import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createShipmentSchema } from "@/lib/validations";

// GET /api/shipments?orderId=xxx — list shipments for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (orderId) where.orderId = orderId;
    if (status && status !== "ALL") where.status = status;

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(shipments);
  } catch (error) {
    console.error("GET /api/shipments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }
}

// POST /api/shipments — create a new shipment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createShipmentSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const shipment = await prisma.shipment.create({
      data: {
        orderId: validated.orderId,
        shipmentNumber: validated.shipmentNumber,
        shippingMode: validated.shippingMode,
        forwarder: validated.forwarder,
        containerNo: validated.containerNo,
        bookingDate: validated.bookingDate ? new Date(validated.bookingDate) : null,
        etd: validated.etd ? new Date(validated.etd) : null,
        eta: validated.eta ? new Date(validated.eta) : null,
        actualDeparture: validated.actualDeparture ? new Date(validated.actualDeparture) : null,
        actualArrival: validated.actualArrival ? new Date(validated.actualArrival) : null,
        blAwbNumber: validated.blAwbNumber,
        portOfLoading: validated.portOfLoading,
        portOfDestination: validated.portOfDestination,
        status: validated.status || "BOOKING",
        notes: validated.notes,
        userId: user.id,
      },
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
    });

    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    console.error("POST /api/shipments error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}
