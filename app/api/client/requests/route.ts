import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const payload = await getCurrentUser(req)
    if(!payload){
        return NextResponse.json(
            { message: "Invalid User"},
            {status: 401}
        )
    }
    try{
        const client = await prisma.client.findUnique({
            where: { user_id: payload.id },
            });
            const requests = await prisma.serviceRequest.findMany({
            where: { clientId: client!.id },
            include: {
                service: {
                select: { name: true, description: true /* or '*' */ },
                },
                client: true,
            },
            });

        return NextResponse.json(
            {message: "All requests fetched",
                data: requests
            },
            {status: 200}
        )
    }
    catch(error){
        console.error('[REQUEST GET]', error);
        return NextResponse.json({ message: "getting all requests failed" }, { status: 500 });
    }

}

export async function POST(req: NextRequest){
    const user = await getCurrentUser(req);

    if(!user){
        return NextResponse.json(
            {message: "Invalid user"},
            {status:401}
        )
    }

    try{
        const client = await prisma.client.findUnique({
            where:{
                user_id: user.id
            },
            select: {id: true}
        })

        const { id } = await req.json()
        if(!id){
            return NextResponse.json(
                {message:"Invalid data"},
                {status: 400}
            )
        }
        if(!client){
            return NextResponse.json(
                {message: "something went wrong with client fetching"},
                { status: 500}
            )
        }

        const create = await prisma.serviceRequest.create({
            data:{
                clientId: client.id,
                serviceId: id,
                createdAt: new Date(),
                status: "PENDING"
            }
        })

        return NextResponse.json(
            {message: "Service Request created"},
            {status : 200}
        )
    }catch(err){
        console.error('[REQUEST POST]', err);
    return NextResponse.json({ message: "request creation failed" }, { status: 500 });
    }

}