import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createProjectSchema = z.object({
	name: z.string().min(1, "Project name is required"),
	description: z.string().default(""),
	clientId: z.string().min(1, "Client id is required"),
	serviceRequestId: z.string().optional(),
	employeeIds: z.array(z.string()).default([]),
});

export async function GET() {
	try {
		const projects = await prisma.project.findMany({
			orderBy: { createdAt: "desc" },
			include: {
				client: true,
				serviceRequest: {
					include: {
						service: true,
					},
				},
				assignedProjects: {
					include: {
						employees: {
							include: {
								user: true,
							},
						},
					},
				},
			},
		});

		return NextResponse.json(
			{
				message: "Projects fetched successfully",
				data: projects,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(`[PROJECTS GET] - error: ${error instanceof Error ? error.message : ""}`);
		return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const payload = await req.json();
	const parsed = createProjectSchema.safeParse(payload);

	if (!parsed.success) {
		return NextResponse.json(
			{
				message: parsed.error.issues[0]?.message || "Invalid payload",
				payload,
			},
			{ status: 400 }
		);
	}

	const { name, description, clientId, serviceRequestId, employeeIds } = parsed.data;

	try {
		const project = await prisma.$transaction(async (tx) => {
			const createdProject = await tx.project.create({
				data: {
					name,
					description,
					clientId,
					serviceRequestId,
					status: "PLANNING",
				},
			});

			if (employeeIds.length > 0) {
				await tx.assignedProject.createMany({
					data: employeeIds.map((employeeId) => ({
						projectId: createdProject.id,
						employeeId,
					})),
					skipDuplicates: true,
				});
			}

			if (serviceRequestId) {
				await tx.serviceRequest.update({
					where: { id: serviceRequestId },
					data: { status: "ACCEPTED" },
				});
			}

			return tx.project.findUnique({
				where: { id: createdProject.id },
				include: {
					client: true,
					serviceRequest: {
						include: {
							service: true,
						},
					},
					assignedProjects: {
						include: {
							employees: {
								include: {
									user: true,
								},
							},
						},
					},
				},
			});
		});

		return NextResponse.json(
			{
				message: "Project created successfully",
				data: project,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.log(`[PROJECTS POST] - error: ${error instanceof Error ? error.message : ""}`);
		return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
	}
}