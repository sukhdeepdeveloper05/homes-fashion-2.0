"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "../modals/Auth";
import { useEffect, useRef, useState } from "react";
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
import Logo from "@/components/ui/Logo";
import { useError } from "@/store/error";
// import logo from "@/assets/images/logo.webp";
// import Image from "next/image";

export default function Header({ user }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isError } = useError();
  const darkRoutes = ["/"];
  const isDark = !isError && darkRoutes.includes(pathname);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const headerRef = useRef();

  useEffect(() => {
    function handleResize() {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        document
          .querySelector(":root")
          .style.setProperty("--header-height", `${headerHeight}px`);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [headerRef.current]);

  const { data: { collections = [] } = {} } = useListQuery({
    handle: "collections",
    url: "/collections",
    queryKey: ["collections"],
  });

  return (
    <header
      className={cn(
        "bg-background-primary",
        isDark && "dark absolute inset-0 z-50 bottom-auto bg-transparent",
        !isDark && "bg-white sticky top-0 z-50"
      )}
      ref={headerRef}
    >
      <div className="grid grid-cols-2 md:grid-cols-[140px_1fr_140px] xl:grid-cols-3 items-center justify-between px-5 lg:px-10 py-3 lg:py-5 border-b dark:border-white/20 border-black/10">
        <div className="flex items-center">
          <Link href="/" className="inline-flex">
            {/* <Image
              src={logo}
              alt="logo"
              priority
              className={"w-24 transition-opacity duration-200 dark:invert"}
            /> */}
            <Logo />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-10 text-foreground-primary dark:text-background-primary">
          <Link
            href="/"
            className="font-medium data-[active=true]:font-bold uppercase"
            data-active={pathname === "/"}
          >
            Home
          </Link>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className="relative dark:text-background-primary py-[7px] font-medium data-[active=true]:font-semibold uppercase"
              data-active={
                pathname.startsWith("/services") ||
                pathname.startsWith("/collections")
              }
            >
              <span className="flex items-center gap-2">Services</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 p-2" align="start">
              {collections?.slice(0, 3).map((collection) => (
                <DropdownMenuItem asChild key={collection.id}>
                  <Link
                    href={"/collections/" + collection.id}
                    className="!text-base cursor-pointer data-[active=true]:font-semibold"
                    data-active={
                      pathname.startsWith("/services") ||
                      (pathname.startsWith("/collections") &&
                        pathname.startsWith("/collections/" + collection.id))
                    }
                  >
                    {collection.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/contact-us"
            className="font-medium data-[active=true]:font-bold uppercase"
            data-active={pathname.startsWith("/contact-us")}
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-4">
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
      <AuthModal
        open={isModalOpen}
        onOpenChange={() => {
          setIsModalOpen(false);
        }}
      />
    </header>
  );
}
