"use client";

import React, { useState } from "react";
import { CreditCard, Wallet, AlertTriangle, CheckCircle2, Download, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, Column } from "@/components/ui/DataTable";
import { formatCurrency } from "@/lib/utils";

interface PaymentRow {
  id: string;
  unit: string;
  tower: string;
  resident: string;
  month: string;
  amount: number;
  lateFee: number;
  status: string;
  paidOn: string;
  txn: string;
}

const payments: PaymentRow[] = [
  { id: "1", unit: "A-1204", tower: "Tower A", resident: "Rahul Verma", month: "September 2026", amount: 2450, lateFee: 0, status: "PENDING", paidOn: "—", txn: "—" },
  { id: "2", unit: "B-802", tower: "Tower B", resident: "Priya Sundaram", month: "September 2026", amount: 3100, lateFee: 200, status: "OVERDUE", paidOn: "—", txn: "—" },
  { id: "3", unit: "A-1204", tower: "Tower A", resident: "Rahul Verma", month: "August 2026", amount: 2450, lateFee: 0, status: "PAID", paidOn: "25 Aug 2026", txn: "TXN9928310481" },
  { id: "4", unit: "C-301", tower: "Tower C", resident: "Arjun Mehta", month: "September 2026", amount: 2800, lateFee: 0, status: "PAID", paidOn: "22 Sep 2026", txn: "TXN1029384756" },
  { id: "5", unit: "A-601", tower: "Tower A", resident: "Sneha Reddy", month: "September 2026", amount: 2450, lateFee: 0, status: "PAID", paidOn: "20 Sep 2026", txn: "TXN2038475610" },
  { id: "6", unit: "D-1502", tower: "Tower D", resident: "Vikash Patel", month: "September 2026", amount: 3500, lateFee: 0, status: "PENDING", paidOn: "—", txn: "—" },
  { id: "7", unit: "B-401", tower: "Tower B", resident: "Ananya Iyer", month: "September 2026", amount: 2800, lateFee: 0, status: "PAID", paidOn: "18 Sep 2026", txn: "TXN3049586720" },
  { id: "8", unit: "E-903", tower: "Tower E", resident: "Karthik Nair", month: "September 2026", amount: 2450, lateFee: 0, status: "PENDING", paidOn: "—", txn: "—" },
];

const statusBadge = (s: string) => {
  const map: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
    PAID: { variant: "success", label: "Paid" },
    PENDING: { variant: "warning", label: "Pending" },
    OVERDUE: { variant: "danger", label: "Overdue" },
  };
  const sv = map[s] || { variant: "warning" as const, label: s };
  return <Badge variant={sv.variant} dot>{sv.label}</Badge>;
};

export default function AdminPaymentsPage() {
  const columns: Column<PaymentRow>[] = [
    {
      header: "Unit / Resident",
      accessorKey: "resident",
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{row.resident}</p>
          <p className="text-xs text-slate-500">{row.unit} • {row.tower}</p>
        </div>
      ),
    },
    { header: "Billing Month", accessorKey: "month" },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (row) => <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(row.amount)}</span>,
    },
    {
      header: "Late Fee",
      accessorKey: "lateFee",
      cell: (row) => (
        <span className={row.lateFee > 0 ? "text-rose-600 font-semibold" : "text-slate-400"}>
          {row.lateFee > 0 ? formatCurrency(row.lateFee) : "—"}
        </span>
      ),
    },
    { header: "Status", accessorKey: "status", cell: (row) => statusBadge(row.status) },
    { header: "Paid On", accessorKey: "paidOn" },
    {
      header: "Transaction",
      accessorKey: "txn",
      cell: (row) => <span className="font-mono text-xs text-slate-500">{row.txn}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Financials</h2>
          <p className="text-sm text-slate-500 mt-1">Track maintenance payments, dues, and collection rates.</p>
        </div>
        <Button variant="outline" icon={<Download className="w-4 h-4" />}>Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collection" value={formatCurrency(1840000)} subtitle="This Month" trend={{ value: "12%", isPositive: true }} icon={<Wallet className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Outstanding Dues" value={formatCurrency(260000)} trend={{ value: "5%", isPositive: false }} icon={<AlertTriangle className="w-6 h-6" />} iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" />
        <StatCard title="Collection Rate" value="87%" subtitle="Target: 95%" icon={<TrendingUp className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
        <StatCard title="Overdue Bills" value="18" subtitle="₹2.6L total" icon={<CreditCard className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
      </div>

      {/* Monthly Collection Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Collection Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "September 2026", collected: 1840000, target: 2100000 },
                { month: "August 2026", collected: 1920000, target: 2100000 },
                { month: "July 2026", collected: 2050000, target: 2100000 },
                { month: "June 2026", collected: 1780000, target: 2100000 },
              ].map((m) => (
                <div key={m.month}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{m.month}</span>
                    <span className="text-slate-500">{formatCurrency(m.collected)} / {formatCurrency(m.target)}</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.round((m.collected / m.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Paid</span>
              </div>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">246 units</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Pending</span>
              </div>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">36 units</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Overdue</span>
              </div>
              <span className="text-sm font-bold text-rose-700 dark:text-rose-400">18 units</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={payments} searchKey="resident" searchPlaceholder="Search by resident name..." pageSize={7} />
    </div>
  );
}
