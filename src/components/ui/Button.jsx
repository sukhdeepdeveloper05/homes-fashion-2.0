"use client";

import { cn } from "@/lib/utils";
import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";

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
  onClick,
  className,
  ...rest
}) {
  const [ripples, setRipples] = useState([]);

  const isLink =
    appearance === "linkBackground" ||
    appearance === "linkForeground" ||
    appearance === "linkAccent";

  const variantClass = isLink
    ? variantClasses[appearance]
    : variantClasses[variant][appearance];

  const finalClassName = cn(
    "button inline-flex items-center justify-center gap-2 relative overflow-hidden disabled:pointer-events-none disabled:opacity-80",
    sizeClasses[size],
    variantClass,
    isLoading &&
      "opacity-90 animate-pulse animation-duration-[800ms] animation-timing-function-[cubic-bezier(0.4, 0, 0.2, 1)] cursor-default",
    className
  );

  const createRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };

    setRipples((prev) => [...prev, newRipple]);

    // cleanup after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 400);
  };

  return (
    <button
      className={cn(
        "relative inline-flex items-center gap-1.5",
        finalClassName
      )}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (isLoading) return;
        createRipple(e);
        onClick?.(e);
      }}
      {...rest}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-background-primary/70 pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            top: r.y,
            left: r.x,
            opacity: 0.7,
          }}
          animate={{
            width: r.size * 2, // expand enough to cover button
            height: r.size * 2,
            top: r.y - r.size,
            left: r.x - r.size,
            opacity: 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            borderRadius: "9999px", // force circle
          }}
        />
      ))}

      <span
        className={cn(
          "inline-flex items-center gap-2 relative z-[1]"
          // isLoading && "invisible"
        )}
      >
        {children}
      </span>
      {/* {isLoading && (
        <FiLoader
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin size-6"
          aria-hidden="true"
        />
      )} */}
    </button>
  );
}
