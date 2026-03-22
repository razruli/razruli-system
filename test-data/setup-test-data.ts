/**
 * Setup test database with necessary departments and grades
 * Run before testing onboarding flow
 */
import prisma from "@/server/db/prisma/lib/prisma";

async function setupTestData() {
  console.log("🔧 Setting up test data...\n");

  try {
    // Ensure Gruzin Inc company exists
    const company = await prisma.company.upsert({
      where: { id: "company-1" },
      update: {},
      create: {
        id: "company-1",
        slug: "gruzin",
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

    for (const grade of grades) {
      await prisma.grade.upsert({
        where: { id: grade.id },
        update: {},
        create: grade,
      });
    }
    console.log(
      `✅ Grades created/updated: ${grades.map((g) => g.name).join(", ")}`,
    );

    // Create departments
    const departments = [
      { name: "Разработка" },
      { name: "Дизайн" },
      { name: "Продажи" },
      { name: "Маркетинг" },
      { name: "HR" },
    ];

    for (const dept of departments) {
      await prisma.department.upsert({
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
    }
    console.log(
      `✅ Departments created: ${departments.map((d) => d.name).join(", ")}`,
    );

    console.log("\n✨ Test data setup completed successfully!");
    console.log("\nYou can now test onboarding with:");
    console.log("  - Company: Gruzin Inc");
    console.log("  - Departments: Разработка, Дизайн, Продажи, Маркетинг, HR");
    console.log("  - Grades: Junior, Middle, Senior, Lead, C-level");
    console.log("  - Employment Types: ТД, ГПХ, Самозанятый");
    console.log("  - Statuses: active, inactive");
  } catch (error) {
    console.error("❌ Error setting up test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestData();
