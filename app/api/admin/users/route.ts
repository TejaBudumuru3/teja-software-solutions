import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const data = await prisma.user.findMany({
                include: {
                    client: true,
                    employee: true
                }
            })
        
            return NextResponse.json({
                message: "All Users data",
                data: data
            },
        {status: 201})
    }
    catch(err){
        console.log(`[USERS] - error: ${err instanceof Error ? err.message : '' }`);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}