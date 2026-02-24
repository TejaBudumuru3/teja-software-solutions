import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const [employeeCount, clientCount, projectCount, deliveredCount] = await Promise.all([
      prisma.employee.count(),
      prisma.client.count(),
      prisma.project.count(),
      prisma.project.count({ where: { status: 'DELIVERED' } }),
    ]);

    return NextResponse.json({
      employeeCount,
      clientCount,
      projectCount,
      deliveredCount,
    }, { status: 200 });
  } catch (err) {
    console.error('[STATS GET]', err);
    return NextResponse.json({ message: 'Could not load stats' }, { status: 500 });
  }
}
