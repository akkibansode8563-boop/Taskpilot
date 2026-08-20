"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  Pause,
  CheckCircle2,
  Package,
  ArrowRight,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardData {
  stats: { overdue: number; today: number; waiting: number; completed: number };
  todayTasks: Array<{
    id: string;
    title: string;
    priority: string;
    dueTime: string | null;
    module: string;
    order: { id: string; orderNumber: string } | null;
  }>;
  overdueTasks: Array<{
    id: string;
    title: string;
    priority: string;
    daysOverdue: number;
    module: string;
    order: { id: string; orderNumber: string } | null;
  }>;
  waitingTasks: Array<{
    id: string;
    title: string;
    waitingFor: string | null;
    followUpDate: string | null;
    module: string;
  }>;
  activeOrders: Array<{
    id: string;
    title: string;
    orderNumber: string;
    type: string;
    currentStage: string | null;
    stageProgress: number;
    dueDate: string | null;
  }>;
}

// Fallback mock data for when API is not available
const fallbackData: DashboardData = {
  stats: { overdue: 2, today: 5, waiting: 3, completed: 0 },
  todayTasks: [
    { id: "1", title: "Follow up with Shenzhen supplier on PI", priority: "HIGH", dueTime: "10:00", module: "IMPORT_PURCHASE", order: { id: "o1", orderNumber: "ORD-2026-001" } },
    { id: "2", title: "Review packing list for Mumbai order", priority: "CRITICAL", dueTime: "11:00", module: "IMPORT_PURCHASE", order: { id: "o2", orderNumber: "ORD-2026-002" } },
    { id: "3", title: "Call customer about quotation", priority: "MEDIUM", dueTime: "14:00", module: "SALES", order: null },
  ],
  overdueTasks: [
    { id: "6", title: "Arrange inspection for Shenzhen order", priority: "CRITICAL", daysOverdue: 2, module: "IMPORT_PURCHASE", order: { id: "o1", orderNumber: "ORD-2026-001" } },
    { id: "7", title: "Confirm domestic PO delivery date", priority: "HIGH", daysOverdue: 1, module: "IMPORT_PURCHASE", order: { id: "o3", orderNumber: "ORD-2026-003" } },
  ],
  waitingTasks: [
    { id: "9", title: "Waiting for supplier PI from Ningbo", waitingFor: "Zhang Wei", followUpDate: "2026-08-22", module: "IMPORT_PURCHASE" },
    { id: "10", title: "Waiting for customs clearance docs", waitingFor: "CHA Agent", followUpDate: "2026-08-23", module: "IMPORT_PURCHASE" },
  ],
  activeOrders: [
    { id: "o1", title: "LED Lights from Shenzhen", orderNumber: "ORD-2026-001", type: "CHINA_IMPORT", currentStage: "PRODUCTION", stageProgress: 45, dueDate: "2026-09-15" },
    { id: "o2", title: "Ceramic Tiles - Guangzhou", orderNumber: "ORD-2026-002", type: "CHINA_IMPORT", currentStage: "CUSTOMS_DOCUMENTS", stageProgress: 78, dueDate: "2026-08-25" },
    { id: "o3", title: "Plywood - Domestic", orderNumber: "ORD-2026-003", type: "DOMESTIC_PURCHASE", currentStage: "DISPATCH", stageProgress: 65, dueDate: "2026-08-20" },
  ],
};

