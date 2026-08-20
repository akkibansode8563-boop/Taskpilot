import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSalesOrderSchema } from "@/lib/validations";

// GET /api/sales-orders — list sales orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") where.status = status;

    if (search) {
      where.OR = [
        { customerName: { contains: search, mode: "insensitive" } },
        { customerContact: { contains: search, mode: "insensitive" } },
        { enquiry: { contains: search, mode: "insensitive" } },
      ];
    }

    const salesOrders = await prisma.salesOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(salesOrders);
  } catch (error) {
    console.error("GET /api/sales-orders error:", error);
    return NextResponse.json({ error: "Failed to fetch sales orders" }, { status: 500 });
  }
}

// POST /api/sales-orders — create a new sales order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSalesOrderSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const salesOrder = await prisma.salesOrder.create({
      data: {
        customerName: validated.customerName,
        customerContact: validated.customerContact,
        customerEmail: validated.customerEmail || null,
        customerPhone: validated.customerPhone,
        enquiry: validated.enquiry,
        quotation: validated.quotation,
        status: validated.status || "ENQUIRY",
        followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        amount: validated.amount,
        currency: validated.currency || "INR",
        notes: validated.notes,
        userId: user.id,
      },
    });

    return NextResponse.json(salesOrder, { status: 201 });
  } catch (error) {
    console.error("POST /api/sales-orders error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create sales order" }, { status: 500 });
  }
}
