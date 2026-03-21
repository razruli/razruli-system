import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth/auth";
import prisma from "@/server/db/prisma/lib/prisma";
import { calculateEmployeeCapacity } from "@/server/lib/capacity/employee-capacity";
import {
  generateSlug,
  generateUniqueSlug,
} from "@/server/lib/slug/slug-generator";
import {
  importDepartments,
  validateDepartmentRows,
  allDepartmentRowsValid,
  getDepartmentValidationErrors,
} from "@/server/services/core/department/DepartmentCSVImporter";
import {
  validateEmployeeRows,
  allEmployeeRowsValid,
  getEmployeeValidationErrors,
} from "@/server/services/core/employee/EmployeeCSVImporter";
import {
  validateFinishedTaskRows,
  allFinishedTaskRowsValid,
  getFinishedTaskValidationErrors,
  importFinishedTasks,
} from "@/server/services/operations/finished-task/FinishedTaskCSVImporter";
import {
  importProcesses,
  validateProcessRows,
  allProcessRowsValid,
  getProcessValidationErrors,
} from "@/server/services/operations/process/ProcessCSVImporter";
import {
  mapAllRows,
  validateColumnMapping,
} from "@/server/utils/dataProcessing/columnMapper";
import { parseCSVBuffer } from "@/server/utils/dataProcessing/csvParser";
import {
  normalizeEmploymentType,
  normalizeGender,
  normalizeStatus,
  parseFullName,
} from "@/server/utils/dataProcessing/languageMapping";

// Required fields for different CSV types
const REQUIRED_EMPLOYEE_FIELDS = [
  "firstName",
  "lastName",
  "hireDate",
  "department",
  "grade",
  "employmentType",
  "status",
];

const REQUIRED_DEPARTMENT_FIELDS = ["name"];

const REQUIRED_PROCESS_FIELDS = [
  "title",
  "plannedHours",
  "targetGrade",
  "department",
];

