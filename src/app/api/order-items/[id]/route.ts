import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/order-items/[id] — update an order item
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingItem = await prisma.orderItem.findUnique({ where: { id } });
    if (!existingItem) {
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = { ...body };

    // Recalculate totalCost if quantity or unitCost changed
    if (body.quantity !== undefined || body.unitCost !== undefined) {
      const qty = body.quantity ?? existingItem.quantity;
      const cost = body.unitCost ?? existingItem.unitCost;
      updateData.totalCost = qty * cost;
    }

    const item = await prisma.orderItem.update({
      where: { id },
      data: updateData,
      include: {
        product: { select: { id: true, name: true, sku: true } },
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("PATCH /api/order-items/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update order item" },
      { status: 500 }
    );
  }
}

// DELETE /api/order-items/[id] — delete an order item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.orderItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { error: "Order item not found" },
        { status: 404 }
      );
    }

    await prisma.orderItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/order-items/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete order item" },
      { status: 500 }
    );
  }
}
