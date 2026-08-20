"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  FileText,
  CreditCard,
  Plus,
  ExternalLink,
  Calculator,
  CheckCircle2,
  Clock,
  Trash2,
  Paperclip,
  Calendar,
  Eye,
  Download,
  Share2,
  Copy,
  MessageSquare,
  Mail,
  Check,
  X as XIcon,
  MoreVertical,
  Building2,
  DollarSign,
  TrendingUp,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentDropzone, ParsedDocumentData } from "@/components/orders/document-dropzone";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

interface OrderTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  waitingFor: string | null;
}

interface OrderDocument {
  id: string;
  type: string;
  fileName: string;
  uploadedAt: string;
  fileSize: number | null;
  fileUrl?: string;
}

interface OrderPayment {
  id: string;
  type: string;
  amount: number;
  currency: string;
  paymentDate: string | null;
  reference: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  title: string;
  type: string;
  status: string;
  description: string | null;
  currency: string;
  piRef: string | null;
  poRef: string | null;
  paymentTerms: string | null;
  currentStage: string | null;
  stageProgress: number;
  dueDate: string | null;
  notes: string | null;
  supplier: { id: string; name: string; contacts: unknown } | null;
  orderItems: OrderItem[];
  tasks: OrderTask[];
  documents: OrderDocument[];
  payments: OrderPayment[];
}

interface DocItem {
  id: string;
  fileName: string;
  type: string;
  uploadedAt: string;
  fileUrl?: string;
  fileSize?: number | null;
}

const CHINA_STAGES = [
  "REQUIREMENT", "QUOTATION", "NEGOTIATION", "SAMPLE", "PI", "PO",
  "PAYMENT", "PRODUCTION", "INSPECTION", "READY_TO_SHIP", "BOOKING",
  "ETD", "BL_AWB", "CUSTOMS_DOCUMENTS", "CHA_CUSTOMS", "DUTY_CHARGES",
  "CLEARANCE", "DELIVERY_GRN",
];

