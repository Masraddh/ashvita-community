"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getResidentBills() {
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

  const bills = await db.maintenanceBill.findMany({
    where: {
      unitId: resident.unitId,
    },
    orderBy: {
      dueDate: "desc",
    },
    include: {
      payments: true,
    },
  });

  // Convert database field names to the names
  // expected by the Payments UI.
  return bills.map((bill) => ({
    ...bill,
    billingPeriod: bill.billingMonth,
    baseAmount: bill.amount,
    totalAmount: bill.amount + bill.lateFee,
  }));
}

export async function processDemoPayment(
  billId: string,
  amount: number,
  paymentMethod: string
) {
  const session = await getSession();

  if (!session || session.role !== "RESIDENT") {
    return { error: "Unauthorized" };
  }

  const resident = await db.resident.findUnique({
    where: {
      userId: session.id as string,
    },
  });

  if (!resident) {
    return { error: "Resident not found" };
  }

  const bill = await db.maintenanceBill.findUnique({
    where: {
      id: billId,
    },
  });

  if (!bill) {
    return { error: "Bill not found" };
  }

  if (bill.unitId !== resident.unitId) {
    return { error: "Unauthorized access to bill" };
  }

  if (bill.status === "PAID") {
    return { error: "Bill is already paid" };
  }

  // Simulate payment processing
  const transactionId = `TXN-${Math.floor(
    Math.random() * 1000000000
  )}`;

  try {
    await db.$transaction([
      db.payment.create({
        data: {
          billId: bill.id,
          residentId: resident.id,
          amount: amount,
          paymentMethod: paymentMethod,
          transactionId: transactionId,
        },
      }),

      db.maintenanceBill.update({
        where: {
          id: bill.id,
        },
        data: {
          status: "PAID",
        },
      }),
    ]);

    revalidatePath("/resident/payments");

    return {
      success: true,
      transactionId,
    };
  } catch (err) {
    console.error("Payment processing error:", err);

    return {
      error: "Payment failed to process",
    };
  }
}