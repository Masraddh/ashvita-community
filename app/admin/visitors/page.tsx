"use client";

import React from "react";
import { Shield, UserCheck, UserMinus, Clock, XCircle } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Column } from "@/components/ui/DataTable";

interface VisitorRow {
  id: string;
  name: string;
  type: string;
  resident: string;
  unit: string;
  phone: string;
  vehicle: string;
  expected: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

const visitors: VisitorRow[] = [
  { id: "VP-849201", name: "Amit Sharma", type: "GUEST", resident: "Rahul Verma", unit: "A-1204", phone: "+91 99887 66554", vehicle: "TS 09 EQ 4821", expected: "6:30 PM", status: "EXPECTED", checkIn: "—", checkOut: "—" },
  { id: "VP-554312", name: "Swiggy Delivery", type: "DELIVERY", resident: "Priya Sundaram", unit: "B-802", phone: "+91 93333 44444", vehicle: "—", expected: "7:15 PM", status: "EXPECTED", checkIn: "—", checkOut: "—" },
  { id: "VP-102938", name: "Amazon Delivery Agent", type: "DELIVERY", resident: "Rahul Verma", unit: "A-1204", phone: "+91 94444 33333", vehicle: "—", expected: "2:00 PM", status: "CHECKED_IN", checkIn: "2:05 PM", checkOut: "—" },
  { id: "VP-738291", name: "Lakshmi (Maid)", type: "DOMESTIC_HELP", resident: "Rahul Verma", unit: "A-1204", phone: "+91 95555 11111", vehicle: "—", expected: "7:00 AM", status: "CHECKED_OUT", checkIn: "7:02 AM", checkOut: "12:30 PM" },
  { id: "VP-445566", name: "Ola Cab Driver", type: "CAB", resident: "Sneha Reddy", unit: "A-601", phone: "+91 96666 22222", vehicle: "TS 11 AB 9999", expected: "8:00 AM", status: "CHECKED_OUT", checkIn: "7:55 AM", checkOut: "8:10 AM" },
  { id: "VP-112233", name: "Plumber Raju", type: "SERVICE_PROVIDER", resident: "Vikash Patel", unit: "D-1502", phone: "+91 97777 33333", vehicle: "—", expected: "10:00 AM", status: "CHECKED_IN", checkIn: "10:05 AM", checkOut: "—" },
];

const statusBadge = (s: string) => {
  const map: Record<string, { variant: "warning" | "info" | "success" | "danger" | "neutral"; label: string }> = {
    EXPECTED: { variant: "warning", label: "Expected" },
    CHECKED_IN: { variant: "info", label: "Inside" },
    CHECKED_OUT: { variant: "success", label: "Left" },
    REJECTED: { variant: "danger", label: "Rejected" },
  };
  const sv = map[s] || { variant: "neutral" as const, label: s };
  return <Badge variant={sv.variant} dot>{sv.label}</Badge>;
};

export default function AdminVisitorsPage() {
  const columns: Column<VisitorRow>[] = [
    {
      header: "Visitor",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{row.name}</p>
          <p className="text-xs text-slate-500 font-mono">{row.id}</p>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => <Badge variant="neutral" size="sm">{row.type.replace(/_/g, " ")}</Badge>,
    },
    {
      header: "Resident / Unit",
      accessorKey: "resident",
      cell: (row) => (
        <div>
          <p className="text-sm text-slate-900 dark:text-slate-100">{row.resident}</p>
          <p className="text-xs text-slate-500">{row.unit}</p>
        </div>
      ),
    },
    { header: "Phone", accessorKey: "phone" },
    { header: "Vehicle", accessorKey: "vehicle" },
    { header: "Expected", accessorKey: "expected" },
    { header: "Status", accessorKey: "status", cell: (row) => statusBadge(row.status) },
    { header: "Check In", accessorKey: "checkIn" },
    { header: "Check Out", accessorKey: "checkOut" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Security & Visitors</h2>
        <p className="text-sm text-slate-500 mt-1">Monitor all visitor activity across the community.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Expected Today" value="86" icon={<Clock className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard title="Currently Inside" value="24" icon={<UserCheck className="w-6 h-6" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" />
        <StatCard title="Checked Out" value="58" icon={<UserMinus className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Rejected" value="4" icon={<XCircle className="w-6 h-6" />} iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" />
      </div>

      <DataTable columns={columns} data={visitors} searchKey="name" searchPlaceholder="Search by visitor name..." pageSize={7} />
    </div>
  );
}
