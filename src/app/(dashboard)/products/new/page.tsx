"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  AlertCircle,
  Building2,
  Tag,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

interface Supplier {
  id: string;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [brand, setBrand] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [unitCost, setUnitCost] = useState("");
  const [weight, setWeight] = useState("");
  const [cbm, setCbm] = useState("");
  const [description, setDescription] = useState("");
  const [defaultSupplierId, setDefaultSupplierId] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const res = await fetch("/api/suppliers");
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data);
      }
    } catch {
      // Ignore supplier fetch error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku: sku || null,
          brand: brand || null,
          hsCode: hsCode || null,
          unit: unit || "pcs",
          unitCost: unitCost ? parseFloat(unitCost) : null,
          weight: weight ? parseFloat(weight) : null,
          cbm: cbm ? parseFloat(cbm) : null,
          description: description || null,
          defaultSupplierId: defaultSupplierId || null,
        }),
      });

      if (res.ok) {
        router.push("/products");
      } else {
        const json = await res.json();
        setError(json.error || "Failed to create product");
      }
    } catch {
      setError("Network error creating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in-0 duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/products">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Add New Product
            </h1>
            <p className="text-xs text-slate-500">Register new SKU, HS code, and specifications in catalog</p>
          </div>
        </div>

        <Badge className="bg-violet-100 text-violet-800 border-violet-200 font-bold text-xs">
          📦 Catalog SKU Entry
        </Badge>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 p-3 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-6 space-y-5">
          {/* Product Name */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product Name *
            </Label>
            <Input
              placeholder="e.g. LED Panel Light 60x60 or Ceramic Wall Tile 30x60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-slate-300 focus:border-violet-500 focus:ring-violet-500 text-sm font-semibold"
              required
              autoFocus
            />
          </div>

          {/* SKU, Brand & HS Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SKU / Model #
              </Label>
              <Input
                placeholder="e.g. LED-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-mono font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Brand / Manufacturer
              </Label>
              <Input
                placeholder="e.g. Philips Compatible"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                HS Code (Customs)
              </Label>
              <Input
                placeholder="e.g. 9405.42"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-mono font-medium"
              />
            </div>
          </div>

          {/* Unit, Cost, Weight, CBM */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Unit
              </Label>
              <Select value={unit} onValueChange={(v) => setUnit(v ?? "pcs")}>
                <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">pcs (Pieces)</SelectItem>
                  <SelectItem value="sqm">sqm (Square Meters)</SelectItem>
                  <SelectItem value="sheet">sheet</SelectItem>
                  <SelectItem value="meter">meter</SelectItem>
                  <SelectItem value="box">box</SelectItem>
                  <SelectItem value="set">set</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Unit Cost ($ / ₹)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="18.50"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Weight (kg)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="2.8"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                CBM (m³)
              </Label>
              <Input
                type="number"
                step="0.001"
                placeholder="0.035"
                value={cbm}
                onChange={(e) => setCbm(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          {/* Default Supplier */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Default Supplier
            </Label>
            <Select value={defaultSupplierId} onValueChange={(v) => setDefaultSupplierId(v ?? "")}>
              <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs">
                <SelectValue placeholder="Select default supplier..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Default Supplier</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Product Description & Specs
            </Label>
            <Textarea
              placeholder="Enter dimensions, packaging specs, or custom requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border-slate-300 text-xs font-medium"
            />
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/products">
            <Button variant="outline" type="button" className="rounded-xl font-semibold">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-6 active:scale-95 spring-transition shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            {loading ? "Saving Product..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
