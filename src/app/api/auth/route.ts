import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const APP_PASSWORD = process.env.APP_PASSWORD!;
const SESSION_SECRET = process.env.SESSION_SECRET!;

async function sign(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== APP_PASSWORD) {
    return NextResponse.json({ error: "Fout wachtwoord" }, { status: 401 });
  }

  const token = await sign("authenticated");
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return NextResponse.json({ ok: true });
}
