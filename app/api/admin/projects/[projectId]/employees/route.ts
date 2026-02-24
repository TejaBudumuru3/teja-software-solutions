import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET: list employees assigned to a project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  if (!projectId) {
    return NextResponse.json({ message: "Missing projectId" }, { status: 400 });
  }

  try {
    const assignments = await prisma.assignedProject.findMany({
      where: { projectId },
      include: {
        employees: { include: { user: true } },
      },
    });

    const employees = assignments.map((a) => a.employees);
    return NextResponse.json({ message: "Assigned employees fetched", data: employees }, { status: 200 });
  } catch (err) {
    console.log(`[PROJECT EMPLOYEES GET] - ${err instanceof Error ? err.message : ""}`);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST: add employee to project
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { employeeId } = await req.json();
  const { projectId } = await params;
  if (!projectId || !employeeId) {
    return NextResponse.json({ message: "projectId and employeeId required" }, { status: 400 });
  }

  try {
    const created = await prisma.assignedProject.create({
      data: { projectId, employeeId },
    });
    return NextResponse.json({ message: "Employee assigned", data: created }, { status: 201 });
  } catch (err) {
    console.log(`[PROJECT EMPLOYEES POST] - ${err instanceof Error ? err.message : ""}`);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// DELETE: remove employee from project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { employeeId } = await req.json();
  const { projectId } = await params;
  if (!projectId || !employeeId) {
    return NextResponse.json({ message: "projectId and employeeId required" }, { status: 400 });
  }

  try {
    await prisma.assignedProject.delete({
      where: { projectId_employeeId: { projectId, employeeId } },
    });
    return NextResponse.json({ message: "Employee unassigned" }, { status: 200 });
  } catch (err) {
    console.log(`[PROJECT EMPLOYEES DELETE] - ${err instanceof Error ? err.message : ""}`);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}