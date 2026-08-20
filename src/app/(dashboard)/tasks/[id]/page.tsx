"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Save,
  Trash2,
  Pause,
  Play,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  User,
  Building,
  Tag,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  module: string;
  dueDate: string | null;
  dueTime: string | null;
  contactName: string | null;
  contactCompany: string | null;
  nextAction: string | null;
  waitingFor: string | null;
  followUpDate: string | null;
  tags: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  order: { id: string; orderNumber: string; title: string } | null;
  activities: Array<{
    id: string;
    action: string;
    fromValue: string | null;
    toValue: string | null;
    note: string | null;
    createdAt: string;
  }>;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  PLANNED: { icon: Clock, color: "text-gray-500", bg: "bg-gray-500/10", label: "Planned" },
  IN_PROGRESS: { icon: ArrowUpDown, color: "text-amber-500", bg: "bg-amber-500/10", label: "In Progress" },
  WAITING: { icon: Pause, color: "text-blue-500", bg: "bg-blue-500/10", label: "Waiting" },
  COMPLETED: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Completed" },
  CANCELLED: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Cancelled" },
};

const priorityConfig: Record<string, { color: string; label: string }> = {
  CRITICAL: { color: "bg-red-500 text-white", label: "Critical" },
  HIGH: { color: "bg-orange-500 text-white", label: "High" },
  MEDIUM: { color: "bg-blue-500 text-white", label: "Medium" },
  LOW: { color: "bg-gray-400 text-white", label: "Low" },
};

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  async function fetchTask() {
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        setFormData(data);
      }
    } catch (err) {
      console.error("Failed to fetch task:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTask();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchTask();
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to save task:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/tasks");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading task...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Task not found</p>
        <Link href="/tasks">
          <Button variant="link">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/tasks">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
            <Badge className={priorityConfig[task.priority].color}>
              {priorityConfig[task.priority].label}
            </Badge>
          </div>
          <p className="text-muted-foreground">{status.label}</p>
        </div>
        <div className="flex items-center gap-2">
          {!editMode && (
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {task.status !== "COMPLETED" && (
              <Button
                size="sm"
                variant={task.status === "IN_PROGRESS" ? "default" : "outline"}
                onClick={() => handleStatusChange("IN_PROGRESS")}
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </Button>
            )}
            {task.status !== "WAITING" && task.status !== "COMPLETED" && (
              <Button
                size="sm"
                variant={task.status === "WAITING" ? "default" : "outline"}
                onClick={() => handleStatusChange("WAITING")}
              >
                <Pause className="w-4 h-4 mr-1" />
                Waiting
              </Button>
            )}
            {task.status !== "COMPLETED" && (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => handleStatusChange("COMPLETED")}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
            {task.status !== "CANCELLED" && task.status !== "COMPLETED" && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => handleStatusChange("CANCELLED")}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Details */}
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editMode ? (
            <>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(v) => v && setFormData({ ...formData, priority: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Module</Label>
                  <Select
                    value={formData.module}
                    onValueChange={(v) => v && setFormData({ ...formData, module: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TASK">General Task</SelectItem>
                      <SelectItem value="IMPORT_PURCHASE">Import / Purchase</SelectItem>
                      <SelectItem value="SALES">Sales</SelectItem>
                      <SelectItem value="SERVICE">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value ? new Date(e.target.value) as unknown as string : null })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Time</Label>
                  <Input
                    type="time"
                    value={formData.dueTime || ""}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={formData.contactName || ""}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={formData.contactCompany || ""}
                    onChange={(e) => setFormData({ ...formData, contactCompany: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Next Action</Label>
                <Input
                  value={formData.nextAction || ""}
                  onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Waiting For</Label>
                  <Input
                    value={formData.waitingFor || ""}
                    onChange={(e) => setFormData({ ...formData, waitingFor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Date</Label>
                  <Input
                    type="date"
                    value={formData.followUpDate ? new Date(formData.followUpDate).toISOString().split("T")[0] : ""}
                    onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value ? new Date(e.target.value) as unknown as string : null })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setEditMode(false); setFormData(task); }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {task.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{task.description}</p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    {task.dueTime && <span className="text-muted-foreground">at {task.dueTime}</span>}
                  </div>
                )}
                {task.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>Contact: {task.contactName}</span>
                  </div>
                )}
                {task.contactCompany && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span>Company: {task.contactCompany}</span>
                  </div>
                )}
                {task.nextAction && (
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <span>Next: {task.nextAction}</span>
                  </div>
                )}
                {task.waitingFor && (
                  <div className="flex items-center gap-2">
                    <Pause className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-500">Waiting for: {task.waitingFor}</span>
                  </div>
                )}
                {task.followUpDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-500">Follow-up: {new Date(task.followUpDate).toLocaleDateString()}</span>
                  </div>
                )}
                {task.tags && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <span>Tags: {task.tags}</span>
                  </div>
                )}
                {task.order && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <Link href={`/orders/${task.order.id}`} className="text-primary hover:underline">
                      {task.order.orderNumber} - {task.order.title}
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Activity Log */}
      {task.activities && task.activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {task.activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p>
                      <span className="font-medium">{activity.action}</span>
                      {activity.fromValue && activity.toValue && (
                        <span className="text-muted-foreground">
                          {" "}from <Badge variant="outline" className="text-xs">{activity.fromValue}</Badge>
                          {" "}to <Badge variant="outline" className="text-xs">{activity.toValue}</Badge>
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
