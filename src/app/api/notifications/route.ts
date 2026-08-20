import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notifications — list notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const unreadOnly = searchParams.get("unread") === "true";

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") where.status = status;
    if (type && type !== "ALL") where.type = type;
    if (unreadOnly) where.sentAt = null;

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        task: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { sentAt: null },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

// POST /api/notifications — create a notification (internal use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    // Generate idempotency key to prevent duplicates
    const idempotencyKey = `${body.type}:${body.entityType}:${body.entityId}:${body.scheduledAt || "now"}`;

    // Check for existing notification with same key
    const existing = await prisma.notification.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      return NextResponse.json(existing, { status: 200 });
    }

    const notification = await prisma.notification.create({
      data: {
        type: body.type,
        entityType: body.entityType,
        entityId: body.entityId,
        title: body.title,
        message: body.message,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : new Date(),
        taskId: body.taskId || null,
        userId: user.id,
        idempotencyKey,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
