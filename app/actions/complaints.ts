"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";

const CACHE_TTL = 60 * 5; // 5 minutes

function generateTicketNo() {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);

    return `CMP-${year}-${random}`;
}

/* =========================================================
   RESIDENT FUNCTIONS
========================================================= */

export async function getResidentComplaints() {
    const session = await getSession();

    if (!session || session.role !== "RESIDENT") {
        return null;
    }

    const resident = await db.resident.findUnique({
        where: {
            userId: session.id as string,
        },
    });

    if (!resident) {
        return null;
    }

    const cacheKey = `complaints:resident:${resident.id}`;
    const cachedComplaints = await redis.get(cacheKey);

    if (cachedComplaints) {
        return JSON.parse(cachedComplaints);
    }

    const complaints = await db.complaint.findMany({
        where: {
            residentId: resident.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            comments: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(complaints));

    return complaints;
}

export async function createComplaint(data: {
    title: string;
    category: string;
    priority: string;
    description: string;
}) {
    const session = await getSession();

    if (!session || session.role !== "RESIDENT") {
        return {
            error: "Unauthorized",
        };
    }

    const resident = await db.resident.findUnique({
        where: {
            userId: session.id as string,
        },
    });

    if (!resident) {
        return {
            error: "Resident profile not found",
        };
    }

    if (!data.title.trim()) {
        return {
            error: "Complaint title is required",
        };
    }

    if (!data.category) {
        return {
            error: "Please select a category",
        };
    }

    if (!data.priority) {
        return {
            error: "Please select a priority",
        };
    }

    if (!data.description.trim()) {
        return {
            error: "Complaint description is required",
        };
    }

    let ticketNo = generateTicketNo();

    let existingTicket = await db.complaint.findUnique({
        where: {
            ticketNo,
        },
    });

    while (existingTicket) {
        ticketNo = generateTicketNo();

        existingTicket = await db.complaint.findUnique({
            where: {
                ticketNo,
            },
        });
    }

    try {
        const complaint = await db.complaint.create({
            data: {
                ticketNo,
                residentId: resident.id,
                title: data.title.trim(),
                category: data.category,
                priority: data.priority,
                description: data.description.trim(),
                status: "SUBMITTED",
            },
        });

        await redis.del(`complaints:resident:${resident.id}`);
        await redis.del("complaints:admin:all");

        revalidatePath("/resident/complaints");
        revalidatePath("/admin/complaints");

        return {
            success: true,
            complaint,
        };
    } catch (error) {
        console.error("Create complaint error:", error);

        return {
            error: "Failed to create complaint",
        };
    }
}

export async function getComplaintDetails(
    complaintId: string
) {
    const session = await getSession();

    if (!session || session.role !== "RESIDENT") {
        return null;
    }

    const resident = await db.resident.findUnique({
        where: {
            userId: session.id as string,
        },
    });

    if (!resident) {
        return null;
    }

    const complaint = await db.complaint.findFirst({
        where: {
            id: complaintId,
            residentId: resident.id,
        },
        include: {
            comments: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    return complaint;
}

export async function addComplaintComment(
    complaintId: string,
    message: string
) {
    const session = await getSession();

    if (!session || session.role !== "RESIDENT") {
        return {
            error: "Unauthorized",
        };
    }

    const resident = await db.resident.findUnique({
        where: {
            userId: session.id as string,
        },
        include: {
            user: true,
        },
    });

    if (!resident) {
        return {
            error: "Resident profile not found",
        };
    }

    if (!message.trim()) {
        return {
            error: "Comment cannot be empty",
        };
    }

    const complaint = await db.complaint.findFirst({
        where: {
            id: complaintId,
            residentId: resident.id,
        },
    });

    if (!complaint) {
        return {
            error: "Complaint not found",
        };
    }

    try {
        const comment = await db.complaintComment.create({
            data: {
                complaintId: complaint.id,
                authorName: resident.user.name,
                authorRole: "RESIDENT",
                message: message.trim(),
            },
        });

        await redis.del(`complaints:resident:${resident.id}`);
        await redis.del("complaints:admin:all");

        revalidatePath("/resident/complaints");

        return {
            success: true,
            comment,
        };
    } catch (error) {
        console.error(
            "Add complaint comment error:",
            error
        );

        return {
            error: "Failed to add comment",
        };
    }
}

/* =========================================================
   ADMIN FUNCTIONS
========================================================= */

export async function getAdminComplaints() {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
        return null;
    }

    const cacheKey = "complaints:admin:all";
    const cachedComplaints = await redis.get(cacheKey);

    if (cachedComplaints) {
        return JSON.parse(cachedComplaints);
    }

    try {
        const complaints = await db.complaint.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                resident: {
                    include: {
                        user: true,
                        unit: true,
                    },
                },
                comments: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });

        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(complaints));

        return complaints;
    } catch (error) {
        console.error(
            "Get admin complaints error:",
            error
        );

        return null;
    }
}

export async function updateComplaintStatus(
    complaintId: string,
    status: string
) {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
        return {
            error: "Unauthorized",
        };
    }

    const allowedStatuses = [
        "SUBMITTED",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
    ];

    if (!allowedStatuses.includes(status)) {
        return {
            error: "Invalid complaint status",
        };
    }

    try {
        const complaint = await db.complaint.findUnique({
            where: {
                id: complaintId,
            },
        });

        if (!complaint) {
            return {
                error: "Complaint not found",
            };
        }

        const updatedComplaint =
            await db.complaint.update({
                where: {
                    id: complaintId,
                },
                data: {
                    status,
                },
            });

        revalidatePath("/admin/complaints");
        revalidatePath("/resident/complaints");

        return {
            success: true,
            complaint: updatedComplaint,
        };
    } catch (error) {
        console.error(
            "Update complaint status error:",
            error
        );

        return {
            error: "Failed to update complaint status",
        };
    }
}

