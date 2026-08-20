"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Package, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";


interface Order {
  id: string;
  orderNumber: string;
  title: string;
  type: string;
  status: string;
  currentStage: string | null;
  stageProgress: number;
  currency: string;
  dueDate: string | null;
  supplier: { id: string; name: string } | null;
  _count: { tasks: number; documents: number; payments: number };
}

const chinaStages = [
  "REQUIREMENT", "QUOTATION", "NEGOTIATION", "SAMPLE", "PI", "PO",
  "PAYMENT", "PRODUCTION", "INSPECTION", "READY_TO_SHIP", "BOOKING",
  "ETD", "BL_AWB", "CUSTOMS_DOCUMENTS", "CHA_CUSTOMS", "DUTY_CHARGES",
  "CLEARANCE", "DELIVERY_GRN",
];

const domesticStages = [
  "REQUIREMENT", "QUOTATION", "PO", "SUPPLIER_CONFIRMATION",
  "PAYMENT", "DISPATCH", "DELIVERY", "GRN",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, typeFilter, statusFilter]);

  async function fetchOrders() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (typeFilter !== "ALL") params.set("type", typeFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Import / Purchase Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Track China import stages & domestic procurement orders</p>
        </div>
        <Link href="/orders/new">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/20 active:scale-95 spring-transition px-4 py-2 font-semibold">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 spring-transition" />
          <Input
            placeholder="Search orders, suppliers, PO references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/50 border border-border/40 focus-visible:bg-background focus-visible:border-indigo-500/50 rounded-xl text-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "ALL")}>
          <SelectTrigger className="w-full sm:w-[170px] h-10 rounded-xl bg-card border-border/60 font-medium text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Procurement</SelectItem>
            <SelectItem value="CHINA_IMPORT">China Import</SelectItem>
            <SelectItem value="DOMESTIC_PURCHASE">Domestic Purchase</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl bg-card border-border/60 font-medium text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="ON_HOLD">On Hold</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Order Cards */}
      <div className="space-y-4">
        {loading ? (
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground font-medium animate-pulse">Loading procurement pipeline...</div>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => {
            const stages = order.type === "CHINA_IMPORT" ? chinaStages : domesticStages;
            const stageIdx = order.currentStage ? stages.indexOf(order.currentStage) : -1;

            return (
              <Link key={order.id} href={`/orders/${order.id}`}>
                <Card className="interactive-card rounded-2xl border border-border/60 hover:border-indigo-500/40 shadow-xs hover:shadow-md cursor-pointer overflow-hidden bg-card">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 spring-transition">{order.title}</h3>
                          <Badge className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border",
                            order.type === "CHINA_IMPORT"
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          )}>
                            {order.type === "CHINA_IMPORT" ? "China Import" : "Domestic"}
                          </Badge>
                          {order.status === "COMPLETED" && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-[10px] font-bold uppercase">Completed</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 font-mono">
                          {order.orderNumber}
                          {order.supplier && ` · ${order.supplier.name}`}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        {order.dueDate && (
                          <p className="text-xs font-mono font-semibold text-muted-foreground inline-flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            ETA: {order.dueDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stage Progress */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-violet-700 uppercase tracking-wider">
                          Current Stage: {order.currentStage?.replace(/_/g, " ") || "Not started"}
                        </span>
                        <span className="font-mono font-bold text-violet-700">{order.stageProgress}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                        <div
                          className="h-full bg-violet-600 rounded-full spring-transition"
                          style={{ width: `${order.stageProgress}%` }}
                        />
                      </div>
                      {/* Visual Stage Stepper Dots */}
                      <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto pb-1 scrollbar-none">
                        {stages.map((stage, idx) => {
                          const isDone = idx < stageIdx;
                          const isCurrent = idx === stageIdx;
                          return (
                            <div key={stage} className="flex flex-col items-center gap-1 group/dot relative flex-1 min-w-[20px]" title={stage.replace(/_/g, " ")}>
                              <div className={cn(
                                "w-3 h-3 rounded-full border transition-all duration-200 flex items-center justify-center",
                                isDone ? "bg-violet-600 border-violet-600" :
                                isCurrent ? "bg-violet-600 border-violet-600 ring-4 ring-violet-600/20 animate-pulse" :
                                "bg-slate-100 border-slate-300"
                              )}>
                                {isDone && <span className="w-1 h-1 bg-white rounded-full" />}
                              </div>
                              <span className={cn(
                                "text-[9px] font-mono leading-none truncate max-w-[50px] hidden sm:block",
                                isCurrent ? "font-bold text-violet-700" : isDone ? "text-slate-600" : "text-slate-400"
                              )}>
                                {stage.split("_")[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}

        {!loading && orders.length === 0 && (
          <Card className="rounded-2xl border-dashed border-2 border-border/60">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold text-muted-foreground">No orders matching filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

