"use client";

import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { FiChevronsRight } from "react-icons/fi";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarContext } from "@/store/sidebarContext";

import { FiGrid, FiSettings, FiLock } from "react-icons/fi";
import { HiOutlineCollection } from "react-icons/hi";
import { LuBox, LuUsersRound } from "react-icons/lu";
import { TbShoppingCartDollar } from "react-icons/tb";
import { RiUserStarLine } from "react-icons/ri";
import { FiCalendar } from "react-icons/fi";
import { MdOutlinePermMedia } from "react-icons/md";

import Logo from "@/components/ui/Logo";

export const iconMap = {
  FiGrid,
  FiSettings,
  FiLock,
  HiOutlineCollection,
  LuBox,
  LuUsersRound,
  TbShoppingCartDollar,
  RiUserStarLine,
  FiCalendar,
  MdOutlinePermMedia,
};

export default function Sidebar({ logo, routes = [], footerRoutes = [] }) {
  const { isMobile, isSidebarOpen, setIsSidebarOpen } = useSidebarContext();

  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex-1">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside
        className={clsx(
          "fixed md:relative top-0 left-0 bottom-0 z-40 flex h-screen flex-col border-r border-r-gray-200 bg-white transition-[width,transform]",
          clsx(
            isSidebarOpen
              ? "translate-x-0 w-80 px-6 pt-2.5 pb-6"
              : "-translate-x-full md:-translate-x-0 p-2 pt-2.5 w-20"
          )
        )}
      >
        {/* Header */}
        <div
          className={clsx("flex items-center justify-between", {
            "justify-center": !isSidebarOpen,
          })}
        >
          {isSidebarOpen && (
            <button onClick={() => router.push("/")}>
              {/* <Image
                src={logo}
                alt="logo"
                priority
                className={clsx("max-w-36 transition-opacity duration-200", {
                  "opacity-0 w-0": !isSidebarOpen,
                  "opacity-100 w-auto": isSidebarOpen,
                })}
              /> */}
              <Logo />
            </button>
          )}
          <button onClick={toggleSidebar} className="cursor-pointer h-16">
            <FiChevronsRight
              className={clsx("text-3xl transition-transform duration-200", {
                "rotate-180": isSidebarOpen,
              })}
            />
          </button>
        </div>

        {/* Routes */}
        <nav className="mt-8 flex-1 flex flex-col gap-y-2.5 overflow-y-auto">
          {routes.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isSidebarOpen={isSidebarOpen}
              segment={segment}
              onClick={isMobile ? toggleSidebar : undefined}
            />
          ))}
        </nav>

        {/* Footer Routes */}
        <nav className="space-y-2.5 pt-4">
          {footerRoutes.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              isSidebarOpen={isSidebarOpen}
              segment={segment}
              onClick={isMobile ? toggleSidebar : undefined}
            />
          ))}
        </nav>
      </aside>
    </div>
  );
}

const NavItem = ({ item, isSidebarOpen, segment, onClick }) => {
  const Icon = iconMap[item.icon];

  return (
    <Link
      href={item.href}
      prefetch={item.prefetch ?? true}
      onClick={onClick}
      className={clsx(
        "w-full flex items-center gap-2.5 rounded-lg py-4 px-0 text-lg font-bold transition-[padding,background,color] duration-300 cursor-pointer",
        `/admin${segment ? `/${segment}` : ""}` === item.href
          ? "px-5 bg-foreground-primary text-white shadow-md"
          : "hover:px-5 hover:bg-accent-primary hover:text-white text-foreground-primary",
        { "justify-center": !isSidebarOpen }
      )}
    >
      <Icon className="h-7 w-6 flex-shrink-0" />
      {isSidebarOpen && !(!isSidebarOpen && !isSidebarOpen) && (
        <span className="truncate">{item.name}</span>
      )}
    </Link>
  );
};
