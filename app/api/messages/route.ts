import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/prisma/client";


export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const msgs = await prisma.message.findMany({
      where: {
        OR: [{ senderId: user.id }, { receiverId: user.id }],
      },
      include: {
        sender: {
          select:{
            id: true,
            email: true,
            employee: {select : {name: true}},
            client: { select: {name: true}},
            
          }
        },

        receiver: {
          select: {
            id: true,
            email: true,
            employee: { select: { name: true }},
            client: { select: {name: true}}
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const conversations = msgs.reduce((acc, msg) => {
      const partner = msg.senderId === user.id ? msg.receiver : msg.sender;

      const idx = acc.findIndex(c => c.partner.id === partner.id);
      if (idx === -1) {
        acc.push({ partner, conversation: [msg] });
      } else {
        acc[idx].conversation.push(msg);
      }
      return acc;
    }, [] as Array<{ partner: typeof msgs[0]["sender"]; conversation: typeof msgs }>);

    return NextResponse.json({ data: conversations }, { status: 200 });
    // return NextResponse.json({ data: msgs }, { status: 200 });
  } catch (err) {
    console.log("[MESSAGES GET]", err);
    return NextResponse.json({ message: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req);
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
  const user = await getCurrentUser(req);
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