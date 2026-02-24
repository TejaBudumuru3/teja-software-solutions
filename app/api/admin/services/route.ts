import { ServiceSchema } from "@/app/lib/schemaTypes";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const body = await req.json()
    console.log(body)
    const dataSafe = ServiceSchema.safeParse(body)

    if(!dataSafe.success){
         return NextResponse.json(
                { message: dataSafe.error.message },
                { status: 400 }
         )
    }
    try{
        const created = await prisma.service.create({
            data:{
                name: dataSafe.data.name,
                price: dataSafe.data.price,
                description: dataSafe.data.description
            }
        })

        return NextResponse.json(
                { message: `${created.name} service created with id: ${created.id}` },
                { status: 201 }
            );
        }catch(e){
            console.log(`[SERVICE] - error: ${e instanceof Error ? e.message : '' }`);
            return NextResponse.json(
                { message: "Something went wrong" },
                { status: 500 }
            );
        }
}

export async function GET(req: NextRequest){

    try{
        const data = await prisma.service.findMany();

        return NextResponse.json({
                message: "All Users data",
                data: data
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