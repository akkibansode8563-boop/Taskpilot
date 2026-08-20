import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/validations";

// GET /api/orders — list orders with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const supplierId = searchParams.get("supplierId");

    const where: Record<string, unknown> = {};

    if (type && type !== "ALL") where.type = type;
    if (status && status !== "ALL") where.status = status;
    if (supplierId) where.supplierId = supplierId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { orderNumber: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { supplier: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        supplier: { select: { id: true, name: true } },
        _count: {
          select: { tasks: true, documents: true, payments: true, shipments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders — create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    // Get or create default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    // Generate order number
    const count = await prisma.order.count();
    const year = new Date().getFullYear();
    const orderNumber = `ORD-${year}-${String(count + 1).padStart(3, "0")}`;

    // Set initial stage based on type
    const initialStage =
      validated.type === "CHINA_IMPORT" ? "REQUIREMENT" : "REQUIREMENT";

    const order = await prisma.order.create({
      data: {
        orderNumber,
        type: validated.type,
        title: validated.title,
        description: validated.description,
        supplierId: validated.supplierId || null,
        currency: validated.currency || (validated.type === "CHINA_IMPORT" ? "USD" : "INR"),
        exchangeRate: validated.exchangeRate || 1.0,
        piRef: validated.piRef,
        poRef: validated.poRef,
        paymentTerms: validated.paymentTerms,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        notes: validated.notes,
        chinaStage: validated.type === "CHINA_IMPORT" ? "REQUIREMENT" : null,
        domesticStage: validated.type === "DOMESTIC_PURCHASE" ? "REQUIREMENT" : null,
        currentStage: initialStage,
        stageProgress: 0,
        userId: user.id,
      },
      include: {
        supplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
