import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import { prisma } from "@/prisma/client";

async function authUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function GET(req: NextRequest) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const msgs = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: { select: { id: true, email: true } },
        receiver: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: msgs }, { status: 200 });
  } catch (err) {
    console.log("[MESSAGES GET]", err);
    return NextResponse.json({ message: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { receiverId, message } = await req.json();
  if (!receiverId || !message) {
    return NextResponse.json({ message: "receiverId and message required" }, { status: 400 });
  }
  try {
    const created = await prisma.message.create({
      data: { senderId: user.id, receiverId, message },
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err) {
    console.log("[MESSAGES POST]", err);
    return NextResponse.json({ message: "Failed to send" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { id, read } = await req.json();
  if (!id || typeof read !== "boolean") {
    return NextResponse.json({ message: "id and read flag required" }, { status: 400 });
  }
  try {
    const updated = await prisma.message.update({
      where: { id },
      data: { read },
    });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (err) {
    console.log("[MESSAGES PUT]", err);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}