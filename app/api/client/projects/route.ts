import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { user_id: user.id },
    });
    if (!client) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    const projects = await prisma.project.findMany({
      where: { clientId: client.id },
      include: {
        client: true,
        assignedProjects: {
          include: {
            employees: {
              include: { user: { select: { email: true } } },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Projects fetched", data: projects },
      { status: 200 }
    );
  } catch (err) {
    console.error("[CLIENT PROJECTS GET]", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
