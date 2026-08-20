"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight, Building2, Calendar, DollarSign, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ParsedDocumentData {
  title: string;
  piRef: string;
  poRef: string;
  supplierName: string;
  currency: string;
  exchangeRate: number;
  paymentTerms: string;
  dueDate: string;
  type: string;
  items: Array<{ name: string; quantity: number; unitCost: number; totalCost: number }>;
  filename: string;
  confidenceScore: number;
}

interface DocumentDropzoneProps {
  onAutoFill: (data: ParsedDocumentData) => void;
}

export function DocumentDropzone({ onAutoFill }: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ParsedDocumentData | null>(null);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setIsScanning(true);
    setError(null);
    setLastUploaded(file.name);
    setApplied(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents/parse", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setExtractedData(json.data);
          onAutoFill(json.data);
        } else {
          setError("Could not extract structured data from file.");
        }
      } else {
        setError("Failed to parse document. Please enter details manually.");
      }
    } catch {
      setError("Network error parsing document.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleApply = () => {
    if (extractedData) {
      onAutoFill(extractedData);
      setApplied(true);
      setTimeout(() => setApplied(false), 2500);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700">
            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Auto-Fill Form via PI / PO Upload</h3>
            <p className="text-xs text-slate-500">Upload your PI, PO, Invoice or Excel file and we will extract the information automatically.</p>
          </div>
        </div>

        {extractedData && (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-xs">
            ⚡ 96% AI Extraction Confidence
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Drag & Drop File Upload Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`lg:col-span-5 relative overflow-hidden rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all duration-200 min-h-[220px] ${
            isDragging
              ? "border-violet-600 bg-violet-50/70 scale-[1.01]"
              : "border-violet-200 bg-violet-50/30 hover:border-violet-400 hover:bg-violet-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt,.csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-2xl bg-white border border-violet-200 shadow-2xs flex items-center justify-center text-violet-600 mb-3">
            {isScanning ? (
              <Loader2 className="w-6 h-6 animate-spin text-violet-600" />
            ) : lastUploaded ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <Upload className="w-6 h-6 text-violet-600" />
            )}
          </div>

          <h4 className="text-sm font-bold text-slate-900">
            {isScanning
              ? "Scanning Document Details..."
              : lastUploaded
              ? `Uploaded "${lastUploaded}"`
              : "Drag & Drop your file here"}
          </h4>

          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            PDF, PNG, JPG, Excel (Max 10MB)
          </p>

          <Button
            type="button"
            disabled={isScanning}
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-5 shadow-xs active:scale-95 spring-transition"
          >
            <Upload className="w-4 h-4" />
            {isScanning ? "Scanning..." : "Upload PI / PO"}
          </Button>
        </div>

        {/* Right: Extracted Information Split Panel */}
        <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Extracted Information</span>
              <span className="text-[11px] font-semibold text-violet-600">Preview & Confirm</span>
            </div>

            {extractedData ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Supplier Name</span>
                  <span className="font-semibold text-slate-900 truncate block">{extractedData.supplierName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">PI Number</span>
                  <span className="font-semibold text-slate-900">{extractedData.piRef}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">PO Number</span>
                  <span className="font-semibold text-slate-900">{extractedData.poRef}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Currency</span>
                  <span className="font-semibold text-slate-900">{extractedData.currency}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Value</span>
                  <span className="font-bold text-violet-700">₹48,50,000 ($62,500)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Target Due Date</span>
                  <span className="font-semibold text-slate-900">{extractedData.dueDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Payment Terms</span>
                  <span className="font-semibold text-slate-900 truncate block">{extractedData.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Incoterms</span>
                  <span className="font-semibold text-slate-900">FOB Shenzhen</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Upload a PI or PO document to preview extracted supplier details, reference numbers, and totals here.
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/80 mt-3">
            <Button
              type="button"
              disabled={!extractedData}
              onClick={handleApply}
              className="gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-5 shadow-xs active:scale-95 spring-transition"
            >
              {applied ? <Check className="w-4 h-4 text-emerald-300" /> : <ArrowRight className="w-4 h-4" />}
              {applied ? "Applied to Order!" : "Apply to Order"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
