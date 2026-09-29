"use client";

import React, { useState } from "react";
import { UserCheck, Shield, Plus, Phone, CheckCircle2, XCircle, Search, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface Visitor {
  id: string;
  name: string;
  phone: string;
  unitNumber: string;
  residentName: string;
  type: "Guest" | "Delivery" | "Cab" | "Service";
  passCode: string;
  status: "Checked In" | "Pre-Approved" | "Checked Out" | "Denied";
  timeIn?: string;
}

const mockSecurityVisitors: Visitor[] = [
  {
    id: "V-101",
    name: "Ramesh Kumar",
    phone: "+91 98765 11111",
    unitNumber: "A-302",
    residentName: "Priya Sharma",
    type: "Delivery",
    passCode: "PASS-4921",
    status: "Checked In",
    timeIn: "10:30 AM",
  },
  {
    id: "V-102",
    name: "Swiggy Delivery (Anil)",
    phone: "+91 98765 22222",
    unitNumber: "B-104",
    residentName: "Rahul Verma",
    type: "Delivery",
    passCode: "PASS-8812",
    status: "Pre-Approved",
  },
  {
    id: "V-103",
    name: "Sunil Electrician",
    phone: "+91 98765 33333",
    unitNumber: "A-101",
    residentName: "Vikram Mehta",
    type: "Service",
    passCode: "PASS-3310",
    status: "Checked In",
    timeIn: "09:15 AM",
  },
];

export default function SecurityVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>(mockSecurityVisitors);
  const [searchCode, setSearchCode] = useState("");
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    name: "",
    phone: "",
    unitNumber: "",
    type: "Guest" as Visitor["type"],
  });

  const handleCheckInNew = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Visitor = {
      id: `V-${Date.now().toString().slice(-3)}`,
      name: newVisitor.name,
      phone: newVisitor.phone,
      unitNumber: newVisitor.unitNumber,
      residentName: "Gate Manual Entry",
      type: newVisitor.type,
      passCode: `GATE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Checked In",
      timeIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setVisitors([created, ...visitors]);
    setIsNewOpen(false);
    setNewVisitor({ name: "", phone: "", unitNumber: "", type: "Guest" });
  };

  const handleVerifyPass = (e: React.FormEvent) => {
    e.preventDefault();
    const found = visitors.find((v) => v.passCode.toLowerCase() === searchCode.trim().toLowerCase());
    if (found) {
      setVisitors(visitors.map((v) => (v.id === found.id ? { ...v, status: "Checked In", timeIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } : v)));
      setSearchCode("");
      alert(`Pass Verified! Visitor ${found.name} marked as Checked In.`);
    } else {
      alert("Invalid or expired Entry Passcode.");
    }
  };

  const handleCheckOut = (id: string) => {
    setVisitors(visitors.map((v) => (v.id === id ? { ...v, status: "Checked Out" } : v)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gate Access Control</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Verify passcode entry or register walk-in visitors.</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Walk-In Check-In
        </Button>
      </div>

      {/* Pass Code Quick Verification Bar */}
      <Card className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
        <h3 className="text-lg font-semibold mb-2">Verify Pre-Approved Pass</h3>
        <p className="text-xs text-slate-300 mb-4">Enter 4-digit numeric code or passcode provided by visitor:</p>
        <form onSubmit={handleVerifyPass} className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="e.g. PASS-4921"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-slate-900 font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Button type="submit" variant="primary" className="bg-indigo-600 hover:bg-indigo-500 text-white">
            Verify Pass
          </Button>
        </form>
      </Card>

      {/* Visitor List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Today's Visitors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitors.map((visitor) => (
            <Card key={visitor.id} className="p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={visitor.status === "Checked In" ? "success" : visitor.status === "Pre-Approved" ? "info" : "neutral"}>
                    {visitor.status}
                  </Badge>
                  <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    {visitor.passCode}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{visitor.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <Phone className="w-3 h-3" /> {visitor.phone}
                </p>
                <div className="mt-3 pt-3 border-t dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>
                    Destination: <span className="font-semibold text-slate-900 dark:text-white">Unit {visitor.unitNumber}</span> ({visitor.residentName})
                  </div>
                  <div>Category: {visitor.type}</div>
                  {visitor.timeIn && <div>Time In: {visitor.timeIn}</div>}
                </div>
              </div>

              {visitor.status === "Checked In" && (
                <Button size="sm" variant="secondary" onClick={() => handleCheckOut(visitor.id)} className="w-full text-xs">
                  Mark Checked Out
                </Button>
              )}
              {visitor.status === "Pre-Approved" && (
                <Button
                  size="sm"
                  onClick={() =>
                    setVisitors(
                      visitors.map((v) =>
                        v.id === visitor.id ? { ...v, status: "Checked In", timeIn: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) } : v
                      )
                    )
                  }
                  className="w-full text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Approve Entry (Check In)
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* New Check-In Modal */}
      <Modal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} title="Manual Walk-In Check-In">
        <form onSubmit={handleCheckInNew} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Visitor Name</label>
            <input
              type="text"
              required
              value={newVisitor.name}
              onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mobile Phone Number</label>
            <input
              type="text"
              required
              value={newVisitor.phone}
              onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination Unit #</label>
              <input
                type="text"
                required
                placeholder="e.g. A-201"
                value={newVisitor.unitNumber}
                onChange={(e) => setNewVisitor({ ...newVisitor, unitNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                value={newVisitor.type}
                onChange={(e) => setNewVisitor({ ...newVisitor, type: e.target.value as Visitor["type"] })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="Guest">Guest</option>
                <option value="Delivery">Delivery</option>
                <option value="Cab">Cab Driver</option>
                <option value="Service">Service / Vendor</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsNewOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Complete Check-In</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
