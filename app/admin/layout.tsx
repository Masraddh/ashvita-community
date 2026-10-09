"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building, LayoutDashboard, Users, UserCog, CreditCard, MessageSquare, Shield, Calendar, Bell, Menu, X, LogOut, FileText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { name: "Command Center", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Residents", href: "/admin/residents", icon: Users },
  { name: "Units", href: "/admin/units", icon: Building },
  { name: "Financials", href: "/admin/payments", icon: CreditCard },
  { name: "Complaints", href: "/admin/complaints", icon: MessageSquare },
  { name: "Security & Visitors", href: "/admin/visitors", icon: Shield },
  { name: "Amenities", href: "/admin/amenities", icon: Calendar },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b0f19] flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Building className="w-6 h-6 text-indigo-400" />
          <span className="font-bold tracking-tight">ASHVITA ADMIN</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 -mr-2">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0 md:static text-slate-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/20">
            <Building className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ASHVITA</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 mt-4 md:mt-0">Management</p>
          {navItems.map((item) => {
            const isActive = (pathname || "").startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 mb-4 px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <UserCog className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Vikram Sharma</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Facility Mgr</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-rose-400 hover:bg-slate-800/50">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="hidden md:flex h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 items-center justify-between px-8 sticky top-0 z-20 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {navItems.find((i) => pathname.startsWith(i.href))?.name || "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
