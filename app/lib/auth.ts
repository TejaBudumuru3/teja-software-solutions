import jwt from 'jsonwebtoken'

export type JwTPayload = {
    id: string;
    role: 'ADMIN' | 'CLIENT' | 'EMPLOYEE';
    email: string;
}

export function signToken(payload: JwTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!)
}

export function verifyToken(token: string): JwTPayload | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwTPayload
    } catch (err) {
        console.log(`[JWT] Error verifying token: ${err}`)
        return null
    }
}