const STAGE_OWNERS: Record<string, string> = {
  REQUIREMENT: "Akshay B.",
  QUOTATION: "Akshay B.",
  NEGOTIATION: "Akshay B.",
  SAMPLE: "Akshay B.",
  PI: "Akshay B.",
  PO: "Akshay B.",
  PAYMENT: "Finance Team",
  PRODUCTION: "Rahul Sharma",
  INSPECTION: "Rahul Sharma",
  READY_TO_SHIP: "Logistics Team",
  BOOKING: "Logistics Team",
  ETD: "CHA Customs Agent",
  BL_AWB: "Logistics Team",
  CUSTOMS_DOCUMENTS: "CHA Customs Agent",
  CHA_CUSTOMS: "CHA Customs Agent",
  DUTY_CHARGES: "Finance Team",
  CLEARANCE: "CHA Customs Agent",
  DELIVERY_GRN: "Warehouse Manager",
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [docCopied, setDocCopied] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);

  // Editable Product Name Card State (Auto-Detected / User Editable)
  const [productName, setProductName] = useState("Cabinet / LED Lights");
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  // Stage Completion Date Modal & Hover States
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split("T")[0]);
  const [completionNote, setCompletionNote] = useState("");
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [stageLogs, setStageLogs] = useState<Record<string, { date: string; note?: string }>>({
    REQUIREMENT: { date: "08 Aug 2026", note: "Order requirement logged" },
    QUOTATION: { date: "09 Aug 2026", note: "Quotation approved" },
    NEGOTIATION: { date: "10 Aug 2026", note: "Terms finalized" },
    SAMPLE: { date: "11 Aug 2026", note: "Sample approved" },
    PI: { date: "12 Aug 2026", note: "PI verified (PI-7477)" },
    PO: { date: "13 Aug 2026", note: "PO issued (PO-001DF)" },
    PAYMENT: { date: "14 Aug 2026", note: "30% Advance T/T paid" },
    PRODUCTION: { date: "15 Aug 2026", note: "Production completed" },
    INSPECTION: { date: "16 Aug - 22 Aug 2026", note: "In Progress" },
  });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  async function fetchOrder() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDocumentAutoFill = async (parsed: ParsedDocumentData & { autoTasks?: Array<Record<string, unknown>> }) => {
    if (parsed.items && parsed.items[0]?.name) {
      setProductName(parsed.items[0].name);
    }
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          piRef: parsed.piRef,
          poRef: parsed.poRef,
          notes: `Uploaded "${parsed.filename}". Payment terms: ${parsed.paymentTerms}`,
        }),
      });

      // Auto-create highlighted action tasks from PI/PO document scan
      if (parsed.autoTasks && Array.isArray(parsed.autoTasks)) {
        for (const taskItem of parsed.autoTasks) {
          await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...taskItem,
              orderId,
              tags: `ai_autofill:${parsed.filename}`,
            }),
          });
        }
      }

      fetchOrder();
    } catch (err) {
      console.error("Failed to update order with document:", err);
    }
  };

  const getSummaryText = () => {
    if (!order) return "";
    return `📦 TaskPilot Order Summary\nTitle: ${order.title}\nOrder #: ${order.orderNumber}\nType: ${order.type === "CHINA_IMPORT" ? "China Import" : "Domestic Purchase"}\nCurrent Stage: ${order.currentStage || "N/A"}\nPI Ref: ${order.piRef || "N/A"} | PO Ref: ${order.poRef || "N/A"}\nSupplier: ${order.supplier?.name || "N/A"}\nETA: ${order.dueDate || "N/A"}`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(getSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getSummaryText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`TaskPilot Order: ${order?.title} (${order?.orderNumber})`);
    const body = encodeURIComponent(getSummaryText());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  async function handleSetStage(targetStage: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStage: targetStage }),
      });
      if (res.ok) {
        fetchOrder();
      }
    } catch (err) {
      console.error("Failed to set stage:", err);
    }
  }

  function handleAdvanceStage() {
    setCompletionDate(new Date().toISOString().split("T")[0]);
    setCompletionNote("");
    setShowCompletionModal(true);
  }

  async function confirmAdvanceStageWithDate() {
    if (!order || !order.currentStage) return;
    const currentStageName = order.currentStage;

    try {
      setStageLogs((prev) => ({
        ...prev,
        [currentStageName]: {
          date: completionDate,
          note: completionNote || "Completed",
        },
      }));

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          advanceStage: true,
          notes: `Stage ${currentStageName} completed on ${completionDate}. ${completionNote}`,
        }),
      });

      if (res.ok) {
        fetchOrder();
      }
    } catch (err) {
      console.error("Failed to advance stage:", err);
    } finally {
      setShowCompletionModal(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/orders");
      }
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-slate-500 font-semibold">Loading Order Control Tower...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Order not found</p>
        <Link href="/orders">
          <Button variant="link">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const stages = order.type === "CHINA_IMPORT" ? CHINA_STAGES : [
    "REQUIREMENT", "QUOTATION", "PO", "SUPPLIER_CONFIRMATION",
    "PAYMENT", "DISPATCH", "DELIVERY", "GRN",
  ];

  const totalStages = stages.length;
  const currentStageIdx = order.currentStage ? stages.indexOf(order.currentStage) : 8;
  const calculatedProgressPercent = Math.min(100, Math.max(5, Math.round(((currentStageIdx + 1) / totalStages) * 100)));

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* ─── TOP HEADER BAR ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                {order.poRef || order.orderNumber || "PO-001DF"}
              </h1>
              <Badge className="bg-violet-100 text-violet-800 border-violet-200 font-bold text-xs">
                {order.currentStage?.replace(/_/g, " ") || "INSPECTION"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{order.supplier?.name || "ABC Technology Ltd."}</span>
              <span>🇨🇳 China</span>
            </div>
          </div>
        </div>

        {/* Share & Actions Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-2 hidden md:inline">
            Last Updated: 20 Aug 2026, 10:30 AM
          </span>
          <Button
            onClick={handleCopySummary}
            className="gap-2 bg-violet-600 hover:bg-violet-500 text-white shadow-xs rounded-xl px-4 py-2 font-bold active:scale-95 spring-transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Summary Copied!" : "Share Details"}
          </Button>

          <Button variant="outline" onClick={handleWhatsAppShare} title="Share via WhatsApp" className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <MessageSquare className="w-4 h-4" />
          </Button>

          <Button variant="outline" onClick={handleEmailShare} title="Share via Email" className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50">
            <Mail className="w-4 h-4" />
          </Button>

          <Button variant="destructive" size="icon" onClick={handleDelete} className="rounded-xl">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── PANEL 1: EXECUTIVE KPI SUMMARY PODS (With Editable Product Card) ──────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* Product Category Card (Auto-Detected / User Editable) */}
        <Card className="rounded-2xl border border-violet-200 bg-violet-50/50 p-4 relative">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-violet-700 uppercase tracking-wider">Product</p>
            <button
              type="button"
              onClick={() => setIsEditingProduct(!isEditingProduct)}
              className="text-[10px] text-violet-600 hover:text-violet-900 font-extrabold uppercase underline"
            >
              {isEditingProduct ? "Save" : "Edit"}
            </button>
          </div>
          {isEditingProduct ? (
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setIsEditingProduct(false); }}
              className="mt-1 h-7 text-xs font-bold bg-white rounded-lg border-violet-300 px-2"
              autoFocus
            />
          ) : (
            <p className="text-sm font-black text-slate-900 mt-1 truncate" title={productName}>
              {productName}
            </p>
          )}
          <p className="text-[10px] text-violet-600 font-medium mt-0.5">Auto-Detected / Editable</p>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">PO Value</p>
          <p className="text-xl font-black text-slate-900 mt-1">₹48.50 L</p>
          <p className="text-[11px] text-slate-400 mt-0.5">$62,500 Total</p>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Quantity</p>
          <p className="text-xl font-black text-slate-900 mt-1">2,400 Units</p>
          <p className="text-[11px] text-slate-400 mt-0.5">2 Line SKUs</p>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Currency</p>
          <p className="text-xl font-black text-slate-900 mt-1">USD</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Rate: 83.5 INR</p>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">PO Date</p>
          <p className="text-xl font-black text-slate-900 mt-1">08 Aug 2026</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Issued Order</p>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-4 bg-violet-50/50 border-violet-200">
          <p className="text-xs font-bold text-violet-700 uppercase tracking-wider">ETA (Arrival)</p>
          <p className="text-xl font-black text-violet-950 mt-1">12 Sep 2026</p>
          <p className="text-[11px] text-violet-600 font-medium mt-0.5">23 Days Remaining</p>
        </Card>
      </div>

      {/* ─── DYNAMICALLY SYNCHRONIZED OVERALL PROGRESS BAR ──────── */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 text-sm">Overall Progress</span>
            <Badge className="bg-violet-600 text-white font-extrabold text-xs px-2.5 py-0.5 transition-all">
              {calculatedProgressPercent}% (Stage {currentStageIdx + 1}/{totalStages})
            </Badge>
          </div>
          <div className="flex items-center gap-6 font-medium text-slate-600">
            <span>Days in Current Stage: <strong className="text-slate-900 font-bold">4 Days</strong></span>
            <span>Documents: <strong className="text-slate-900 font-bold">8/10</strong> <span className="text-rose-600 font-semibold text-[11px]">(2 Pending)</span></span>
          </div>
        </div>

        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="bg-violet-600 h-full rounded-full transition-all duration-500 shadow-2xs"
            style={{ width: `${calculatedProgressPercent}%` }}
          />
        </div>

        {/* Horizontal Node Stepper Synchronized with Current Stage */}
        <div className="hidden lg:flex items-center justify-between pt-2 text-[10px] font-semibold text-slate-400 overflow-x-auto">
          {stages.slice(0, 10).map((st, i) => (
            <div key={st} className="flex flex-col items-center gap-1 min-w-[70px] text-center">
              <div className={`w-3 h-3 rounded-full transition-all ${
                i < currentStageIdx
                  ? "bg-emerald-500"
                  : i === currentStageIdx
                  ? "bg-violet-600 ring-2 ring-violet-200"
                  : "bg-slate-200"
              }`} />
              <span className={i <= currentStageIdx ? "text-slate-800 font-bold" : ""}>
                {st.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── SPLIT ROW: CURRENT STAGE & NEXT ACTION ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Current Stage Card */}
        <Card className="lg:col-span-7 rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Stage</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Inspection</h3>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border-amber-300 font-bold">In Progress</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Started On</span>
              <span className="font-semibold text-slate-900">16 Aug 2026</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Due On</span>
              <span className="font-semibold text-slate-900">22 Aug 2026</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned To</span>
              <span className="font-semibold text-slate-900">Rahul Sharma</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-slate-700">Stage Checklist</span>
            <div className="space-y-1.5 text-xs font-medium">
              <div className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Quantity Verification (16 Aug)</div>
              <div className="flex items-center gap-2 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Packaging Check (16 Aug)</div>
              <div className="flex items-center gap-2 text-slate-500"><Clock className="w-3.5 h-3.5 text-amber-500" /> QC Report Uploaded (Pending)</div>
              <div className="flex items-center gap-2 text-slate-500"><Clock className="w-3.5 h-3.5 text-slate-300" /> Final Approval (Pending)</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" className="rounded-xl text-xs font-bold">View Details</Button>
            <Button onClick={handleAdvanceStage} className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs px-4">Complete Stage</Button>
          </div>
        </Card>

        {/* Right: Next Action Card */}
        <Card className="lg:col-span-5 rounded-2xl border border-slate-200/80 shadow-2xs bg-white p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Next Action</span>
            <h3 className="text-lg font-extrabold text-slate-900">Complete QC Report</h3>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Due Date</span>
                <span className="font-bold text-rose-600">22 Aug 2026 <span className="text-[10px] font-normal block text-rose-500">(2 Days Remaining)</span></span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Priority</span>
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-bold text-[10px]">High</Badge>
              </div>
            </div>
          </div>

          <Button onClick={handleAdvanceStage} className="w-full mt-6 gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl py-3 shadow-xs active:scale-95 spring-transition">
            <span>Complete Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </div>

      {/* ─── PANEL 2: MASTER ORDER TIMELINE TABLE VIEW ──────────── */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-2xs bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-600" />
              Order Timeline (All Stages)
            </CardTitle>
            <Button onClick={handleAdvanceStage} className="gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs px-4">
              <span>Advance to Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-center">Documents</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stages.map((st, idx) => {
                  const isCompleted = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  const owner = STAGE_OWNERS[st] || "Team";
                  const log = stageLogs[st];

                  return (
                    <tr
                      key={st}
                      onMouseEnter={() => setHoveredStage(st)}
                      onMouseLeave={() => setHoveredStage(null)}
                      className={`transition-colors ${
                        isCurrent
                          ? "bg-violet-50/60 font-semibold"
                          : hoveredStage === st
                          ? "bg-slate-50/80"
                          : "hover:bg-slate-50/50"
                      }`}
                    >
                      {/* Stage Name */}
                      <td className="py-3.5 px-4 flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted ? "bg-emerald-500 text-white" : isCurrent ? "bg-violet-600 text-white ring-2 ring-violet-200" : "bg-slate-200 text-slate-400"
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : isCurrent ? <Clock className="w-3.5 h-3.5" /> : <span className="text-[10px]">{idx + 1}</span>}
                        </div>
                        <span className={isCurrent ? "font-extrabold text-violet-950" : "text-slate-900"}>{st.replace(/_/g, " ")}</span>
                        {isCurrent && <Badge className="bg-violet-600 text-white text-[9px] font-bold px-1.5 py-0">Current Stage</Badge>}
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className={
                          isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold" :
                          isCurrent ? "bg-amber-50 text-amber-700 border-amber-300 font-bold" :
                          "bg-slate-50 text-slate-400 border-slate-200"
                        }>
                          {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Not Started"}
                        </Badge>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {log?.date || (isCompleted ? "10 Aug 2026" : isCurrent ? "16 Aug - 22 Aug 2026" : "—")}
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4 text-slate-700 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                          {owner[0]}
                        </div>
                        <span>{owner}</span>
                      </td>

                      {/* Documents Count */}
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          variant="outline"
                          onClick={() => setSelectedDoc({
                            id: `doc-${st}`,
                            fileName: `${st.replace(/_/g, "_")}_Document.pdf`,
                            type: st,
                            uploadedAt: new Date().toISOString(),
                          })}
                          className="bg-slate-50 text-slate-700 border-slate-200 gap-1 text-xs cursor-pointer hover:bg-slate-100"
                        >
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>{isCompleted ? "2" : isCurrent ? "3/5" : "0/2"}</span>
                          <Eye className="w-3 h-3 text-slate-500 ml-0.5" />
                        </Badge>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDoc({
                              id: `doc-${st}`,
                              fileName: `${st.replace(/_/g, "_")}_Document.pdf`,
                              type: st,
                              uploadedAt: new Date().toISOString(),
                            })}
                            className={`h-7 px-3 text-xs font-bold rounded-lg border ${
                              isCurrent
                                ? "bg-violet-600 hover:bg-violet-500 text-white border-violet-600 shadow-2xs"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {isCurrent ? "Open" : "View"}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title={`Attach file for ${st}`}
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = ".pdf,.png,.jpg,.jpeg,.txt,.csv,.xlsx";
                              input.onchange = async (e) => {
                                const target = e.target as HTMLInputElement;
                                if (target.files && target.files[0]) {
                                  const file = target.files[0];
                                  try {
                                    await fetch(`/api/orders/${orderId}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        notes: `Attached document "${file.name}" for stage ${st}`,
                                      }),
                                    });
                                    fetchOrder();
                                  } catch (err) {
                                    console.error("Failed to attach document:", err);
                                  }
                                }
                              };
                              input.click();
                            }}
                            className="h-7 w-7 rounded-lg border-slate-200 text-slate-500 hover:text-violet-700 hover:bg-violet-50"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ─── PANEL 4: AUTO-FILL SPLIT PREVIEW FILE DROPZONE ─────── */}
      <DocumentDropzone onAutoFill={handleDocumentAutoFill} />

      {/* ─── MODAL 1: STAGE COMPLETION DATE PROMPT DIALOG ──────── */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-600" />
                Complete Stage: {order.currentStage?.replace(/_/g, " ")}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCompletionModal(false)} className="rounded-xl">
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-xs text-slate-500">
              Please specify the official completion date for <strong>{order.currentStage?.replace(/_/g, " ")}</strong> before advancing to the next stage.
            </p>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">Completion Date *</Label>
              <Input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="rounded-xl border-slate-300 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">Completion Remarks (Optional)</Label>
              <Input
                placeholder="e.g. Approved by Quality Manager"
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
                className="rounded-xl border-slate-300 focus:border-violet-500 focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowCompletionModal(false)} className="rounded-xl font-semibold">
                Cancel
              </Button>
              <Button onClick={confirmAdvanceStageWithDate} className="bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl gap-2 active:scale-95 spring-transition">
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Advance Stage
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ─── MODAL 2: DOCUMENT VIEWER, SHARE & DOWNLOAD DIALOG ──── */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 truncate max-w-[260px]">
                    {selectedDoc.fileName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-200">
                      {selectedDoc.type.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      Uploaded {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDoc(null)} className="rounded-xl">
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Document Card Preview Container */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center space-y-3">
              <div className="w-14 h-14 bg-white rounded-2xl border border-slate-200 shadow-2xs mx-auto flex items-center justify-center text-violet-600">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{selectedDoc.fileName}</p>
                <p className="text-xs text-slate-500 mt-0.5">Official Document Attachment · PDF / Image</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-[10px]">
                ✓ Verified & Logged
              </Badge>
            </div>

            {/* Action Grid: View, Download & Share Options */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Document Actions</p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    const blob = new Blob([`Document Content: ${selectedDoc.fileName}`], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    window.open(selectedDoc.fileUrl || url, "_blank");
                  }}
                  className="gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold active:scale-95 spring-transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>View / Open</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([`Document Content for ${selectedDoc.fileName}`], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = selectedDoc.fileName;
                    a.click();
                  }}
                  className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold active:scale-95 spring-transition"
                >
                  <Download className="w-4 h-4 text-violet-600" />
                  <span>Download</span>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const text = encodeURIComponent(`📦 TaskPilot Document Share\nFile: ${selectedDoc.fileName}\nOrder: ${order?.title} (${order?.orderNumber})\nStage: ${selectedDoc.type}`);
                    window.open(`https://wa.me/?text=${text}`, "_blank");
                  }}
                  className="gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const subject = encodeURIComponent(`TaskPilot Document: ${selectedDoc.fileName}`);
                    const body = encodeURIComponent(`TaskPilot Document Share\nFile: ${selectedDoc.fileName}\nOrder: ${order?.title} (${order?.orderNumber})`);
                    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
                  }}
                  className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setDocCopied(true);
                    setTimeout(() => setDocCopied(false), 2000);
                  }}
                  className="gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl text-xs font-semibold"
                >
                  {docCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{docCopied ? "Copied!" : "Copy Link"}</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
