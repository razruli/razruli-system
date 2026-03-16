import { NextRequest, NextResponse } from "next/server";

import prisma from "@/server/db/prisma/lib/prisma";

/**
 * Cleanup API endpoint - removes test data for fresh start
 * DELETE /api/setup/cleanup
 */
export async function DELETE(request: NextRequest) {
  try {
    // Delete all employees (first, since they have foreign keys)
    const employeesDeleted = await prisma.employee.deleteMany({});
    console.log(`🗑️  Deleted ${employeesDeleted.count} employees`);

    // Delete all departments
    const departmentsDeleted = await prisma.department.deleteMany({});
    console.log(`🗑️  Deleted ${departmentsDeleted.count} departments`);

    // Delete all companies except the seed one
    const companiesDeleted = await prisma.company.deleteMany({
      where: {
        NOT: {
          id: "company-1",
        },
      },
    });
    console.log(`🗑️  Deleted ${companiesDeleted.count} companies`);

    return NextResponse.json({
      success: true,
      message: "Cleanup completed",
      deleted: {
        employees: employeesDeleted.count,
        departments: departmentsDeleted.count,
        companies: companiesDeleted.count,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Cleanup error:", error);

    return NextResponse.json(
      {
        error: "Cleanup failed",
        message,
      },
      { status: 500 },
    );
  }
}

/**
 * Setup API endpoint - creates test infrastructure
 * POST /api/setup/cleanup
 */
export async function POST(request: NextRequest) {
  try {
    // First clean up
    await DELETE(request);

    console.log("🔧 Setting up fresh test data...");

    // Create fresh test company
    const company = await prisma.company.create({
      data: {
        name: "Test Company 2026-03-15",
        timezone: "UTC+3",
        workingHoursDay: 8,
        workingDaysPerMonth: 21,
      },
    });
    console.log(`✅ Company created: ${company.name} (ID: ${company.id})`);

    // Ensure grades exist
    const grades = [
      { id: 1, name: "Junior", kGrade: 0.6 },
      { id: 2, name: "Middle", kGrade: 0.9 },
      { id: 3, name: "Senior", kGrade: 1.2 },
      { id: 4, name: "Lead", kGrade: 1.5 },
      { id: 5, name: "C-level", kGrade: 1.7 },
    ];

    const createdGrades = [];
    for (const grade of grades) {
      const result = await prisma.grade.upsert({
        where: { id: grade.id },
        update: {},
        create: grade,
      });
      createdGrades.push(result.name);
    }
    console.log(`✅ Grades: ${createdGrades.join(", ")}`);

    // Create departments for the new company
    const departments = [
      { name: "Разработка" },
      { name: "Дизайн" },
      { name: "Продажи" },
      { name: "Маркетинг" },
      { name: "HR" },
    ];

    const createdDepartments = [];
    for (const dept of departments) {
      const result = await prisma.department.create({
        data: {
          name: dept.name,
          companyId: company.id,
        },
      });
      createdDepartments.push(result.name);
    }
    console.log(`✅ Departments: ${createdDepartments.join(", ")}`);

    return NextResponse.json({
      success: true,
      message: "Fresh test data setup completed",
      data: {
        company: {
          id: company.id,
          name: company.name,
        },
        grades: createdGrades,
        departments: createdDepartments,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Setup error:", error);

    return NextResponse.json(
      {
        error: "Setup failed",
        message,
      },
      { status: 500 },
    );
  }
}
