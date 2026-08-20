"use client";

import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Package,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const taskStats = {
  completed: 156,
  pending: 23,
  overdue: 8,
  waiting: 12,
  completionRate: 87,
};

const importStats = {
  activeImports: 6,
  delayedImports: 2,
  pendingPO: 3,
  grnPending: 4,
  upcomingETAs: 5,
};

const recentActivity = [
  { date: "2026-08-19", completed: 8, created: 5, overdue: 2 },
  { date: "2026-08-18", completed: 12, created: 7, overdue: 1 },
  { date: "2026-08-17", completed: 6, created: 4, overdue: 3 },
  { date: "2026-08-16", completed: 10, created: 6, overdue: 0 },
  { date: "2026-08-15", completed: 9, created: 8, overdue: 1 },
];

const topSuppliers = [
  { name: "Shenzhen Tech Co.", orders: 12, onTime: 10, delayed: 2, score: 92 },
  { name: "Kerala Wood Industries", orders: 15, onTime: 13, delayed: 2, score: 85 },
  { name: "Guangzhou Ceramics Ltd.", orders: 8, onTime: 7, delayed: 1, score: 88 },
  { name: "Jaipur Ceramics Pvt Ltd", orders: 20, onTime: 18, delayed: 2, score: 90 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Performance, delays, and productivity insights</p>
      </div>

      {/* Task Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Task Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{taskStats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">{taskStats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{taskStats.overdue}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{taskStats.waiting}</p>
              <p className="text-sm text-muted-foreground">Waiting</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{taskStats.completionRate}%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import/Purchase Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Import / Purchase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{importStats.activeImports}</p>
              <p className="text-sm text-muted-foreground">Active Imports</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">{importStats.delayedImports}</p>
              <p className="text-sm text-muted-foreground">Delayed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500">{importStats.pendingPO}</p>
              <p className="text-sm text-muted-foreground">Pending PO</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">{importStats.grnPending}</p>
              <p className="text-sm text-muted-foreground">GRN Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{importStats.upcomingETAs}</p>
              <p className="text-sm text-muted-foreground">Upcoming ETAs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-24">{day.date}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-xs">{day.completed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span className="text-xs">{day.created}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-xs">{day.overdue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supplier Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Supplier Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((supplier) => (
                <div key={supplier.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{supplier.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm">{supplier.score}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${(supplier.onTime / supplier.orders) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {supplier.onTime}/{supplier.orders} on time ({supplier.delayed} delayed)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
