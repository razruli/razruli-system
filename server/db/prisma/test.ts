import prisma from "./lib/prisma";

export async function testConnection() {
  try {
    await prisma.$connect();
    console.warn("✅ Database connection successful");
  } catch (err) {
    console.error("❌ Database connection failed", err);
  } finally {
    await prisma.$disconnect();
  }
}
