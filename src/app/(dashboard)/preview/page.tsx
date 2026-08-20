"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckSquare,
  Package,
  Calendar,
  Users,
  ShoppingCart,
  BarChart3,
  Wrench,
  Bot,
  Settings,
  Plus,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  AlertTriangle,
  CheckCircle2,
  ArrowUpDown,
  Calendar as CalendarIcon,
  Star,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  FileText,
  Weight,
  Ruler,
  ExternalLink,
  Calculator,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ═══════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════

const todayStats = {
  overdue: 2,
  today: 5,
  waiting: 3,
  completed: 4,
};

const todayTasks = [
  { id: "1", title: "Follow up with Shenzhen supplier on PI", priority: "HIGH", dueTime: "10:00", module: "IMPORT_PURCHASE", orderId: "ORD-2026-001" },
  { id: "2", title: "Review packing list for Mumbai order", priority: "CRITICAL", dueTime: "11:00", module: "IMPORT_PURCHASE", orderId: "ORD-2026-002" },
  { id: "3", title: "Call customer about quotation", priority: "MEDIUM", dueTime: "14:00", module: "SALES", orderId: null },
  { id: "4", title: "Confirm CHA documents for BL release", priority: "HIGH", dueTime: "15:00", module: "IMPORT_PURCHASE", orderId: "ORD-2026-002" },
  { id: "5", title: "Send payment proof to Guangzhou supplier", priority: "MEDIUM", dueTime: "16:00", module: "IMPORT_PURCHASE", orderId: null },
];

const overdueTasks = [
  { id: "6", title: "Arrange inspection for Shenzhen order", priority: "CRITICAL", daysOverdue: 2, module: "IMPORT_PURCHASE" },
  { id: "7", title: "Confirm domestic PO delivery date", priority: "HIGH", daysOverdue: 1, module: "IMPORT_PURCHASE" },
];

const waitingTasks = [
  { id: "9", title: "Waiting for supplier PI from Ningbo", waitingFor: "Zhang Wei", followUpDate: "Aug 22", module: "IMPORT_PURCHASE" },
  { id: "10", title: "Waiting for customs clearance docs", waitingFor: "CHA Agent", followUpDate: "Aug 23", module: "IMPORT_PURCHASE" },
  { id: "11", title: "Waiting for customer PO confirmation", waitingFor: "Rahul Mehta", followUpDate: "Aug 24", module: "SALES" },
];

const activeOrders = [
  { id: "o1", title: "LED Lights from Shenzhen", orderNumber: "ORD-2026-001", type: "CHINA_IMPORT", stage: "Production", progress: 45, eta: "Sep 15", amount: "$14,450" },
  { id: "o2", title: "Ceramic Tiles - Guangzhou", orderNumber: "ORD-2026-002", type: "CHINA_IMPORT", stage: "Customs Docs", progress: 78, eta: "Aug 25", amount: "$9,600" },
  { id: "o3", title: "Plywood - Domestic", orderNumber: "ORD-2026-003", type: "DOMESTIC_PURCHASE", stage: "Dispatch", progress: 65, eta: "Aug 20", amount: "₹3,40,000" },
  { id: "o4", title: "Aluminum Profiles - Foshan", orderNumber: "ORD-2026-004", type: "CHINA_IMPORT", stage: "ETD", progress: 55, eta: "Sep 1", amount: "$16,000" },
];

