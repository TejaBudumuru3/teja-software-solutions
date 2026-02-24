import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const employees = await prisma.employee.findMany({
            include: { user: { select: { email: true } } }
        });

        return NextResponse.json({ 
            message: "employees are fetched",
            data: employees }, { status: 200 });
    }
    catch(err){
        console.log(`[EMPLOYEES - GET] - error: ${err instanceof Error ? err.message : '' }`);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}