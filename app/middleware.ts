import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest){
    const token = req.cookies.get('token')?.value;

    if(!token){
        return NextResponse.redirect(new URL("/login",  req.url))
    }

    const payload = verifyToken(token)

    if(!payload){
        return NextResponse.redirect(new URL('/login',  req.url))
    }
    
    const {pathname} = req.nextUrl

    if(pathname.startsWith('/api')) return NextResponse.next()
    
    if(!pathname.startsWith(`/${payload.role.toLowerCase()}`)){
        console.log(`Unauthorized user to this page`)
        return NextResponse.redirect(new URL(`/${payload.role.toLowerCase()}`,  req.url))
    }
    return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/client/:path*","/api/:path*",],
};