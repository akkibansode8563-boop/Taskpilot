"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Building2,
  Paperclip,
  Plus,
  AlertCircle,
  FileText,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [module, setModule] = useState("IMPORT_PURCHASE");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("PLANNED");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueTime, setDueTime] = useState("17:00");
  const [waitingFor, setWaitingFor] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [description, setDescription] = useState("");
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          module,
          priority,
          status,
          dueDate: dueDate || null,
          dueTime: dueTime || null,
          waitingFor: waitingFor || null,
          contactName: contactName || null,
          contactCompany: contactCompany || null,
          description: description || null,
          tags: attachedFileName ? `attachment:${attachedFileName}` : null,
        }),
      });

      if (res.ok) {
        router.push("/tasks");
      } else {
        const json = await res.json();
        setError(json.error || "Failed to create task");
      }
    } catch {
      setError("Network error creating task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in-0 duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/tasks">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create New Task
            </h1>
            <p className="text-xs text-slate-500">Manually log a new work item or import reminder</p>
          </div>
        </div>

        <Badge className="bg-violet-100 text-violet-800 border-violet-200 font-bold text-xs">
          ⚡ Manual Task Log
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
          {/* Task Title */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Task Title *
            </Label>
            <Input
              placeholder="e.g. File customs duty payment receipt or Send PI to supplier"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-300 focus:border-violet-500 focus:ring-violet-500 text-sm font-semibold"
              required
            />
          </div>

          {/* Module Category, Priority & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category / Module
              </Label>
              <Select value={module} onValueChange={(v) => setModule(v ?? "IMPORT_PURCHASE")}>
                <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMPORT_PURCHASE">Import / Purchase</SelectItem>
                  <SelectItem value="SALES">Sales</SelectItem>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="TASK">General Task</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Priority Level
              </Label>
              <Select value={priority} onValueChange={(v) => setPriority(v ?? "MEDIUM")}>
                <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CRITICAL">🔥 Critical</SelectItem>
                  <SelectItem value="HIGH">⚡ High</SelectItem>
                  <SelectItem value="MEDIUM">📌 Medium</SelectItem>
                  <SelectItem value="LOW">🔹 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Initial Status
              </Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "PLANNED")}>
                <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLANNED">📅 Planned</SelectItem>
                  <SelectItem value="IN_PROGRESS">⏱️ In Progress</SelectItem>
                  <SelectItem value="WAITING">⏸️ Waiting</SelectItem>
                  <SelectItem value="COMPLETED">✅ Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-violet-600" />
                Target Due Date
              </Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-xl border-slate-300 font-medium text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-violet-600" />
                Target Time
              </Label>
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="rounded-xl border-slate-300 font-medium text-xs"
              />
            </div>
          </div>

          {/* Contact / Waiting For */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-violet-600" />
                Waiting For / Assignee
              </Label>
              <Input
                placeholder="e.g. CHA Agent or Zhang Wei"
                value={waitingFor}
                onChange={(e) => setWaitingFor(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-violet-600" />
                Contact / Company Name
              </Label>
              <Input
                placeholder="e.g. ABC Technology Ltd."
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="rounded-xl border-slate-300 text-xs font-medium"
              />
            </div>
          </div>

          {/* Description & Remarks */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description & Notes (Optional)
            </Label>
            <Textarea
              placeholder="Add details, invoice notes, or special instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border-slate-300 text-xs font-medium"
            />
          </div>

          {/* Document Attachment Button */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Attachment
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".pdf,.png,.jpg,.jpeg,.txt,.csv,.xlsx";
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files[0]) {
                      setAttachedFileName(target.files[0].name);
                    }
                  };
                  input.click();
                }}
                className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-bold text-xs"
              >
                <Paperclip className="w-4 h-4 text-violet-600" />
                <span>Attach File</span>
              </Button>

              {attachedFileName ? (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs font-bold gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {attachedFileName}
                </Badge>
              ) : (
                <span className="text-xs text-slate-400">No file attached</span>
              )}
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/tasks">
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
            {loading ? "Saving Task..." : "Save Task"}
          </Button>
        </div>
      </form>
    </div>
  );
}
