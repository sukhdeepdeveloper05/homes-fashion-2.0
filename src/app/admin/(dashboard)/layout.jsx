import logo from "@/assets/images/logo.png";

import Sidebar from "@/components/admin/ui/Sidebar";
import AuthHeader from "@/components/admin/shared/AuthHeader";
import { getAuthUser } from "@/actions/user";
import SidebarFormContextProvider from "@/store/sidebarFormContext";
import { SidebarContextProvider } from "@/store/sidebarContext";

const ADMIN_NAV = [
  { name: "Dashboard", icon: "FiGrid", href: "/admin", roles: ["admin"] },
  {
    name: "Collections",
    icon: "HiOutlineCollection",
    href: "/admin/collections",
    roles: ["admin"],
  },
  {
    name: "Products",
    icon: "LuBox",
    href: "/admin/products",
    roles: ["admin"],
  },
  {
    name: "Partners",
    icon: "RiUserStarLine",
    href: "/admin/partners",
    roles: ["admin"],
  },
  {
    name: "Customers",
    icon: "LuUsersRound",
    href: "/admin/customers",
    roles: ["admin"],
  },
  {
    name: "Orders",
    icon: "TbShoppingCartDollar",
    href: "/admin/orders",
    roles: ["admin"],
  },
  {
    name: "Bookings",
    icon: "FiCalendar",
    href: "/admin/bookings",
    roles: ["admin"],
  },
];

const FOOTER_NAV = [
  {
    name: "Settings",
    icon: "FiSettings",
    href: "/admin/settings",
    roles: ["admin"],
  },
  {
    name: "Sign Out",
    icon: "FiLock",
    href: "/admin/logout",
    roles: ["admin"],
    prefetch: false,
  },
];

const HEADER_NAV = [
  { href: "/admin", label: "Documents" },
  { href: "/admin/reports", label: "Reports" },
];

const PROFILE_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/logout", label: "Sign Out" },
];

export default async function DashboardLayout({ children }) {
  const user = await getAuthUser();

  return (
    <SidebarContextProvider>
      <SidebarFormContextProvider>
        <div className={`transition-all flex bg-gray-50`}>
          <Sidebar logo={logo} routes={ADMIN_NAV} footerRoutes={FOOTER_NAV} />

          <div className="w-full">
            <AuthHeader
              navLinks={HEADER_NAV}
              profileLinks={PROFILE_LINKS}
              user={user}
            />

            <main className="main h-[calc(100vh-4.5rem)] md:h-[calc(100vh-80px)] overflow-y-auto md:px-7 px-4 py-4 md:py-8 bg-gray-100">
              {children}
            </main>
          </div>
        </div>
      </SidebarFormContextProvider>
    </SidebarContextProvider>
  );
}
