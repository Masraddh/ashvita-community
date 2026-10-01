"use client";

import React from "react";
import {
  Users,
  Building2,
  Wallet,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CalendarDays,
  UserPlus,
  FileText,
  ChevronRight,
  CircleDollarSign,
  DoorOpen,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen space-y-7 pb-10">

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#111936] via-[#312e81] to-[#4f46e5] p-7 text-white shadow-[0_20px_60px_rgba(49,46,129,0.25)] md:p-9">

        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-100 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Admin Command Center
            </div>

            <h1 className="max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
              Good afternoon, Admin.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100/80">
              Monitor residents, finances, security and community operations
              from one centralized dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20">
              <FileText className="h-4 w-4" />
              Reports
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
              <UserPlus className="h-4 w-4" />
              Add Resident
            </button>

          </div>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 md:grid-cols-4">

          <MiniHeroStat
            label="System Status"
            value="Operational"
            icon={<CheckCircle2 className="h-4 w-4" />}
            green
          />

          <MiniHeroStat
            label="Last Sync"
            value="2 mins ago"
            icon={<Activity className="h-4 w-4" />}
          />

          <MiniHeroStat
            label="Open Issues"
            value="37"
            icon={<AlertTriangle className="h-4 w-4" />}
          />

          <MiniHeroStat
            label="Today's Visitors"
            value="86"
            icon={<DoorOpen className="h-4 w-4" />}
          />

        </div>
      </section>


      {/* =========================================================
          KPI CARDS
      ========================================================= */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <AdminStatCard
          title="Total Residents"
          value="1,248"
          subtitle="Registered residents"
          trend="+2.4%"
          positive
          icon={<Users className="h-5 w-5" />}
          iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
          accent="from-indigo-500 to-violet-500"
        />

        <AdminStatCard
          title="Occupied Units"
          value="94%"
          subtitle="282 of 300 units"
          trend="+1.8%"
          positive
          icon={<Building2 className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
          accent="from-emerald-500 to-teal-500"
        />

        <AdminStatCard
          title="Collections"
          value={formatCurrency(1840000)}
          subtitle="This month's collection"
          trend="+12.0%"
          positive
          icon={<Wallet className="h-5 w-5" />}
          iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
          accent="from-sky-500 to-cyan-500"
        />

        <AdminStatCard
          title="Outstanding Dues"
          value={formatCurrency(260000)}
          subtitle="Pending resident payments"
          trend="-5.0%"
          positive={false}
          icon={<CreditCard className="h-5 w-5" />}
          iconClass="bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
          accent="from-rose-500 to-pink-500"
        />

      </section>


      {/* =========================================================
          MAIN ANALYTICS
      ========================================================= */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">

        {/* Financial Overview */}
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <TrendingUp className="h-4 w-4" />
                </div>

                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Financial Overview
                </h2>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Maintenance collection performance
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              2026
            </div>

          </div>

          <div className="mt-8 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-medium text-slate-400">
                Total collected
              </p>

              <p className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                ₹18.4L
              </p>

              <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5" />
                12% compared to last month
              </p>
            </div>

          </div>

          {/* Fake but attractive chart */}
          <div className="mt-8 flex h-56 items-end gap-3 rounded-2xl bg-gradient-to-b from-indigo-50/70 to-white p-5 dark:from-indigo-950/30 dark:to-slate-900">

            {[45, 58, 52, 72, 64, 78, 70, 86, 74, 91, 82, 96].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex h-full flex-1 flex-col justify-end"
                >
                  <div className="relative">

                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-400 transition-all duration-300 group-hover:from-indigo-500 group-hover:to-fuchsia-400"
                      style={{ height: `${height * 1.55}px` }}
                    />

                    <div className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-900 px-2 py-1 text-[9px] font-bold text-white group-hover:block">
                      ₹{Math.round(height * 18)}K
                    </div>

                  </div>
                </div>
              )
            )}

          </div>

          <div className="mt-4 grid grid-cols-6 text-center text-[10px] font-semibold text-slate-400">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Dec</span>
          </div>

        </div>


        {/* Occupancy */}
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Community Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current occupancy status
              </p>
            </div>

            <Building2 className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="relative mx-auto mt-8 flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#4f46e5_0_94%,#e2e8f0_94%_100%)] dark:bg-[conic-gradient(#818cf8_0_94%,#1e293b_94%_100%)]">

            <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white dark:bg-slate-900">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                94%
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Occupied
              </span>
            </div>

          </div>

          <div className="mt-7 grid grid-cols-2 gap-3">

            <OverviewBox
              label="Occupied"
              value="282"
              dot="bg-indigo-500"
            />

            <OverviewBox
              label="Available"
              value="18"
              dot="bg-slate-300"
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          OPERATIONS ROW
      ========================================================= */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Complaints */}
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">

          <SectionHeading
            title="Complaint Center"
            subtitle="Tickets requiring attention"
            icon={<MessageSquare className="h-4 w-4" />}
          />

          <div className="mt-6 space-y-3">

            <ComplaintItem
              title="Urgent"
              count="8"
              percentage="22%"
              className="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
            />

            <ComplaintItem
              title="High Priority"
              count="12"
              percentage="32%"
              className="bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
            />

            <ComplaintItem
              title="Medium Priority"
              count="17"
              percentage="46%"
              className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
            />

          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total open tickets
              </span>

              <span className="text-lg font-black text-slate-900 dark:text-white">
                37
              </span>
            </div>

          </div>

        </div>


        {/* Security */}
        <div className="overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#111827] via-[#172554] to-[#312e81] p-6 text-white shadow-[0_15px_50px_rgba(30,41,59,0.2)]">

          <SectionHeading
            title="Security Monitor"
            subtitle="Gate activity today"
            icon={<ShieldCheck className="h-4 w-4" />}
            dark
          />

          <div className="mt-7 space-y-3">

            <DarkMetric
              icon={<DoorOpen className="h-4 w-4" />}
              label="Expected Visitors"
              value="86"
            />

            <DarkMetric
              icon={<Users className="h-4 w-4" />}
              label="Currently Inside"
              value="24"
              green
            />

            <DarkMetric
              icon={<Clock3 className="h-4 w-4" />}
              label="Pending Verification"
              value="04"
              amber
            />

          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-semibold text-emerald-300">
                All gates operational
              </span>
            </div>

          </div>

        </div>


        {/* Amenities */}
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">

          <SectionHeading
            title="Amenity Usage"
            subtitle="Today's utilization"
            icon={<CalendarDays className="h-4 w-4" />}
          />

          <div className="mt-6 space-y-5">

            <UsageBar
              label="Badminton Court"
              value={95}
              color="bg-indigo-500"
            />

            <UsageBar
              label="Swimming Pool"
              value={85}
              color="bg-cyan-500"
            />

            <UsageBar
              label="Gymnasium"
              value={60}
              color="bg-emerald-500"
            />

            <UsageBar
              label="Clubhouse Hall"
              value={20}
              color="bg-amber-500"
            />

          </div>

        </div>

      </section>


      {/* =========================================================
          BOTTOM ROW
      ========================================================= */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">

        {/* Recent Activity */}
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest community events
              </p>
            </div>

            <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>

          </div>

          <div className="mt-6 space-y-5">

            <TimelineItem
              icon={<CreditCard className="h-4 w-4" />}
              iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              title="Maintenance payment received"
              description="A-1204 · ₹2,450"
              time="10 min ago"
            />

            <TimelineItem
              icon={<ShieldCheck className="h-4 w-4" />}
              iconClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
              title="Visitor verified at Gate 1"
              description="Security verification completed"
              time="25 min ago"
            />

            <TimelineItem
              icon={<CalendarDays className="h-4 w-4" />}
              iconClass="bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
              title="Amenity booking created"
              description="Badminton Court · 6:00 PM"
              time="1 hr ago"
            />

            <TimelineItem
              icon={<UserPlus className="h-4 w-4" />}
              iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
              title="New resident registered"
              description="C-301 · Rahul Mehta"
              time="3 hr ago"
            />

          </div>

        </div>


        {/* Quick Actions */}
        <div className="rounded-[1.6rem] border border-slate-200/70 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-900">

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Frequently used admin tools
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">

            <QuickAction
              icon={<Users className="h-5 w-5" />}
              title="Residents"
              subtitle="Manage"
              className="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
            />

            <QuickAction
              icon={<CreditCard className="h-5 w-5" />}
              title="Payments"
              subtitle="Review"
              className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
            />

            <QuickAction
              icon={<MessageSquare className="h-5 w-5" />}
              title="Complaints"
              subtitle="Resolve"
              className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
            />

            <QuickAction
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Security"
              subtitle="Monitor"
              className="bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400"
            />

          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <CircleDollarSign className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Collection target
                </p>

                <p className="text-[10px] text-slate-500">
                  82% achieved this month
                </p>
              </div>
            </div>

            <ArrowUpRight className="h-4 w-4 text-emerald-500" />

          </div>

        </div>

      </section>

    </div>
  );
}


