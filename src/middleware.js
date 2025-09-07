import { NextResponse } from "next/server";
import { getAuthUser } from "./actions/user";

const ROLE_HOME = {
  admin: "/admin",
  partner: "/partner",
  customer: "/customer",
};

const ROLE_SIGNIN = {
  admin: "/admin/signin",
  partner: "/signin",
  customer: "/signin",
};

const PUBLIC_ROUTES = ["/", "/signin", "/admin/signin"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  const user = await getAuthUser();
  const token = user?.token;
  const role = user?.role;

  const roleHome = ROLE_HOME[role];
  const roleSignin = ROLE_SIGNIN[role];

  const isRoleArea =
    roleHome && (path === roleHome || path.startsWith(roleHome + "/"));
  const isAuthPage = ["/signin", "/admin/signin"].includes(path);
  const isPublic = PUBLIC_ROUTES.includes(path);

  // Case 1: Not logged in
  if (!token) {
    // block protected areas
    if (path.startsWith("/admin") && path !== "/admin/signin") {
      return NextResponse.redirect(new URL("/admin/signin", req.url));
    }
    if (
      (path.startsWith("/partner") || path.startsWith("/customer")) &&
      path !== "/signin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Case 2: Logged in
  if (token) {
    // visiting login page while logged in → send to role home
    if (isAuthPage && roleHome) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }

    // trying to access a different role’s area
    const allRoleHomes = Object.values(ROLE_HOME);
    const otherRoleArea = allRoleHomes.find(
      (home) => home !== roleHome && path.startsWith(home)
    );
    if (otherRoleArea) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico|html)).*)",
  ],
};
