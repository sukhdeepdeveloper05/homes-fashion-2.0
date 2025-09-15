"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronDown, FiChevronsRight } from "react-icons/fi";
import Profile from "../ui/Profile";
import clsx from "clsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { useSidebarContext } from "@/store/sidebarContext";

export default function AuthHeader({ navLinks = [], profileLinks = [], user }) {
  const pathname = usePathname();

  const { setIsSidebarOpen } = useSidebarContext();

  return (
    <nav className="no-print sticky top-0 z-20 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:px-6 h-[80px]">
      {/* Mobile Sidebar Toggle */}
      <button
        className="text-gray-900 md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FiChevronsRight
          className={clsx("text-3xl transition-transform duration-200")}
        />
      </button>

      <div></div>
      {/* Nav Links */}
      {/* <ul className="hidden md:flex items-center space-x-6">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={clsx(
                "block py-2 font-semibold transition",
                pathname === href
                  ? "text-foreground-primary"
                  : "text-foreground-tertiary"
              )}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul> */}

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center cursor-pointer">
          <Profile user={user} imageClass="h-full object-cover" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56 rounded-md p-0 overflow-hidden"
        >
          {/* User Info */}
          <DropdownMenuLabel className="px-4 py-3">
            <span className="block font-semibold capitalize text-base">
              {user?.firstName} {user?.lastName ?? ""}
            </span>
            <span className="block truncate text-sm text-gray-500">
              {user?.email}
            </span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Profile Links */}
          <DropdownMenuGroup className="py-2 pb-3">
            {profileLinks.map(({ href, label }) => (
              <DropdownMenuItem key={label} asChild>
                <Link
                  href={href}
                  className="w-full cursor-pointer text-foreground-secondary hover:rounded-none px-4 py-2 font-medium"
                >
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
