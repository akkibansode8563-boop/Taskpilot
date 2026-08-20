import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderItemSchema } from "@/lib/validations";

// GET /api/order-items?orderId=xxx — list items for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );
    }

    const items = await prisma.orderItem.findMany({
      where: { orderId },
      include: {
        product: { select: { id: true, name: true, sku: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/order-items error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order items" },
      { status: 500 }
    );
  }
}

// POST /api/order-items — create a new order item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderItemSchema.parse(body);

    const totalCost = validated.totalCost ?? validated.quantity * validated.unitCost;

    const item = await prisma.orderItem.create({
      data: {
        orderId: validated.orderId,
        productId: validated.productId || null,
        sku: validated.sku,
        name: validated.name,
        quantity: validated.quantity,
        unit: validated.unit || "pcs",
        unitCost: validated.unitCost,
        totalCost,
        hsCode: validated.hsCode,
        notes: validated.notes,
      },
      include: {
        product: { select: { id: true, name: true, sku: true } },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/order-items error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create order item" },
      { status: 500 }
    );
  }
}
