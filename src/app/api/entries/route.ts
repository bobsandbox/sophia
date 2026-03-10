import { NextRequest, NextResponse } from "next/server";
import { getEntriesByDate, getDailySummary, createEntry } from "@/lib/services/journal";
import { entrySchema } from "@/lib/validations/journal";
import { format } from "date-fns";

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");
  // Pass the date as a yyyy-MM-dd string to preserve the intended calendar day
  const dateStr = dateParam ?? format(new Date(), "yyyy-MM-dd");

  const [entries, summary] = await Promise.all([
    getEntriesByDate(dateStr),
    getDailySummary(dateStr),
  ]);

  return NextResponse.json({ entries, summary });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = entrySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const entry = await createEntry(parsed.data);
  return NextResponse.json(entry, { status: 201 });
}
