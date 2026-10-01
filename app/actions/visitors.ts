"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function generatePassCode() {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `VP-${random}`;
}

/* =========================================================
   RESIDENT — GET VISITOR PASSES
========================================================= */

export async function getResidentVisitors() {
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

    const visitors = await db.visitorPass.findMany({
        where: {
            residentId: resident.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            logs: {
                orderBy: {
                    checkInTime: "desc",
                },
                include: {
                    checkedInBy: true,
                    checkedOutBy: true,
                },
            },
        },
    });

    return visitors;
}

/* =========================================================
   RESIDENT — CREATE VISITOR PASS
========================================================= */

export async function createVisitorPass(data: {
    visitorName: string;
    visitorPhone: string;
    vehicleNo?: string;
    purpose: string;
    visitorType: string;
    expectedTime: string;
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

    if (!data.visitorName.trim()) {
        return {
            error: "Visitor name is required",
        };
    }

    if (!data.visitorPhone.trim()) {
        return {
            error: "Visitor phone number is required",
        };
    }

    if (!data.purpose.trim()) {
        return {
            error: "Purpose is required",
        };
    }

    if (!data.visitorType) {
        return {
            error: "Visitor type is required",
        };
    }

    if (!data.expectedTime) {
        return {
            error: "Expected arrival time is required",
        };
    }

    let passCode = generatePassCode();

    let existingPass = await db.visitorPass.findUnique({
        where: {
            passCode,
        },
    });

    while (existingPass) {
        passCode = generatePassCode();

        existingPass = await db.visitorPass.findUnique({
            where: {
                passCode,
            },
        });
    }

    const expectedTime = new Date(data.expectedTime);

    if (Number.isNaN(expectedTime.getTime())) {
        return {
            error: "Invalid expected arrival time",
        };
    }

    try {
        const visitor = await db.visitorPass.create({
            data: {
                passCode,
                residentId: resident.id,
                visitorName: data.visitorName.trim(),
                visitorPhone: data.visitorPhone.trim(),
                vehicleNo: data.vehicleNo?.trim() || null,
                purpose: data.purpose.trim(),
                visitorType: data.visitorType,
                expectedTime,
                status: "EXPECTED",
            },
        });

        revalidatePath("/resident/visitors");
        revalidatePath("/admin/visitors");

        return {
            success: true,
            visitor,
        };
    } catch (error) {
        console.error(
            "Create visitor pass error:",
            error
        );

        return {
            error: "Failed to create visitor pass",
        };
    }
}

/* =========================================================
   ADMIN / SECURITY — GET ALL VISITORS
========================================================= */

export async function getAdminVisitors() {
    const session = await getSession();

    if (
        !session ||
        (session.role !== "ADMIN" &&
            session.role !== "SECURITY")
    ) {
        return null;
    }

    try {
        const visitors = await db.visitorPass.findMany({
            orderBy: {
                expectedTime: "desc",
            },
            include: {
                resident: {
                    include: {
                        user: true,
                        unit: true,
                    },
                },
                logs: {
                    orderBy: {
                        checkInTime: "desc",
                    },
                    include: {
                        checkedInBy: true,
                        checkedOutBy: true,
                    },
                },
            },
        });

        return visitors;
    } catch (error) {
        console.error(
            "Get visitors error:",
            error
        );

        return null;
    }
}

/* =========================================================
   SECURITY — CHECK IN VISITOR
========================================================= */

export async function checkInVisitor(
    passId: string
) {
    const session = await getSession();

    if (
        !session ||
        (session.role !== "SECURITY" &&
            session.role !== "ADMIN")
    ) {
        return {
            error: "Unauthorized",
        };
    }

    try {
        const visitor = await db.visitorPass.findUnique({
            where: {
                id: passId,
            },
        });

        if (!visitor) {
            return {
                error: "Visitor pass not found",
            };
        }

        if (visitor.status === "CHECKED_IN") {
            return {
                error: "Visitor is already checked in",
            };
        }

        if (visitor.status === "CHECKED_OUT") {
            return {
                error: "This visitor pass has already been completed",
            };
        }

        const securityStaff = await db.securityStaff.findUnique({
            where: {
                userId: session.id as string,
            },
        });

        if (!securityStaff && session.role === "SECURITY") {
            return {
                error: "Security staff profile not found",
            };
        }

        const log = await db.visitorLog.create({
            data: {
                passId: visitor.id,
                checkedInById: securityStaff?.id || null,
            },
        });

        await db.visitorPass.update({
            where: {
                id: visitor.id,
            },
            data: {
                status: "CHECKED_IN",
            },
        });

        revalidatePath("/admin/visitors");
        revalidatePath("/security/visitors");
        revalidatePath("/resident/visitors");

        return {
            success: true,
            log,
        };
    } catch (error) {
        console.error(
            "Check in visitor error:",
            error
        );

        return {
            error: "Failed to check in visitor",
        };
    }
}

/* =========================================================
   SECURITY — CHECK OUT VISITOR
========================================================= */

export async function checkOutVisitor(
    passId: string
) {
    const session = await getSession();

    if (
        !session ||
        (session.role !== "SECURITY" &&
            session.role !== "ADMIN")
    ) {
        return {
            error: "Unauthorized",
        };
    }

    try {
        const visitor = await db.visitorPass.findUnique({
            where: {
                id: passId,
            },
        });

        if (!visitor) {
            return {
                error: "Visitor pass not found",
            };
        }

        if (visitor.status !== "CHECKED_IN") {
            return {
                error: "Visitor is not currently checked in",
            };
        }

        const securityStaff = await db.securityStaff.findUnique({
            where: {
                userId: session.id as string,
            },
        });

        if (!securityStaff && session.role === "SECURITY") {
            return {
                error: "Security staff profile not found",
            };
        }

        const activeLog = await db.visitorLog.findFirst({
            where: {
                passId: visitor.id,
                checkOutTime: null,
            },
            orderBy: {
                checkInTime: "desc",
            },
        });

        if (!activeLog) {
            return {
                error: "Active visitor log not found",
            };
        }

        const log = await db.visitorLog.update({
            where: {
                id: activeLog.id,
            },
            data: {
                checkOutTime: new Date(),
                checkedOutById: securityStaff?.id || null,
            },
        });

        await db.visitorPass.update({
            where: {
                id: visitor.id,
            },
            data: {
                status: "CHECKED_OUT",
            },
        });

        revalidatePath("/admin/visitors");
        revalidatePath("/security/visitors");
        revalidatePath("/resident/visitors");

        return {
            success: true,
            log,
        };
    } catch (error) {
        console.error(
            "Check out visitor error:",
            error
        );

        return {
            error: "Failed to check out visitor",
        };
    }
}

/* =========================================================
   SECURITY / ADMIN — REJECT VISITOR
========================================================= */

export async function rejectVisitor(
    passId: string
) {
    const session = await getSession();

    if (
        !session ||
        (session.role !== "SECURITY" &&
            session.role !== "ADMIN")
    ) {
        return {
            error: "Unauthorized",
        };
    }

    try {
        const visitor = await db.visitorPass.findUnique({
            where: {
                id: passId,
            },
        });

        if (!visitor) {
            return {
                error: "Visitor pass not found",
            };
        }

        if (visitor.status === "CHECKED_IN") {
            return {
                error: "A checked-in visitor cannot be rejected",
            };
        }

        const updatedVisitor =
            await db.visitorPass.update({
                where: {
                    id: passId,
                },
                data: {
                    status: "REJECTED",
                },
            });

        revalidatePath("/admin/visitors");
        revalidatePath("/security/visitors");
        revalidatePath("/resident/visitors");

        return {
            success: true,
            visitor: updatedVisitor,
        };
    } catch (error) {
        console.error(
            "Reject visitor error:",
            error
        );

        return {
            error: "Failed to reject visitor",
        };
    }
}