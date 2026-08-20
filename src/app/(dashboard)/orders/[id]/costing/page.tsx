"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  currency: string;
  orderItems: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    unitCost: number;
    totalCost: number;
    weight: number | null;
  }>;
}

interface CostComponent {
  id: string;
  component: string;
  amount: number;
  currency: string;
  allocationMethod: string;
}

const COST_COMPONENTS = [
  "Freight (Sea/Air)", "Insurance", "Customs Duty", "GST / IGST",
  "CHA Fees", "Port Charges", "Transport (Inland)", "Handling / CFS",
  "Dock Rent", "Examination Charges", "Stamp Duty", "Bank Charges", "Other",
];

const ALLOCATION_METHODS = [
  { value: "BY_VALUE", label: "By Invoice Value" },
  { value: "BY_WEIGHT", label: "By Weight (KG)" },
  { value: "BY_QTY", label: "By Quantity" },
  { value: "EQUAL", label: "Equal Split" },
];

export default function CostingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [costs, setCosts] = useState<CostComponent[]>([]);
  const [exchangeRate, setExchangeRate] = useState(83.5);

  useEffect(() => { fetchOrder(); }, [orderId]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        if (data.currency === "INR") setExchangeRate(1);
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }

  function addCost() {
    setCosts([...costs, {
      id: `cost-${Date.now()}`,
      component: COST_COMPONENTS[0],
      amount: 0,
      currency: order?.currency || "USD",
      allocationMethod: "BY_VALUE",
    }]);
  }

  function updateCost(id: string, field: string, value: string | number) {
    setCosts(costs.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function removeCost(id: string) {
    setCosts(costs.filter((c) => c.id !== id));
  }

  const totalForeign = costs.filter((c) => c.currency !== "INR").reduce((sum, c) => sum + c.amount, 0);
  const totalLocal = costs.filter((c) => c.currency === "INR").reduce((sum, c) => sum + c.amount, 0);
  const totalInINR = totalForeign * exchangeRate + totalLocal;
  const invoiceTotal = order?.orderItems.reduce((sum, item) => sum + item.totalCost, 0) || 0;
  const invoiceInINR = order?.currency === "INR" ? invoiceTotal : invoiceTotal * exchangeRate;
  const totalLandedCost = invoiceInINR + totalInINR;
  const totalQuantity = order?.orderItems.reduce((sum, item) => sum + item.quantity, 0) || 1;
  const landedCostPerUnit = totalLandedCost / totalQuantity;
  const freightAmount = costs.find((c) => c.component.includes("Freight"))?.amount || 0;
  const insuranceAmount = costs.find((c) => c.component.includes("Insurance"))?.amount || 0;
  const cifValue = invoiceTotal + freightAmount + insuranceAmount;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/orders"><Button variant="link">Back to Orders</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/orders/${orderId}`}>
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Landed Cost Calculator</h1>
          <p className="text-muted-foreground">{order.orderNumber} — {order.title}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap">Exchange Rate (USD → INR)</Label>
            <Input type="number" step="0.01" value={exchangeRate} onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)} className="max-w-[150px]" disabled={order.currency === "INR"} />
            {order.currency === "INR" && <Badge variant="secondary">Domestic order — rate locked at 1</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Invoice Value</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{item.name}</span>
                <span className="font-medium">{order.currency === "INR" ? "₹" : "$"}{item.totalCost.toLocaleString()}</span>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total Invoice</span>
              <span>{order.currency === "INR" ? "₹" : "$"}{invoiceTotal.toLocaleString()}</span>
            </div>
            {order.currency !== "INR" && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>In INR</span>
                <span>₹{invoiceInINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5" />CIF Estimate</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm"><span>Invoice Value</span><span>{order.currency === "INR" ? "₹" : "$"}{invoiceTotal.toLocaleString()}</span></div>
            <div className="flex items-center justify-between text-sm"><span>+ Freight</span><span>{order.currency === "INR" ? "₹" : "$"}{freightAmount.toLocaleString()}</span></div>
            <div className="flex items-center justify-between text-sm"><span>+ Insurance</span><span>{order.currency === "INR" ? "₹" : "$"}{insuranceAmount.toLocaleString()}</span></div>
            <Separator />
            <div className="flex items-center justify-between font-semibold"><span>CIF Value</span><span>{order.currency === "INR" ? "₹" : "$"}{cifValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            <p className="text-xs text-muted-foreground">CIF = Cost + Insurance + Freight (used for duty calculation)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5" />Cost Components</CardTitle>
            <Button size="sm" onClick={addCost} className="gap-1.5"><Plus className="w-4 h-4" />Add Cost</Button>
          </div>
        </CardHeader>
        <CardContent>
          {costs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No cost components added yet</p>
              <p className="text-sm">Click &quot;Add Cost&quot; to start calculating landed cost</p>
            </div>
          ) : (
            <div className="space-y-4">
              {costs.map((cost) => (
                <div key={cost.id} className="flex items-end gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Component</Label>
                    <Select value={cost.component} onValueChange={(v) => v && updateCost(cost.id, "component", v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>{COST_COMPONENTS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="w-32 space-y-1">
                    <Label className="text-xs">Amount</Label>
                    <Input type="number" step="0.01" value={cost.amount || ""} onChange={(e) => updateCost(cost.id, "amount", parseFloat(e.target.value) || 0)} className="h-9" placeholder="0" />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Currency</Label>
                    <Select value={cost.currency} onValueChange={(v) => v && updateCost(cost.id, "currency", v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="INR">INR</SelectItem><SelectItem value="CNY">CNY</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="w-40 space-y-1">
                    <Label className="text-xs">Allocate By</Label>
                    <Select value={cost.allocationMethod} onValueChange={(v) => v && updateCost(cost.id, "allocationMethod", v)}>
                      <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                      <SelectContent>{ALLOCATION_METHODS.map((m) => (<SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => removeCost(cost.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary">
        <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" />Landed Cost Summary</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Invoice (INR)</p>
              <p className="text-xl font-bold">₹{invoiceInINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Additional Costs</p>
              <p className="text-xl font-bold">₹{totalInINR.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/10">
              <p className="text-sm text-muted-foreground">Total Landed Cost</p>
              <p className="text-xl font-bold text-primary">₹{totalLandedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-500/10">
              <p className="text-sm text-muted-foreground">Cost Per Unit</p>
              <p className="text-xl font-bold text-green-500">₹{landedCostPerUnit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          {order.orderItems.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-3">Per-Item Breakdown</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left pb-2">Item</th>
                      <th className="text-right pb-2">Qty</th>
                      <th className="text-right pb-2">Unit Cost</th>
                      <th className="text-right pb-2">Landed/Unit</th>
                      <th className="text-right pb-2">Total Landed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => {
                      const itemLandedPerUnit = (item.totalCost * exchangeRate / totalQuantity) + (totalInINR / totalQuantity);
                      const itemLandedTotal = itemLandedPerUnit * item.quantity;
                      return (
                        <tr key={item.id} className="border-b border-border last:border-0">
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-right">{item.quantity} {item.unit}</td>
                          <td className="py-2 text-right">{order.currency === "INR" ? "₹" : "$"}{item.unitCost.toLocaleString()}</td>
                          <td className="py-2 text-right font-medium">₹{itemLandedPerUnit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td className="py-2 text-right font-semibold">₹{itemLandedTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
