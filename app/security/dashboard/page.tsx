"use client";

import React, { useState } from "react";
import { ShieldCheck, UserCheck, UserMinus, Clock, Search, CheckCircle2, XCircle, Phone, Car, Building } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const expectedVisitors = [
  { id: "VP-849201", name: "Amit Sharma", resident: "Rahul Verma", apt: "A-1204", phone: "+91 99887 66554", vehicle: "TS 09 EQ 4821", purpose: "Family Dinner", expected: "6:30 PM", type: "GUEST" },
  { id: "VP-554312", name: "Swiggy Delivery", resident: "Priya Sundaram", apt: "B-802", phone: "+91 93333 44444", vehicle: "—", purpose: "Food Delivery", expected: "7:15 PM", type: "DELIVERY" },
];

const insideVisitors = [
  { id: "VP-102938", name: "Amazon Delivery Agent", resident: "Rahul Verma", apt: "A-1204", checkIn: "2:05 PM", purpose: "Parcel Delivery" },
];

export default function SecurityDashboard() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const handleCheckIn = (name: string) => {
    toast("Visitor Checked In", `${name} has been checked in successfully.`, "success");
  };

  const handleCheckOut = (name: string) => {
    toast("Visitor Checked Out", `${name} has been checked out.`, "info");
  };

  const handleReject = (name: string) => {
    toast("Visitor Rejected", `${name} entry has been rejected.`, "warning");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Operations</h2>
          <p className="text-sm text-slate-400 mt-1">Real-time visitor management and gate control.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-emerald-900/50 text-emerald-400 rounded-full border border-emerald-800/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Gate 1 — Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Expected Today" value="2" icon={<Clock className="w-6 h-6" />} iconBgColor="bg-amber-900/50 text-amber-400" className="bg-slate-900 border-slate-800" />
        <StatCard title="Currently Inside" value="1" icon={<UserCheck className="w-6 h-6" />} iconBgColor="bg-emerald-900/50 text-emerald-400" className="bg-slate-900 border-slate-800" />
        <StatCard title="Checked Out" value="5" icon={<UserMinus className="w-6 h-6" />} iconBgColor="bg-sky-900/50 text-sky-400" className="bg-slate-900 border-slate-800" />
        <StatCard title="Rejected" value="0" icon={<XCircle className="w-6 h-6" />} iconBgColor="bg-rose-900/50 text-rose-400" className="bg-slate-900 border-slate-800" />
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input placeholder="Search by name, phone, vehicle, or pass ID..." icon={<Search className="w-4 h-4" />} value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500" />
      </div>

      {/* Expected Visitors */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Expected Visitors ({expectedVisitors.length})
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {expectedVisitors.map((v) => (
            <Card key={v.id} className="bg-slate-900 border-slate-800">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-base font-bold text-white">{v.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{v.id}</p>
                  </div>
                  <Badge variant="warning" dot>{v.type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-slate-500 uppercase font-semibold">Resident</p><p className="text-slate-200">{v.resident}</p></div>
                  <div><p className="text-slate-500 uppercase font-semibold">Apartment</p><p className="text-slate-200 flex items-center gap-1"><Building className="w-3 h-3" />{v.apt}</p></div>
                  <div><p className="text-slate-500 uppercase font-semibold">Phone</p><p className="text-slate-200 flex items-center gap-1"><Phone className="w-3 h-3" />{v.phone}</p></div>
                  <div><p className="text-slate-500 uppercase font-semibold">Vehicle</p><p className="text-slate-200 flex items-center gap-1"><Car className="w-3 h-3" />{v.vehicle}</p></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="success" size="sm" className="flex-1" onClick={() => handleCheckIn(v.name)}>
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Check In
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleReject(v.name)}>
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Currently Inside */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
          <UserCheck className="w-4 h-4" /> Currently Inside ({insideVisitors.length})
        </h3>
        <div className="space-y-3">
          {insideVisitors.map((v) => (
            <Card key={v.id} className="bg-slate-900 border-slate-800">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{v.name}</p>
                    <Badge variant="info" dot size="sm">Inside</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{v.apt} • {v.resident} • Checked in at {v.checkIn}</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800" onClick={() => handleCheckOut(v.name)}>
                  <UserMinus className="w-4 h-4 mr-1" /> Check Out
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
