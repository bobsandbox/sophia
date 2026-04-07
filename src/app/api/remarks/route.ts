import { NextResponse } from "next/server";
import { getFrequentRemarks } from "@/lib/services/journal";

export async function GET() {
  const remarks = await getFrequentRemarks();
  return NextResponse.json(remarks);
}
