"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "My Profile", href: "/profile" },
  { name: "Saved Addresses", href: "/saved-addresses" },
  { name: "My Bookings", href: "/bookings" },
];

export default function ProfileLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex container flex-1 md:flex-row flex-col bg-white relative h-full">
      {/* Sidebar */}
      <aside className="md:w-64 md:border-r bg-gray-50 px-4 md:py-12 py-4">
        <nav className="flex md:flex-col justify-center gap-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "inline-flex rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-foreground-primary text-white"
                    : "text-gray-700 hover:bg-gray-200"
                )}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-6 py-12 overflow-y-auto">{children}</main>
    </div>
  );
}
