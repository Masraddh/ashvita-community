"use client";

import React, { useState } from "react";
import { Users, Plus, Mail, Phone, Building, Home, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  tower: string;
  floor: number;
  type: string;
  moveIn: string;
  status: string;
}

const residents: Resident[] = [
  { id: "R-001", name: "Rahul Verma", email: "rahul@email.com", phone: "+91 98123 45678", unit: "A-1204", tower: "Tower A", floor: 12, type: "OWNER", moveIn: "15 Jan 2024", status: "ACTIVE" },
  { id: "R-002", name: "Priya Sundaram", email: "priya@email.com", phone: "+91 97777 88888", unit: "B-802", tower: "Tower B", floor: 8, type: "TENANT", moveIn: "01 Mar 2024", status: "ACTIVE" },
  { id: "R-003", name: "Arjun Mehta", email: "arjun@email.com", phone: "+91 96666 55555", unit: "C-301", tower: "Tower C", floor: 3, type: "OWNER", moveIn: "10 Jun 2023", status: "ACTIVE" },
  { id: "R-004", name: "Sneha Reddy", email: "sneha@email.com", phone: "+91 95555 44444", unit: "A-601", tower: "Tower A", floor: 6, type: "TENANT", moveIn: "20 Feb 2025", status: "ACTIVE" },
  { id: "R-005", name: "Vikash Patel", email: "vikash@email.com", phone: "+91 94444 33333", unit: "D-1502", tower: "Tower D", floor: 15, type: "OWNER", moveIn: "05 Sep 2023", status: "ACTIVE" },
  { id: "R-006", name: "Ananya Iyer", email: "ananya@email.com", phone: "+91 93333 22222", unit: "B-401", tower: "Tower B", floor: 4, type: "OWNER", moveIn: "12 Dec 2023", status: "ACTIVE" },
  { id: "R-007", name: "Karthik Nair", email: "karthik@email.com", phone: "+91 92222 11111", unit: "E-903", tower: "Tower E", floor: 9, type: "TENANT", moveIn: "01 Jul 2025", status: "ACTIVE" },
  { id: "R-008", name: "Deepika Sharma", email: "deepika@email.com", phone: "+91 91111 00000", unit: "C-704", tower: "Tower C", floor: 7, type: "OWNER", moveIn: "15 Apr 2024", status: "INACTIVE" },
];

const towerOptions = [
  { label: "Select Tower", value: "" },
  { label: "Tower A", value: "Tower A" },
  { label: "Tower B", value: "Tower B" },
  { label: "Tower C", value: "Tower C" },
  { label: "Tower D", value: "Tower D" },
  { label: "Tower E", value: "Tower E" },
];

const typeOptions = [
  { label: "Owner", value: "OWNER" },
  { label: "Tenant", value: "TENANT" },
];

export default function AdminResidentsPage() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  const selected = residents.find((r) => r.id === detailOpen);

  const columns: Column<Resident>[] = [
    {
      header: "Resident",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs shrink-0">
            {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{row.name}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Unit",
      accessorKey: "unit",
      cell: (row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">{row.unit}</p>
          <p className="text-xs text-slate-500">{row.tower} • Floor {row.floor}</p>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => (
        <Badge variant={row.type === "OWNER" ? "primary" : "info"} size="sm">{row.type}</Badge>
      ),
    },
    {
      header: "Move-in",
      accessorKey: "moveIn",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <Badge variant={row.status === "ACTIVE" ? "success" : "neutral"} dot>{row.status === "ACTIVE" ? "Active" : "Inactive"}</Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setDetailOpen(row.id)}>View</Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Residents</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all registered residents across towers.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>Add Resident</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Residents" value="1,248" trend={{ value: "2%", isPositive: true }} icon={<Users className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
        <StatCard title="Owners" value="842" icon={<Home className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Tenants" value="406" icon={<UserCheck className="w-6 h-6" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" />
        <StatCard title="Active" value="1,240" subtitle="8 Inactive" icon={<Users className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
      </div>

      <DataTable columns={columns} data={residents} searchKey="name" searchPlaceholder="Search by resident name..." pageSize={7} />

      {/* Add Resident Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Register New Resident" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); toast("Resident Added", "New resident registered successfully.", "success"); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter full name" required />
            <Input label="Email Address" type="email" placeholder="name@example.com" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone Number" placeholder="+91 XXXXX XXXXX" required />
            <Select label="Resident Type" options={typeOptions} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Tower" options={towerOptions} required />
            <Input label="Unit Number" placeholder="e.g. A-1204" required />
          </div>
          <Input label="Emergency Contact" placeholder="+91 XXXXX XXXXX" />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit">Register Resident</Button>
          </div>
        </form>
      </Modal>

      {/* Resident Detail Modal */}
      <Modal isOpen={!!detailOpen} onClose={() => setDetailOpen(null)} title="Resident Details" size="lg">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xl">
                {selected.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                <p className="text-sm text-slate-500">{selected.id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Email</span><span className="flex items-center gap-1.5 mt-1"><Mail className="w-3.5 h-3.5 text-slate-400" />{selected.email}</span></div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Phone</span><span className="flex items-center gap-1.5 mt-1"><Phone className="w-3.5 h-3.5 text-slate-400" />{selected.phone}</span></div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Unit</span><span className="flex items-center gap-1.5 mt-1"><Building className="w-3.5 h-3.5 text-slate-400" />{selected.unit} • {selected.tower}</span></div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Floor</span>{selected.floor}</div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Type</span><Badge variant={selected.type === "OWNER" ? "primary" : "info"} className="mt-1">{selected.type}</Badge></div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Status</span><Badge variant={selected.status === "ACTIVE" ? "success" : "neutral"} dot className="mt-1">{selected.status}</Badge></div>
              <div><span className="text-xs text-slate-500 uppercase font-semibold block">Move-in Date</span>{selected.moveIn}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
