"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  UserRound,
  Send,
} from "lucide-react";

import {
  Card,
  CardContent,
  StatCard,
} from "@/components/ui/Card";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

import {
  getAdminComplaints,
  updateComplaintStatus,
  assignComplaint,
  addAdminComplaintComment,
} from "@/app/actions/complaints";

import { format } from "date-fns";

const statusOptions = [
  { label: "All Status", value: "" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const updateStatusOptions = [
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const statusBadge = (status: string) => {
  const map: Record<
    string,
    {
      variant:
      | "warning"
      | "info"
      | "primary"
      | "success"
      | "neutral";
      label: string;
    }
  > = {
    SUBMITTED: {
      variant: "info",
      label: "Submitted",
    },
    ASSIGNED: {
      variant: "primary",
      label: "Assigned",
    },
    IN_PROGRESS: {
      variant: "warning",
      label: "In Progress",
    },
    RESOLVED: {
      variant: "success",
      label: "Resolved",
    },
    CLOSED: {
      variant: "neutral",
      label: "Closed",
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

const priorityBadge = (priority: string) => {
  const map: Record<
    string,
    "danger" | "warning" | "primary" | "neutral"
  > = {
    URGENT: "danger",
    HIGH: "warning",
    MEDIUM: "primary",
    LOW: "neutral",
  };

  return (
    <Badge variant={map[priority] || "neutral"}>
      {priority}
    </Badge>
  );
};

export default function AdminComplaintsPage() {
  const { toast } = useToast();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<any>(null);

  const [statusFilter, setStatusFilter] = useState("");

  const [newStatus, setNewStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [comment, setComment] = useState("");

  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false);

  const [isAssigning, setIsAssigning] = useState(false);

  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);

    try {
      const data = await getAdminComplaints();

      if (data) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error(
        "Failed to load admin complaints:",
        error
      );

      toast(
        "Error",
        "Unable to load complaints.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAssignedTo(complaint.assignedTo || "");
    setComment("");
    setDetailOpen(true);
  };

  const closeComplaint = () => {
    setDetailOpen(false);
    setSelectedComplaint(null);
    setNewStatus("");
    setAssignedTo("");
    setComment("");
  };

  const handleStatusUpdate = async () => {
    if (!selectedComplaint || !newStatus) {
      return;
    }

    setIsUpdatingStatus(true);

    try {
      const result = await updateComplaintStatus(
        selectedComplaint.id,
        newStatus
      );

      if (result.error) {
        toast(
          "Update Failed",
          result.error,
          "error"
        );
        return;
      }

      if (result.success) {
        toast(
          "Status Updated",
          "Complaint status has been updated successfully.",
          "success"
        );

        const updatedComplaints =
          await getAdminComplaints();

        if (updatedComplaints) {
          setComplaints(updatedComplaints);

          const updatedComplaint =
            updatedComplaints.find(
              (item: any) =>
                item.id === selectedComplaint.id
            );

          if (updatedComplaint) {
            setSelectedComplaint(updatedComplaint);
            setNewStatus(updatedComplaint.status);
            setAssignedTo(
              updatedComplaint.assignedTo || ""
            );
          }
        }
      }
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      toast(
        "Error",
        "Unable to update complaint status.",
        "error"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedComplaint || !assignedTo.trim()) {
      toast(
        "Assignment Required",
        "Please enter the name of the person or team.",
        "warning"
      );

      return;
    }

    setIsAssigning(true);

    try {
      const result = await assignComplaint(
        selectedComplaint.id,
        assignedTo
      );

      if (result.error) {
        toast(
          "Assignment Failed",
          result.error,
          "error"
        );
        return;
      }

      if (result.success) {
        toast(
          "Complaint Assigned",
          "The complaint has been assigned successfully.",
          "success"
        );

        const updatedComplaints =
          await getAdminComplaints();

        if (updatedComplaints) {
          setComplaints(updatedComplaints);

          const updatedComplaint =
            updatedComplaints.find(
              (item: any) =>
                item.id === selectedComplaint.id
            );

          if (updatedComplaint) {
            setSelectedComplaint(updatedComplaint);
            setAssignedTo(
              updatedComplaint.assignedTo || ""
            );
            setNewStatus(updatedComplaint.status);
          }
        }
      }
    } catch (error) {
      console.error(
        "Assignment error:",
        error
      );

      toast(
        "Error",
        "Unable to assign complaint.",
        "error"
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAddComment = async () => {
    if (!selectedComplaint || !comment.trim()) {
      return;
    }

    setIsCommenting(true);

    try {
      const result =
        await addAdminComplaintComment(
          selectedComplaint.id,
          comment
        );

      if (result.error) {
        toast(
          "Comment Failed",
          result.error,
          "error"
        );
        return;
      }

      if (result.success) {
        toast(
          "Comment Added",
          "Admin update has been added.",
          "success"
        );

        setComment("");

        const updatedComplaints =
          await getAdminComplaints();

        if (updatedComplaints) {
          setComplaints(updatedComplaints);

          const updatedComplaint =
            updatedComplaints.find(
              (item: any) =>
                item.id === selectedComplaint.id
            );

          if (updatedComplaint) {
            setSelectedComplaint(updatedComplaint);
          }
        }
      }
    } catch (error) {
      console.error(
        "Admin comment error:",
        error
      );

      toast(
        "Error",
        "Unable to add admin update.",
        "error"
      );
    } finally {
      setIsCommenting(false);
    }
  };

  const filtered = complaints.filter(
    (complaint) =>
      !statusFilter ||
      complaint.status === statusFilter
  );

  const totalComplaints = complaints.length;

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === "IN_PROGRESS" ||
      complaint.status === "ASSIGNED"
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === "RESOLVED" ||
      complaint.status === "CLOSED"
  ).length;

  const urgentHighCount = complaints.filter(
    (complaint) =>
      complaint.priority === "URGENT" ||
      complaint.priority === "HIGH"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Complaints
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Manage and resolve community complaints.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints"
          value={String(totalComplaints)}
          icon={
            <MessageSquare className="w-6 h-6" />
          }
          iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
        />

        <StatCard
          title="In Progress"
          value={String(inProgressCount)}
          icon={
            <Clock className="w-6 h-6" />
          }
          iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        />

        <StatCard
          title="Resolved"
          value={String(resolvedCount)}
          icon={
            <CheckCircle2 className="w-6 h-6" />
          }
          iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
        />

        <StatCard
          title="Urgent / High"
          value={String(urgentHighCount)}
          icon={
            <AlertTriangle className="w-6 h-6" />
          }
          iconBgColor="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
        />
      </div>

      {/* Filter */}
      <div className="max-w-xs">
        <Select
          label=""
          options={statusOptions}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        />
      </div>

      {/* Complaint List */}
      <div className="space-y-3">
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-sm text-slate-500">
                Loading complaints...
              </div>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-sm text-slate-500">
                No complaints found.
              </div>
            </CardContent>
          </Card>
        ) : (
          filtered.map((complaint) => (
            <Card
              key={complaint.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                openComplaint(complaint)
              }
            >
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {complaint.ticketNo}
                    </span>

                    {priorityBadge(
                      complaint.priority
                    )}

                    {statusBadge(
                      complaint.status
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {complaint.title}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1">
                    {complaint.category} •{" "}
                    {complaint.resident?.user?.name ||
                      "Unknown Resident"}{" "}
                    (
                    {complaint.resident?.unit?.unitNumber ||
                      "Unknown Unit"}
                    ) •{" "}
                    {format(
                      new Date(
                        complaint.createdAt
                      ),
                      "dd MMM yyyy"
                    )}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Complaint Details */}
      <Modal
        isOpen={detailOpen}
        onClose={closeComplaint}
        title={selectedComplaint?.ticketNo || ""}
        description={selectedComplaint?.title}
        size="lg"
      >
        {selectedComplaint && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Category
                </span>

                <span className="text-slate-800 dark:text-slate-200">
                  {selectedComplaint.category}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Priority
                </span>

                {priorityBadge(
                  selectedComplaint.priority
                )}
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Resident
                </span>

                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <UserRound className="w-4 h-4 text-slate-400" />

                  {selectedComplaint.resident
                    ?.user?.name ||
                    "Unknown Resident"}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Unit
                </span>

                <span className="text-slate-800 dark:text-slate-200">
                  {selectedComplaint.resident
                    ?.unit?.unitNumber ||
                    "Unknown Unit"}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Created
                </span>

                <span className="text-slate-800 dark:text-slate-200">
                  {format(
                    new Date(
                      selectedComplaint.createdAt
                    ),
                    "dd MMM yyyy, hh:mm a"
                  )}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Current Status
                </span>

                {statusBadge(
                  selectedComplaint.status
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">
                Description
              </p>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Status Management */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <p className="text-xs text-slate-500 uppercase font-semibold">
                Update Status
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Select
                    label=""
                    options={updateStatusOptions}
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(e.target.value)
                    }
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleStatusUpdate}
                  isLoading={isUpdatingStatus}
                >
                  Update Status
                </Button>
              </div>
            </div>

            {/* Assignment */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <p className="text-xs text-slate-500 uppercase font-semibold">
                Assign Complaint
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    name="assignedTo"
                    label=""
                    value={assignedTo}
                    onChange={(e) =>
                      setAssignedTo(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Rajesh (Senior Plumber)"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAssign}
                  isLoading={isAssigning}
                >
                  Assign
                </Button>
              </div>

              <p className="text-xs text-slate-400">
                Current assignee:{" "}
                {selectedComplaint.assignedTo ||
                  "Not assigned"}
              </p>
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-indigo-600" />

                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Comments & Updates
                </p>
              </div>

              <div className="space-y-3">
                {selectedComplaint.comments?.length >
                  0 ? (
                  selectedComplaint.comments.map(
                    (item: any) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {item.authorName}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {format(
                              new Date(
                                item.createdAt
                              ),
                              "dd MMM, hh:mm a"
                            )}
                          </span>
                        </div>

                        <p className="text-xs text-indigo-600 mt-0.5">
                          {item.authorRole}
                        </p>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                          {item.message}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-xs text-slate-400">
                    No comments yet.
                  </p>
                )}
              </div>

              {/* Add Admin Comment */}
              <div className="mt-4 space-y-2">
                <Textarea
                  name="adminComment"
                  label=""
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  placeholder="Add an internal update or message for the resident..."
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddComment}
                    isLoading={isCommenting}
                    disabled={!comment.trim()}
                    icon={
                      <Send className="w-4 h-4" />
                    }
                  >
                    Add Update
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}