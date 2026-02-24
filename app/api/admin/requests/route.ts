import { requestSchema } from "@/app/lib/schemaTypes";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try{
        const res = await prisma.serviceRequest.findMany(
            {
                include: {
                    client: true,
                    service: true
                }
            }
        )

        return NextResponse.json({
            message: "All Users data",
            data: res
        },
        {status: 201})
    }
    catch(err){
            console.log(`[REQUEST GET] - error: ${err instanceof Error ? err.message : '' }`);
            return NextResponse.json(
                { message: "Something went wrong" },
                { status: 500 }
            );
        }
}

export async function PUT(req: NextRequest){
    const data = await req.json();

    const dataSafe = requestSchema.safeParse(data)

    if(!dataSafe.success){
        return NextResponse.json(
                { message: dataSafe.error.message,
                    payload: data
                 },
                { status: 400 }
         )
    }

    try{
        const updated = await prisma.serviceRequest.update({
            where: { id: dataSafe.data.id},
            data: {
                status: dataSafe.data.status
            },include:{
                client: true

            }
        })
        return NextResponse.json(
                { message: `${updated.id} service request: ${updated.status}`,
                    data: updated },
                { status: 201 }
            );
        }catch(e){
            console.log(`[REQUEST UPDATE] - error: ${e instanceof Error ? e.message : '' }`);
            return NextResponse.json(
                { message: "Something went wrong" },
                { status: 500 }
            );
        }
}