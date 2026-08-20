"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  AlertTriangle,
  Pause,
  CheckCircle2,
  MoreHorizontal,
  ArrowUpDown,
  Paperclip,
  FileText,
  X as XIcon,
  User,
  Sparkles,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  dueTime: string | null;
  module: string;
  contactName: string | null;
  waitingFor: string | null;
  followUpDate: string | null;
  tags?: string | null;
  order: { id: string; orderNumber: string; title?: string; productName?: string } | null;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  PLANNED: { icon: Clock, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  IN_PROGRESS: { icon: ArrowUpDown, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  WAITING: { icon: Pause, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  COMPLETED: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  CANCELLED: { icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

const priorityBadge: Record<string, string> = {
  CRITICAL: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
  HIGH: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  MEDIUM: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  LOW: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Create Task Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newModule, setNewModule] = useState("IMPORT_PURCHASE");
  const [newPriority, setNewPriority] = useState("MEDIUM");
  const [newStatus, setNewStatus] = useState("PLANNED");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newDueTime, setNewDueTime] = useState("17:00");
  const [newWaitingFor, setNewWaitingFor] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (priorityFilter !== "ALL") params.set("priority", priorityFilter);

      const res = await fetch(`/api/tasks?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          module: newModule,
          priority: newPriority,
          status: newStatus,
          dueDate: newDueDate || null,
          dueTime: newDueTime || null,
          waitingFor: newWaitingFor || null,
          contactName: newContactName || null,
          description: newDescription || null,
          tags: attachedFileName ? `attachment:${attachedFileName}` : null,
        }),
      });

      if (res.ok) {
        setShowCreateModal(false);
        setNewTitle("");
        setNewWaitingFor("");
        setNewDescription("");
        setAttachedFileName(null);
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchQuery, statusFilter, priorityFilter]);

  const filteredTasks = tasks;

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Organize and prioritize your daily action items</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow-md shadow-violet-500/20 active:scale-95 spring-transition px-4 py-2 font-bold"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Task
          </Button>
          <Link href="/tasks/new">
            <Button variant="outline" className="rounded-xl font-semibold text-xs border-slate-200">
              Full Form
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 spring-transition" />
          <Input
            placeholder="Search by title, contact, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-muted/50 border border-border/40 focus-visible:bg-background focus-visible:border-indigo-500/50 rounded-xl text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "ALL")}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl bg-card border-border/60 font-medium text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PLANNED">Planned</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="WAITING">Waiting</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? "ALL")}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 rounded-xl bg-card border-border/60 font-medium text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priority</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <Card className="rounded-2xl border-border/50">
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground font-medium animate-pulse">Loading action items...</div>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const status = statusConfig[task.status] || statusConfig.PLANNED;
            const StatusIcon = status.icon;
            const isAiGenerated = Boolean(
              task.tags?.includes("ai_autofill") ||
              task.title.toLowerCase().includes("verify") ||
              task.title.toLowerCase().includes("send po") ||
              task.title.toLowerCase().includes("schedule pre-shipment")
            );

            return (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <Card className={`interactive-card rounded-2xl border transition-all cursor-pointer overflow-hidden bg-card ${
                  isAiGenerated
                    ? "border-violet-300 border-l-4 border-l-violet-600 bg-violet-50/20 shadow-2xs hover:shadow-md"
                    : "border-border/60 hover:border-indigo-500/40 shadow-xs hover:shadow-md"
                }`}>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center gap-4">
                      {/* Status Icon */}
                      <div className={`p-2.5 rounded-xl ${status.bg} border ${status.border} shrink-0`}>
                        <StatusIcon className={`w-5 h-5 ${status.color} stroke-[2.2]`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                          <h3 className="text-sm sm:text-base font-bold truncate group-hover:text-violet-600 spring-transition">{task.title}</h3>
                          <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${priorityBadge[task.priority]}`}>
                            {task.priority}
                          </Badge>

                          {isAiGenerated && (
                            <Badge className="bg-violet-100 text-violet-800 border-violet-200 text-[10px] font-bold gap-1 animate-in fade-in-0">
                              <Sparkles className="w-3 h-3 text-violet-600 animate-pulse" />
                              ⚡ Auto-Generated via AI PI/PO Scan
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                          {task.dueDate && (
                            <span className="flex items-center gap-1 font-mono font-medium bg-muted/60 px-2 py-0.5 rounded-md border border-border/40">
                              <Calendar className="w-3.5 h-3.5 text-violet-600" />
                              {new Date(task.dueDate).toLocaleDateString()}
                              {task.dueTime && ` · ${task.dueTime}`}
                            </span>
                          )}
                          {task.contactName && (
                            <span className="font-medium text-foreground">Contact: {task.contactName}</span>
                          )}
                          {task.order && (
                            <Badge variant="outline" className="text-[10px] font-bold border-violet-300 text-violet-800 bg-violet-50 gap-1.5 px-2.5 py-0.5 rounded-lg shadow-2xs">
                              <Package className="w-3 h-3 text-violet-600" />
                              <span>{task.order.orderNumber}</span>
                              <span className="text-violet-400 font-normal">·</span>
                              <span className="text-violet-950 font-semibold">{task.order.productName || "Cabinet / LED Lights"}</span>
                            </Badge>
                          )}
                          {task.waitingFor && (
                            <span className="text-violet-700 font-semibold bg-violet-100/60 px-2 py-0.5 rounded-md">
                              Waiting for: {task.waitingFor}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider bg-muted text-muted-foreground">
                            {task.module === "IMPORT_PURCHASE"
                              ? "Import"
                              : task.module === "SALES"
                              ? "Sales"
                              : task.module === "SERVICE"
                              ? "Service"
                              : "Task"}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <Button variant="ghost" size="icon" className="shrink-0 rounded-xl hover:bg-muted/80 spring-transition">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}

        {!loading && filteredTasks.length === 0 && (
          <Card className="rounded-2xl border-dashed border-2 border-border/60">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 stroke-[1.5]" />
              <p className="text-sm font-semibold text-muted-foreground">No tasks found for current filter selection</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── CREATE NEW TASK MODAL DIALOG ───────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0">
          <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-700 font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Add New Action Item</h3>
                  <p className="text-xs text-slate-500">Log custom task, payment, or follow-up reminder</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="rounded-xl">
                <XIcon className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Task Title *</Label>
                <Input
                  placeholder="e.g. File customs duty payment receipt"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded-xl border-slate-300 font-semibold text-sm"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-600">Category</Label>
                  <Select value={newModule} onValueChange={(v) => setNewModule(v ?? "IMPORT_PURCHASE")}>
                    <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMPORT_PURCHASE">Import</SelectItem>
                      <SelectItem value="SALES">Sales</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                      <SelectItem value="TASK">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-600">Priority</Label>
                  <Select value={newPriority} onValueChange={(v) => setNewPriority(v ?? "MEDIUM")}>
                    <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-600">Status</Label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v ?? "PLANNED")}>
                    <SelectTrigger className="rounded-xl border-slate-300 font-semibold text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="WAITING">Waiting</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-600">Due Date</Label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="rounded-xl border-slate-300 font-medium text-xs h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-600">Due Time</Label>
                  <Input
                    type="time"
                    value={newDueTime}
                    onChange={(e) => setNewDueTime(e.target.value)}
                    className="rounded-xl border-slate-300 font-medium text-xs h-9"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-slate-600">Waiting For / Assignee</Label>
                <Input
                  placeholder="e.g. CHA Agent or Zhang Wei"
                  value={newWaitingFor}
                  onChange={(e) => setNewWaitingFor(e.target.value)}
                  className="rounded-xl border-slate-300 text-xs font-medium h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-slate-600">Notes / Remarks</Label>
                <Textarea
                  placeholder="Optional details or payment instructions..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  className="rounded-xl border-slate-300 text-xs font-medium"
                />
              </div>

              {/* Document Attachment option */}
              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
                  className="gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  <Paperclip className="w-3.5 h-3.5 text-violet-600" />
                  <span>{attachedFileName ? `Attached: ${attachedFileName}` : "Attach File"}</span>
                </Button>

                <div className="flex items-center gap-2">
                  <Button variant="outline" type="button" onClick={() => setShowCreateModal(false)} className="rounded-xl font-semibold text-xs">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="gap-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs px-4 shadow-xs active:scale-95 spring-transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {saving ? "Saving..." : "Save Task"}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

