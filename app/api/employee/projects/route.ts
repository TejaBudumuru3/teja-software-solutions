import { getCurrentUser } from "@/app/lib/auth";
import { projectUpdateSchema } from "@/app/lib/schemaTypes";
import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const user = await getCurrentUser(req);
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "EMPLOYEE") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    try{
        const url = new URL(req.url);
        const statusFilter = url.searchParams.get("status"); // e.g. "DELIVERED"

        // fetch employee record + projects in one go
        const employeeWithProjects = await prisma.employee.findUnique({
            where: { user_id: user.id },
            include: {
                assignedProjects: {
                    where: statusFilter
                        ? { project: { status: statusFilter as any } }
                        : undefined,
                    include: {
                        project: {
                            include: {
                                client: { select: { name: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!employeeWithProjects) {
            return NextResponse.json(
                { message: "Employee profile not found" },
                { status: 404 }
            );
        }

        const projects = employeeWithProjects.assignedProjects.map((ap) => ap.project);
        const userName = employeeWithProjects.name || null;

        return NextResponse.json(
            {
                message: `Project fetched for ${user.id}`,
                data: projects,
                userName,
            },
            { status: 200 }
        );
    }
    catch(err){
        console.error("[EMPLOYEE PROJECTS GET]", err);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest){
    const data = await req.json()

    const dataSafe = projectUpdateSchema.safeParse(data);

    if(!dataSafe.success){
        return NextResponse.json(
            {message: "Invalid inputs"},
            {status: 400}
        )
    }

    try{
        const updated = await prisma.project.update({
            where:{ id: dataSafe.data.id},
            data:{
                status: dataSafe.data.status
            }
        })
        return NextResponse.json(
            { message: "Updated successfully"},
            {status: 200}
        )
    }
    catch(err){
        console.error("[EMPLOYEE PROJECTS PUT]", err);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}