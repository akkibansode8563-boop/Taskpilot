import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServiceTicketSchema } from "@/lib/validations";

// GET /api/service-tickets — list service tickets
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
        { complaint: { contains: search, mode: "insensitive" } },
        { engineer: { contains: search, mode: "insensitive" } },
      ];
    }

    const tickets = await prisma.serviceTicket.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("GET /api/service-tickets error:", error);
    return NextResponse.json({ error: "Failed to fetch service tickets" }, { status: 500 });
  }
}

// POST /api/service-tickets — create a new service ticket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createServiceTicketSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const ticket = await prisma.serviceTicket.create({
      data: {
        customerName: validated.customerName,
        customerContact: validated.customerContact,
        complaint: validated.complaint,
        description: validated.description,
        engineer: validated.engineer,
        priority: validated.priority || "MEDIUM",
        status: validated.status || "OPEN",
        visitDate: validated.visitDate ? new Date(validated.visitDate) : null,
        followUpDate: validated.followUpDate ? new Date(validated.followUpDate) : null,
        closureNotes: validated.closureNotes,
        userId: user.id,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("POST /api/service-tickets error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create service ticket" }, { status: 500 });
  }
}
