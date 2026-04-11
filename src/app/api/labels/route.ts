import { NextRequest, NextResponse } from "next/server";
import { getLabels, createLabel, deleteLabel } from "@/lib/services/journal";

export async function GET() {
  const labels = await getLabels();
  return NextResponse.json(labels);
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  try {
    const label = await createLabel(name.trim());
    return NextResponse.json(label, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Label exists" }, { status: 409 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  await deleteLabel(id);
  return NextResponse.json({ ok: true });
}
