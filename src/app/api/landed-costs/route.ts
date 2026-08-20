import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createLandedCostSchema } from "@/lib/validations";

// GET /api/landed-costs?orderId=xxx — list cost entries for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const entries = await prisma.landedCostEntry.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });

    // Calculate totals
    const totalByCurrency: Record<string, number> = {};
    for (const entry of entries) {
      const key = entry.currency;
      totalByCurrency[key] = (totalByCurrency[key] || 0) + entry.amount;
    }

    return NextResponse.json({ entries, totals: totalByCurrency });
  } catch (error) {
    console.error("GET /api/landed-costs error:", error);
    return NextResponse.json({ error: "Failed to fetch landed costs" }, { status: 500 });
  }
}

// POST /api/landed-costs — create a new cost entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createLandedCostSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const entry = await prisma.landedCostEntry.create({
      data: {
        orderId: validated.orderId,
        component: validated.component,
        amount: validated.amount,
        currency: validated.currency || "USD",
        exchangeRate: validated.exchangeRate || 1.0,
        allocationMethod: validated.allocationMethod,
        notes: validated.notes,
        userId: user.id,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/landed-costs error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create landed cost entry" }, { status: 500 });
  }
}
