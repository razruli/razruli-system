import { prisma } from "./lib/prisma";

async function main() {
  console.log("🌱 Seeding database...\n");

  try {
    const user = await prisma.user.upsert({
      where: { email: "admin@gruzin.com" },
      update: {},
      create: {
        id: "user-1",
        name: "Admin",
        email: "admin@gruzin.com",
        emailVerified: true,
      },
    });

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

    // Create all grades
    const grades = [
      { id: 1, name: "Junior", kGrade: 0.6 },
      { id: 2, name: "Senior", kGrade: 1.2 },
      { id: 3, name: "Lead", kGrade: 1.5 },
      { id: 4, name: "Middle", kGrade: 0.9 },
      { id: 5, name: "Intern", kGrade: 0.4 },
    ];

    for (const gradeData of grades) {
      await prisma.grade.upsert({
        where: { id: gradeData.id },
        update: {},
        create: gradeData,
      });
    }

    console.log("✅ Base models: User, Company, Grades created");
    console.log("\n✨ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
    console.log("\n🌱 Seeding completed.");
  }
}

main();
