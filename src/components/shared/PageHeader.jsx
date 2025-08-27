"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import SearchField from "../ui/fields/SearchField";
import Button from "../ui/Button";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import { HiPlus } from "react-icons/hi";
// import DateRangePicker from "./DateRangePicker";

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  search = false,
  onSearch,
  searchPlaceholder = "Search…",
  buttons = [],
  rangePicker = false,
  children,
  className = "",
}) {
  const { show, setInitialData } = useSidebarFormContext();

  const buttonsArr = [
    {
      label: "Add Product",
      identifier: "add",
      icon: <HiPlus fontSize={20} />,
      size: "medium",
      onClick: () => {
        setInitialData(null);
        show();
      },
    },
  ];

  const mergedButtons = buttonsArr
    .filter((button) => buttons.some((b) => b.identifier === button.identifier))
    .map((button) => {
      const override = buttons.find((b) => b.identifier === button.identifier);
      return { ...button, ...override }; // override label etc
    });

  const path = usePathname();
  const isDashboard = path.includes("/");

  return (
    <div
      className={`flex flex-col justify-between gap-5 pt-1.5 ${
        isDashboard ? "lg:flex-row lg:items-start" : "lg:flex-row"
      } ${className}`}
    >
      <div className="flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900 capitalize sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm font-medium text-gray-600">
            {description}
          </p>
        )}

        {!!breadcrumbs.length && (
          <ul className="mt-2 flex items-center gap-2 text-sm font-medium">
            {breadcrumbs.map((bc, i) => (
              <li
                key={i}
                className={bc.isActive ? "text-gray-900" : "text-gray-600"}
              >
                {bc.link ? <Link href={bc.link}>{bc.label}</Link> : bc.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(search || rangePicker || buttons.length || children) && (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {children}

          {search && (
            <SearchField
              size="xs"
              placeholder={searchPlaceholder}
              onSearch={onSearch}
              iconLeft
              wrapperClass="w-full lg:w-80"
              inputClass="border border-gray-300 pl-8"
            />
          )}

          {/* {rangePicker && <DateRangePicker />} */}

          {!!buttons.length && (
            <div className="flex flex-wrap gap-2">
              {mergedButtons.map((b) =>
                b.href ? (
                  <Link key={b.label} href={b.href}>
                    {console.log(b)}
                    <Button
                      variant={b.variant || "primary"}
                      size={b.size}
                      onClick={b.onClick}
                      isLoading={b.loading}
                      className={b.className}
                      {...b}
                    >
                      {b.icon}
                      {b.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    key={b.label}
                    variant={b.variant || "primary"}
                    size={b.size}
                    onClick={b.onClick}
                    isLoading={b.loading}
                    className={b.className}
                    {...b}
                  >
                    {b.icon}
                    {b.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
