import { NextRequest, NextResponse } from "next/server";

import prisma from "@/server/db/prisma/lib/prisma";

/**
 * Setup API endpoint - creates test infrastructure
 * POST /api/setup/test-data
 */
export async function POST(request: NextRequest) {
  try {
    console.log("🔧 Setting up test data...");

    // Ensure Gruzin Inc company exists
    const company = await prisma.company.upsert({
      where: { id: "company-1" },
      update: {},
      create: {
        id: "company-1",
        name: "Gruzin Inc",
        timezone: "UTC+3",
        workingHoursDay: 8,
        workingDaysPerMonth: 21,
      },
    });
    console.log(`✅ Company: ${company.name}`);

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

    // Create departments
    const departments = [
      { name: "Разработка" },
      { name: "Дизайн" },
      { name: "Продажи" },
      { name: "Маркетинг" },
      { name: "HR" },
    ];

    const createdDepartments = [];
    for (const dept of departments) {
      const result = await prisma.department.upsert({
        where: {
          companyId_name: {
            companyId: company.id,
            name: dept.name,
          },
        },
        update: {},
        create: {
          name: dept.name,
          companyId: company.id,
        },
      });
      createdDepartments.push(result.name);
    }
    console.log(`✅ Departments: ${createdDepartments.join(", ")}`);

    return NextResponse.json({
      success: true,
      message: "Test data setup completed",
      data: {
        company: company.name,
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
