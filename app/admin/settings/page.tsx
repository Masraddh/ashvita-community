"use client";

import React, { useState } from "react";
import { Building, Shield, Bell, CreditCard, Save, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    societyName: "Ashvita Heights Community",
    address: "Plot 42, Green Glen Layout, Bellandur, Bengaluru",
    maintenanceDueDay: "5",
    lateFeePercentage: "2.5",
    gateSecurityPhone: "+91 98765 43210",
    allowTenantVisitorApproval: true,
    enableUpiPayments: true,
    autoApproveAmenity: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Society Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Configure community preferences, payment rules, and security policies.</p>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card className="p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Society Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Society Name</label>
              <input
                type="text"
                value={settings.societyName}
                onChange={(e) => setSettings({ ...settings, societyName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card className="p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Payment & Billing Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Maintenance Due Date (Day of Month)</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={settings.maintenanceDueDay}
                  onChange={(e) => setSettings({ ...settings, maintenanceDueDay: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Late Fee (% per month)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.lateFeePercentage}
                  onChange={(e) => setSettings({ ...settings, lateFeePercentage: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="enableUpi"
                checked={settings.enableUpiPayments}
                onChange={(e) => setSettings({ ...settings, enableUpiPayments: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="enableUpi" className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                Enable Instant UPI Payment Gateway (Razorpay Integration)
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Gate Security Policy */}
        <Card className="p-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" /> Gate Security Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Main Gate Emergency Contact Hotline</label>
              <input
                type="text"
                value={settings.gateSecurityPhone}
                onChange={(e) => setSettings({ ...settings, gateSecurityPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="tenantApproval"
                  checked={settings.allowTenantVisitorApproval}
                  onChange={(e) => setSettings({ ...settings, allowTenantVisitorApproval: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="tenantApproval" className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Allow tenants (non-owners) to approve visitor entry pass
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoAmenity"
                  checked={settings.autoApproveAmenity}
                  onChange={(e) => setSettings({ ...settings, autoApproveAmenity: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="autoAmenity" className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Auto-approve non-paid amenity bookings (e.g. Badminton Court)
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2 px-6">
            <Save className="w-4 h-4" /> Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
