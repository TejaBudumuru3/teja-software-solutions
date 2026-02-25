// middleware.ts at project root
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./app/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // public endpoints
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = payload.role.toLowerCase(); // "admin" | "employee" | "client"

  if (pathname.startsWith("/api")) {

    if(pathname.startsWith("/api/profile")) return NextResponse.next()
    if (!pathname.startsWith(`/api/${role}`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  // page requests
  if (!pathname.startsWith(`/${role}`)) {
    return NextResponse.redirect(new URL(`/${role}`, req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/client/:path*", "/api/:path*"],
};