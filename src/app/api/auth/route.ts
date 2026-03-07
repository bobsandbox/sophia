import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";

const APP_PASSWORD = process.env.APP_PASSWORD!;
const SESSION_SECRET = process.env.SESSION_SECRET!;

function sign(value: string) {
  return createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== APP_PASSWORD) {
    return NextResponse.json({ error: "Fout wachtwoord" }, { status: 401 });
  }

  const token = sign("authenticated");
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return NextResponse.json({ ok: true });
}
