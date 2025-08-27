"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "#fff",
        "--normal-border": "var(--gray4)",
        "--normal-text": "var(--gray12)",
        "--success-bg": "oklch(66.513% 0.16679 153.645)",
        "--success-border": "oklch(66.513% 0.16679 153.645)",
        "--success-text": "oklch(100% 0.00011 271.152)",
        "--info-bg": "oklch(97.515% 0.01276 244.483)",
        "--info-border": "oklch(92.71% 0.03191 266.188)",
        "--info-text": "oklch(56.29% 0.18149 255.001)",
        "--warning-bg": "oklch(99.012% 0.01597 95.255)",
        "--warning-border": "oklch(94.506% 0.07889 97.528)",
        "--warning-text": "oklch(66.832% 0.16008 56.682)",
        "--error-bg": "oklch(63.175% 0.1931 29.694)",
        "--error-border": "oklch(63.175% 0.1931 29.694)",
        "--error-text": "oklch(100% 0.00011 271.152)",
      }}
      toastOptions={{
        duration: 2000,
        classNames: {
          title: "font-semibold text-sm select-none",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
