"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  UserCheck,
  UserMinus,
  Clock,
  XCircle,
  LogIn,
  LogOut,
  Ban,
} from "lucide-react";

import { StatCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

import {
  getAdminVisitors,
  checkInVisitor,
  checkOutVisitor,
  rejectVisitor,
} from "@/app/actions/visitors";

import { format, isToday } from "date-fns";

interface VisitorRow {
  id: string;
  name: string;
  type: string;
  resident: string;
  unit: string;
  phone: string;
  vehicle: string;
  expected: string;
  status: string;
  checkIn: string;
  checkOut: string;
}

export default function AdminVisitorsPage() {
  const { toast } = useToast();

  const [visitors, setVisitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCheckingIn, setIsCheckingIn] = useState<string | null>(
    null
  );

  const [isCheckingOut, setIsCheckingOut] = useState<string | null>(
    null
  );

  const [isRejecting, setIsRejecting] = useState<string | null>(
    null
  );

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = async () => {
    setIsLoading(true);

    try {
      const data = await getAdminVisitors();

      if (data) {
        setVisitors(data);
      } else {
        setVisitors([]);
      }
    } catch (error) {
      console.error("Failed to load visitors:", error);

      toast(
        "Error",
        "Unable to load visitor records.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<
      string,
      {
        variant:
        | "warning"
        | "info"
        | "success"
        | "danger"
        | "neutral";
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

    const badge = map[status] || {
      variant: "neutral" as const,
      label: status,
    };

    return (
      <Badge variant={badge.variant} dot>
        {badge.label}
      </Badge>
    );
  };

  const handleCheckIn = async (id: string) => {
    setIsCheckingIn(id);

    try {
      const result = await checkInVisitor(id);

      if (result.error) {
        toast(
          "Check-in Failed",
          result.error,
          "error"
        );
        return;
      }

      toast(
        "Visitor Checked In",
        "The visitor has been marked as inside the community.",
        "success"
      );

      await loadVisitors();
    } catch (error) {
      console.error("Check-in error:", error);

      toast(
        "Error",
        "Unable to check in visitor.",
        "error"
      );
    } finally {
      setIsCheckingIn(null);
    }
  };

  const handleCheckOut = async (id: string) => {
    setIsCheckingOut(id);

    try {
      const result = await checkOutVisitor(id);

      if (result.error) {
        toast(
          "Check-out Failed",
          result.error,
          "error"
        );
        return;
      }

      toast(
        "Visitor Checked Out",
        "The visitor has been marked as checked out.",
        "success"
      );

      await loadVisitors();
    } catch (error) {
      console.error("Check-out error:", error);

      toast(
        "Error",
        "Unable to check out visitor.",
        "error"
      );
    } finally {
      setIsCheckingOut(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsRejecting(id);

    try {
      const result = await rejectVisitor(id);

      if (result.error) {
        toast(
          "Rejection Failed",
          result.error,
          "error"
        );
        return;
      }

      toast(
        "Visitor Rejected",
        "The visitor pass has been rejected.",
        "success"
      );

      await loadVisitors();
    } catch (error) {
      console.error("Reject visitor error:", error);

      toast(
        "Error",
        "Unable to reject visitor.",
        "error"
      );
    } finally {
      setIsRejecting(null);
    }
  };

  const rows: VisitorRow[] = useMemo(() => {
    return visitors.map((visitor) => {
      const latestLog = visitor.logs?.[0];

      return {
        id: visitor.passCode,
        name: visitor.visitorName,
        type: visitor.visitorType,
        resident:
          visitor.resident?.user?.name ||
          "Unknown Resident",
        unit:
          visitor.resident?.unit?.unitNumber ||
          "Unknown Unit",
        phone: visitor.visitorPhone,
        vehicle: visitor.vehicleNo || "—",
        expected: format(
          new Date(visitor.expectedTime),
          "dd MMM, hh:mm a"
        ),
        status: visitor.status,
        checkIn: latestLog?.checkInTime
          ? format(
            new Date(latestLog.checkInTime),
            "hh:mm a"
          )
          : "—",
        checkOut: latestLog?.checkOutTime
          ? format(
            new Date(latestLog.checkOutTime),
            "hh:mm a"
          )
          : "—",
      };
    });
  }, [visitors]);

  const expectedToday = visitors.filter(
    (visitor) =>
      visitor.status === "EXPECTED" &&
      isToday(new Date(visitor.expectedTime))
  ).length;

  const currentlyInside = visitors.filter(
    (visitor) => visitor.status === "CHECKED_IN"
  ).length;

  const checkedOut = visitors.filter(
    (visitor) => visitor.status === "CHECKED_OUT"
  ).length;

  const rejected = visitors.filter(
    (visitor) => visitor.status === "REJECTED"
  ).length;

  const columns: Column<VisitorRow>[] = [
    {
      header: "Visitor",
      accessorKey: "name",
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {row.name}
          </p>

          <p className="text-xs text-slate-500 font-mono">
            {row.id}
          </p>
        </div>
      ),
    },

    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => (
        <Badge variant="neutral" size="sm">
          {row.type.replace(/_/g, " ")}
        </Badge>
      ),
    },

    {
      header: "Resident / Unit",
      accessorKey: "resident",
      cell: (row) => (
        <div>
          <p className="text-sm text-slate-900 dark:text-slate-100">
            {row.resident}
          </p>

          <p className="text-xs text-slate-500">
            {row.unit}
          </p>
        </div>
      ),
    },

    {
      header: "Phone",
      accessorKey: "phone",
    },

    {
      header: "Vehicle",
      accessorKey: "vehicle",
    },

    {
      header: "Expected",
      accessorKey: "expected",
    },

    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => statusBadge(row.status),
    },

    {
      header: "Check In",
      accessorKey: "checkIn",
    },

    {
      header: "Check Out",
      accessorKey: "checkOut",
    },

    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => {
        const visitor = visitors.find(
          (item) => item.passCode === row.id
        );

        if (!visitor) {
          return null;
        }

        return (
          <div
            className="flex items-center gap-2"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {visitor.status === "EXPECTED" && (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    handleCheckIn(visitor.id)
                  }
                  isLoading={
                    isCheckingIn === visitor.id
                  }
                  icon={
                    <LogIn className="w-3.5 h-3.5" />
                  }
                >
                  Check In
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleReject(visitor.id)
                  }
                  isLoading={
                    isRejecting === visitor.id
                  }
                  icon={
                    <Ban className="w-3.5 h-3.5" />
                  }
                >
                  Reject
                </Button>
              </>
            )}

            {visitor.status === "CHECKED_IN" && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  handleCheckOut(visitor.id)
                }
                isLoading={
                  isCheckingOut === visitor.id
                }
                icon={
                  <LogOut className="w-3.5 h-3.5" />
                }
              >
                Check Out
              </Button>
            )}

            {visitor.status === "CHECKED_OUT" && (
              <span className="text-xs text-slate-400">
                Completed
              </span>
            )}

            {visitor.status === "REJECTED" && (
              <span className="text-xs text-rose-500">
                Rejected
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Security & Visitors
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Monitor all visitor activity across the
          community.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Expected Today"
          value={String(expectedToday)}
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        />

        <StatCard
          title="Currently Inside"
          value={String(currentlyInside)}
          icon={<UserCheck className="w-6 h-6" />}
          iconBgColor="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
        />

        <StatCard
          title="Checked Out"
          value={String(checkedOut)}
          icon={<UserMinus className="w-6 h-6" />}
          iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
        />

        <StatCard
          title="Rejected"
          value={String(rejected)}
          icon={<XCircle className="w-6 h-6" />}
          iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
        />
      </div>

      {/* Visitor table */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-10 text-center text-sm text-slate-500">
          Loading visitor records...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={rows}
          searchKey="name"
          searchPlaceholder="Search by visitor name..."
          pageSize={7}
        />
      )}
    </div>
  );
}