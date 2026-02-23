import { verifyToken } from "@/app/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest){
    const token = req.cookies.get("token")?.value

    if(!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const verified  = verifyToken(token)
    if(!verified) return NextResponse.json({ message: "invalid token"}, {status: 401})

    return NextResponse.json(
        {
            id: verified.id,
            email: verified.email,
            role: verified.role
        },
        { status: 200}
    )
}