import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

const sizeClasses = {
  small: "button-small",
  medium: "button-medium",
  large: "button-large",
};

const variantClasses = {
  primary: {
    solid: "button-primary__solid",
    outline: "button-primary__outline",
  },
  foreground: {
    solid: "button-foreground__solid",
    outline: "button-foreground__outline",
  },
  linkBackground: "button-link__background",
  linkForeground: "button-link__foreground",
  linkAccent: "button-link__accent",
};

export default function Button({
  children,
  size = "medium",
  variant = "primary",
  appearance = "solid",
  isLoading = false,
  disabled = false,
  className,
  ...rest
}) {
  const isLink =
    appearance === "linkBackground" ||
    appearance === "linkForeground" ||
    appearance === "linkAccent";

  const variantClass = isLink
    ? variantClasses[appearance]
    : variantClasses[variant][appearance];

  const finalClassName = clsx(
    "button inline-flex items-center justify-center gap-2 relative",
    sizeClasses[size],
    variantClass,
    isLoading && "opacity-90 pointer-events-none",
    className
  );

  return (
    <button
      className={finalClassName}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <FiLoader
          className="absolute animate-spin h-5 w-5"
          aria-hidden="true"
        />
      )}
      <span
        className={clsx("inline-flex items-center gap-1.5", {
          "opacity-0": isLoading,
        })}
      >
        {children}
      </span>
    </button>
  );
}
