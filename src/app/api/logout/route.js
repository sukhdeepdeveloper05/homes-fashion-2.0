import { NextResponse } from "next/server";

export async function POST(req) {
  const res = NextResponse.json({ message: "Logout successful" });

  // Expire the auth_user cookie
  res.cookies.set({
    name: "auth_user",
    value: "",
    path: "/",
    expires: new Date(0), // expire immediately
  });

  console.log(res);

  return res;
}