const REQUIRED_FINISHED_TASK_FIELDS = [
  "department",
  "process_name",
  "quantity",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Parse company and role data
    const companyData = JSON.parse(formData.get("company") as string);
    const roleData = JSON.parse(formData.get("role") as string);

    // Get all files and their mappings
    const files = formData.getAll("files") as File[];
    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Get authenticated user from session
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - user not authenticated" },
        { status: 401 },
      );
    }

    const userId = session.user.id;

    // Get mappings for each file
    const mappings: Record<string, Record<string, string>> = {};
    for (const file of files) {
      const mappingKey = `mapping_${file.name}`;
      const mapping = formData.get(mappingKey);
      if (!mapping) {
        return NextResponse.json(
          {
            error: `No mapping provided for file: ${file.name}`,
            details: {
              fileName: file.name,
              mappingKey,
              availableKeys: Array.from(formData.keys()),
            },
          },
          { status: 400 },
        );
      }
      try {
        mappings[file.name] = JSON.parse(mapping as string);
      } catch (parseError) {
        return NextResponse.json(
          {
            error: `Invalid mapping JSON for file: ${file.name}`,
            details: {
              fileName: file.name,
              rawMapping: mapping,
              parseError:
                parseError instanceof Error
                  ? parseError.message
                  : String(parseError),
            },
          },
          { status: 400 },
        );
      }
    }

    // Step 1: Create or get company
    let company = await prisma.company.findFirst({
      where: { name: companyData.name },
    });

    if (!company) {
      // Generate slug from company name
      let slug = generateSlug(companyData.name);

      // Check if slug already exists and make it unique
      const existingBySlug = await prisma.company.findFirst({
        where: { slug },
      });

      if (existingBySlug) {
        const existingSlugs = await prisma.company.findMany({
          select: { slug: true },
        });
        const slugSet = new Set(existingSlugs.map((c) => c.slug));
        slug = generateUniqueSlug(slug, slugSet);
      }

      company = await prisma.company.create({
        data: {
          name: companyData.name,
          slug,
          timezone: companyData.timezone || "UTC+3",
          workingHoursDay: 8,
          workingDaysPerMonth: 21,
        },
      });
    }

    // Step 2: Create Actor for the authenticated user
    // First check if actor already exists for this user
    let actor = await prisma.actor.findFirst({
      where: {
        userId,
      },
    });

    if (!actor) {
      // Create new actor
      actor = await prisma.actor.create({
        data: {
          userId,
          companyId: company.id,
          name: companyData.name || "Owner", // Use company name or fallback
          email: session.user.email, // Use authenticated user email
          status: "ACTIVE",
        },
      });
    } else if (actor.companyId !== company.id) {
      // Update actor if company changed
      actor = await prisma.actor.update({
        where: { id: actor.id },
        data: { companyId: company.id },
      });
    }

    // Step 3: Assign role to actor
    // Find or create the role based on selected role
    const roleEnum = roleData.role.toUpperCase();
    let roleRecord = await prisma.role.findFirst({
      where: {
        name: roleEnum,
        companyId: company.id,
      },
    });

    // If role doesn't exist for this company, create a default one or find the global one
    if (!roleRecord) {
      roleRecord = await prisma.role.findFirst({
        where: {
          name: roleEnum,
        },
      });
    }

    if (roleRecord) {
      // Check if actor already has this role
      const existingActorRole = await prisma.actorRole.findFirst({
        where: {
          actorId: actor.id,
          roleId: roleRecord.id,
        },
      });

      if (!existingActorRole) {
        await prisma.actorRole.create({
          data: {
            actorId: actor.id,
            roleId: roleRecord.id,
          },
        });
      }
    }

    // Process CSV files - identify file types and process in order
    const allEmployees = [];
    const allDepartments = [];
    const allProcesses = [];
    const allFinishedTasks = [];
    const processedErrors: Record<string, any> = {};

    // Determine file types by name pattern
    const filesByType = {
      department: [] as File[],
      employee: [] as File[],
      process: [] as File[],
      finishedTask: [] as File[],
      unknown: [] as File[],
    };

    for (const file of files) {
      const nameLower = file.name.toLowerCase();
      if (nameLower.includes("depart")) {
        filesByType.department.push(file);
      } else if (nameLower.includes("process")) {
        filesByType.process.push(file);
      } else if (
        nameLower.includes("finished") ||
        nameLower.includes("completed") ||
        nameLower.includes("task")
      ) {
        filesByType.finishedTask.push(file);
      } else if (
        nameLower.includes("employee") ||
        nameLower.includes("staff")
      ) {
        filesByType.employee.push(file);
      } else {
        filesByType.unknown.push(file);
      }
    }

    // Process files in order: departments → employees → processes
    // Step 3a: Process department files
    for (const file of filesByType.department) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseCSVBuffer(buffer);

        const mappingValidation = validateColumnMapping(
          mappings[file.name],
          REQUIRED_DEPARTMENT_FIELDS,
        );

        if (!mappingValidation.valid) {
          processedErrors[file.name] = {
            type: "mapping",
            message: "Invalid column mapping",
            missingFields: mappingValidation.missingFields,
            receivedMapping: mappings[file.name],
            requiredFields: REQUIRED_DEPARTMENT_FIELDS,
          };
          continue;
        }

        const mappedRows = mapAllRows(parsed.rows, mappings[file.name]);
        const validationResults = validateDepartmentRows(
          mappedRows as any,
          REQUIRED_DEPARTMENT_FIELDS,
        );

        if (!allDepartmentRowsValid(validationResults)) {
          processedErrors[file.name] = {
            type: "validation",
            message: "Some rows failed validation",
            errors: getDepartmentValidationErrors(validationResults),
          };
          continue;
        }

        allDepartments.push(...mappedRows);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        processedErrors[file.name] = {
          type: "processing",
          message: message,
        };
      }
    }

    // Step 3b: Import departments immediately (before validating employees)
    // This ensures departments exist when we validate employee department references
    let importedDepartmentIds = new Map<string, string>();
    if (allDepartments.length > 0) {
      const deptImportResult = await importDepartments(
        allDepartments as any,
        company.id,
        prisma,
      );

      if (!deptImportResult.success || deptImportResult.errors.length > 0) {
        return NextResponse.json(
          {
            error: "Department import failed",
            details: deptImportResult.errors,
          },
          { status: 400 },
        );
      }

      // Get imported department IDs for later use
      const importedDepts = await prisma.department.findMany({
        where: {
          companyId: company.id,
          name: { in: allDepartments.map((d) => d.name) },
        },
      });

      importedDepartmentIds = new Map(importedDepts.map((d) => [d.name, d.id]));
    }

    // Step 3c: Process employee files (NOW departments exist for validation)
    for (const file of filesByType.employee) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseCSVBuffer(buffer);

        // Validate column mapping
        const mappingValidation = validateColumnMapping(
          mappings[file.name],
          REQUIRED_EMPLOYEE_FIELDS,
        );

        if (!mappingValidation.valid) {
          processedErrors[file.name] = {
            type: "mapping",
            message: "Invalid column mapping",
            missingFields: mappingValidation.missingFields,
            receivedMapping: mappings[file.name],
            requiredFields: REQUIRED_EMPLOYEE_FIELDS,
          };
          continue;
        }

        // Map columns
        const mappedRows = mapAllRows(parsed.rows, mappings[file.name]);

        // Validate all rows
        const validationResults = await validateEmployeeRows(
          mappedRows,
          company.id,
          REQUIRED_EMPLOYEE_FIELDS,
          prisma,
        );

        if (!allEmployeeRowsValid(validationResults)) {
          processedErrors[file.name] = {
            type: "validation",
            message: "Some rows failed validation",
            errors: getEmployeeValidationErrors(validationResults),
          };
          continue;
        }

        // Collect valid rows
        allEmployees.push(...mappedRows);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        processedErrors[file.name] = {
          type: "processing",
          message: message,
        };
      }
    }

    // Step 3d: Process process files
    for (const file of filesByType.process) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseCSVBuffer(buffer);

        const mappingValidation = validateColumnMapping(
          mappings[file.name],
          REQUIRED_PROCESS_FIELDS,
        );

        if (!mappingValidation.valid) {
          processedErrors[file.name] = {
            type: "mapping",
            message: "Invalid column mapping",
            missingFields: mappingValidation.missingFields,
            receivedMapping: mappings[file.name],
            requiredFields: REQUIRED_PROCESS_FIELDS,
          };
          continue;
        }

        const mappedRows = mapAllRows(parsed.rows, mappings[file.name]);
        const validationResults = validateProcessRows(
          mappedRows as any,
          REQUIRED_PROCESS_FIELDS,
        );

        if (!allProcessRowsValid(validationResults)) {
          processedErrors[file.name] = {
            type: "validation",
            message: "Some rows failed validation",
            errors: getProcessValidationErrors(validationResults),
          };
          continue;
        }

        allProcesses.push(...mappedRows);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        processedErrors[file.name] = {
          type: "processing",
          message: message,
        };
      }
    }

    // Step 3e: Parse finished task files (validate later after processes are imported)
    // Store raw mapped rows for validation after process import
    const finishedTaskFileData: Array<{ fileName: string; mappedRows: any[] }> =
      [];

    for (const file of filesByType.finishedTask) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const parsed = parseCSVBuffer(buffer);

        const mappingValidation = validateColumnMapping(
          mappings[file.name],
          REQUIRED_FINISHED_TASK_FIELDS,
        );

        if (!mappingValidation.valid) {
          processedErrors[file.name] = {
            type: "mapping",
            message: "Invalid column mapping",
            missingFields: mappingValidation.missingFields,
            receivedMapping: mappings[file.name],
            requiredFields: REQUIRED_FINISHED_TASK_FIELDS,
          };
          continue;
        }

        const mappedRows = mapAllRows(parsed.rows, mappings[file.name]);
        finishedTaskFileData.push({ fileName: file.name, mappedRows });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        processedErrors[file.name] = {
          type: "processing",
          message: message,
        };
      }
    }

    // If there are processing errors, return early
    if (Object.keys(processedErrors).length > 0) {
      return NextResponse.json(
        {
          error: "File processing failed",
          details: processedErrors,
        },
        { status: 400 },
      );
    }

    // Step 4: Prepare department ID mapping for employee and process creation
    // Collect all department names from employees and processes
    const requiredDepartmentNames = [
      ...new Set(
        [
          ...allEmployees.map((e) => e.department),
          ...allProcesses.map((p) => p.department),
        ].filter(Boolean),
      ),
    ];

    const existingDepartments = await prisma.department.findMany({
      where: {
        companyId: company.id,
        name: { in: requiredDepartmentNames },
      },
    });

    const existingDeptMap = new Map(
      existingDepartments.map((d) => [d.name, d.id]),
    );
    const departmentMap = new Map([
      ...importedDepartmentIds,
      ...existingDeptMap,
    ]);

    // Auto-create missing departments
    const missingDepartments = requiredDepartmentNames.filter(
      (name) => !departmentMap.has(name),
    );

    if (missingDepartments.length) {
      console.warn(
        `Auto-creating ${missingDepartments.length} missing departments`,
      );
      for (const deptName of missingDepartments) {
        const newDept = await prisma.department.create({
          data: {
            name: deptName,
            companyId: company.id,
          },
        });
        departmentMap.set(deptName, newDept.id);
      }
    }

    // Step 5: Prepare grade maps for employees and processes
    const gradeNames = [
      ...new Set(
        [
          ...allEmployees.map((e) => e.grade),
          ...allProcesses.map((p) => p.targetGrade),
        ].filter(Boolean),
      ),
    ];

    const grades = await prisma.grade.findMany({
      where: {
        name: { in: gradeNames },
      },
    });

    const gradeMap = new Map(grades.map((g) => [g.name, g.id]));

    // Check for missing grades
    const missingGrades = gradeNames.filter((name) => !gradeMap.has(name));

    if (missingGrades.length > 0) {
      return NextResponse.json(
        {
          error: "Grades not found",
          missingGrades,
        },
        { status: 400 },
      );
    }

    // Step 6: Create employees
    let createdEmployeesCount = 0;

    if (allEmployees.length > 0) {
      try {
        // Get all grades with their kGrade values for capacity calculation
        const gradesWithDetails = await prisma.grade.findMany({
          where: {
            name: { in: gradeNames },
          },
        });
        const gradeDetailsMap = new Map(
          gradesWithDetails.map((g) => [g.name, g]),
        );

        // Get company working hours details
        const companyDetails = await prisma.company.findUnique({
          where: { id: company.id },
        });

        const employees = await prisma.$transaction(
          allEmployees.map((data) => {
            // Use only firstName/lastName,
            const firstName = data.firstName || "";
            const lastName = data.lastName || "";

            // Map language-specific values to English enums
            let employmentType = "LABOR_CONTRACT";
            try {
              employmentType = normalizeEmploymentType(
                data.employmentType || "LABOR_CONTRACT",
              );
            } catch (_e) {
              console.error(
                `Employment type mapping error: ${data.employmentType}`,
              );
            }

            let gender = "OTHER";
            if (data.gender) {
              try {
                gender = normalizeGender(data.gender);
              } catch (_e) {
                console.error(`Gender mapping error: ${data.gender}`);
              }
            }

            let status = "ACTIVE";
            try {
              status = normalizeStatus(data.status || "ACTIVE");
            } catch (_e) {
              console.error(`Status mapping error: ${data.status}`);
            }

            // Calculate monthlyCU based on grade and employee factors
            const gradeDetails = gradeDetailsMap.get(data.grade);
            const workingHoursPerDay = data.workingHoursPerDay
              ? parseInt(data.workingHoursPerDay, 10)
              : 8;

            // Calculate age from birthDate (or use default if not provided)
            let age = 30; // Default to 30 for baseline if not provided
            if (data.birthDate) {
              const birthDate = new Date(data.birthDate);
              const today = new Date();
              age = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
              ) {
                age--;
              }
            }

            // Calculate yearsInGrade from hire date
            const hireDate = new Date(data.hireDate);
            const today = new Date();
            const yearsInGrade =
              (today.getTime() - hireDate.getTime()) /
              (1000 * 60 * 60 * 24 * 365.25);

            let monthlyCU = 0;
            if (gradeDetails && companyDetails) {
              const capacityOutput = calculateEmployeeCapacity({
                gradeKFactor: gradeDetails.kGrade,
                gender: gender as "MALE" | "FEMALE" | "OTHER",
                age,
                yearsInGrade,
                workingHoursPerDay,
                workingDaysPerMonth: companyDetails.workingDaysPerMonth,
                // kEfficiencyOverride not provided - defaults to 1.0
              });
              monthlyCU = capacityOutput.monthlyCU;
            }

            return prisma.employee.create({
              data: {
                companyId: company.id,
                departmentId: departmentMap.get(data.department)!,
                firstName,
                lastName,
                gradeId: gradeMap.get(data.grade)!,
                gender: gender as any,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                hireDate: new Date(data.hireDate),
                employmentType: employmentType as any,
                status: status as any,
                workingHoursPerDay,
                monthlyCU,
                // kEfficiency intentionally not set - defaults to null
                // Can be set later via individual employee updates if needed
              },
            });
          }),
        );

        createdEmployeesCount = employees.length;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
          {
            error: "Employee creation failed",
            message,
          },
          { status: 400 },
        );
      }
    }

    // Step 7: Create processes (if any)
    let processImportResult = null;

    if (allProcesses.length > 0) {
      try {
        // Need to map grade keys properly - try both name and ID
        const gradeMapWithId = new Map<string | number, number>();
        for (const grade of grades) {
          gradeMapWithId.set(grade.name, grade.id);
          gradeMapWithId.set(grade.id, grade.id);
        }

        processImportResult = await importProcesses(
          allProcesses as any,
          company.id,
          departmentMap,
          gradeMapWithId,
          prisma,
        );

        if (
          !processImportResult.success ||
          processImportResult.errors.length > 0
        ) {
          console.warn(
            "Process import had errors:",
            processImportResult.errors,
          );
          // Don't fail the entire onboarding, just warn
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn("Process import failed:", message);
        // Don't fail the entire onboarding for processes
      }
    }

    // Step 8: Validate and create finished tasks (NOW processes exist in DB)
    let finishedTaskImportResult = null;

    try {
      // Validate finished task files (NOW processes are imported and can be looked up)
      for (const fileData of finishedTaskFileData) {
        const validationResults = await validateFinishedTaskRows(
          fileData.mappedRows as any,
          company.id,
          prisma,
        );

        if (!allFinishedTaskRowsValid(validationResults)) {
          processedErrors[fileData.fileName] = {
            type: "validation",
            message: "Some rows failed validation",
            errors: getFinishedTaskValidationErrors(validationResults),
          };
          continue;
        }

        // Collect validated rows (with normalized data)
        allFinishedTasks.push(
          ...validationResults
            .filter((r) => r.valid && r.row)
            .map((r) => r.row),
        );
      }

      // If validation failed, return errors
      if (Object.keys(processedErrors).length > 0) {
        return NextResponse.json(
          {
            error: "File processing failed",
            details: processedErrors,
          },
          { status: 400 },
        );
      }

      // Validate that finished tasks are required
      if (allFinishedTasks.length === 0) {
        return NextResponse.json(
          {
            error: "Finished tasks file is required",
            message:
              "No valid finished tasks were found in the uploaded file. Please ensure your finished tasks CSV has at least one valid row.",
          },
          { status: 400 },
        );
      }

      finishedTaskImportResult = await importFinishedTasks(
        allFinishedTasks,
        prisma,
      );

      if (
        !finishedTaskImportResult.success ||
        finishedTaskImportResult.errors.length > 0
      ) {
        return NextResponse.json(
          {
            error: "Finished tasks import failed",
            details: finishedTaskImportResult.errors,
          },
          { status: 400 },
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        {
          error: "Finished tasks import failed",
          message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
      company: {
        id: company.id,
        name: company.name,
        slug: company.slug,
      },
      actor: {
        id: actor.id,
        name: actor.name,
        email: actor.email,
        status: actor.status,
      },
      role: roleData,
      summary: {
        departments: {
          imported: importedDepartmentIds.size,
          autocreated: missingDepartments.length,
          total: departmentMap.size,
        },
        employees: {
          created: createdEmployeesCount,
        },
        processes: processImportResult
          ? {
              created: processImportResult.created,
              failed: processImportResult.failed,
              errors: processImportResult.errors,
            }
          : {
              created: 0,
              failed: 0,
            },
        finishedTasks: finishedTaskImportResult
          ? {
              created: finishedTaskImportResult.count,
              errors: finishedTaskImportResult.errors,
            }
          : {
              created: 0,
            },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Onboarding submission error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message,
      },
      { status: 500 },
    );
  }
}
