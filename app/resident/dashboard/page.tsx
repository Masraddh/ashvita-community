"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Wrench,
  Users,
  CalendarDays,
  Bell,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Clock3,
  ChevronRight,
  Home,
  Activity,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatCard,
} from "@/components/ui/Card";

import { formatCurrency } from "@/lib/utils";
import { getResidentProfile } from "@/app/actions/user";

export default function ResidentDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getResidentProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const name = profile?.user?.name || "Resident";
  const firstName = name.split(" ")[0];
  const towerName = profile?.unit?.tower?.name || "Tower";
  const unitNumber = profile?.unit?.unitNumber || "Apartment";

  return (
    <div className="space-y-7 pb-10 animate-fade-in">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-hero p-7 text-white shadow-[0_25px_60px_rgba(30,27,75,0.20)] sm:p-9">

        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 hidden opacity-[0.07] lg:block">
          <BuildingIcon className="h-56 w-56" />
        </div>

        <div className="relative z-10 max-w-3xl">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Ashvita Resident Portal
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.7rem]">
            Good Morning, {firstName}
            <span className="ml-2">👋</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/85 sm:text-[15px]">
            Welcome back to your Ashvita community.
            Manage your home, payments, visitors and community
            services from one place.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Home className="h-4 w-4 text-indigo-200" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-200/70">
                  Residence
                </p>
                <p className="mt-0.5 text-xs font-bold text-white">
                  {towerName} · {unitNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/10 bg-emerald-400/10 px-4 py-3">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-100">
                Verified Resident
              </span>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Maintenance Due"
          value={formatCurrency(2450)}
          subtitle="Due in 5 days"
          icon={<CreditCard className="h-5 w-5" />}
          iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
        />

        <StatCard
          title="Open Complaints"
          value="1"
          subtitle="Currently in progress"
          icon={<Wrench className="h-5 w-5" />}
          iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
        />

        <StatCard
          title="Expected Visitors"
          value="2"
          subtitle="Arriving today"
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
        />

        <StatCard
          title="Upcoming Booking"
          value="1"
          subtitle="Badminton Court"
          icon={<CalendarDays className="h-5 w-5" />}
          iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
        />

      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ===================================================
            LEFT COLUMN
        =================================================== */}

        <div className="space-y-6 xl:col-span-2">

          {/* QUICK ACTIONS */}

          <Card>

            <CardHeader className="bg-gradient-to-r from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900">

              <div className="flex w-full items-center justify-between">

                <div>
                  <CardTitle>Quick Actions</CardTitle>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Frequently used community services
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <ArrowUpRight className="h-4 w-4" />
                </div>

              </div>

            </CardHeader>

            <CardContent>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                <ActionBtn
                  href="/resident/payments"
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Pay Bill"
                  color="indigo"
                />

                <ActionBtn
                  href="/resident/complaints"
                  icon={<Wrench className="h-5 w-5" />}
                  label="Complaint"
                  color="rose"
                />

                <ActionBtn
                  href="/resident/visitors"
                  icon={<Users className="h-5 w-5" />}
                  label="Add Visitor"
                  color="sky"
                />

                <ActionBtn
                  href="/resident/amenities"
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Book Amenity"
                  color="emerald"
                />

              </div>

            </CardContent>

          </Card>


          {/* COMMUNITY NOTICES */}

          <Card>

            <CardHeader>

              <CardTitle className="flex items-center gap-3">

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Bell className="h-4 w-4" />
                </span>

                <span>
                  <span className="block">
                    Community Notices
                  </span>

                  <span className="mt-1 block text-xs font-normal text-slate-400">
                    Important updates from Ashvita management
                  </span>
                </span>

              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3">

              <NoticeCard
                type="urgent"
                title="Scheduled Water Supply Maintenance"
                description="Overhead tank cleaning and main inlet valve replacement will take place on Friday Sept 25 from 10:00 AM to 02:00 PM."
                time="Published Today"
              />

              <NoticeCard
                type="event"
                title="Dandiya & Diwali Cultural Fest"
                description="Join us at the Central Lawn on Oct 10th for evening Dandiya beats, food stalls and community celebrations!"
                time="Published 2 days ago"
              />

            </CardContent>

          </Card>


          {/* COMMUNITY SNAPSHOT */}

          <Card>

            <CardHeader>
              <div>
                <CardTitle>Community Snapshot</CardTitle>
                <p className="mt-1 text-xs text-slate-400">
                  A quick look at your community
                </p>
              </div>

              <Activity className="h-5 w-5 text-indigo-500" />
            </CardHeader>

            <CardContent>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                <Snapshot
                  icon={<Users className="h-5 w-5" />}
                  title="Residents"
                  value="1,248"
                  subtitle="Community members"
                  color="indigo"
                />

                <Snapshot
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Security"
                  value="24/7"
                  subtitle="Active protection"
                  color="emerald"
                />

                <Snapshot
                  icon={<Sparkles className="h-5 w-5" />}
                  title="Amenities"
                  value="18"
                  subtitle="Available facilities"
                  color="amber"
                />

              </div>

            </CardContent>

          </Card>

        </div>


        {/* ===================================================
            RIGHT COLUMN
        =================================================== */}

        <div className="space-y-6">

          {/* TODAY'S VISITORS */}

          <Card>

            <CardHeader className="pb-3">

              <div className="flex w-full items-center justify-between">

                <div>
                  <CardTitle>Today's Visitors</CardTitle>

                  <p className="mt-1 text-xs text-slate-400">
                    Expected at your residence
                  </p>
                </div>

                <Link
                  href="/resident/visitors"
                  className="text-[11px] font-bold text-indigo-600 transition hover:text-indigo-700"
                >
                  View All
                </Link>

              </div>

            </CardHeader>

            <CardContent className="pt-2">

              <div className="group rounded-2xl border border-indigo-100/70 bg-gradient-to-br from-slate-50 via-white to-indigo-50/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white shadow-lg shadow-indigo-200/60 dark:shadow-none">
                    AS
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-bold text-slate-900 dark:text-white">
                      Amit Sharma
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Clock3 className="h-3.5 w-3.5" />
                      Expected at 6:30 PM
                    </div>

                  </div>

                  <span className="rounded-lg bg-amber-100 px-2 py-1 text-[9px] font-black tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    EXPECTED
                  </span>

                </div>

              </div>

            </CardContent>

          </Card>


          {/* UPCOMING BOOKING */}

          <Card>

            <CardHeader>
              <CardTitle>Upcoming Booking</CardTitle>
            </CardHeader>

            <CardContent>

              <div className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-200/60 dark:shadow-none">

                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      Sep
                    </span>

                    <span className="text-xl font-black leading-none">
                      25
                    </span>

                  </div>

                  <div className="min-w-0 flex-1">

                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Badminton Court
                    </h4>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      07:00 AM - 08:00 AM
                    </p>

                    <span className="mt-2 inline-flex rounded-md bg-emerald-100 px-2 py-1 text-[9px] font-black text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      CONFIRMED
                    </span>

                  </div>

                  <ChevronRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* RESIDENT STATUS */}

          <div className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 text-white shadow-xl">

            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Resident Status
                  </p>

                  <h3 className="mt-1 text-lg font-black">
                    Everything looks good
                  </h3>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400" />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>Community services</span>
                <span>92% active</span>
              </div>

            </div>

          </div>


          {/* MINI PAYMENT CARD */}

          <div className="rounded-[1.5rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-900/40 dark:from-amber-950/30 dark:to-orange-950/20">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
                <Wallet className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Pending Payment
                </p>

                <p className="mt-0.5 text-xl font-black text-slate-900 dark:text-white">
                  {formatCurrency(2450)}
                </p>
              </div>

            </div>

            <Link
              href="/resident/payments"
              className="mt-4 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-white dark:bg-slate-900/50 dark:text-amber-300"
            >
              Pay maintenance
              <ChevronRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   QUICK ACTION BUTTON
   ========================================================= */

