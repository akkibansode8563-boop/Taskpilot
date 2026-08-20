import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/dashboard — aggregated stats
export async function GET() {
  try {
    // Get or find user
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({
        stats: { overdue: 0, today: 0, waiting: 0, completed: 0 },
        todayTasks: [],
        overdueTasks: [],
        waitingTasks: [],
        activeOrders: [],
      });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Task stats
    const [overdue, today, waiting, completedToday] = await Promise.all([
      prisma.task.count({
        where: {
          userId: user.id,
          dueDate: { lt: startOfDay },
          status: { in: ["PLANNED", "IN_PROGRESS", "WAITING"] },
        },
      }),
      prisma.task.count({
        where: {
          userId: user.id,
          dueDate: { gte: startOfDay, lt: endOfDay },
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      }),
      prisma.task.count({
        where: {
          userId: user.id,
          status: "WAITING",
        },
      }),
      prisma.task.count({
        where: {
          userId: user.id,
          completedAt: { gte: startOfDay, lt: endOfDay },
        },
      }),
    ]);

    // Today's tasks
    const todayTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        dueDate: { gte: startOfDay, lt: endOfDay },
        status: { notIn: ["COMPLETED", "CANCELLED"] },
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
      },
      orderBy: [{ priority: "asc" }, { dueTime: "asc" }],
    });

    // Overdue tasks
    const overdueTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        dueDate: { lt: startOfDay },
        status: { in: ["PLANNED", "IN_PROGRESS", "WAITING"] },
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    // Waiting tasks
    const waitingTasks = await prisma.task.findMany({
      where: {
        userId: user.id,
        status: "WAITING",
      },
      include: {
        order: { select: { id: true, orderNumber: true } },
      },
      orderBy: { followUpDate: "asc" },
    });

    // Active orders
    const activeOrders = await prisma.order.findMany({
      where: {
        userId: user.id,
        status: "ACTIVE",
      },
      include: {
        supplier: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Calculate days overdue for each overdue task
    const overdueTasksWithDays = overdueTasks.map((task) => ({
      ...task,
      daysOverdue: task.dueDate
        ? Math.ceil((startOfDay.getTime() - task.dueDate.getTime()) / (24 * 60 * 60 * 1000))
        : 0,
    }));

    return NextResponse.json({
      stats: { overdue, today, waiting, completed: completedToday },
      todayTasks,
      overdueTasks: overdueTasksWithDays,
      waitingTasks,
      activeOrders,
    });
  } catch (error) {
    console.error("GET /api/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
