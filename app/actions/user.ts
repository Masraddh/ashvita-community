"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getResidentProfile() {
  const session = await getSession();
  if (!session || session.role !== "RESIDENT") return null;

  const resident = await db.resident.findUnique({
    where: { userId: session.id as string },
    include: {
      user: true,
      unit: {
        include: {
          tower: true,
        },
      },
    },
  });

  return resident;
}
