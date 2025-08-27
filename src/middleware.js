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
  const isRoleArea =
    roleHome && (path === roleHome || path.startsWith(roleHome + "/"));
  const isAuthPage = ["/signin", "/admin/signin"].includes(path);

  if (!token) {
    if (path.startsWith("/admin") && path !== "/admin/signin") {
      return NextResponse.redirect(new URL("/admin/signin", req.url));
    }
    if (
      (path.startsWith("/partner") || path.startsWith("/customer")) &&
      path !== "/signin"
    ) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
    return NextResponse.next();
  }

  if (token) {
    if (!isRoleArea && roleHome) {
      return NextResponse.redirect(new URL(roleHome, req.url));
    }
    if (isAuthPage && roleHome) {
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