/* ===============================================================
   COMPONENTS
================================================================ */

function MiniHeroStat({
  label,
  value,
  icon,
  green,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  green?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-indigo-100">
        {icon}
      </div>

      <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-200/60">
          {label}
        </p>

        <p
          className={`mt-0.5 text-xs font-bold ${green ? "text-emerald-300" : "text-white"
            }`}
        >
          {value}
        </p>
      </div>

    </div>
  );
}


function AdminStatCard({
  title,
  value,
  subtitle,
  trend,
  positive,
  icon,
  iconClass,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  positive: boolean;
  icon: React.ReactNode;
  iconClass: string;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[1.45rem] border border-slate-200/70 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.09)] dark:border-slate-800 dark:bg-slate-900">

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${accent}`}
      />

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-[1.65rem] font-black tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-[11px] font-medium text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>

      </div>

      <div className="mt-4 flex items-center gap-2">

        <span
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${positive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
            }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}

          {trend}
        </span>

        <span className="text-[10px] text-slate-400">
          vs last month
        </span>

      </div>

    </div>
  );
}


function SectionHeading({
  title,
  subtitle,
  icon,
  dark,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">

      <div
        className={`rounded-xl p-2 ${dark
            ? "bg-white/10 text-indigo-200"
            : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
          }`}
      >
        {icon}
      </div>

      <div>
        <h2
          className={`text-base font-bold ${dark ? "text-white" : "text-slate-900 dark:text-white"
            }`}
        >
          {title}
        </h2>

        <p
          className={`mt-1 text-xs ${dark ? "text-indigo-200/60" : "text-slate-500"
            }`}
        >
          {subtitle}
        </p>
      </div>

    </div>
  );
}


function ComplaintItem({
  title,
  count,
  percentage,
  className,
}: {
  title: string;
  count: string;
  percentage: string;
  className: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3 dark:border-slate-800">

      <div className="flex items-center gap-3">

        <div className={`rounded-lg px-2 py-1 text-[10px] font-bold ${className}`}>
          {count}
        </div>

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {title}
        </span>

      </div>

      <span className="text-[10px] font-bold text-slate-400">
        {percentage}
      </span>

    </div>
  );
}


function DarkMetric({
  icon,
  label,
  value,
  green,
  amber,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  green?: boolean;
  amber?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-white/10 p-2 text-indigo-200">
          {icon}
        </div>

        <span className="text-xs font-semibold text-indigo-100/80">
          {label}
        </span>

      </div>

      <span
        className={`text-xl font-black ${green
            ? "text-emerald-400"
            : amber
              ? "text-amber-400"
              : "text-white"
          }`}
      >
        {value}
      </span>

    </div>
  );
}


function UsageBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between">

        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </span>

        <span className="text-xs font-black text-slate-500">
          {value}%
        </span>

      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />

      </div>

    </div>
  );
}


function OverviewBox({
  label,
  value,
  dot,
}: {
  label: string;
  value: string;
  dot: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">

      <div className="flex items-center gap-2">

        <span className={`h-2 w-2 rounded-full ${dot}`} />

        <span className="text-[10px] font-semibold text-slate-500">
          {label}
        </span>

      </div>

      <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">
        {value}
      </p>

    </div>
  );
}


function TimelineItem({
  icon,
  iconClass,
  title,
  description,
  time,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex gap-4">

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-col justify-between gap-1 sm:flex-row">

          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {title}
          </p>

          <span className="text-[10px] font-medium text-slate-400">
            {time}
          </span>

        </div>

        <p className="mt-1 text-[11px] text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}


function QuickAction({
  icon,
  title,
  subtitle,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  className: string;
}) {
  return (
    <button className="group rounded-xl border border-slate-100 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md dark:border-slate-800">

      <div className="flex items-center gap-3">

        <div className={`rounded-xl p-2.5 ${className}`}>
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {subtitle}
          </p>
        </div>

      </div>

    </button>
  );
}