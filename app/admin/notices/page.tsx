"use client";

import React, { useState } from "react";
import { Bell, Plus, Pin, Calendar, Tag, AlertTriangle, Eye, Trash2, Send } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface Notice {
  id: string;
  title: string;
  category: "General" | "Emergency" | "Event" | "Maintenance";
  content: string;
  author: string;
  date: string;
  isPinned: boolean;
  targetAudience: "All Residents" | "Owners" | "Tenants" | "Block A";
}

const mockNotices: Notice[] = [
  {
    id: "NOT-001",
    title: "Annual General Body Meeting (AGM) 2026",
    category: "Event",
    content: "All residents and apartment owners are requested to attend the AGM scheduled for October 15th at the Community Hall.",
    author: "Management Committee",
    date: "2026-09-28",
    isPinned: true,
    targetAudience: "All Residents",
  },
  {
    id: "NOT-002",
    title: "Water Supply Interruption - Scheduled Maintenance",
    category: "Maintenance",
    content: "Water supply will be suspended tomorrow between 10:00 AM and 2:00 PM due to overhead tank cleaning.",
    author: "Facility Manager",
    date: "2026-09-27",
    isPinned: true,
    targetAudience: "All Residents",
  },
  {
    id: "NOT-003",
    title: "Fire Safety Drill & Inspection Notice",
    category: "Emergency",
    content: "A mandatory fire alarm test and evacuation drill will take place on Saturday at 11 AM.",
    author: "Security Team",
    date: "2026-09-25",
    isPinned: false,
    targetAudience: "All Residents",
  },
  {
    id: "NOT-004",
    title: "Deepavali Community Cultural Fest",
    category: "General",
    content: "Registrations are open for cultural performances for upcoming Deepavali event. Contact cultural committee.",
    author: "Cultural Club",
    date: "2026-09-20",
    isPinned: false,
    targetAudience: "All Residents",
  },
];

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    category: "General" as Notice["category"],
    content: "",
    targetAudience: "All Residents" as Notice["targetAudience"],
    isPinned: false,
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Notice = {
      id: `NOT-00${notices.length + 1}`,
      title: newNotice.title,
      category: newNotice.category,
      content: newNotice.content,
      author: "Admin",
      date: new Date().toISOString().split("T")[0],
      isPinned: newNotice.isPinned,
      targetAudience: newNotice.targetAudience,
    };
    setNotices([created, ...notices]);
    setIsAddOpen(false);
    setNewNotice({
      title: "",
      category: "General",
      content: "",
      targetAudience: "All Residents",
      isPinned: false,
    });
  };

  const getCategoryBadge = (cat: Notice["category"]) => {
    switch (cat) {
      case "Emergency":
        return <Badge variant="danger">Emergency</Badge>;
      case "Maintenance":
        return <Badge variant="warning">Maintenance</Badge>;
      case "Event":
        return <Badge variant="info">Event</Badge>;
      default:
        return <Badge variant="neutral">General</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notice Board Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Publish broadcasts, announcements, and emergency notices to residents.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Broadcast Notice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Notices" value={notices.length} icon={<Bell className="w-5 h-5" />} iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50" />
        <StatCard title="Pinned Notices" value={notices.filter((n) => n.isPinned).length} icon={<Pin className="w-5 h-5" />} iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-900/50" />
        <StatCard title="Emergency Broadcasts" value={notices.filter((n) => n.category === "Emergency").length} icon={<AlertTriangle className="w-5 h-5" />} iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50" />
        <StatCard title="Events & Cultural" value={notices.filter((n) => n.category === "Event").length} icon={<Calendar className="w-5 h-5" />} iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-900/50" />
      </div>

      {/* Notice Feed */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className={`p-5 transition ${notice.isPinned ? "border-l-4 border-l-amber-500" : ""}`}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  {notice.isPinned && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  {getCategoryBadge(notice.category)}
                  <span className="text-xs text-slate-400">Audience: {notice.targetAudience}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{notice.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{notice.content}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <span>By {notice.author}</span>
                  <span>•</span>
                  <span>Published on {notice.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setNotices(notices.map((n) => (n.id === notice.id ? { ...n, isPinned: !n.isPinned } : n)))
                  }
                >
                  <Pin className={`w-4 h-4 ${notice.isPinned ? "fill-amber-500 text-amber-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotices(notices.filter((n) => n.id !== notice.id))}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Notice Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Broadcast New Notice">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notice Title</label>
            <input
              type="text"
              required
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. Water Maintenance Schedule"
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value as Notice["category"] })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="General">General</option>
                <option value="Event">Event</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
              <select
                value={newNotice.targetAudience}
                onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value as Notice["targetAudience"] })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All Residents">All Residents</option>
                <option value="Owners">Owners</option>
                <option value="Tenants">Tenants</option>
                <option value="Block A">Block A</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content / Message</label>
            <textarea
              rows={4}
              required
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              placeholder="Write detailed notice information here..."
              className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPinned"
              checked={newNotice.isPinned}
              onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isPinned" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Pin to top of notice board
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Send className="w-4 h-4" /> Publish Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
