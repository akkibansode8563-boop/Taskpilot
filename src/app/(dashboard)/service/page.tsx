"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Wrench, Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ServiceTicket {
  id: string;
  customerName: string;
  complaint: string | null;
  status: string;
  priority: string;
  engineer: string | null;
  visitDate: string | null;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Open", color: "bg-gray-500 text-white" },
  ASSIGNED: { label: "Assigned", color: "bg-blue-500 text-white" },
  IN_PROGRESS: { label: "In Progress", color: "bg-amber-500 text-white" },
  VISIT_SCHEDULED: { label: "Visit Scheduled", color: "bg-purple-500 text-white" },
  COMPLETED: { label: "Completed", color: "bg-green-500 text-white" },
  CLOSED: { label: "Closed", color: "bg-green-600 text-white" },
};

const priorityConfig: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-blue-500 text-white",
  LOW: "bg-gray-400 text-white",
};

export default function ServicePage() {
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [searchQuery]);

  async function fetchTickets() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/service-tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (err) {
      console.error("Failed to fetch service tickets:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service</h1>
          <p className="text-muted-foreground">Track complaints and service visits</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Loading service tickets...</div>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card key={ticket.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Wrench className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{ticket.customerName}</h3>
                    {ticket.complaint && (
                      <p className="text-sm text-muted-foreground mt-1">{ticket.complaint}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge className={statusConfig[ticket.status]?.color || "bg-gray-500 text-white"}>
                        {statusConfig[ticket.status]?.label || ticket.status}
                      </Badge>
                      <Badge className={priorityConfig[ticket.priority] || "bg-gray-400 text-white"}>
                        {ticket.priority}
                      </Badge>
                      {ticket.engineer && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {ticket.engineer}
                        </span>
                      )}
                      {ticket.visitDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {ticket.visitDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
