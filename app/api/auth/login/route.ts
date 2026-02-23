import { signToken } from "@/app/lib/auth";
import { comparePassword } from "@/app/lib/hash";
import { loginSchema } from "@/app/lib/schemaTypes";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/app/middleware";

export async function POST(req: NextRequest) {
    const data = await req.json();

    const dataSafe = loginSchema.safeParse(data)


    if(!dataSafe.success){
        return NextResponse.json(
            {
            message: 'Email and Password are required'
            },
            { status: 400 }
        )
    }
    const { email, password } = dataSafe.data;

    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
    })

    if (!user) {
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        )
    }
    const match = await comparePassword(password, user.password)
    // console.log(`[bcrypt] - match error: ${match}`)
    if(!match) return NextResponse.json(
        { message: "Invalid Password"},
        { status: 401}
    )
    const payload = {id: user.id, role: user.role, email: user.email}

    const token = signToken(payload)

    const response = NextResponse.json(
       { message: "Login successful",
         data:   payload},
        {status: 200},
    )

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7
    })

    return response;
    
}