const priorityColors: Record<string, { bg: string; text: string; border: string; indicator: string }> = {
  CRITICAL: { bg: "bg-rose-50 border-rose-200", text: "text-rose-700", border: "border-rose-200", indicator: "bg-rose-500" },
  HIGH: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", border: "border-amber-200", indicator: "bg-amber-500" },
  MEDIUM: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", border: "border-violet-200", indicator: "bg-violet-500" },
  LOW: { bg: "bg-slate-100 border-slate-200", text: "text-slate-700", border: "border-slate-200", indicator: "bg-slate-400" },
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>(fallbackData);
  const [isUsingApi, setIsUsingApi] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const apiData = await res.json();
        setData(apiData);
        setIsUsingApi(true);
      }
    } catch {
      console.log("Using fallback dashboard data");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Clean Minimalist Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-50/90 via-purple-50/60 to-indigo-50/90 border border-violet-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 rounded-full bg-violet-600/10 border border-violet-200 text-violet-800 text-xs font-bold uppercase tracking-wider">
                Control Tower
              </span>
              {!isUsingApi && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-200 text-amber-800 text-[10px] font-mono font-semibold">
                  Demo Mode
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Welcome back, User 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              You have <span className="text-rose-700 font-bold">{data.stats.overdue} overdue items</span> and <span className="text-amber-700 font-bold">{data.stats.today} priority tasks</span> scheduled for action today.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/tasks/new">
              <Button className="gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-xs active:scale-[0.985] spring-transition px-5 py-2.5 font-bold">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Quick Add Task
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overdue", value: data.stats.overdue, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", border: "border-slate-200/80" },
          { label: "Today", value: data.stats.today, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-slate-200/80" },
          { label: "Waiting", value: data.stats.waiting, icon: Pause, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-slate-200/80" },
          { label: "Completed", value: data.stats.completed, icon: CheckCircle2, color: "text-violet-600", bg: "bg-violet-50", border: "border-slate-200/80" },
        ].map((stat) => (
          <Card key={stat.label} className="interactive-card border border-slate-200/80 shadow-2xs rounded-2xl bg-white hover:border-violet-600/30">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border border-slate-100 spring-transition`}>
                  <stat.icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <p className="text-3xl font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Priorities */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-900">
                <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                  <Clock className="w-4 h-4 stroke-[2.2]" />
                </div>
                Today&apos;s Priorities
              </CardTitle>
              <Link href="/tasks?filter=today" className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {data.todayTasks.map((task) => {
              const priorityStyle = priorityColors[task.priority] || priorityColors.MEDIUM;
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/60 hover:border-violet-600/30 hover:bg-slate-50/50 spring-transition group"
                >
                  <div className={`w-2 h-10 rounded-full ${priorityStyle.indicator}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-violet-600 spring-transition">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Due at {task.dueTime || "EOD"}</p>
                  </div>
                  <Badge variant="outline" className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}>
                    {task.priority}
                  </Badge>
                </Link>
              );
            })}
            {data.todayTasks.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-6">No tasks scheduled for today</p>
            )}
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className="rounded-2xl border border-rose-200 shadow-2xs bg-rose-50/30 overflow-hidden">
          <CardHeader className="pb-3 border-b border-rose-100 bg-rose-50/60">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-rose-700">
                <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 border border-rose-200">
                  <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
                </div>
                Overdue Action Items
              </CardTitle>
              <Link href="/tasks?filter=overdue" className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {data.overdueTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-rose-200/80 hover:border-rose-300 hover:bg-rose-50/30 spring-transition group"
              >
                <div className="w-2 h-10 rounded-full bg-rose-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-rose-700 spring-transition">{task.title}</p>
                  <p className="text-xs text-rose-600 font-bold mt-0.5">{task.daysOverdue} day{task.daysOverdue > 1 ? "s" : ""} overdue</p>
                </div>
                <Badge variant="outline" className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-700 border-rose-200">
                  {task.priority}
                </Badge>
              </Link>
            ))}
            {data.overdueTasks.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-6">No overdue tasks 🎉</p>
            )}
          </CardContent>
        </Card>

        {/* Waiting For */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-900">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Pause className="w-4 h-4 stroke-[2.2]" />
                </div>
                Waiting For Follow-Ups
              </CardTitle>
              <Link href="/tasks?filter=waiting" className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {data.waitingTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white border border-slate-200/60 hover:border-violet-600/30 hover:bg-slate-50/50 spring-transition group"
              >
                <div className="w-2 h-10 rounded-full bg-indigo-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-violet-600 spring-transition">{task.title}</p>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">From: {task.waitingFor || "External Party"}</p>
                </div>
                {task.followUpDate && (
                  <Badge variant="outline" className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 border-slate-200">
                    {task.followUpDate}
                  </Badge>
                )}
              </Link>
            ))}
            {data.waitingTasks.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-6">No pending waiting tasks</p>
            )}
          </CardContent>
        </Card>

        {/* Active Orders */}
        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2.5 text-slate-900">
                <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
                  <Package className="w-4 h-4 stroke-[2.2]" />
                </div>
                Active Import & Purchase Orders
              </CardTitle>
              <Link href="/orders" className="text-xs font-bold text-violet-600 hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            {data.activeOrders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-3.5 rounded-xl bg-white border border-slate-200/60 hover:border-violet-600/30 hover:bg-slate-50/50 spring-transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-violet-600 spring-transition">{order.title}</p>
                    <p className="text-xs font-mono text-slate-500">{order.orderNumber}</p>
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border",
                    order.type === "CHINA_IMPORT"
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-violet-50 text-violet-700 border-violet-200"
                  )}>
                    {order.type === "CHINA_IMPORT" ? "China Import" : "Domestic"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-600">{order.currentStage?.replace(/_/g, " ")}</span>
                      <span className="font-mono font-bold text-violet-600">{order.stageProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                      <div
                        className="h-full bg-violet-600 rounded-full spring-transition"
                        style={{ width: `${order.stageProgress}%` }}
                      />
                    </div>
                  </div>
                  {order.dueDate && (
                    <div className="text-right pl-2 border-l border-slate-200">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">ETA</p>
                      <p className="text-xs font-mono font-bold text-slate-900">{order.dueDate}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
            {data.activeOrders.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-6">No active procurement orders</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Progress */}
      {data.stats.completed > 0 && (
        <Card className="rounded-2xl border border-violet-200 bg-violet-50/40 shadow-2xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2.5 text-violet-800">
              <TrendingUp className="w-5 h-5 text-violet-600" />
              Daily Accomplishment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-2 font-semibold">
                  <span className="text-slate-600">Tasks completed today</span>
                  <span className="font-bold text-violet-700">{data.stats.completed} tasks</span>
                </div>
                <div className="h-2.5 bg-violet-100 rounded-full overflow-hidden p-0.5 border border-violet-200">
                  <div className="h-full bg-violet-600 rounded-full" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="w-10 h-10 bg-violet-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-2xs">
                ✓
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


