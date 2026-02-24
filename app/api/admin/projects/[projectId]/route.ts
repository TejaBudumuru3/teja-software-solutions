import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// PUT: Update project status
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { message: "projectId required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Validate status
    const statusSchema = z.object({
      status: z.enum(["PLANNING", "DEVELOPMENT", "TESTING", "DEPLOYMENT", "DELIVERED"])
    });

    const parsed = statusSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    // Update project status
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { status }
    });

    return NextResponse.json(
      { message: "Project status updated", data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error(`[UPDATE PROJECT STATUS] - ${err instanceof Error ? err.message : ""}`);
    return NextResponse.json(
      { message: "Failed to update project status" },
      { status: 500 }
    );
  }
}
