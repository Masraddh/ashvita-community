"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  Plus,
  ChevronRight,
  MessageSquare,
  Send,
  Inbox,
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
  getResidentComplaints,
  createComplaint,
  addComplaintComment,
} from "@/app/actions/complaints";
import { format } from "date-fns";

const categories = [
  { label: "Select Category", value: "" },
  { label: "Plumbing", value: "Plumbing" },
  { label: "Electrical", value: "Electrical" },
  { label: "Cleaning", value: "Cleaning" },
  { label: "Security", value: "Security" },
  { label: "Lift / Elevator", value: "Lift / Elevator" },
  { label: "Water Supply", value: "Water Supply" },
  { label: "Parking", value: "Parking" },
  { label: "Common Area", value: "Common Area" },
  { label: "Other", value: "Other" },
];

const priorities = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Urgent", value: "URGENT" },
];

export default function ComplaintsPage() {
  const { toast } = useToast();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);

    try {
      const data = await getResidentComplaints();

      if (data) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }
    } catch (error) {
      console.error("Failed to load complaints:", error);

      toast(
        "Error",
        "Unable to load your complaints.",
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

  const handleCreateComplaint = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("title") || "");
    const category = String(formData.get("category") || "");
    const priority = String(formData.get("priority") || "");
    const description = String(
      formData.get("description") || ""
    );

    try {
      const result = await createComplaint({
        title,
        category,
        priority,
        description,
      });

      if (result.error) {
        toast(
          "Complaint Failed",
          result.error,
          "error"
        );
        return;
      }

      if (result.success) {
        toast(
          "Complaint Submitted",
          `Your complaint ${result.complaint.ticketNo} has been raised successfully.`,
          "success"
        );

        setCreateOpen(false);

        await fetchComplaints();
      }
    } catch (error) {
      console.error("Create complaint error:", error);

      toast(
        "Error",
        "Something went wrong while submitting the complaint.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
    setComment("");
    setDetailOpen(true);
  };

  const handleAddComment = async () => {
    if (!selectedComplaint || !comment.trim()) {
      return;
    }

    setIsCommenting(true);

    try {
      const result = await addComplaintComment(
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
          "Your comment has been added.",
          "success"
        );

        setComment("");

        const updatedComplaints =
          await getResidentComplaints();

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
      console.error("Comment error:", error);

      toast(
        "Error",
        "Unable to add your comment.",
        "error"
      );
    } finally {
      setIsCommenting(false);
    }
  };

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

  const isStageComplete = (
    status: string,
    stage: string
  ) => {
    const order: Record<string, number> = {
      SUBMITTED: 1,
      ASSIGNED: 2,
      IN_PROGRESS: 3,
      RESOLVED: 4,
      CLOSED: 5,
    };

    const current = order[status] || 1;
    const required = order[stage] || 1;

    return current >= required;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Complaints
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Track and manage your service requests.
          </p>
        </div>

        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateOpen(true)}
        >
          Raise Complaint
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Complaints"
          value={String(totalComplaints)}
          icon={<Wrench className="w-6 h-6" />}
          iconBgColor="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
        />

        <StatCard
          title="In Progress"
          value={String(inProgressCount)}
          icon={<Wrench className="w-6 h-6" />}
          iconBgColor="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        />

        <StatCard
          title="Resolved"
          value={String(resolvedCount)}
          icon={<Wrench className="w-6 h-6" />}
          iconBgColor="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
        />
      </div>

      {/* Complaint List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-sm text-slate-500">
                Loading complaints...
              </div>
            </CardContent>
          </Card>
        ) : complaints.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center">
                <Inbox className="w-10 h-10 text-slate-300 mb-3" />

                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No complaints yet
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Raise a complaint whenever you need help.
                </p>

                <Button
                  className="mt-4"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setCreateOpen(true)}
                >
                  Raise Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          complaints.map((complaint) => (
            <Card
              key={complaint.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => openComplaint(complaint)}
            >
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {complaint.ticketNo}
                    </span>

                    {priorityBadge(complaint.priority)}

                    {statusBadge(complaint.status)}
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {complaint.title}
                  </h4>

                  <p className="text-xs text-slate-500 mt-1">
                    {complaint.category} • Raised on{" "}
                    {format(
                      new Date(complaint.createdAt),
                      "dd MMM yyyy"
                    )}{" "}
                    • Assigned to{" "}
                    {complaint.assignedTo || "Unassigned"}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 hidden sm:block" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Complaint Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Raise New Complaint"
        size="lg"
      >
        <form
          className="space-y-5"
          onSubmit={handleCreateComplaint}
        >
          <Input
            name="title"
            label="Title"
            placeholder="Brief description of the issue"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              name="category"
              label="Category"
              options={categories}
              required
            />

            <Select
              name="priority"
              label="Priority"
              options={priorities}
              required
            />
          </div>

          <Textarea
            name="description"
            label="Description"
            placeholder="Provide detailed information about the issue..."
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Submit Complaint
            </Button>
          </div>
        </form>
      </Modal>

      {/* Complaint Details Modal */}
      <Modal
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedComplaint(null);
          setComment("");
        }}
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
                  Status
                </span>

                {statusBadge(
                  selectedComplaint.status
                )}
              </div>

              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-1">
                  Assigned To
                </span>

                <span className="text-slate-800 dark:text-slate-200">
                  {selectedComplaint.assignedTo ||
                    "Not assigned yet"}
                </span>
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

            {/* Timeline */}
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-3">
                Resolution Timeline
              </p>

              <div className="space-y-0 relative pl-6">
                {[
                  {
                    label: "Complaint Created",
                    stage: "SUBMITTED",
                  },
                  {
                    label: "Complaint Assigned",
                    stage: "ASSIGNED",
                  },
                  {
                    label: "Technician Started Work",
                    stage: "IN_PROGRESS",
                  },
                  {
                    label: "Issue Resolved",
                    stage: "RESOLVED",
                  },
                  {
                    label: "Complaint Closed",
                    stage: "CLOSED",
                  },
                ].map((step, index, steps) => {
                  const done = isStageComplete(
                    selectedComplaint.status,
                    step.stage
                  );

                  return (
                    <div
                      key={step.stage}
                      className="relative pb-6 last:pb-0"
                    >
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-[-18px] top-5 w-0.5 h-full ${done
                              ? "bg-emerald-400"
                              : "bg-slate-200 dark:bg-slate-700"
                            }`}
                        />
                      )}

                      <div
                        className={`absolute left-[-22px] top-1 w-3 h-3 rounded-full border-2 ${done
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                          }`}
                      />

                      <p
                        className={`text-sm font-medium ${done
                            ? "text-slate-900 dark:text-slate-100"
                            : "text-slate-400"
                          }`}
                      >
                        {step.label}
                      </p>

                      <p className="text-xs text-slate-500">
                        {step.stage === "SUBMITTED"
                          ? format(
                            new Date(
                              selectedComplaint.createdAt
                            ),
                            "dd MMM yyyy, hh:mm a"
                          )
                          : done
                            ? "Completed"
                            : "Pending"}
                      </p>
                    </div>
                  );
                })}
              </div>
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
                {selectedComplaint.comments?.length > 0 ? (
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
                              new Date(item.createdAt),
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

              {/* Add Comment */}
              {selectedComplaint.status !== "CLOSED" && (
                <div className="mt-4 flex gap-2">
                  <input
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                    placeholder="Add an update or comment..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddComment}
                    isLoading={isCommenting}
                    disabled={!comment.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}