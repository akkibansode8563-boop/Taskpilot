import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/sales-orders/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salesOrder = await prisma.salesOrder.findUnique({ where: { id } });

    if (!salesOrder) {
      return NextResponse.json({ error: "Sales order not found" }, { status: 404 });
    }

    return NextResponse.json(salesOrder);
  } catch (error) {
    console.error("GET /api/sales-orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch sales order" }, { status: 500 });
  }
}

// PATCH /api/sales-orders/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.salesOrder.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Sales order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...body };
    if (updateData.followUpDate && typeof updateData.followUpDate === "string") {
      updateData.followUpDate = new Date(updateData.followUpDate);
    }
    if (updateData.dueDate && typeof updateData.dueDate === "string") {
      updateData.dueDate = new Date(updateData.dueDate);
    }

    const salesOrder = await prisma.salesOrder.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(salesOrder);
  } catch (error) {
    console.error("PATCH /api/sales-orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update sales order" }, { status: 500 });
  }
}

// DELETE /api/sales-orders/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const salesOrder = await prisma.salesOrder.findUnique({ where: { id } });
    if (!salesOrder) {
      return NextResponse.json({ error: "Sales order not found" }, { status: 404 });
    }
    await prisma.salesOrder.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/sales-orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete sales order" }, { status: 500 });
  }
}
