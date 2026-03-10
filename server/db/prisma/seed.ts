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

    const grade = await prisma.grade.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: "Junior",
        kGrade: 0.6,
      },
    });

    console.log("✅ Base models: User, Company, Grade created");
    console.log("\n✨ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
    console.log("\n🌱 Seeding completed.");
  }
}

main();
