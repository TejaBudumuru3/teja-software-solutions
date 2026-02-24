import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";
import { hashpassword } from "@/app/lib/hash";
import { prisma } from "@/prisma/client";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const verified = await verifyToken(token);
  if (!verified) return NextResponse.json({ message: "invalid token" }, { status: 401 });

  // fetch extra info for employee/client
  const include: any = {};
  if (verified.role === "EMPLOYEE") include.employee = true;
  if (verified.role === "CLIENT") include.client = true;

  const user = await prisma.user.findUnique({ where: { id: verified.id }, include });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // employee and client relations are arrays on User (cast to any to avoid union types)
  const employeesArr = (user.employee as any[] | undefined) || [];
  const clientsArr = (user.client as any[] | undefined) || [];
  const nameVal =
    employeesArr[0]?.name || clientsArr[0]?.name || undefined;

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    name: nameVal,
  });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const verified = await verifyToken(token);
  if (!verified) return NextResponse.json({ message: "invalid token" }, { status: 401 });

  const { name, password } = await req.json();
  const data: any = {};
  if (password) {
    data.password = await hashpassword(password);
  }

  try {
    const updatedUser = await prisma.user.update({ where: { id: verified.id }, data });

    // update name in related profile if provided
    if (name) {
      if (verified.role === "EMPLOYEE") {
        await prisma.employee.update({ where: { user_id: verified.id }, data: { name } });
      }
      if (verified.role === "CLIENT") {
        await prisma.client.update({ where: { user_id: verified.id }, data: { name } });
      }
    }

    return NextResponse.json({ message: "Profile updated" }, { status: 200 });
  } catch (err) {
    console.error('[PROFILE PUT]', err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
