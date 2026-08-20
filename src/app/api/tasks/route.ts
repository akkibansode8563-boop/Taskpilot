import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validations";

// GET /api/tasks — list tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const module = searchParams.get("module");
    const orderId = searchParams.get("orderId");
    const search = searchParams.get("search");
    const dueBefore = searchParams.get("dueBefore");
    const dueAfter = searchParams.get("dueAfter");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") where.status = status;
    if (priority && priority !== "ALL") where.priority = priority;
    if (module && module !== "ALL") where.module = module;
    if (orderId) where.orderId = orderId;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { contactName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (dueBefore || dueAfter) {
      const dueDateFilter: Record<string, Date> = {};
      if (dueAfter) dueDateFilter.gte = new Date(dueAfter);
      if (dueBefore) dueDateFilter.lte = new Date(dueBefore);
      where.dueDate = dueDateFilter;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
      orderBy: [
        { priority: "asc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createTaskSchema.parse(body);

    // Get or create a default user (for personal use without auth)
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "user@taskpilot.com",
          name: "User",
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        ...validated,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
        followUpDate: validated.followUpDate
          ? new Date(validated.followUpDate)
          : null,
        reminderAt: validated.reminderAt
          ? new Date(validated.reminderAt)
          : null,
        userId: user.id,
      },
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
    });

    // Create activity log
    await prisma.taskActivity.create({
      data: {
        action: "CREATED",
        toValue: task.status,
        taskId: task.id,
        userId: user.id,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
