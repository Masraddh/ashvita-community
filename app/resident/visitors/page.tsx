"use client";

import React, { useEffect, useState } from "react";

import { Users, Plus, QrCode, Car, Phone, Clock } from "lucide-react";

import { Card, CardContent, StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

import {
  getResidentVisitors,
  createVisitorPass,
} from "@/app/actions/visitors";

import { format } from "date-fns";

interface Visitor {
  id: string;
  passCode: string;
  visitorName: string;
  visitorPhone: string;
  vehicleNo: string | null;
  purpose: string;
  visitorType: string;
  expectedTime: Date;
  status: string;
}

const visitorTypes = [
  { label: "Guest", value: "GUEST" },
  { label: "Delivery", value: "DELIVERY" },
  { label: "Cab / Ride", value: "CAB" },
  { label: "Domestic Help", value: "DOMESTIC_HELP" },
  { label: "Service Provider", value: "SERVICE_PROVIDER" },
  { label: "Other", value: "OTHER" },
];

const statusConfig: Record<
  string,
  {
    variant: "warning" | "success" | "neutral" | "info" | "danger";
    label: string;
  }
> = {
  EXPECTED: {
    variant: "warning",
    label: "Expected",
  },
  CHECKED_IN: {
    variant: "info",
    label: "Inside",
  },
  CHECKED_OUT: {
    variant: "success",
    label: "Left",
  },
  REJECTED: {
    variant: "danger",
    label: "Rejected",
  },
};

export default function VisitorsPage() {
  const { toast } = useToast();

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [passOpen, setPassOpen] = useState<string | null>(null);

  const [form, setForm] = useState({
    visitorName: "",
    visitorPhone: "",
    visitorType: "GUEST",
    vehicleNo: "",
    purpose: "",
    expectedDate: "",
    expectedTime: "",
  });

  const selected = visitors.find((v) => v.id === passOpen);

  const loadVisitors = async () => {
    setIsLoading(true);

    try {
      const data = await getResidentVisitors();

      if (data) {
        setVisitors(data);
      } else {
        setVisitors([]);
      }
    } catch (error) {
      console.error("Failed to load visitors:", error);

      toast(
        "Unable to Load Visitors",
        "Please refresh the page and try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const statusBadge = (status: string) => {
    const config =
      statusConfig[status] || {
        variant: "neutral" as const,
        label: status,
      };

    return (
      <Badge variant={config.variant} dot>
        {config.label}
      </Badge>
    );
  };

  const resetForm = () => {
    setForm({
      visitorName: "",
      visitorPhone: "",
      visitorType: "GUEST",
      vehicleNo: "",
      purpose: "",
      expectedDate: "",
      expectedTime: "",
    });
  };

  const handleCreateVisitor = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !form.visitorName ||
      !form.visitorPhone ||
      !form.purpose ||
      !form.expectedDate ||
      !form.expectedTime
    ) {
      toast(
        "Missing Information",
        "Please fill in all required fields.",
        "warning"
      );
      return;
    }

    setIsCreating(true);

    try {
      const expectedTime = new Date(
        `${form.expectedDate}T${form.expectedTime}`
      );

      const result = await createVisitorPass({
        visitorName: form.visitorName,
        visitorPhone: form.visitorPhone,
        visitorType: form.visitorType,
        vehicleNo: form.vehicleNo || undefined,
        purpose: form.purpose,
        expectedTime: expectedTime.toISOString(),
      });

      if (result?.error) {
        toast("Visitor Pass Failed", result.error, "error");
        return;
      }

      toast(
        "Visitor Added",
        "Digital visitor pass generated successfully.",
        "success"
      );

      setAddOpen(false);
      resetForm();

      await loadVisitors();
    } catch (error) {
      console.error("Failed to create visitor:", error);

      toast(
        "Something Went Wrong",
        "Unable to create the visitor pass.",
        "error"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const expectedToday = visitors.filter((visitor) => {
    if (visitor.status !== "EXPECTED") return false;

    const today = new Date();
    const expected = new Date(visitor.expectedTime);

    return (
      today.getFullYear() === expected.getFullYear() &&
      today.getMonth() === expected.getMonth() &&
      today.getDate() === expected.getDate()
    );
  }).length;

  const currentlyInside = visitors.filter(
    (visitor) => visitor.status === "CHECKED_IN"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Visitors
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Pre-register visitors and generate digital passes.
          </p>
        </div>

        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddOpen(true)}
        >
          Add Visitor
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Expected Today"
          value={expectedToday.toString()}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        />

        <StatCard
          title="Currently Inside"
          value={currentlyInside.toString()}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
        />

        <StatCard
          title="Total This Week"
          value={visitors.length.toString()}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
        />
      </div>

      {/* Visitor List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-slate-500">
              Loading visitor records...
            </CardContent>
          </Card>
        ) : visitors.length === 0 ? (
          <Card>
            <CardContent className="py-14 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                <Users className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                No visitors registered
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Create a visitor pass before your guest arrives.
              </p>

              <Button
                className="mt-5"
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setAddOpen(true)}
              >
                Add Visitor
              </Button>
            </CardContent>
          </Card>
        ) : (
          visitors.map((v) => (
            <Card
              key={v.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm shrink-0">
                    {v.visitorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {v.visitorName}
                      </span>

                      {statusBadge(v.status)}

                      <Badge variant="neutral" size="sm">
                        {v.visitorType.replaceAll("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {v.visitorPhone}
                      </span>

                      {v.vehicleNo && (
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {v.vehicleNo}
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />

                        {format(
                          new Date(v.expectedTime),
                          "dd MMM, hh:mm a"
                        )}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      Purpose:{" "}
                      <span className="text-slate-700 dark:text-slate-300">
                        {v.purpose}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPassOpen(v.id)}
                  >
                    <QrCode className="w-4 h-4 mr-1" />
                    View Pass
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Visitor Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => {
          if (!isCreating) {
            setAddOpen(false);
            resetForm();
          }
        }}
        title="Pre-Register Visitor"
        size="lg"
      >
        <form
          className="space-y-5"
          onSubmit={handleCreateVisitor}
        >
          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-4">
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
              Register your visitor before they arrive.
            </p>

            <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
              The generated pass can be used by security to verify the visitor
              at the gate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Visitor Name"
              placeholder="Full name"
              value={form.visitorName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  visitorName: e.target.value,
                }))
              }
              required
            />

            <Input
              label="Phone Number"
              placeholder="+91 XXXXX XXXXX"
              value={form.visitorPhone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  visitorPhone: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Visitor Type"
              options={visitorTypes}
              value={form.visitorType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  visitorType: e.target.value,
                }))
              }
              required
            />

            <Input
              label="Vehicle Number"
              placeholder="TS 09 AB 1234"
              value={form.vehicleNo}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  vehicleNo: e.target.value,
                }))
              }
            />
          </div>

          <Input
            label="Purpose of Visit"
            placeholder="e.g. Family dinner, Delivery"
            value={form.purpose}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                purpose: e.target.value,
              }))
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Expected Date"
              type="date"
              value={form.expectedDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  expectedDate: e.target.value,
                }))
              }
              required
            />

            <Input
              label="Expected Time"
              type="time"
              value={form.expectedTime}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  expectedTime: e.target.value,
                }))
              }
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="outline"
              type="button"
              disabled={isCreating}
              onClick={() => {
                setAddOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={isCreating}>
              Generate Pass
            </Button>
          </div>
        </form>
      </Modal>

      {/* Visitor Pass Modal */}
      <Modal
        isOpen={!!passOpen}
        onClose={() => setPassOpen(null)}
        title="Digital Visitor Pass"
      >
        {selected && (
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white rounded-2xl p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-2">
                ASHVITA VISITOR PASS
              </p>

              <div className="w-32 h-32 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                <QrCode className="w-16 h-16 text-white/80" />
              </div>

              <p className="text-lg font-bold">
                {selected.visitorName}
              </p>

              <p className="text-xs text-indigo-200 mt-1 font-mono">
                {selected.passCode}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-left">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Visitor Type
                </p>

                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {selected.visitorType.replaceAll("_", " ")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Status
                </p>

                <div className="mt-1">
                  {statusBadge(selected.status)}
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Phone
                </p>

                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {selected.visitorPhone}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Vehicle
                </p>

                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {selected.vehicleNo || "No vehicle"}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Purpose
                </p>

                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {selected.purpose}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Expected
                </p>

                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {format(
                    new Date(selected.expectedTime),
                    "dd MMM yyyy, hh:mm a"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}