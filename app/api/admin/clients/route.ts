import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const clients = await prisma.client.findMany({include: {user: true}})
        return NextResponse.json({
                        message: "All Users data",
                        data: clients
                    },
                    {status: 201})
        }
        catch(err){
            console.log(`[SERVICE] - error: ${err instanceof Error ? err.message : '' }`);
            return NextResponse.json(
                { message: "Something went wrong" },
                { status: 500 }
            );
        }
}