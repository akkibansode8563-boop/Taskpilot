import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validations";

// GET /api/tasks/[id] — get a single task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
        activities: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        notifications: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/[id] — update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = updateTaskSchema.parse({ ...body, id });

    // Get existing task for activity logging
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...validated };
    delete updateData.id;

    // Handle date conversions
    if (validated.dueDate !== undefined) {
      updateData.dueDate = validated.dueDate ? new Date(validated.dueDate) : null;
    }
    if (validated.followUpDate !== undefined) {
      updateData.followUpDate = validated.followUpDate
        ? new Date(validated.followUpDate)
        : null;
    }
    if (validated.reminderAt !== undefined) {
      updateData.reminderAt = validated.reminderAt
        ? new Date(validated.reminderAt)
        : null;
    }

    // Handle status changes
    if (validated.status && validated.status !== existingTask.status) {
      if (validated.status === "COMPLETED") {
        updateData.completedAt = new Date();
      } else if (validated.status === "CANCELLED") {
        updateData.cancelledAt = new Date();
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        order: { select: { id: true, orderNumber: true, title: true } },
      },
    });

    // Log status change activity
    if (validated.status && validated.status !== existingTask.status) {
      let user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { email: "user@taskpilot.com", name: "User" },
        });
      }

      await prisma.taskActivity.create({
        data: {
          action: "STATUS_CHANGED",
          fromValue: existingTask.status,
          toValue: validated.status,
          taskId: task.id,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] — delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
