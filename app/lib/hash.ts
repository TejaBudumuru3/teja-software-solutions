import bcrypt from "bcryptjs";

export async function hashpassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    // console.log(password)
    return bcrypt.compare(password, hash)
}