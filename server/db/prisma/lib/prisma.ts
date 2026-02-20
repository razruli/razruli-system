import { withAccelerate } from "@prisma/extension-accelerate";

import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl: process.env.NEXT_PUBLIC_DATABASE_URL_ACCELERATE || "",
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
