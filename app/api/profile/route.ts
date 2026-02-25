import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { hashpassword } from "@/app/lib/hash";
import { prisma } from "@/prisma/client";
import { profileSchema } from "@/app/lib/schemaTypes";

export async function GET(req: NextRequest) {
  const verified = await getCurrentUser(req);
  if (!verified) return NextResponse.json({ message: "invalid token" }, { status: 401 });

  const include: any = {};
  if (verified.role === "EMPLOYEE") include.employee = true;
  if (verified.role === "CLIENT") include.client = true;

  const user = await prisma.user.findUnique({ where: { id: verified.id }, include });
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  // employee and client relations are arrays on User (cast to any to avoid union types)
  const employeesArr = (user.employee as any[] | undefined) || [];
  const clientsArr = (user.client as any[] | undefined) || [];
  const nameVal =
    employeesArr[0] || clientsArr[0] || undefined;

  return NextResponse.json({
    id: user.id,
    email: user.email,
    role: user.role,
    users: nameVal,
  });
}

export async function PUT(req: NextRequest) {
  const verified = await getCurrentUser(req);
  if (!verified) return NextResponse.json({ message: "invalid token" }, { status: 401 });

  const payload = await req.json();
  const dataSafe = profileSchema.safeParse(payload);

  if(!dataSafe.success){
    return NextResponse.json( 
      { message: "invalid data"},
      {status: 400}
    )
  }

  const { name, password, phone, company } = dataSafe.data; 
  const data: any = {};
  if (password) {
    data.password = await hashpassword(password);
  }

  try {
    const updatedUser = await prisma.user.update({ where: { id: verified.id }, data });

    // update name in related profile if provided
    if (name) {
      if (verified.role === "EMPLOYEE") {
        await prisma.employee.update({ where: { user_id: verified.id }, data: { name, phone } });
      }
      if (verified.role === "CLIENT") {
        await prisma.client.update({ where: { user_id: verified.id }, data: { name, phone, company } });
      }
    }

    return NextResponse.json({ message: "Profile updated" }, { status: 200 });
  } catch (err) {
    console.error('[PROFILE PUT]', err);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
