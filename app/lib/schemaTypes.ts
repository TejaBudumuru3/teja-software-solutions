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