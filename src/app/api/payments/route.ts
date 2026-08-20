import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPaymentSchema } from "@/lib/validations";

// GET /api/payments?orderId=xxx — list payments for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    const where: Record<string, unknown> = {};
    if (orderId) where.orderId = orderId;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
      orderBy: { paymentDate: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST /api/payments — create a new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createPaymentSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: validated.orderId,
        amount: validated.amount,
        currency: validated.currency || "USD",
        exchangeRate: validated.exchangeRate || 1.0,
        paymentDate: new Date(validated.paymentDate),
        type: validated.type,
        reference: validated.reference,
        notes: validated.notes,
        userId: user.id,
      },
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
