import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/landed-costs/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.landedCostEntry.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Landed cost entry not found" }, { status: 404 });
    }

    const entry = await prisma.landedCostEntry.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("PATCH /api/landed-costs/[id] error:", error);
    return NextResponse.json({ error: "Failed to update landed cost entry" }, { status: 500 });
  }
}

// DELETE /api/landed-costs/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entry = await prisma.landedCostEntry.findUnique({ where: { id } });
    if (!entry) {
      return NextResponse.json({ error: "Landed cost entry not found" }, { status: 404 });
    }
    await prisma.landedCostEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/landed-costs/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete landed cost entry" }, { status: 500 });
  }
}
