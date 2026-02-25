import { role } from "@/generated/prisma/enums"
import { z } from "zod"

export const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN","CLIENT","EMPLOYEE"], { message: "Invalid user"})
})

export const loginSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const ServiceSchema = z.object({
    name: z.string(),
    price: z.int(),
    description: z.string().optional()
})

export const requestSchema = z.object({
    id: z.string(),
    status: z.enum(["REJECTED", "ACCEPTED"])
})

export const profileSchema = z.object({
    name: z.string().optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
    company: z.string().optional()
})

export const projectUpdateSchema = z.object({
    id: z.string(),
    status: z.enum(["PLANNING","DEVELOPMENT","DEPLOYMENT", "TESTING", "DELIVERED"])
})