export async function assignComplaint(
    complaintId: string,
    assignedTo: string
) {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
        return {
            error: "Unauthorized",
        };
    }

    if (!assignedTo.trim()) {
        return {
            error: "Please provide an assignee",
        };
    }

    try {
        const complaint = await db.complaint.findUnique({
            where: {
                id: complaintId,
            },
        });

        if (!complaint) {
            return {
                error: "Complaint not found",
            };
        }

        const updatedComplaint =
            await db.complaint.update({
                where: {
                    id: complaintId,
                },
                data: {
                    assignedTo: assignedTo.trim(),
                    status:
                        complaint.status === "SUBMITTED"
                            ? "ASSIGNED"
                            : complaint.status,
                },
            });

        revalidatePath("/admin/complaints");
        revalidatePath("/resident/complaints");

        return {
            success: true,
            complaint: updatedComplaint,
        };
    } catch (error) {
        console.error(
            "Assign complaint error:",
            error
        );

        return {
            error: "Failed to assign complaint",
        };
    }
}

export async function addAdminComplaintComment(
    complaintId: string,
    message: string
) {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
        return {
            error: "Unauthorized",
        };
    }

    if (!message.trim()) {
        return {
            error: "Comment cannot be empty",
        };
    }

    const admin = await db.user.findUnique({
        where: {
            id: session.id as string,
        },
    });

    if (!admin) {
        return {
            error: "Admin user not found",
        };
    }

    const complaint = await db.complaint.findUnique({
        where: {
            id: complaintId,
        },
    });

    if (!complaint) {
        return {
            error: "Complaint not found",
        };
    }

    try {
        const comment =
            await db.complaintComment.create({
                data: {
                    complaintId: complaint.id,
                    authorName: admin.name,
                    authorRole: "ADMIN",
                    message: message.trim(),
                },
            });

        await redis.del(`complaints:resident:${complaint.residentId}`);
        await redis.del("complaints:admin:all");

        revalidatePath("/admin/complaints");
        revalidatePath("/resident/complaints");

        return {
            success: true,
            comment,
        };
    } catch (error) {
        console.error(
            "Add admin complaint comment error:",
            error
        );

        return {
            error: "Failed to add admin comment",
        };
    }
}