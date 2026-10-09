"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Building2,
  Home,
  CreditCard,
  MessageSquare,
  Users,
  CalendarDays,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getResidentProfile } from "@/app/actions/user";
import { logoutAction } from "@/app/actions/auth";
import { PusherListener } from "@/components/PusherListener";

const navItems = [
  {
    name: "Dashboard",
    href: "/resident/dashboard",
    icon: Home,
  },
  {
    name: "Payments",
    href: "/resident/payments",
    icon: CreditCard,
  },
  {
    name: "Complaints",
    href: "/resident/complaints",
    icon: MessageSquare,
  },
  {
    name: "Visitors",
    href: "/resident/visitors",
    icon: Users,
  },
  {
    name: "Amenities",
    href: "/resident/amenities",
    icon: CalendarDays,
  },
];

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getResidentProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const name = profile?.user?.name || "Resident Name";
  const towerName = profile?.unit?.tower?.name || "Tower";
  const unitNumber = profile?.unit?.unitNumber || "Unit";

  const currentPage =
    navItems.find((item) => pathname.startsWith(item.href))?.name ||
    "Dashboard";

  const initials = name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900 dark:bg-slate-950 dark:text-white">
      <PusherListener />

      {/* ================= MOBILE HEADER ================= */}

      <div className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 md:hidden">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-black tracking-wide text-slate-900 dark:text-white">
              ASHVITA
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Resident Portal
            </p>
          </div>

        </div>

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

      </div>

      {/* ================= MOBILE OVERLAY ================= */}

      {isSidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-hidden border-r border-slate-800 bg-[#0b1020] text-white shadow-2xl transition-transform duration-300 ease-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Logo */}
        <div className="relative flex h-[86px] items-center border-b border-white/[0.07] px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-700 shadow-lg shadow-indigo-950/50">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[17px] font-black tracking-[0.08em]">
                ASHVITA
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-400">
                  Resident Portal
                </p>
              </div>
            </div>

          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white md:hidden"
          >
            <X className="h-4 w-4" />
          </button>

        </div>

        {/* Resident mini profile */}
        <div className="relative mx-4 mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.045] p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-black shadow-lg">
              {initials || "R"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {name}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                {towerName} • {unitNumber}
              </p>
            </div>

          </div>

          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-400/10 px-2.5 py-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />

            <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
              Verified Resident
            </span>
          </div>

        </div>

        {/* Navigation */}
        <div className="relative flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Community
          </p>

          <nav className="space-y-1.5">

            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/20 to-violet-500/10 text-white shadow-inner"
                      : "text-slate-400 hover:bg-white/[0.045] hover:text-white"
                  )}
                >

                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r-full bg-gradient-to-b from-indigo-400 to-violet-400" />
                  )}

                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/50"
                        : "bg-white/[0.04] text-slate-500 group-hover:bg-white/[0.08] group-hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </span>

                  <span className="flex-1">
                    {item.name}
                  </span>

                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-indigo-300" />
                  )}

                </Link>
              );
            })}

          </nav>

          {/* Premium community card */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-emerald-500/5 p-4">

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                <Sparkles className="h-4 w-4" />
              </div>

              <p className="text-xs font-bold text-white">
                Ashvita Community
              </p>
            </div>

            <p className="mt-3 text-[10px] leading-4 text-slate-400">
              Your home, services and community — beautifully connected.
            </p>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400" />
            </div>

            <p className="mt-1.5 text-[9px] text-slate-500">
              Community services active
            </p>

          </div>

        </div>

        {/* Logout */}
        <div className="relative border-t border-white/[0.07] p-4">

          <form action={logoutAction}>

            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <LogOut className="mr-2.5 h-4 w-4" />
              Sign Out
            </Button>

          </form>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="flex min-h-screen flex-col md:ml-[280px]">

        {/* Desktop top bar */}
        <header className="sticky top-0 z-30 hidden h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/85 px-8 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 md:flex">

          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {currentPage}
              </h1>

              <span className="rounded-full bg-indigo-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                Resident
              </span>

            </div>

            <p className="mt-1 text-xs text-slate-400">
              Welcome back, {name.split(" ")[0]}
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Community status */}
            <div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 lg:flex dark:border-emerald-900/40 dark:bg-emerald-950/20">

              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-300" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Community Active
              </span>

            </div>

            {/* Notification */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-indigo-950/30">

              <Bell className="h-[18px] w-[18px]" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500 dark:border-slate-900" />

            </button>

            {/* User */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-black text-white">
                {initials || "R"}
              </div>

              <div className="hidden min-w-0 lg:block">
                <p className="max-w-[120px] truncate text-xs font-bold text-slate-800 dark:text-white">
                  {name}
                </p>

                <p className="text-[9px] text-slate-400">
                  {unitNumber}
                </p>
              </div>

            </div>

          </div>
        </header>

        {/* Page content */}
        <div className="w-full flex-1 px-4 py-5 sm:px-6 md:px-8 md:py-7">

          <div className="mx-auto w-full max-w-[1500px]">
            {children}
          </div>

        </div>

      </main>

    </div>
  );
}