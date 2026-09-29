"use client";

import React from "react";
import { Users, Building, CreditCard, MessageSquare, ShieldCheck, ArrowUpRight, ArrowDownRight, Wallet, Activity, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Command Center</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Here is what's happening across Ashvita today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-900/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Status: Optimal
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Residents"
          value="1,248"
          trend={{ value: "2%", isPositive: true }}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
        />
        <StatCard
          title="Occupied Units"
          value="94%"
          subtitle="282 / 300 Units"
          icon={<Building className="w-6 h-6" />}
          iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
        />
        <StatCard
          title="Maintenance Collection"
          value={formatCurrency(1840000)}
          subtitle="This Month"
          trend={{ value: "12%", isPositive: true }}
          icon={<Wallet className="w-6 h-6" />}
          iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
        />
        <StatCard
          title="Outstanding Dues"
          value={formatCurrency(260000)}
          trend={{ value: "5%", isPositive: false }}
          icon={<CreditCard className="w-6 h-6" />}
          iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Analytics / Charts Placeholder */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-full flex flex-col items-center justify-center text-slate-400">
              <Activity className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm font-medium">Monthly Collection Chart Visualization</p>
              <p className="text-xs mt-1">(Recharts Area Chart will be mounted here)</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Open Complaints</CardTitle>
                  <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-500 rounded-md">37 TICKETS</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <TicketRow id="CMP-0041" category="Plumbing" priority="URGENT" time="2h ago" />
                <TicketRow id="CMP-0038" category="Elevator" priority="HIGH" time="5h ago" />
                <TicketRow id="CMP-0035" category="Electrical" priority="MEDIUM" time="1d ago" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <ActivityRow text="Maintenance paid for A-1204" time="10 min ago" type="payment" />
                <ActivityRow text="Visitor passed verified at Gate 1" time="25 min ago" type="security" />
                <ActivityRow text="Amenity booked: Badminton Court" time="1 hr ago" type="amenity" />
                <ActivityRow text="New resident registered: C-301" time="3 hr ago" type="user" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Operational Stats */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-indigo-100">Today's Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-indigo-200">Expected Visitors</span>
                <span className="font-bold text-lg">86</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <span className="text-sm text-indigo-200">Currently Inside</span>
                <span className="font-bold text-lg text-emerald-400">24</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-indigo-200">Pending Verification</span>
                <span className="font-bold text-lg text-amber-400">4</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Amenity Utilization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar label="Swimming Pool" value={85} />
              <ProgressBar label="Badminton Court" value={95} />
              <ProgressBar label="Gymnasium" value={60} />
              <ProgressBar label="Clubhouse Hall" value={20} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TicketRow({ id, category, priority, time }: { id: string; category: string; priority: string; time: string }) {
  const pColors: Record<string, string> = {
    URGENT: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200",
    HIGH: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200",
    MEDIUM: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200",
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{id}</span>
          <span className="text-[10px] text-slate-500">{time}</span>
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-400">{category}</span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${pColors[priority]}`}>
        {priority}
      </span>
    </div>
  );
}

function ActivityRow({ text, time, type }: { text: string; time: string; type: string }) {
  const icons: Record<string, React.ReactNode> = {
    payment: <CreditCard className="w-3.5 h-3.5 text-emerald-600" />,
    security: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />,
    amenity: <Calendar className="w-3.5 h-3.5 text-sky-600" />,
    user: <Users className="w-3.5 h-3.5 text-amber-600" />,
  };
  const bgs: Record<string, string> = {
    payment: "bg-emerald-100 dark:bg-emerald-900/50",
    security: "bg-indigo-100 dark:bg-indigo-900/50",
    amenity: "bg-sky-100 dark:bg-sky-900/50",
    user: "bg-amber-100 dark:bg-amber-900/50",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bgs[type]}`}>
        {icons[type]}
      </div>
      <div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight">{text}</p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-slate-500">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}
