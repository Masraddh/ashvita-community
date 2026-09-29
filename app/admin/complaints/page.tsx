"use client";

import React, { useState } from "react";
import { MessageSquare, Clock, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { Card, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Input";

const complaints = [
  { id: "CMP-2026-0041", title: "Master bathroom flush leak & low pressure", category: "Plumbing", priority: "HIGH", status: "IN_PROGRESS", resident: "Rahul Verma", unit: "A-1204", assignedTo: "Rajesh (Senior Plumber)", created: "22 Sep 2026" },
  { id: "CMP-2026-0038", title: "Tower A Lift B making screeching sound", category: "Lift / Elevator", priority: "URGENT", status: "RESOLVED", resident: "Rahul Verma", unit: "A-1204", assignedTo: "Otis Elevator Engineer", created: "18 Sep 2026" },
  { id: "CMP-2026-0035", title: "Parking slot B2-15 occupied by unknown vehicle", category: "Parking", priority: "MEDIUM", status: "SUBMITTED", resident: "Priya Sundaram", unit: "B-802", assignedTo: "—", created: "16 Sep 2026" },
  { id: "CMP-2026-0032", title: "Common area lights flickering on 6th floor", category: "Electrical", priority: "LOW", status: "ASSIGNED", resident: "Sneha Reddy", unit: "A-601", assignedTo: "Kumar (Electrician)", created: "14 Sep 2026" },
  { id: "CMP-2026-0029", title: "Water seepage from ceiling in bedroom", category: "Plumbing", priority: "URGENT", status: "IN_PROGRESS", resident: "Vikash Patel", unit: "D-1502", assignedTo: "Rajesh (Senior Plumber)", created: "12 Sep 2026" },
  { id: "CMP-2026-0025", title: "Gym treadmill #3 not working", category: "Common Area", priority: "LOW", status: "CLOSED", resident: "Ananya Iyer", unit: "B-401", assignedTo: "Gym Maintenance Team", created: "10 Sep 2026" },
];

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

export default function AdminComplaintsPage() {
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const selected = complaints.find((c) => c.id === detailOpen);

  const filtered = complaints.filter((c) => !statusFilter || c.status === statusFilter);

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Submitted", value: "SUBMITTED" },
    { label: "Assigned", value: "ASSIGNED" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Resolved", value: "RESOLVED" },
    { label: "Closed", value: "CLOSED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Complaints</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and resolve community complaints.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Complaints" value="37" icon={<MessageSquare className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
        <StatCard title="In Progress" value="12" icon={<Clock className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard title="Resolved" value="20" icon={<CheckCircle2 className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Urgent / High" value="5" icon={<AlertTriangle className="w-6 h-6" />} iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" />
      </div>

      <div className="max-w-xs">
        <Select label="" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setDetailOpen(c.id)}>
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">{c.id}</span>
                  {priorityBadge(c.priority)}
                  {statusBadge(c.status)}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{c.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{c.category} • {c.resident} ({c.unit}) • {c.created}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!detailOpen} onClose={() => setDetailOpen(null)} title={selected?.id || ""} description={selected?.title} size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Category</span>{selected.category}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Priority</span>{priorityBadge(selected.priority)}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Status</span>{statusBadge(selected.status)}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Assigned To</span>{selected.assignedTo}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Resident</span>{selected.resident}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Unit</span>{selected.unit}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Created</span>{selected.created}</div>
            </div>
            <div className="flex gap-3 pt-2">
              {selected.status !== "RESOLVED" && selected.status !== "CLOSED" && (
                <Button variant="secondary" size="sm">Mark Resolved</Button>
              )}
              <Button variant="outline" size="sm">Add Comment</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
