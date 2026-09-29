"use client";

import React, { useState } from "react";
import { Calendar, MapPin, Users as UsersIcon, Clock, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";

const amenities = [
  { id: "1", name: "Swimming Pool", desc: "Semi-olympic heated pool with toddler section.", image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 1F", capacity: 25, hours: "6 AM - 9 PM", fee: 0, rules: "Swimwear mandatory. Kids under 12 need adult." },
  { id: "2", name: "Badminton Court", desc: "Synthetic floor with LED lighting.", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80", location: "Sports Complex", capacity: 4, hours: "6 AM - 10 PM", fee: 150, rules: "Non-marking shoes only." },
  { id: "3", name: "Gymnasium", desc: "Fully equipped with cardio and strength zones.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 2F", capacity: 30, hours: "5 AM - 11 PM", fee: 0, rules: "Carry a towel. Wipe equipment after use." },
  { id: "4", name: "Party Hall", desc: "Air-conditioned hall with AV system.", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80", location: "Clubhouse 3F", capacity: 100, hours: "9 AM - 11 PM", fee: 2500, rules: "Advance booking required. Noise curfew at 10 PM." },
];

const slots = ["06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM"];

export default function AmenitiesPage() {
  const { toast } = useToast();
  const [bookOpen, setBookOpen] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const selected = amenities.find((a) => a.id === bookOpen);

  const handleBook = () => {
    setBookOpen(null);
    setSelectedSlot(null);
    toast("Booking Confirmed!", "Your amenity slot has been reserved.", "success");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Amenities</h2>
        <p className="text-sm text-slate-500 mt-1">Explore and book community amenities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {amenities.map((a) => (
          <Card key={a.id} className="overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{a.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{a.desc}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.location}</span>
                <span className="flex items-center gap-1"><UsersIcon className="w-3 h-3" />Cap: {a.capacity}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.hours}</span>
              </div>
              <Button className="w-full mt-2" onClick={() => setBookOpen(a.id)}>
                <Calendar className="w-4 h-4 mr-2" /> Book Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={!!bookOpen} onClose={() => { setBookOpen(null); setSelectedSlot(null); }} title={`Book ${selected?.name || ""}`} size="md">
        {selected && (
          <div className="space-y-5">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-900 text-sm">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">{selected.name}</p>
              <p className="text-xs text-slate-500">{selected.rules}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Select Date</label>
              <input type="date" className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Available Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`p-3 rounded-xl border text-xs font-medium transition-all ${selectedSlot === s ? "bg-indigo-600 text-white border-indigo-600 shadow-md" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {selected.fee > 0 && (
              <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-sm">
                <span className="text-slate-600 dark:text-slate-300">Booking Fee</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{formatCurrency(selected.fee)}</span>
              </div>
            )}
            <Button className="w-full" size="lg" disabled={!selectedSlot} onClick={handleBook}>
              Confirm Booking
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
