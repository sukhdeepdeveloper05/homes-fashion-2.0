"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// AUTH USER
export async function setAuthUser(user) {
  const cookieStore = await cookies();
  cookieStore.set("auth_user", JSON.stringify(user), {
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getAuthUser() {
  const cookieStore = await cookies();
  const rawUser = cookieStore.get("auth_user")?.value;

  return rawUser ? JSON.parse(rawUser) : null;
}

export async function removeAuthUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_user");
}
