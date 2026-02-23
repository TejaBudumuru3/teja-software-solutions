import { hashpassword } from "./app/lib/hash";
import { prisma } from "./prisma/client";

const email = "admin@tejasoft.com";
const password = "123456789";
const role = "ADMIN";

async function seed(){
    const hashed = await hashpassword(password)

    const user = await prisma.user.create({
        data:{
            email,
            password: hashed,
            role
        }
    })

    console.log(user)
}

seed();