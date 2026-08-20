import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateOrderSchema } from "@/lib/validations";

// China Import stages in order
const CHINA_STAGES = [
  "REQUIREMENT", "QUOTATION", "NEGOTIATION", "SAMPLE", "PI", "PO",
  "PAYMENT", "PRODUCTION", "INSPECTION", "READY_TO_SHIP", "BOOKING",
  "ETD", "BL_AWB", "CUSTOMS_DOCUMENTS", "CHA_CUSTOMS", "DUTY_CHARGES",
  "CLEARANCE", "DELIVERY_GRN",
];

// Domestic Purchase stages in order
const DOMESTIC_STAGES = [
  "REQUIREMENT", "QUOTATION", "PO", "SUPPLIER_CONFIRMATION",
  "PAYMENT", "DISPATCH", "DELIVERY", "GRN",
];

// GET /api/orders/[id] — get a single order with relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        supplier: true,
        orderItems: {
          include: { product: true },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
        },
        documents: {
          orderBy: { uploadedAt: "desc" },
        },
        payments: {
          orderBy: { paymentDate: "desc" },
        },
        shipments: {
          orderBy: { createdAt: "desc" },
        },
        landedCosts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] — update an order (including stage progression)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateOrderSchema.parse({ ...body, id });

    const existingOrder = await prisma.order.findUnique({ where: { id } });
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...validated };
    delete updateData.id;

    // Handle date conversions
    if (validated.dueDate !== undefined) {
      updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    }

    // Handle stage progression
    if (body.advanceStage) {
      const stages = existingOrder.type === "CHINA_IMPORT" ? CHINA_STAGES : DOMESTIC_STAGES;
      const currentIdx = stages.indexOf(existingOrder.currentStage || "REQUIREMENT");

      if (currentIdx < stages.length - 1) {
        const nextStage = stages[currentIdx + 1];
        const newProgress = Math.round(((currentIdx + 1) / (stages.length - 1)) * 100);

        if (existingOrder.type === "CHINA_IMPORT") {
          updateData.chinaStage = nextStage;
        } else {
          updateData.domesticStage = nextStage;
        }
        updateData.currentStage = nextStage;
        updateData.stageProgress = newProgress;

        // Auto-complete order if at last stage
        if (currentIdx + 1 === stages.length - 1) {
          updateData.status = "COMPLETED";
        }
      }
    }

    // Handle stage set (jump to specific stage)
    if (body.setStage) {
      const stages = existingOrder.type === "CHINA_IMPORT" ? CHINA_STAGES : DOMESTIC_STAGES;
      const stageIdx = stages.indexOf(body.setStage);

      if (stageIdx !== -1) {
        const newProgress = Math.round((stageIdx / (stages.length - 1)) * 100);

        if (existingOrder.type === "CHINA_IMPORT") {
          updateData.chinaStage = body.setStage;
        } else {
          updateData.domesticStage = body.setStage;
        }
        updateData.currentStage = body.setStage;
        updateData.stageProgress = newProgress;
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] — delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
