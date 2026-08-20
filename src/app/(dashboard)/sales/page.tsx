"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [enquiry, setEnquiry] = useState("");
  const [amount, setAmount] = useState("");

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    try {
      const res = await fetch("/api/sales-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerContact: customerContact || null,
          enquiry: enquiry || null,
          amount: amount ? parseFloat(amount) : null,
          status: "ENQUIRY",
        }),
      });

      if (res.ok) {
        setShowModal(false);
        setCustomerName("");
        setCustomerContact("");
        setEnquiry("");
        setAmount("");
        fetchSalesOrders();
      }
    } catch (err) {
      console.error("Failed to create sales enquiry:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">Track enquiries and quotations</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl active:scale-95 spring-transition">
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

      {/* New Enquiry Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create New Sales Enquiry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateEnquiry} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">Customer Name *</Label>
              <Input
                placeholder="e.g. ABC Corporation"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">Contact Person</Label>
              <Input
                placeholder="e.g. Rahul Mehta (+91 98765 43210)"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">Enquiry Details</Label>
              <Input
                placeholder="e.g. LED lighting requirement for 50 offices"
                value={enquiry}
                onChange={(e) => setEnquiry(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider">Quotation Amount (INR)</Label>
              <Input
                type="number"
                placeholder="e.g. 450000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white font-bold">
                Save Enquiry
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
