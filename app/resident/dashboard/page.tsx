"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Wrench, Users, Calendar, ArrowRight, Bell } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
    <div className="space-y-6">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-emerald-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BuildingIcon className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-2">Good Morning, {firstName} 👋</h2>
          <p className="text-indigo-100 text-lg mb-6">Welcome back to Ashvita. Here is what is happening in your community today.</p>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium border border-white/10">
            <span>{towerName}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <span>Apartment {unitNumber}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Maintenance Due"
          value={formatCurrency(2450)}
          subtitle="Due in 5 days"
          icon={<CreditCard className="w-6 h-6" />}
          iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
        />
        <StatCard
          title="Open Complaints"
          value="1"
          subtitle="In Progress"
          icon={<Wrench className="w-6 h-6" />}
          iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400"
        />
        <StatCard
          title="Expected Visitors"
          value="2"
          subtitle="Today"
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-400"
        />
        <StatCard
          title="Upcoming Bookings"
          value="1"
          subtitle="Badminton Court"
          icon={<Calendar className="w-6 h-6" />}
          iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Actions & Notices */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ActionBtn icon={<CreditCard className="w-5 h-5" />} label="Pay Bill" color="indigo" />
                <ActionBtn icon={<Wrench className="w-5 h-5" />} label="Complaint" color="rose" />
                <ActionBtn icon={<Users className="w-5 h-5" />} label="Add Visitor" color="sky" />
                <ActionBtn icon={<Calendar className="w-5 h-5" />} label="Book Amenity" color="emerald" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" /> Community Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">🚨 URGENT: Scheduled Water Supply Maintenance</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Overhead tank cleaning and main inlet valve replacement will take place on Friday Sept 25 from 10:00 AM to 02:00 PM.</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Published Today</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">🎉 Dandiya & Diwali Cultural Fest</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Join us at the Central Lawn on Oct 10th for evening Dandiya beats, food stalls, and community celebrations!</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Published 2 days ago</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity & Visitors */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b-0">
              <div className="flex items-center justify-between">
                <CardTitle>Today's Visitors</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm shrink-0">
                  AS
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Amit Sharma</p>
                  <p className="text-xs text-slate-500">Expected at 6:30 PM</p>
                </div>
                <div className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-[10px] font-bold rounded-md">
                  EXPECTED
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3 border-b-0">
              <CardTitle>Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
               <div className="flex gap-4 items-start p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex flex-col items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400">
                    <span className="text-xs font-bold uppercase">Sep</span>
                    <span className="text-lg font-black leading-none mt-0.5">25</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Badminton Court</h4>
                    <p className="text-xs text-slate-500 mt-1">07:00 AM - 08:00 AM</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function ActionBtn({ icon, label, color }: { icon: React.ReactNode, label: string, color: 'indigo' | 'emerald' | 'rose' | 'sky' }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50 dark:hover:bg-indigo-900/50",
    emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 dark:hover:bg-emerald-900/50",
    rose: "bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 dark:hover:bg-rose-900/50",
    sky: "bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-100 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/50 dark:hover:bg-sky-900/50",
  };
  
  return (
    <button className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 shadow-sm ${colors[color]}`}>
      <div className="mb-2">{icon}</div>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
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
