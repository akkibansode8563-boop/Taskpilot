"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Package, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DocumentDropzone, ParsedDocumentData } from "@/components/orders/document-dropzone";

interface Supplier { id: string; name: string; }

export default function NewOrderPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [autoFilled, setAutoFilled] = useState(false);
  const [formData, setFormData] = useState({
    type: "CHINA_IMPORT", title: "", description: "", supplierId: "",
    currency: "USD", exchangeRate: "83.5", piRef: "", poRef: "",
    paymentTerms: "", dueDate: "", notes: "",
  });

  useEffect(() => {
    fetch("/api/suppliers").then((r) => r.json()).then((d) => setSuppliers(d)).catch(() => {});
  }, []);

  const handleAutoFill = (data: ParsedDocumentData) => {
    // Find matching supplier ID if exists
    let matchedSupplierId = "";
    const matched = suppliers.find((s) => s.name.toLowerCase().includes(data.supplierName.toLowerCase()) || data.supplierName.toLowerCase().includes(s.name.toLowerCase()));
    if (matched) matchedSupplierId = matched.id;

    setFormData((prev) => ({
      ...prev,
      type: data.type || prev.type,
      title: data.title || prev.title,
      piRef: data.piRef || prev.piRef,
      poRef: data.poRef || prev.poRef,
      currency: data.currency || prev.currency,
      exchangeRate: String(data.exchangeRate || prev.exchangeRate),
      paymentTerms: data.paymentTerms || prev.paymentTerms,
      dueDate: data.dueDate || prev.dueDate,
      supplierId: matchedSupplierId || prev.supplierId,
      notes: `Extracted from document "${data.filename}". Line items: ${data.items.map((i) => `${i.name} (x${i.quantity})`).join(", ")}`,
    }));
    setAutoFilled(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) { setError("Title is required"); return; }
    setIsSaving(true); setError(null);
    try {
      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        supplierId: formData.supplierId || null,
        currency: formData.currency || "USD",
        exchangeRate: parseFloat(formData.exchangeRate) || 1,
        piRef: formData.piRef.trim() || null,
        poRef: formData.poRef.trim() || null,
        paymentTerms: formData.paymentTerms.trim() || null,
        dueDate: formData.dueDate || null,
        notes: formData.notes.trim() || null,
      };
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const order = await res.json();
        router.push(`/orders/${order.id}`);
      } else {
        const data = await res.json();
        let errMsg = data.error || "Failed to create order";
        if (typeof errMsg === "string" && errMsg.startsWith("[")) {
          try {
            const parsed = JSON.parse(errMsg);
            if (Array.isArray(parsed) && parsed[0]?.message) {
              errMsg = `${parsed[0].path?.join(".")} ${parsed[0].message}`;
            }
          } catch {}
        }
        setError(errMsg);
      }
    } catch { setError("Network error — please try again"); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders"><Button variant="ghost" size="icon" className="rounded-xl"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Import / Purchase Order</h1>
          <p className="text-sm text-slate-500">Upload a PI / PO file to auto-detect details, or fill manually below.</p>
        </div>
      </div>

      {/* AI Document Upload Dropzone */}
      <DocumentDropzone onAutoFill={handleAutoFill} />

      {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold">{error}</div>}

      <Card>
        <CardContent className="p-6">
          <Label className="text-base font-medium">Order Type *</Label>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <button type="button" onClick={() => setFormData({ ...formData, type: "CHINA_IMPORT", currency: "USD" })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${formData.type === "CHINA_IMPORT" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <Package className="w-8 h-8 mb-2 text-primary" />
              <p className="font-medium">China Import</p>
              <p className="text-sm text-muted-foreground">18-stage workflow</p>
            </button>
            <button type="button" onClick={() => setFormData({ ...formData, type: "DOMESTIC_PURCHASE", currency: "INR" })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${formData.type === "DOMESTIC_PURCHASE" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
              <Truck className="w-8 h-8 mb-2 text-primary" />
              <p className="font-medium">Domestic Purchase</p>
              <p className="text-sm text-muted-foreground">8-stage workflow</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Order Title *</Label>
            <Input id="title" placeholder="e.g., LED Lights from Shenzhen" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Additional details..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Supplier</Label>
            <Select value={formData.supplierId} onValueChange={(v) => setFormData({ ...formData, supplierId: v ?? "" })}>
              <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={formData.currency} onValueChange={(v) => v && setFormData({ ...formData, currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="INR">INR (₹)</SelectItem><SelectItem value="CNY">CNY (¥)</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchangeRate">Exchange Rate</Label>
              <Input id="exchangeRate" type="number" step="0.01" value={formData.exchangeRate} onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="piRef">PI Reference</Label><Input id="piRef" placeholder="PI-2026-XXXX" value={formData.piRef} onChange={(e) => setFormData({ ...formData, piRef: e.target.value })} /></div>
            <div className="space-y-2"><Label htmlFor="poRef">PO Reference</Label><Input id="poRef" placeholder="PO-2026-XXXX" value={formData.poRef} onChange={(e) => setFormData({ ...formData, poRef: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label htmlFor="paymentTerms">Payment Terms</Label><Input id="paymentTerms" placeholder="e.g., 30% advance, 70% before shipment" value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="dueDate">Target Delivery Date</Label><Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" placeholder="Any additional notes..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} /></div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Link href="/orders"><Button variant="outline">Cancel</Button></Link>
        <Button onClick={handleSave} disabled={!formData.title.trim() || isSaving}>
          <Save className="w-4 h-4 mr-2" />{isSaving ? "Creating..." : "Create Order"}
        </Button>
      </div>
    </div>
  );
}
