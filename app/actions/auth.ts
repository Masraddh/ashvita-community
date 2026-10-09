"use server";

import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Invalid credentials" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return { error: "Invalid credentials" };
  }

  // Create token
  const token = await signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  // Determine redirect URL based on role
  let redirectUrl = "/";
  if (user.role === "RESIDENT") {
    redirectUrl = "/resident/dashboard";
  } else if (user.role === "ADMIN") {
    redirectUrl = "/admin/dashboard";
  } else if (user.role === "SECURITY") {
    redirectUrl = "/security/dashboard";
  }

  return { success: true, redirectUrl };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/login");
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required" };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // We will assign them a dummy unit for the sake of the demo
    // Grab the first tower to attach a dummy unit to
    const firstTower = await db.tower.findFirst();
    let unitId = "";

    if (!firstTower) {
      return { error: "No towers exist in database to assign a unit to" };
    }

    const newUnit = await db.unit.create({
      data: {
        towerId: firstTower.id,
        unitNumber: `DUMMY-${Math.floor(Math.random() * 1000)}`,
        floor: 1,
        status: "OCCUPIED",
      },
    });
    unitId = newUnit.id;

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "RESIDENT",
      },
    });

    await db.resident.create({
      data: {
        userId: user.id,
        unitId: unitId,
        residentType: "OWNER",
      },
    });

    // Create token
    const token = await signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true, redirectUrl: "/resident/dashboard" };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Failed to create account" };
  }
}
