"use client";

import React, { useState } from "react";
import { Users, Plus, QrCode, Car, Phone } from "lucide-react";
import { Card, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const visitors = [
  { id: "VP-849201", name: "Amit Sharma", phone: "+91 99887 66554", vehicle: "TS 09 EQ 4821", purpose: "Family Dinner", type: "GUEST", expected: "6:30 PM Today", status: "EXPECTED" },
  { id: "VP-102938", name: "Amazon Delivery Agent", phone: "+91 94444 33333", vehicle: "—", purpose: "Parcel Delivery", type: "DELIVERY", expected: "2:00 PM Today", status: "CHECKED_IN" },
  { id: "VP-738291", name: "Lakshmi (Maid)", phone: "+91 95555 11111", vehicle: "—", purpose: "Domestic Help", type: "DOMESTIC_HELP", expected: "7:00 AM Daily", status: "CHECKED_OUT" },
];

const visitorTypes = [
  { label: "Guest", value: "GUEST" },
  { label: "Delivery", value: "DELIVERY" },
  { label: "Cab / Ride", value: "CAB" },
  { label: "Domestic Help", value: "DOMESTIC_HELP" },
  { label: "Service Provider", value: "SERVICE_PROVIDER" },
  { label: "Other", value: "OTHER" },
];

export default function VisitorsPage() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [passOpen, setPassOpen] = useState<string | null>(null);

  const statusBadge = (s: string) => {
    const map: Record<string, { variant: "warning" | "success" | "neutral" | "info" | "danger"; label: string }> = {
      EXPECTED: { variant: "warning", label: "Expected" },
      CHECKED_IN: { variant: "info", label: "Inside" },
      CHECKED_OUT: { variant: "success", label: "Left" },
      REJECTED: { variant: "danger", label: "Rejected" },
    };
    const sv = map[s] || { variant: "neutral" as const, label: s };
    return <Badge variant={sv.variant} dot>{sv.label}</Badge>;
  };

  const selected = visitors.find((v) => v.id === passOpen);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Visitors</h2>
          <p className="text-sm text-slate-500 mt-1">Pre-register visitors and generate digital passes.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>Add Visitor</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Expected Today" value="1" icon={<Users className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard title="Currently Inside" value="1" icon={<Users className="w-6 h-6" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" />
        <StatCard title="Total This Week" value="3" icon={<Users className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
      </div>

      <div className="space-y-4">
        {visitors.map((v) => (
          <Card key={v.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm shrink-0">
                  {v.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{v.name}</span>
                    {statusBadge(v.status)}
                    <Badge variant="neutral" size="sm">{v.type.replace("_", " ")}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{v.phone}</span>
                    {v.vehicle !== "—" && <span className="flex items-center gap-1"><Car className="w-3 h-3" />{v.vehicle}</span>}
                    <span>Expected: {v.expected}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={() => setPassOpen(v.id)}>
                  <QrCode className="w-4 h-4 mr-1" /> View Pass
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Visitor Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Pre-Register Visitor" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); toast("Visitor Added", "Digital pass generated successfully.", "success"); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Visitor Name" placeholder="Full name" required />
            <Input label="Phone Number" placeholder="+91 XXXXX XXXXX" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Visitor Type" options={visitorTypes} required />
            <Input label="Vehicle Number" placeholder="TS XX XX XXXX (optional)" />
          </div>
          <Input label="Purpose of Visit" placeholder="e.g. Family dinner, Delivery" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Expected Date" type="date" required />
            <Input label="Expected Time" type="time" required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit">Generate Pass</Button>
          </div>
        </form>
      </Modal>

      {/* Visitor Pass Modal */}
      <Modal isOpen={!!passOpen} onClose={() => setPassOpen(null)} title="Digital Visitor Pass">
        {selected && (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">ASHVITA VISITOR PASS</p>
              <div className="w-32 h-32 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                <QrCode className="w-16 h-16 text-white/80" />
              </div>
              <p className="text-lg font-bold">{selected.name}</p>
              <p className="text-xs text-indigo-200 mt-1 font-mono">{selected.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-left">
              <div><p className="text-xs text-slate-500 uppercase font-semibold">Resident</p><p className="font-medium text-slate-900 dark:text-slate-100">Rahul Verma</p></div>
              <div><p className="text-xs text-slate-500 uppercase font-semibold">Apartment</p><p className="font-medium text-slate-900 dark:text-slate-100">Tower A • A-1204</p></div>
              <div><p className="text-xs text-slate-500 uppercase font-semibold">Purpose</p><p className="font-medium text-slate-900 dark:text-slate-100">{selected.purpose}</p></div>
              <div><p className="text-xs text-slate-500 uppercase font-semibold">Expected</p><p className="font-medium text-slate-900 dark:text-slate-100">{selected.expected}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
