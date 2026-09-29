"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building, Home, CreditCard, MessageSquare, Users, Calendar, Bell, Menu, X, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getResidentProfile } from "@/app/actions/user";
import { logoutAction } from "@/app/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/resident/dashboard", icon: Home },
  { name: "Payments", href: "/resident/payments", icon: CreditCard },
  { name: "Complaints", href: "/resident/complaints", icon: MessageSquare },
  { name: "Visitors", href: "/resident/visitors", icon: Users },
  { name: "Amenities", href: "/resident/amenities", icon: Calendar },
];

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getResidentProfile().then((data) => {
      if (data) setProfile(data);
    });
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const name = profile?.user?.name || "Resident Name";
  const towerName = profile?.unit?.tower?.name || "Tower";
  const unitNumber = profile?.unit?.unitNumber || "Unit";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
          <Building className="w-6 h-6" />
          <span className="font-bold tracking-tight">ASHVITA</span>
        </div>
        <button onClick={toggleSidebar} className="p-2 -mr-2 text-slate-600 dark:text-slate-300">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out flex flex-col md:translate-x-0 md:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden md:flex items-center gap-2 text-indigo-700 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800">
          <Building className="w-7 h-7" />
          <span className="text-xl font-bold tracking-tight">ASHVITA</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4 md:mt-0">Main Menu</p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{name}</p>
              <p className="text-xs text-slate-500 truncate">{towerName} • {unitNumber}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-rose-600">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="hidden md:flex h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {navItems.find((i) => pathname.startsWith(i.href))?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
