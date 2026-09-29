"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Users as UsersIcon, Clock, Plus, Settings, IndianRupee } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

const amenities = [
  { id: "1", name: "Swimming Pool", desc: "Semi-olympic heated pool with toddler section.", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 1F", capacity: 25, hours: "6 AM - 9 PM", fee: 0, bookings: 45, status: "AVAILABLE" },
  { id: "2", name: "Badminton Court", desc: "Synthetic floor with LED lighting.", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80", location: "Sports Complex", capacity: 4, hours: "6 AM - 10 PM", fee: 150, bookings: 62, status: "AVAILABLE" },
  { id: "3", name: "Gymnasium", desc: "Fully equipped with cardio and strength zones.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 2F", capacity: 30, hours: "5 AM - 11 PM", fee: 0, bookings: 120, status: "AVAILABLE" },
  { id: "4", name: "Party Hall", desc: "Air-conditioned hall with AV system.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 3F", capacity: 100, hours: "9 AM - 11 PM", fee: 2500, bookings: 8, status: "AVAILABLE" },
  { id: "5", name: "Tennis Court", desc: "Hard court with floodlights for night play.", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80", location: "Sports Complex", capacity: 4, hours: "6 AM - 10 PM", fee: 200, bookings: 38, status: "MAINTENANCE" },
  { id: "6", name: "Yoga Room", desc: "Serene space with bamboo flooring and mirrors.", image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 1F", capacity: 20, hours: "5 AM - 9 PM", fee: 0, bookings: 85, status: "AVAILABLE" },
];

export default function AdminAmenitiesPage() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Amenities</h2>
          <p className="text-sm text-slate-500 mt-1">Manage community amenities and view booking stats.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setAddOpen(true)}>Add Amenity</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Amenities" value="6" icon={<Calendar className="w-6 h-6" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" />
        <StatCard title="Monthly Bookings" value="358" trend={{ value: "8%", isPositive: true }} icon={<UsersIcon className="w-6 h-6" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" />
        <StatCard title="Revenue" value={formatCurrency(28500)} subtitle="This month" icon={<IndianRupee className="w-6 h-6" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" />
        <StatCard title="Under Maintenance" value="1" icon={<Settings className="w-6 h-6" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {amenities.map((a) => (
          <Card key={a.id} className="overflow-hidden group">
            <div className="h-40 overflow-hidden relative">
              <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 left-3">
                <Badge variant={a.status === "AVAILABLE" ? "success" : "warning"} dot>{a.status === "AVAILABLE" ? "Active" : "Maintenance"}</Badge>
              </div>
              {a.fee > 0 && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                  {formatCurrency(a.fee)}/slot
                </div>
              )}
              {a.fee === 0 && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                  Free
                </div>
              )}
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{a.name}</h3>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-lg">{a.bookings} bookings</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{a.desc}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
                <span className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />Cap: {a.capacity}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.hours}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Settings className="w-3.5 h-3.5 mr-1.5" /> Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Amenity" size="lg">
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setAddOpen(false); toast("Amenity Added", "New amenity created successfully.", "success"); }}>
          <Input label="Amenity Name" placeholder="e.g. Tennis Court" required />
          <Textarea label="Description" placeholder="Brief description of the amenity..." required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Location" placeholder="e.g. Sports Complex" required />
            <Input label="Capacity" type="number" placeholder="e.g. 20" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Operating Hours" placeholder="e.g. 6 AM - 10 PM" required />
            <Input label="Booking Fee (₹)" type="number" placeholder="0 for free" />
          </div>
          <Input label="Image URL" placeholder="https://..." />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit">Create Amenity</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
