"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Home, Users, FileText, User, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navItems = [
  { name: "Dashboard", href: "/security/dashboard", icon: Home },
  { name: "Visitors", href: "/security/visitors", icon: Users },
  { name: "Logs", href: "/security/logs", icon: FileText },
];

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-white">
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-bold tracking-tight">SECURITY OPS</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 -mr-2 text-slate-300">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0 md:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">SECURITY</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-emerald-700">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Suresh Kumar</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">SEC-1092 • Morning</p>
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
        <div className="flex-1 p-4 md:p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
