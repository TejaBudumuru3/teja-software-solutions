import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// DELETE: Remove user (employee or client)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "userId required" },
        { status: 400 }
      );
    }

    // Check if user exists and get their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Cannot delete admin user" },
        { status: 403 }
      );
    }

    // Delete related records first, then the user
    // Prisma will handle cascading deletes based on schema relations
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(`[DELETE USER] - ${err instanceof Error ? err.message : ""}`);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