function ActionBtn({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: "indigo" | "emerald" | "rose" | "sky";
}) {
  const colors = {
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50",

    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",

    rose:
      "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50",

    sky:
      "bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50",
  };

  return (
    <Link
      href={href}
      className={`group flex min-h-[104px] flex-col items-center justify-center rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${colors[color]}`}
    >
      <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <span className="text-xs font-bold">
        {label}
      </span>
    </Link>
  );
}


/* =========================================================
   NOTICE CARD
   ========================================================= */

function NoticeCard({
  type,
  title,
  description,
  time,
}: {
  type: "urgent" | "event";
  title: string;
  description: string;
  time: string;
}) {
  const urgent = type === "urgent";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 ${urgent
          ? "border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/20"
          : "border-indigo-100/80 bg-gradient-to-r from-indigo-50 to-purple-50 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-purple-950/20"
        }`}
    >

      <div
        className={`absolute left-0 top-0 h-full w-1 ${urgent ? "bg-amber-500" : "bg-indigo-500"
          }`}
      />

      <div className="pl-2">

        <div className="flex items-start gap-3">

          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${urgent
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400"
              }`}
          >
            {urgent ? "!" : "★"}
          </div>

          <div className="min-w-0">

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h4>

            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
              {description}
            </p>

            <p className="mt-2 text-[10px] font-semibold text-slate-400">
              {time}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   COMMUNITY SNAPSHOT
   ========================================================= */

function Snapshot({
  icon,
  title,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: "indigo" | "emerald" | "amber";
}) {
  const styles = {
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",

    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",

    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">

      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${styles[color]}`}
      >
        {icon}
      </div>

      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}


/* =========================================================
   BUILDING ICON
   ========================================================= */

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}