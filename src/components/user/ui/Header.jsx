"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { useListQuery } from "@/hooks/queries";
import { useRouter } from "nextjs-toploader/app";
import CartButton from "./CartButton";
import logo from "@/assets/images/logo.webp";
import Image from "next/image";

const darkRoutes = ["/"];

export default function Header({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const isDark = darkRoutes.includes(pathname);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: { collections = [] } = {} } = useListQuery({
    handle: "collections",
    url: "/collections",
    queryKey: ["collections"],
  });

  return (
    <header
      className={cn(
        "fixed inset-0 z-50 bottom-auto bg-background-primary",
        isDark && "dark absolute bg-transparent",
        !isDark && "mr-(--removed-body-scroll-bar-size)"
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 items-center justify-between px-16 py-7">
        <div className="flex items-center">
          <Link href="/" className="inline-flex">
            <Image
              src={logo}
              alt="logo"
              priority
              className={"w-24 transition-opacity duration-200 dark:invert"}
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 text-foreground-primary dark:text-background-primary">
          <Link
            href="/"
            className="data-[active=true]:font-semibold"
            data-active={pathname === "/"}
          >
            Home
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="dark:text-background-primary py-[7px]">
              <span className="flex items-center gap-2">Services</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 " align="start">
              {collections?.slice(0, 3).map((collection) => (
                <DropdownMenuItem asChild key={collection.id}>
                  <Link
                    href={"/collections/" + collection.id}
                    className="cursor-pointer"
                  >
                    {collection.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/contact-us"
            className="data-[active=true]:font-semibold"
            data-active={pathname.startsWith("/contact-us")}
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-4">
          <CartButton />
          {!user ? (
            <Button
              appearance="solid"
              variant="primary"
              size="small"
              onClick={() => setIsModalOpen(true)}
            >
              Log in
            </Button>
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                className="dark:text-background-primary"
                hideIcon
              >
                <Avatar className="cursor-pointer text-foreground-primary size-10 shadow rounded-full border border-input">
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
