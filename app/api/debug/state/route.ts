import { NextRequest, NextResponse } from "next/server";

import prisma from "@/server/db/prisma/lib/prisma";

/**
 * Debug API endpoint - shows current database state
 * GET /api/debug/state
 */
export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        departments: true,
      },
    });

    const grades = await prisma.grade.findMany();

    return NextResponse.json({
      companies,
      grades,
      departmentCount: companies.reduce(
        (sum, c) => sum + c.departments.length,
        0,
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        error: "Debug failed",
        message,
      },
      { status: 500 },
    );
  }
}
