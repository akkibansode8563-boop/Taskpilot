import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/shipments/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        order: true,
        tasks: true,
      },
    });

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    return NextResponse.json(shipment);
  } catch (error) {
    console.error("GET /api/shipments/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch shipment" }, { status: 500 });
  }
}

// PATCH /api/shipments/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.shipment.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...body };

    // Handle date conversions
    for (const field of ["bookingDate", "etd", "eta", "actualDeparture", "actualArrival"]) {
      if (updateData[field] !== undefined) {
        const val = updateData[field];
        updateData[field] = val && typeof val === "string" ? new Date(val) : null;
      }
    }

    const shipment = await prisma.shipment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(shipment);
  } catch (error) {
    console.error("PATCH /api/shipments/[id] error:", error);
    return NextResponse.json({ error: "Failed to update shipment" }, { status: 500 });
  }
}

// DELETE /api/shipments/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }
    await prisma.shipment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/shipments/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete shipment" }, { status: 500 });
  }
}
