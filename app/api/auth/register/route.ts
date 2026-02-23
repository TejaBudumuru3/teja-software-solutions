import { hashpassword } from "@/app/lib/hash";
import { signToken, verifyToken } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { registerSchema } from "@/app/lib/schemaTypes";
//--------------------- Validations are pending using ZOD (login also) 
export async function POST(req: NextRequest){
    const token = req.cookies.get("token")?.value;

    if(!token) return NextResponse.json(
        {message: "Unauthorized"},
        { status: 401}
    )

    const user = verifyToken(token)

    if(!user || user.role !== "ADMIN"){
        return NextResponse.json(
            {message: "Forbidden"},
            { status: 403 }
        )
    }

    const body = await req.json()
    const dataSafe = registerSchema.safeParse(body)

    if(!dataSafe.success)
        return NextResponse.json(
        { message: dataSafe.error.message },
        { status: 400 }
    )

    const { email, password, role } = dataSafe.data;


    const existed = await prisma.user.findUnique({
        where: { email }
    })

    if(existed) return NextResponse.json(
        {message: "user already existed"},
        { status: 409 }
    )
    try{
        const hashed = await hashpassword(password)
        const create = await prisma.user.create({
            data:{
                email: email,
                role: role,
                password: hashed
            }
        })

        return NextResponse.json(
        {message: `${create.role} created with id: ${create.id}`},
        { status: 201 }
    )
    }
    catch(err){
        console.log(`[Register] - error: ${err instanceof Error ? err.message : '' }`)
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500}
        )
    }
    
    
}