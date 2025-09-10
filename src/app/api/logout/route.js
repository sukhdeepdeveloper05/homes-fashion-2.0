import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.json({ message: "Logout successful" });

  res.cookies.set({
    name: "auth_user",
    value: "",
    path: "/",
    expires: new Date(0), // expire immediately
  });

  return res;
}
