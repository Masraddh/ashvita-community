"use client";

import React, { useState } from "react";
import { Wrench, Plus, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";

const complaints = [
  {
    id: "CMP-2026-0041", title: "Master bathroom flush leak & low pressure", category: "Plumbing", priority: "HIGH", status: "IN_PROGRESS",
    assignedTo: "Rajesh (Senior Plumber)", created: "22 Sep 2026",
    timeline: [
      { label: "Complaint Created", time: "22 Sep, 10:32 AM", done: true },
      { label: "Assigned to Rajesh", time: "22 Sep, 11:00 AM", done: true },
      { label: "Technician Started Work", time: "22 Sep, 3:15 PM", done: true },
      { label: "Issue Resolved", time: "—", done: false },
      { label: "Resident Confirmed", time: "—", done: false },
    ],
  },
  {
    id: "CMP-2026-0038", title: "Tower A Lift B making screeching sound", category: "Lift / Elevator", priority: "URGENT", status: "RESOLVED",
    assignedTo: "Otis Elevator Engineer", created: "18 Sep 2026",
    timeline: [
      { label: "Complaint Created", time: "18 Sep, 8:00 AM", done: true },
      { label: "Assigned to Otis Team", time: "18 Sep, 9:15 AM", done: true },
      { label: "Engineer Started Work", time: "19 Sep, 10:00 AM", done: true },
      { label: "Issue Resolved", time: "20 Sep, 2:30 PM", done: true },
      { label: "Resident Confirmed", time: "20 Sep, 5:00 PM", done: true },
    ],
  },
];

const categories = [
  { label: "Select Category", value: "" },
  { label: "Plumbing", value: "Plumbing" },
  { label: "Electrical", value: "Electrical" },
  { label: "Cleaning", value: "Cleaning" },
  { label: "Security", value: "Security" },
  { label: "Lift / Elevator", value: "Lift / Elevator" },
  { label: "Water Supply", value: "Water Supply" },
  { label: "Parking", value: "Parking" },
  { label: "Common Area", value: "Common Area" },
  { label: "Other", value: "Other" },
];

const priorities = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

export default function ComplaintsPage() {
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  const statusBadge = (s: string) => {
    const map: Record<string, { variant: "warning" | "info" | "primary" | "success" | "neutral"; label: string }> = {
      SUBMITTED: { variant: "info", label: "Submitted" },
      ASSIGNED: { variant: "primary", label: "Assigned" },
      IN_PROGRESS: { variant: "warning", label: "In Progress" },
      RESOLVED: { variant: "success", label: "Resolved" },
      CLOSED: { variant: "neutral", label: "Closed" },
    };
    const sv = map[s] || { variant: "neutral" as const, label: s };
    return <Badge variant={sv.variant} dot>{sv.label}</Badge>;
  };

  const priorityBadge = (p: string) => {
    const map: Record<string, "danger" | "warning" | "primary" | "neutral"> = { URGENT: "danger", HIGH: "warning", MEDIUM: "primary", LOW: "neutral" };
    return <Badge variant={map[p] || "neutral"}>{p}</Badge>;
  };

  const selected = complaints.find((c) => c.id === detailOpen);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Complaints</h2>
          <p className="text-sm text-slate-500 mt-1">Track and manage your service requests.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Raise Complaint</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Complaints" value="2" icon={<Wrench className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
        <StatCard title="In Progress" value="1" icon={<Wrench className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard title="Resolved" value="1" icon={<Wrench className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
      </div>

      <div className="space-y-4">
        {complaints.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailOpen(c.id)}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{c.id}</span>
                  {priorityBadge(c.priority)}
                  {statusBadge(c.status)}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{c.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{c.category} • Raised on {c.created} • Assigned to {c.assignedTo || "Unassigned"}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Complaint Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Raise New Complaint" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setCreateOpen(false); toast("Complaint Submitted", "Your complaint has been raised successfully.", "success"); }}>
          <Input label="Title" placeholder="Brief description of the issue" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" options={categories} required />
            <Select label="Priority" options={priorities} required />
          </div>
          <Textarea label="Description" placeholder="Provide detailed information about the issue..." required />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Complaint</Button>
          </div>
        </form>
      </Modal>

      {/* Complaint Detail Modal */}
      <Modal isOpen={!!detailOpen} onClose={() => setDetailOpen(null)} title={selected?.id || ""} description={selected?.title} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Category</span>{selected.category}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Priority</span>{priorityBadge(selected.priority)}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Status</span>{statusBadge(selected.status)}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Assigned To</span>{selected.assignedTo}</div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-3">Resolution Timeline</p>
              <div className="space-y-0 relative pl-6">
                {selected.timeline.map((step, i) => (
                  <div key={i} className="relative pb-6 last:pb-0">
                    {i < selected.timeline.length - 1 && (
                      <div className={`absolute left-[-18px] top-5 w-0.5 h-full ${step.done ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                    )}
                    <div className={`absolute left-[-22px] top-1 w-3 h-3 rounded-full border-2 ${step.done ? "bg-emerald-500 border-emerald-500" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"}`} />
                    <p className={`text-sm font-medium ${step.done ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>{step.label}</p>
                    <p className="text-xs text-slate-500">{step.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
