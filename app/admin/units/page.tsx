"use client";

import React, { useState } from "react";
import { Building, Plus, Home, Wrench, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { DataTable, Column } from "@/components/ui/DataTable";
import { useToast } from "@/components/ui/Toast";

interface UnitRow {
  id: string;
  unitNumber: string;
  tower: string;
  floor: number;
  status: string;
  residentName: string;
  residentType: string;
  phone: string;
}

const units: UnitRow[] = [
  { id: "1", unitNumber: "A-1204", tower: "Tower A", floor: 12, status: "OCCUPIED", residentName: "Rahul Verma", residentType: "OWNER", phone: "+91 98123 45678" },
  { id: "2", unitNumber: "B-802", tower: "Tower B", floor: 8, status: "OCCUPIED", residentName: "Priya Sundaram", residentType: "TENANT", phone: "+91 97777 88888" },
  { id: "3", unitNumber: "C-301", tower: "Tower C", floor: 3, status: "OCCUPIED", residentName: "Arjun Mehta", residentType: "OWNER", phone: "+91 96666 55555" },
  { id: "4", unitNumber: "D-105", tower: "Tower D", floor: 1, status: "VACANT", residentName: "—", residentType: "—", phone: "—" },
  { id: "5", unitNumber: "A-601", tower: "Tower A", floor: 6, status: "OCCUPIED", residentName: "Sneha Reddy", residentType: "TENANT", phone: "+91 95555 44444" },
  { id: "6", unitNumber: "D-1502", tower: "Tower D", floor: 15, status: "OCCUPIED", residentName: "Vikash Patel", residentType: "OWNER", phone: "+91 94444 33333" },
  { id: "7", unitNumber: "B-401", tower: "Tower B", floor: 4, status: "OCCUPIED", residentName: "Ananya Iyer", residentType: "OWNER", phone: "+91 93333 22222" },
  { id: "8", unitNumber: "E-903", tower: "Tower E", floor: 9, status: "OCCUPIED", residentName: "Karthik Nair", residentType: "TENANT", phone: "+91 92222 11111" },
  { id: "9", unitNumber: "C-704", tower: "Tower C", floor: 7, status: "MAINTENANCE", residentName: "Deepika Sharma", residentType: "OWNER", phone: "+91 91111 00000" },
  { id: "10", unitNumber: "E-202", tower: "Tower E", floor: 2, status: "VACANT", residentName: "—", residentType: "—", phone: "—" },
];

const statusBadge = (s: string) => {
  const map: Record<string, { variant: "success" | "warning" | "danger" | "neutral"; label: string }> = {
    OCCUPIED: { variant: "success", label: "Occupied" },
    VACANT: { variant: "warning", label: "Vacant" },
    MAINTENANCE: { variant: "danger", label: "Maintenance" },
  };
  const sv = map[s] || { variant: "neutral" as const, label: s };
  return <Badge variant={sv.variant} dot>{sv.label}</Badge>;
};

export default function AdminUnitsPage() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);

  const columns: Column<UnitRow>[] = [
    {
      header: "Unit",
      accessorKey: "unitNumber",
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{row.unitNumber}</p>
          <p className="text-xs text-slate-500">{row.tower} • Floor {row.floor}</p>
        </div>
      ),
    },
    { header: "Tower", accessorKey: "tower" },
    { header: "Floor", accessorKey: "floor" },
    { header: "Status", accessorKey: "status", cell: (row) => statusBadge(row.status) },
    {
      header: "Resident",
      accessorKey: "residentName",
      cell: (row) => (
        <div>
          <p className="text-sm text-slate-900 dark:text-slate-100">{row.residentName}</p>
          {row.residentType !== "—" && <p className="text-xs text-slate-500">{row.residentType}</p>}
        </div>
      ),
    },
    { header: "Phone", accessorKey: "phone" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Units</h2>
          <p className="text-sm text-slate-500 mt-1">Overview of all apartments across towers.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>Add Unit</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Units" value="300" icon={<Building className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
        <StatCard title="Occupied" value="282" subtitle="94%" icon={<Home className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Vacant" value="14" icon={<CheckCircle2 className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
        <StatCard title="Maintenance" value="4" icon={<Wrench className="w-6 h-6" />} iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" />
      </div>

      <DataTable columns={columns} data={units} searchKey="unitNumber" searchPlaceholder="Search by unit number..." pageSize={8} />

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Unit" size="md">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); toast("Unit Added", "New unit registered successfully.", "success"); }}>
          <Select label="Tower" options={[{ label: "Select Tower", value: "" }, { label: "Tower A", value: "A" }, { label: "Tower B", value: "B" }, { label: "Tower C", value: "C" }, { label: "Tower D", value: "D" }, { label: "Tower E", value: "E" }]} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Unit Number" placeholder="e.g. A-1204" required />
            <Input label="Floor" type="number" placeholder="e.g. 12" required />
          </div>
          <Select label="Status" options={[{ label: "Occupied", value: "OCCUPIED" }, { label: "Vacant", value: "VACANT" }, { label: "Maintenance", value: "MAINTENANCE" }]} />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit">Add Unit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
