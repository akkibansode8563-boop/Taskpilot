"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock calendar data
const mockEvents = [
  { id: "1", title: "Follow up with Shenzhen supplier", date: "2026-08-19", type: "task", priority: "HIGH" },
  { id: "2", title: "Review packing list", date: "2026-08-19", type: "task", priority: "CRITICAL" },
  { id: "3", title: "Call customer about quotation", date: "2026-08-19", type: "task", priority: "MEDIUM" },
  { id: "4", title: "Inspection - Shenzhen order", date: "2026-08-25", type: "milestone", priority: "HIGH" },
  { id: "5", title: "ETD - Ceramic Tiles", date: "2026-08-28", type: "shipment", priority: "HIGH" },
  { id: "6", title: "Payment due - Plywood order", date: "2026-08-20", type: "payment", priority: "CRITICAL" },
  { id: "7", title: "Follow-up with Rahul Mehta", date: "2026-08-22", type: "task", priority: "MEDIUM" },
  { id: "8", title: "CHA confirmation - BL release", date: "2026-08-21", type: "milestone", priority: "HIGH" },
  { id: "9", title: "ETA - Plywood delivery", date: "2026-08-20", type: "shipment", priority: "HIGH" },
  { id: "10", title: "Supplier meeting", date: "2026-08-23", type: "task", priority: "LOW" },
];

const eventTypeColors: Record<string, string> = {
  task: "bg-blue-500",
  milestone: "bg-amber-500",
  shipment: "bg-green-500",
  payment: "bg-red-500",
};

const priorityDots: Record<string, string> = {
  CRITICAL: "bg-red-500",
  HIGH: "bg-orange-500",
  MEDIUM: "bg-blue-500",
  LOW: "bg-gray-400",
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 19)); // August 19, 2026
  const [view, setView] = useState("month");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // 0 = Sunday

    const days = [];
    // Add empty cells for days before the first day
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return mockEvents.filter((event) => event.date === dateStr);
  };

  const days = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const todayEvents = getEventsForDate(new Date(2026, 7, 19));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Plan your work and track deadlines</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsList className="grid w-full grid-cols-3 max-w-[300px]">
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
        </TabsList>

        {/* Month View */}
        <TabsContent value="month">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <CardTitle>{monthName}</CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="h-24" />;
                  }

                  const events = getEventsForDate(day);
                  const isToday =
                    day.toISOString().split("T")[0] === "2026-08-19";

                  return (
                    <div
                      key={day.toISOString()}
                      className={`h-24 p-1 rounded-lg border ${
                        isToday ? "border-primary bg-primary/5" : "border-border"
                      } hover:bg-muted/50 transition-colors cursor-pointer`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {events.slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center gap-1 text-xs truncate"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[event.type]}`} />
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{events.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Week View */}
        <TabsContent value="week">
          <Card>
            <CardHeader>
              <CardTitle>Week of August 19, 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22", "Sat 23", "Sun 24"].map(
                  (day, idx) => {
                    const date = new Date(2026, 7, 18 + idx);
                    const events = getEventsForDate(date);
                    const isToday = idx === 1;

                    return (
                      <div
                        key={day}
                        className={`rounded-lg border p-2 ${
                          isToday ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className={`text-sm font-medium mb-2 ${isToday ? "text-primary" : ""}`}>
                          {day}
                        </div>
                        <div className="space-y-1">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className="p-1.5 rounded bg-muted text-xs"
                            >
                              <div className="flex items-center gap-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${eventTypeColors[event.type]}`} />
                                <span className="truncate">{event.title}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Day View */}
        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>Tuesday, August 19, 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "09:00", events: [] },
                  { time: "10:00", events: [{ title: "Follow up with Shenzhen supplier", priority: "HIGH" }] },
                  { time: "11:00", events: [{ title: "Review packing list for Mumbai order", priority: "CRITICAL" }] },
                  { time: "12:00", events: [] },
                  { time: "13:00", events: [] },
                  { time: "14:00", events: [{ title: "Call customer about quotation", priority: "MEDIUM" }] },
                  { time: "15:00", events: [{ title: "Confirm CHA documents for BL release", priority: "HIGH" }] },
                  { time: "16:00", events: [{ title: "Send payment proof to Guangzhou supplier", priority: "MEDIUM" }] },
                  { time: "17:00", events: [] },
                ].map((slot) => (
                  <div key={slot.time} className="flex gap-4">
                    <div className="w-16 text-sm text-muted-foreground">{slot.time}</div>
                    <div className="flex-1 border-l border-border pl-4">
                      {slot.events.map((event, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/50 mb-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${priorityDots[event.priority]}`} />
                            <span className="text-sm font-medium">{event.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="font-medium">Legend:</span>
            {Object.entries(eventTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
