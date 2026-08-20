"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SalesOrder {
  id: string;
  customerName: string;
  customerContact: string | null;
  enquiry: string | null;
  status: string;
  followUpDate: string | null;
  amount: number | null;
  currency: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  ENQUIRY: { label: "Enquiry", color: "bg-gray-500 text-white" },
  QUOTATION_SENT: { label: "Quotation Sent", color: "bg-blue-500 text-white" },
  FOLLOW_UP: { label: "Follow Up", color: "bg-amber-500 text-white" },
  ORDER_RECEIVED: { label: "Order Received", color: "bg-green-500 text-white" },
  COMPLETED: { label: "Completed", color: "bg-green-600 text-white" },
  LOST: { label: "Lost", color: "bg-red-500 text-white" },
};

export default function SalesPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSalesOrders();
  }, [searchQuery]);

  async function fetchSalesOrders() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/sales-orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSalesOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch sales orders:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Track enquiries and quotations</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Enquiry
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">Loading sales orders...</div>
            </CardContent>
          </Card>
        ) : (
          salesOrders.map((sale) => (
            <Card key={sale.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{sale.customerName}</h3>
                    {sale.customerContact && (
                      <p className="text-sm text-muted-foreground">{sale.customerContact}</p>
                    )}
                    {sale.enquiry && (
                      <p className="text-sm mt-1">{sale.enquiry}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className={statusConfig[sale.status]?.color || "bg-gray-500 text-white"}>
                        {statusConfig[sale.status]?.label || sale.status}
                      </Badge>
                      {sale.followUpDate && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Follow-up: {sale.followUpDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {sale.amount !== null && (
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {sale.currency === "INR" ? "₹" : "$"}{sale.amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
