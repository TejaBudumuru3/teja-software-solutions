import { getCurrentUser, verifyToken } from "@/app/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const verified = await getCurrentUser(req)

    if(!verified) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });


    return NextResponse.json(
        {
            id: verified.id,
            email: verified.email,
            role: verified.role
        },
        { status: 200}
    )
}