const suppliers = [
  { id: "s1", name: "Shenzhen Tech Co.", country: "China", city: "Shenzhen", score: 92, orders: 12, products: 2, contacts: [{ name: "Zhang Wei", phone: "+86 138 1234 5678", email: "zhang@sztech.com", role: "Sales Manager" }] },
  { id: "s2", name: "Guangzhou Ceramics Ltd.", country: "China", city: "Guangzhou", score: 88, orders: 8, products: 1, contacts: [{ name: "Li Ming", phone: "+86 139 8765 4321", email: "liming@gzceramics.com", role: "Export Manager" }] },
  { id: "s3", name: "Kerala Wood Industries", country: "India", city: "Kochi", score: 85, orders: 15, products: 1, contacts: [{ name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@keralawood.com", role: "Owner" }] },
  { id: "s4", name: "Foshan Aluminum Co.", country: "China", city: "Foshan", score: 78, orders: 6, products: 1, contacts: [{ name: "Chen Fang", phone: "+86 136 1111 2222", email: "chen@foshanalu.com", role: "Sales" }] },
  { id: "s5", name: "Jaipur Ceramics Pvt Ltd", country: "India", city: "Jaipur", score: 90, orders: 20, products: 1, contacts: [{ name: "Amit Sharma", phone: "+91 99887 76655", email: "amit@jaipurceramics.in", role: "Sales Head" }] },
];

const products = [
  { id: "p1", sku: "LED-001", name: "LED Panel Light 60x60", brand: "Philips Compatible", hsCode: "9405.42", unit: "pcs", unitCost: 18.5, weight: 2.8, cbm: 0.035, supplier: "Shenzhen Tech Co." },
  { id: "p2", sku: "LED-002", name: "LED Downlight 12W", brand: "Generic", hsCode: "9405.42", unit: "pcs", unitCost: 5.2, weight: 0.35, cbm: 0.004, supplier: "Shenzhen Tech Co." },
  { id: "p3", sku: "CT-001", name: "Ceramic Wall Tile 30x60", brand: "China Ceramics", hsCode: "6907.21", unit: "sqm", unitCost: 4.8, weight: 15.5, cbm: 0.018, supplier: "Guangzhou Ceramics Ltd." },
  { id: "p4", sku: "PW-001", name: "Marine Plywood 18mm", brand: "Greenply", hsCode: "4412.31", unit: "sheet", unitCost: 850, weight: 32, cbm: 0.043, supplier: "Kerala Wood Industries" },
  { id: "p5", sku: "AL-001", name: "Aluminum Profile T6063", brand: "Foshan Alu", hsCode: "7604.10", unit: "meter", unitCost: 3.2, weight: 0.85, cbm: 0.001, supplier: "Foshan Aluminum Co." },
];

const salesOrders = [
  { id: "so1", customer: "ABC Corporation", contact: "Rahul Mehta", enquiry: "LED lighting for new office building", status: "QUOTATION_SENT", followUpDate: "Aug 22", amount: 450000 },
  { id: "so2", customer: "XYZ Interiors", contact: "Priya Patel", enquiry: "Ceramic tiles for 50 apartments", status: "FOLLOW_UP", followUpDate: "Aug 25", amount: 1200000 },
  { id: "so3", customer: "DEF Builders", contact: "Amit Singh", enquiry: "Aluminum profiles for windows", status: "ENQUIRY", followUpDate: null, amount: 280000 },
];

const serviceTickets = [
  { id: "st1", customer: "ABC Corporation", complaint: "LED panel not working in Conference Room", status: "IN_PROGRESS", priority: "HIGH", engineer: "Ravi Kumar", visitDate: "Aug 20" },
  { id: "st2", customer: "XYZ Interiors", complaint: "Ceramic tile crack in lobby area", status: "VISIT_SCHEDULED", priority: "MEDIUM", engineer: "Amit Sharma", visitDate: "Aug 22" },
  { id: "st3", customer: "DEF Builders", complaint: "Aluminum frame alignment issue", status: "OPEN", priority: "CRITICAL", engineer: null, visitDate: null },
];

const calendarEvents = [
  { id: "1", title: "Follow up with Shenzhen supplier", date: "2026-08-20", type: "task", priority: "HIGH" },
  { id: "2", title: "Review packing list", date: "2026-08-20", type: "task", priority: "CRITICAL" },
  { id: "3", title: "Call customer about quotation", date: "2026-08-20", type: "task", priority: "MEDIUM" },
  { id: "4", title: "Inspection - Shenzhen order", date: "2026-08-25", type: "milestone", priority: "HIGH" },
  { id: "5", title: "ETD - Ceramic Tiles", date: "2026-08-28", type: "shipment", priority: "HIGH" },
  { id: "6", title: "Payment due - Plywood order", date: "2026-08-21", type: "payment", priority: "CRITICAL" },
  { id: "7", title: "Follow-up with Rahul Mehta", date: "2026-08-22", type: "task", priority: "MEDIUM" },
  { id: "8", title: "CHA confirmation - BL release", date: "2026-08-23", type: "milestone", priority: "HIGH" },
  { id: "9", title: "ETA - Plywood delivery", date: "2026-08-20", type: "shipment", priority: "HIGH" },
];

const chinaTimeline = [
  { stage: "REQUIREMENT", label: "Requirement", status: "completed", date: "Jul 15" },
  { stage: "QUOTATION", label: "Quotation", status: "completed", date: "Jul 18" },
  { stage: "NEGOTIATION", label: "Negotiation", status: "completed", date: "Jul 20" },
  { stage: "SAMPLE", label: "Sample", status: "completed", date: "Jul 25" },
  { stage: "PI", label: "PI", status: "completed", date: "Jul 28" },
  { stage: "PO", label: "PO", status: "completed", date: "Jul 30" },
  { stage: "PAYMENT", label: "Payment", status: "completed", date: "Aug 2" },
  { stage: "PRODUCTION", label: "Production", status: "current", date: "Aug 5", dueDate: "Aug 25" },
  { stage: "INSPECTION", label: "Inspection", status: "upcoming", dueDate: "Aug 28" },
  { stage: "READY_TO_SHIP", label: "Ready to Ship", status: "upcoming" },
  { stage: "BOOKING", label: "Booking", status: "upcoming" },
  { stage: "ETD", label: "ETD", status: "upcoming" },
  { stage: "BL_AWB", label: "BL / AWB", status: "upcoming" },
  { stage: "CUSTOMS_DOCUMENTS", label: "Customs Docs", status: "upcoming" },
  { stage: "CHA_CUSTOMS", label: "CHA / Customs", status: "upcoming" },
  { stage: "DUTY_CHARGES", label: "Duty / Charges", status: "upcoming" },
  { stage: "CLEARANCE", label: "Clearance", status: "upcoming" },
  { stage: "DELIVERY_GRN", label: "Delivery / GRN", status: "upcoming" },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

const priorityColors: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-blue-500 text-white",
  LOW: "bg-gray-400 text-white",
};

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  PLANNED: { icon: Clock, color: "text-gray-500", bg: "bg-gray-500/10" },
  IN_PROGRESS: { icon: ArrowUpDown, color: "text-amber-500", bg: "bg-amber-500/10" },
  WAITING: { icon: Pause, color: "text-blue-500", bg: "bg-blue-500/10" },
  COMPLETED: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  CANCELLED: { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
};

const eventTypeColors: Record<string, string> = {
  task: "bg-blue-500",
  milestone: "bg-amber-500",
  shipment: "bg-green-500",
  payment: "bg-red-500",
};

const salesStatusConfig: Record<string, { label: string; color: string }> = {
  ENQUIRY: { label: "Enquiry", color: "bg-gray-500 text-white" },
  QUOTATION_SENT: { label: "Quotation Sent", color: "bg-blue-500 text-white" },
  FOLLOW_UP: { label: "Follow Up", color: "bg-amber-500 text-white" },
  ORDER_RECEIVED: { label: "Order Received", color: "bg-green-500 text-white" },
  COMPLETED: { label: "Completed", color: "bg-green-600 text-white" },
  LOST: { label: "Lost", color: "bg-red-500 text-white" },
};

const serviceStatusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "bg-gray-500 text-white" },
  ASSIGNED: { label: "Assigned", color: "bg-blue-500 text-white" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-500 text-white" },
  VISIT_SCHEDULED: { label: "Visit Scheduled", color: "bg-purple-500 text-white" },
  COMPLETED: { label: "Completed", color: "bg-green-500 text-white" },
  CLOSED: { label: "Closed", color: "bg-green-600 text-white" },
};

// ═══════════════════════════════════════════════════════════
// PREVIEW PAGES
// ═══════════════════════════════════════════════════════════

function DashboardPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">What needs your attention today</p>
        </div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />Quick Add</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overdue", value: todayStats.overdue, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Today", value: todayStats.today, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Waiting", value: todayStats.waiting, icon: Pause, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Completed", value: todayStats.completed, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
                <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" />Today&apos;s Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                <div className={`w-1.5 h-8 rounded-full ${priorityColors[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Due {task.dueTime}</p>
                </div>
                <Badge variant="outline" className="text-xs">{task.module === "IMPORT_PURCHASE" ? "Import" : "Sales"}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" />Overdue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
                <div className="w-1.5 h-8 rounded-full bg-red-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-red-500 font-medium">{task.daysOverdue} day{task.daysOverdue > 1 ? "s" : ""} overdue</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Pause className="w-5 h-5 text-blue-500" />Waiting For</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {waitingTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors">
                <div className="w-1.5 h-8 rounded-full bg-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-blue-600">From: {task.waitingFor}</p>
                  <p className="text-xs text-muted-foreground">Follow-up: {task.followUpDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2"><Package className="w-5 h-5 text-primary" />Active Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeOrders.map((order) => (
              <div key={order.id} className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{order.title}</p>
                    <p className="text-xs text-muted-foreground">{order.orderNumber}</p>
                  </div>
                  <Badge variant={order.type === "CHINA_IMPORT" ? "default" : "secondary"}>{order.type === "CHINA_IMPORT" ? "China" : "Domestic"}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{order.stage}</span>
                      <span className="font-medium">{order.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${order.progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">ETA</p>
                    <p className="text-xs font-medium">{order.eta}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrdersPreview() {
  const chinaStages = ["REQUIREMENT", "QUOTATION", "NEGOTIATION", "SAMPLE", "PI", "PO", "PAYMENT", "PRODUCTION", "INSPECTION", "READY_TO_SHIP", "BOOKING", "ETD", "BL_AWB", "CUSTOMS_DOCUMENTS", "CHA_CUSTOMS", "DUTY_CHARGES", "CLEARANCE", "DELIVERY_GRN"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Import / Purchase</h1><p className="text-muted-foreground">Manage your orders and shipments</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />New Order</Button>
      </div>

      <div className="space-y-4">
        {activeOrders.map((order) => {
          const stageIdx = chinaStages.indexOf(order.stage.replace(/ /g, "_").toUpperCase());
          return (
            <Card key={order.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{order.title}</h3>
                      <Badge variant={order.type === "CHINA_IMPORT" ? "default" : "secondary"}>{order.type === "CHINA_IMPORT" ? "China Import" : "Domestic"}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.orderNumber} · Supplier Name</p>
                  </div>
                  <p className="text-lg font-semibold">{order.amount}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">{order.stage}</span>
                    <span className="text-muted-foreground">{order.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${order.progress}%` }} />
                  </div>
                  <div className="flex gap-1 mt-2">
                    {chinaStages.map((stage, idx) => (
                      <div key={stage} className={`w-2 h-2 rounded-full ${idx === stageIdx ? "bg-primary ring-2 ring-primary/30" : idx < stageIdx ? "bg-primary/60" : "bg-muted"}`} title={stage.replace(/_/g, " ")} />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TasksPreview() {
  const allTasks = [...todayTasks, ...overdueTasks.map(t => ({ ...t, dueTime: null as string | null, orderId: null as string | null })), ...waitingTasks.map(t => ({ ...t, dueTime: null as string | null, orderId: null as string | null, priority: "MEDIUM" }))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Tasks</h1><p className="text-muted-foreground">Manage your work items</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />New Task</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search tasks..." className="pl-9" /></div>
      <div className="space-y-2">
        {allTasks.map((task) => {
          const isOverdue = "daysOverdue" in task;
          const isWaiting = "waitingFor" in task;
          const status = isOverdue ? "PLANNED" : isWaiting ? "WAITING" : "PLANNED";
          const cfg = statusConfig[status];
          const StatusIcon = cfg.icon;
          return (
            <Card key={task.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${cfg.bg}`}><StatusIcon className={`w-5 h-5 ${cfg.color}`} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium truncate">{task.title}</h3>
                      <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {"daysOverdue" in task && <span className="text-red-500">{task.daysOverdue} days overdue</span>}
                      {"waitingFor" in task && <span className="text-blue-500">Waiting for: {task.waitingFor}</span>}
                      {"followUpDate" in task && task.followUpDate && <span>Follow-up: {task.followUpDate}</span>}
                      <Badge variant="secondary" className="text-xs">{task.module === "IMPORT_PURCHASE" ? "Import" : "Sales"}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function CalendarPreview() {
  const days = (() => {
    const d = [];
    for (let i = 0; i < 35; i++) d.push(i);
    return d;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Calendar</h1><p className="text-muted-foreground">Plan your work and track deadlines</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />Add Event</Button>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
            <CardTitle>August 2026</CardTitle>
            <Button variant="ghost" size="icon"><ChevronRight className="w-5 h-5" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((i) => {
              const dayNum = i - 0 + 1;
              const dateStr = `2026-08-${String(dayNum).padStart(2, "0")}`;
              const events = calendarEvents.filter((e) => e.date === dateStr);
              const isToday = dayNum === 20;
              if (dayNum > 31) return <div key={i} className="h-24" />;
              return (
                <div key={i} className={`h-24 p-1 rounded-lg border ${isToday ? "border-primary bg-primary/5" : "border-border"} hover:bg-muted/50 transition-colors cursor-pointer`}>
                  <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{dayNum}</div>
                  <div className="space-y-0.5">
                    {events.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center gap-1 text-xs truncate">
                        <div className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[event.type]}`} />
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                    {events.length > 3 && <div className="text-xs text-muted-foreground">+{events.length - 3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="font-medium">Legend:</span>
            {Object.entries(eventTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5"><div className={`w-3 h-3 rounded-full ${color}`} /><span className="capitalize">{type}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SuppliersPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Suppliers</h1><p className="text-muted-foreground">Manage your supplier relationships</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />Add Supplier</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search suppliers..." className="pl-9" /></div>
      <div className="grid gap-4 md:grid-cols-2">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">{supplier.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{supplier.name}</h3>
                    <div className="flex items-center gap-0.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="text-sm">{supplier.score}</span></div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><MapPin className="w-3.5 h-3.5" />{supplier.city}, {supplier.country}</div>
                  <div className="flex items-center gap-2"><Badge variant="secondary">{supplier.orders} orders</Badge><Badge variant="outline" className="text-xs">{supplier.products} products</Badge></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProductsPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Products</h1><p className="text-muted-foreground">Product catalog and HS codes</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />Add Product</Button>
      </div>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search by name, SKU, HS code..." className="pl-9" /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-mono">{product.sku}</Badge>
                    <Badge variant="secondary" className="text-xs">HS: {product.hsCode}</Badge>
                  </div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-muted-foreground">Unit Cost</p><p className="font-medium">{product.unitCost > 100 ? "₹" : "$"}{product.unitCost.toLocaleString()}/{product.unit}</p></div>
                <div><p className="text-muted-foreground">Weight</p><p className="font-medium">{product.weight} kg</p></div>
                <div><p className="text-muted-foreground">CBM</p><p className="font-medium">{product.cbm}</p></div>
                <div><p className="text-muted-foreground">Supplier</p><p className="font-medium text-xs truncate">{product.supplier}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OrderDetailPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">LED Lights from Shenzhen</h1>
            <Badge>China Import</Badge>
          </div>
          <p className="text-muted-foreground">ORD-2026-001 · Shenzhen Tech Co. · Zhang Wei</p>
        </div>
        <p className="text-2xl font-bold">$14,450</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Order Timeline</CardTitle></CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-4">
              {chinaTimeline.map((item) => (
                <div key={item.stage} className="flex items-start gap-4 relative">
                  <div className={`w-6 h-6 rounded-full ${item.status === "completed" ? "bg-green-500" : item.status === "current" ? "bg-primary ring-4 ring-primary/20" : "bg-muted"} flex items-center justify-center z-10`}>
                    {item.status === "completed" && <CheckCircle2 className="w-4 h-4 text-white" />}
                    {item.status === "current" && <Clock className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.status === "upcoming" ? "text-muted-foreground" : ""}`}>{item.label}</span>
                      {item.status === "current" && <Badge className="bg-primary text-primary-foreground">Current</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      {item.date && <span>Completed: {item.date}</span>}
                      {item.dueDate && <span>Due: {item.dueDate}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5" />Landed Cost Calculator</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Invoice (INR)</p><p className="text-xl font-bold">₹12,06,575</p></div>
            <div className="text-center p-4 rounded-lg bg-muted/50"><p className="text-sm text-muted-foreground">Freight + Duty</p><p className="text-xl font-bold">₹2,85,000</p></div>
            <div className="text-center p-4 rounded-lg bg-primary/10"><p className="text-sm text-muted-foreground">Total Landed</p><p className="text-xl font-bold text-primary">₹14,91,575</p></div>
            <div className="text-center p-4 rounded-lg bg-green-500/10"><p className="text-sm text-muted-foreground">Per Unit</p><p className="text-xl font-bold text-green-500">₹2,486</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesPreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Sales</h1><p className="text-muted-foreground">Track enquiries and quotations</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />New Enquiry</Button>
      </div>
      <div className="space-y-3">
        {salesOrders.map((sale) => (
          <Card key={sale.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{sale.customer}</h3>
                  <p className="text-sm text-muted-foreground">{sale.contact}</p>
                  <p className="text-sm mt-1">{sale.enquiry}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={salesStatusConfig[sale.status]?.color || "bg-gray-500 text-white"}>{salesStatusConfig[sale.status]?.label || sale.status}</Badge>
                    {sale.followUpDate && <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarIcon className="w-3 h-3" />Follow-up: {sale.followUpDate}</span>}
                  </div>
                </div>
                <p className="text-lg font-semibold">₹{sale.amount.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ServicePreview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Service</h1><p className="text-muted-foreground">Track complaints and service visits</p></div>
        <Button className="gap-1.5"><Plus className="w-4 h-4" />New Ticket</Button>
      </div>
      <div className="space-y-3">
        {serviceTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-muted"><Wrench className="w-5 h-5 text-muted-foreground" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{ticket.customer}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{ticket.complaint}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge className={serviceStatusConfig[ticket.status]?.color || "bg-gray-500 text-white"}>{serviceStatusConfig[ticket.status]?.label || ticket.status}</Badge>
                    <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    {ticket.engineer && <span className="text-xs text-muted-foreground">{ticket.engineer}</span>}
                    {ticket.visitDate && <span className="text-xs text-muted-foreground">Visit: {ticket.visitDate}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReportsPreview() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Reports</h1><p className="text-muted-foreground">Performance, delays, and productivity insights</p></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" />Task Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center"><p className="text-3xl font-bold text-green-500">156</p><p className="text-sm text-muted-foreground">Completed</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-amber-500">23</p><p className="text-sm text-muted-foreground">Pending</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-red-500">8</p><p className="text-sm text-muted-foreground">Overdue</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-blue-500">12</p><p className="text-sm text-muted-foreground">Waiting</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-primary">87%</p><p className="text-sm text-muted-foreground">Completion Rate</p></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-primary" />Import / Purchase</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center"><p className="text-3xl font-bold text-primary">6</p><p className="text-sm text-muted-foreground">Active Imports</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-red-500">2</p><p className="text-sm text-muted-foreground">Delayed</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-amber-500">3</p><p className="text-sm text-muted-foreground">Pending PO</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-blue-500">4</p><p className="text-sm text-muted-foreground">GRN Pending</p></div>
            <div className="text-center"><p className="text-3xl font-bold text-green-500">5</p><p className="text-sm text-muted-foreground">Upcoming ETAs</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsPreview() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Settings</h1><p className="text-muted-foreground">Manage your profile and preferences</p></div>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-2xl font-bold">U</div>
            <Button variant="outline" size="sm">Change Photo</Button>
          </div>
          <div className="space-y-2"><label className="text-sm font-medium">Full Name</label><Input defaultValue="User" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Email</label><Input defaultValue="user@taskpilot.com" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">Phone</label><Input defaultValue="+91 98765 43210" /></div>
          <Button className="gap-1.5">Save Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PREVIEW PAGE
// ═══════════════════════════════════════════════════════════

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Package },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "suppliers", label: "Suppliers", icon: Users },
  { id: "products", label: "Products", icon: ShoppingCart },
  { id: "sales", label: "Sales", icon: BarChart3 },
  { id: "service", label: "Service", icon: Wrench },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

const pageComponents: Record<string, React.FC> = {
  dashboard: DashboardPreview,
  orders: OrdersPreview,
  tasks: TasksPreview,
  calendar: CalendarPreview,
  suppliers: SuppliersPreview,
  products: ProductsPreview,
  sales: SalesPreview,
  service: ServicePreview,
  reports: ReportsPreview,
  orderDetail: OrderDetailPreview,
  settings: SettingsPreview,
};

export default function PreviewPage() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const PageComponent = pageComponents[activePage] || DashboardPreview;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-border bg-card flex-shrink-0 overflow-hidden`}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">TaskPilot</span>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                activePage === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
          <Separator className="my-2" />
          <button
            onClick={() => setActivePage("orderDetail")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left ${
              activePage === "orderDetail" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <FileText className="w-5 h-5" />
            Order Detail (Demo)
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center gap-4 h-14 px-4 lg:px-6 border-b border-border bg-card/95 backdrop-blur">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <MoreHorizontal className="w-5 h-5" />
          </Button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="search" placeholder="Search tasks, orders, suppliers..." className="pl-9 h-9 bg-muted border-0" readOnly />
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <Link href="/dashboard">
            <Button size="sm" className="gap-1.5">Exit Preview</Button>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 py-6 lg:px-8 overflow-auto">
          <div className="mb-4">
            <Badge variant="outline" className="text-xs">📋 Preview Mode — Mock Data</Badge>
          </div>
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
