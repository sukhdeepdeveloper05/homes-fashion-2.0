"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthModal from "../modals/Auth";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/shadcn/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { UserIcon } from "lucide-react";
import { removeAuthUser } from "@/actions/user";
import { useProgress } from "@bprogress/next";

const darkRoutes = ["/"];

export default function Header({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = darkRoutes.includes(pathname);
  const progress = useProgress();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Whenever pathname changes (or refresh completes), stop progress
    progress.stop();
  }, [pathname, progress]);

  return (
    <header
      className={cn(
        "fixed inset-0 z-50 bottom-auto bg-background-primary",
        isDark && "dark absolute bg-transparent",
        !isDark && "mr-(--removed-body-scroll-bar-size)"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-16 py-7">
        <Link
          href="/"
          className="text-4xl font-bold text-foreground-primary dark:text-background-primary"
        >
          LOGO
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-foreground-primary dark:text-background-primary">
          <Link
            href="/"
            className="data-[active=true]:font-semibold"
            data-active={pathname === "/"}
          >
            Home
          </Link>
          <Link
            href="/services"
            className="data-[active=true]:font-semibold"
            data-active={pathname.startsWith("/services")}
          >
            Services
          </Link>
          <Link
            href="/contact-us"
            className="data-[active=true]:font-semibold"
            data-active={pathname.startsWith("/contact-us")}
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!user ? (
            <Button
              appearance="solid"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Log in
            </Button>
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="dark:text-background-primary py-[7px]">
                <Avatar className="cursor-pointer text-foreground-primary">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="dark:bg-background-primary">
                    <UserIcon className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>
                  <span className="font-medium">{user?.name}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookings" className="cursor-pointer">
                    My Bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={async () => {
                    progress.start();
                    await removeAuthUser();
                    router.refresh();
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="border-t dark:border-white/[7%] border-black/[7%]"></div>

      <AuthModal
        open={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
        }}
      />
    </header>
  );
}
