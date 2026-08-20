import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createDocumentSchema } from "@/lib/validations";

// GET /api/documents?orderId=xxx&taskId=xxx — list documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const taskId = searchParams.get("taskId");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (orderId) where.orderId = orderId;
    if (taskId) where.taskId = taskId;
    if (type && type !== "ALL") where.type = type;

    const documents = await prisma.document.findMany({
      where,
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
        task: { select: { id: true, title: true } },
      },
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET /api/documents error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

// POST /api/documents — create a new document record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createDocumentSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const document = await prisma.document.create({
      data: {
        type: validated.type,
        fileName: validated.fileName,
        fileUrl: validated.fileUrl,
        fileSize: validated.fileSize,
        mimeType: validated.mimeType,
        orderId: validated.orderId || null,
        taskId: validated.taskId || null,
        notes: validated.notes,
        userId: user.id,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
