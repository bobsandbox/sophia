import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API
  if (pathname === "/login" || pathname === "/api/auth") {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;
  const secret = process.env.SESSION_SECRET!;
  const expected = createHmac("sha256", secret).update("authenticated").digest("hex");

  if (session !== expected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
