"use client";

import React from "react";
import { BarChart3, Download, TrendingUp, DollarSign, Users, AlertCircle, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Generate and export financial, operational, and occupancy reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export All (PDF)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Collection (YTD)" value="₹14,50,000" icon={<DollarSign className="w-5 h-5" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50" trend={{ value: "+12% vs last year", isPositive: true }} />
        <StatCard title="Occupancy Rate" value="92.5%" icon={<Users className="w-5 h-5" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50" trend={{ value: "+3.2% this quarter", isPositive: true }} />
        <StatCard title="Avg Resolution Time" value="1.8 Days" icon={<AlertCircle className="w-5 h-5" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-900/50" trend={{ value: "-0.5 days faster", isPositive: true }} />
        <StatCard title="Amenity Revenue" value="₹85,000" icon={<TrendingUp className="w-5 h-5" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-900/50" trend={{ value: "+18% this month", isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Summary Card */}
        <Card className="p-5">
          <CardHeader>
            <CardTitle>Maintenance Fee Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Collected (88%)</span>
                <span className="font-semibold text-emerald-600">₹4,84,000</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div className="bg-emerald-500 h-3 rounded-full" style={{ width: "88%" }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Pending (12%)</span>
                <span className="font-semibold text-amber-600">₹66,000</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div className="bg-amber-500 h-3 rounded-full" style={{ width: "12%" }} />
              </div>
            </div>

            <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-center">
              <span className="text-sm text-slate-500">Monthly Target: ₹5,50,000</span>
              <Button size="sm" variant="ghost" className="text-indigo-600 dark:text-indigo-400">
                Download Breakdown
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Complaints Summary Card */}
        <Card className="p-5">
          <CardHeader>
            <CardTitle>Complaint Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { category: "Plumbing", count: 18, percentage: 40, color: "bg-sky-500" },
              { category: "Electrical", count: 12, percentage: 27, color: "bg-amber-500" },
              { category: "Security / Parking", count: 9, percentage: 20, color: "bg-indigo-500" },
              { category: "Housekeeping", count: 6, percentage: 13, color: "bg-emerald-500" },
            ].map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                  <span className="text-slate-500">{item.count} tickets ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Report Templates / Downloadable Reports list */}
      <Card className="p-5">
        <CardHeader>
          <CardTitle>Downloadable Statement & Ledger Reports</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 divide-y dark:divide-slate-800">
          {[
            { title: "Monthly Maintenance Collection Ledger (Sept 2026)", type: "Excel / CSV", size: "2.4 MB" },
            { title: "Occupancy & Tenant Directory Statement", type: "PDF Document", size: "1.1 MB" },
            { title: "Visitor & Gate Access Audit Log", type: "CSV Export", size: "4.8 MB" },
            { title: "Annual Financial & Vendor Payout Audit (2025-2026)", type: "PDF Document", size: "8.5 MB" },
          ].map((report, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{report.title}</h4>
                  <p className="text-xs text-slate-400">{report.type} • {report.size}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
