import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const services = await prisma.service.findMany();

        return NextResponse.json(
            {message: "All Services list",
                data: services
            },
            {status: 200}
        );        
    }
    catch(err){
        console.error('[SERVICES GET]', err);
    return NextResponse.json({ message: "unable to fetch all services" }, { status: 500 });
    }
}