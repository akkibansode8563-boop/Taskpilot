"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertCircle,
  Globe,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function NewSupplierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [country, setCountry] = useState("China");
  const [city, setCity] = useState("Shenzhen");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRole, setContactRole] = useState("Sales Manager");
  const [paymentTerms, setPaymentTerms] = useState("30% advance, 70% before shipment");
  const [website, setWebsite] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Supplier name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          country: country || null,
          city: city || null,
          contacts: contactName ? [{ name: contactName, phone: contactPhone, email: contactEmail, role: contactRole }] : [],
          paymentTerms: paymentTerms || null,
          website: website || null,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        router.push("/suppliers");
      } else {
        const json = await res.json();
        setError(json.error || "Failed to create supplier");
      }
    } catch {
      setError("Network error creating supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in-0 duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/suppliers">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Add New Supplier Partner
            </h1>
            <p className="text-xs text-slate-500">Register new factory, overseas vendor, or local supplier</p>
          </div>
        </div>

        <Badge className="bg-violet-100 text-violet-800 border-violet-200 font-bold text-xs">
          🏭 Vendor Onboarding
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
          {/* Supplier Name */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-violet-600" />
              Supplier / Factory Company Name *
            </Label>
            <Input
              placeholder="e.g. Shenzhen Tech Co. or Guangzhou Ceramics Ltd."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-slate-300 focus:border-violet-500 focus:ring-violet-500 text-sm font-semibold"
              required
              autoFocus
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-violet-600" />
                Country
              </Label>
              <Input
                placeholder="e.g. China or India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                City / Region
              </Label>
              <Input
                placeholder="e.g. Shenzhen or Guangzhou"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Primary Contact Person
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-violet-600" />
                  Contact Name
                </Label>
                <Input
                  placeholder="e.g. Zhang Wei"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-600">
                  Role / Title
                </Label>
                <Input
                  placeholder="e.g. Sales Manager or Export Director"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-violet-600" />
                  Phone Number
                </Label>
                <Input
                  placeholder="e.g. +86 138 1234 5678"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-violet-600" />
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="e.g. zhang@sztech.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Terms & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Default Payment Terms
              </Label>
              <Input
                placeholder="e.g. 30% advance, 70% before shipment"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-violet-600" />
                Website URL
              </Label>
              <Input
                placeholder="https://www.sztech.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notes & Qualifications
            </Label>
            <Textarea
              placeholder="Enter factory certificates, main product lines, or special terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="rounded-xl border-slate-300 text-xs font-medium"
            />
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/suppliers">
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
            {loading ? "Saving Supplier..." : "Save Supplier"}
          </Button>
        </div>
      </form>
    </div>
  );
}
