import clsx from "clsx";
import { useState } from "react";
import { FiSearch, FiX, FiCommand } from "react-icons/fi";

const sizes = {
  xs: "text-xs py-2 px-3",
  sm: "text-sm py-2.5 px-3.5",
  md: "text-base py-3.5 px-4",
  lg: "text-lg py-4 px-5",
};

export default function SearchField({
  placeholder = "Search…",
  size = "md",
  wrapperClass = "",
  inputClass = "",
  iconLeft = null,
  iconRight = <FiSearch />,
  clearable = true,
  shortcut = false,
  disabled = false,
  onSearch = () => {},
  value = "",
  ...rest
}) {
  const [search, setSearch] = useState(value);

  const triggerSearch = () => {
    onSearch(search.trim());
  };

  const handleKey = (e) => {
    if (e.key === "Enter") triggerSearch();
    if (e.key === "Escape" && clearable) {
      setSearch("");
    }
  };

  return (
    <div className={`relative ${wrapperClass}`}>
      {iconLeft && (
        <button
          type="button"
          onClick={triggerSearch}
          className="absolute inset-y-0 left-0 flex items-center pl-4 text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {iconLeft}
        </button>
      )}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={clsx(
          "w-full rounded-lg border border-gray-300 text-foreground-primary bg-white placeholder-gray-500 outline-none",
          sizes[size],
          inputClass,
          { "pl-11": iconLeft },
          iconRight || clearable || shortcut ? "pr-12" : ""
        )}
        placeholder={placeholder}
        onKeyUp={handleKey}
        disabled={disabled}
        autoComplete="off"
        {...rest}
        type="text"
      />

      {(iconRight || clearable || shortcut) && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-5 space-x-2">
          {shortcut && (
            <span className="hidden sm:flex items-center space-x-1 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
              <FiCommand /> <span>K</span>
            </span>
          )}

          {clearable && search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <FiX />
            </button>
          )}

          {iconRight && (
            <button
              type="button"
              onClick={triggerSearch}
              className="text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {iconRight}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
