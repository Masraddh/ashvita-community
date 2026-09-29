"use client";

import React, { useState } from "react";
import { Shield, Clock, Filter, Download, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";

interface AuditLog {
  id: string;
  timestamp: string;
  gate: string;
  guardName: string;
  action: string;
  details: string;
  severity: "Low" | "Medium" | "High";
}

const mockLogs: AuditLog[] = [
  {
    id: "LOG-9001",
    timestamp: "2026-09-29 10:30:15",
    gate: "Main Gate (Gate 1)",
    guardName: "Rajesh Guard",
    action: "Visitor Entry Approved",
    details: "Ramesh Kumar (Delivery - Swiggy) allowed for Unit A-302",
    severity: "Low",
  },
  {
    id: "LOG-9002",
    timestamp: "2026-09-29 09:45:00",
    gate: "Service Gate (Gate 2)",
    guardName: "Suresh Guard",
    action: "Vendor Vehicle Entered",
    details: "Plumbing Truck KA-01-MJ-8812 verified and passed",
    severity: "Medium",
  },
  {
    id: "LOG-9003",
    timestamp: "2026-09-29 08:15:22",
    gate: "Main Gate (Gate 1)",
    guardName: "Rajesh Guard",
    action: "Invalid Pass Attempt",
    details: "Passcode PASS-9999 failed verification. Entry denied.",
    severity: "High",
  },
  {
    id: "LOG-9004",
    timestamp: "2026-09-28 22:10:04",
    gate: "Clubhouse Gate",
    guardName: "Mahesh Guard",
    action: "Gate Unlocked",
    details: "Emergency exit opened for maintenance review",
    severity: "Medium",
  },
];

export default function SecurityLogsPage() {
  const [filter, setFilter] = useState("All");

  const filtered = mockLogs.filter((log) => {
    if (filter === "High") return log.severity === "High";
    if (filter === "Gate1") return log.gate.includes("Gate 1");
    return true;
  });

  const columns: Column<AuditLog>[] = [
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      cell: (row) => <span className="font-mono text-xs text-slate-500">{row.timestamp}</span>,
    },
    { header: "Gate Location", accessorKey: "gate" },
    { header: "Guard On Duty", accessorKey: "guardName" },
    {
      header: "Action / Event",
      accessorKey: "action",
      cell: (row) => <span className="font-semibold text-slate-900 dark:text-white">{row.action}</span>,
    },
    { header: "Details", accessorKey: "details" },
    {
      header: "Severity",
      accessorKey: "severity",
      cell: (row) => (
        <Badge variant={row.severity === "High" ? "danger" : row.severity === "Medium" ? "warning" : "neutral"}>
          {row.severity}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Audit & Entry Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time gate activity feed and guard event history.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Logs (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Today's Gate Events" value="142" icon={<Clock className="w-5 h-5"/>} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50" />
        <StatCard title="Denied Entries" value="3" icon={<AlertTriangle className="w-5 h-5"/>} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-900/50" />
        <StatCard title="Active Guards On Duty" value="6 Guards" icon={<Shield className="w-5 h-5"/>} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50" />
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant={filter === "All" ? "primary" : "ghost"} onClick={() => setFilter("All")}>
          All Logs
        </Button>
        <Button size="sm" variant={filter === "High" ? "primary" : "ghost"} onClick={() => setFilter("High")}>
          Security Alerts (High)
        </Button>
        <Button size="sm" variant={filter === "Gate1" ? "primary" : "ghost"} onClick={() => setFilter("Gate1")}>
          Main Gate
        </Button>
      </div>

      <DataTable data={filtered} columns={columns} searchPlaceholder="Search audit logs by guard or detail..." />
    </div>
  );
}
