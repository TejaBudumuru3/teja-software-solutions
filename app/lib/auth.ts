import jwt from 'jsonwebtoken'

import { SignJWT, jwtVerify } from "jose";

export type JwTPayload = {
    id: string;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
    email: string;
}

const encoder = new TextEncoder()

export async function signToken(payload: JwTPayload): Promise<string> {
    const secret = encoder.encode(process.env.JWT_SECRET!);
    
    return await new SignJWT({...payload})
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret)
}

export async function verifyToken(token: string): Promise<JwTPayload | null> {
    try {
        const secret = encoder.encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret)
        return payload as JwTPayload
    } catch (err) {
        console.log(`[JWT] Error verifying token: ${err}`)
        return null
    }
}