import { cn } from "@/lib/utils";
import React from "react";

export function MessagePhoneIcon({ className }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-12", className)}
    >
      <path
        d="M34.412 39.066l-7.302-6.639a1.798 1.798 0 00-2.498.078l-4.299 4.42c-1.035-.197-3.115-.846-5.256-2.982-2.141-2.142-2.79-4.228-2.982-5.255l4.417-4.3a1.796 1.796 0 00.078-2.5l-6.638-7.3a1.797 1.797 0 00-2.498-.156l-3.898 3.343c-.31.312-.496.727-.521 1.166-.027.45-.54 11.087 7.708 19.339C17.919 45.474 26.933 46 29.415 46c.363 0 .585-.01.645-.014.439-.025.854-.211 1.164-.523l3.34-3.9a1.791 1.791 0 00-.152-2.497z"
        fill="var(--accent-primary)"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.186 11c-.548 0-1.092.204-1.509.596-.42.396-.677.955-.677 1.561V27.5l5.262-4.753h7.782c.548 0 1.093-.203 1.51-.596.42-.395.676-.954.676-1.56v-7.434c0-.606-.256-1.165-.677-1.561A2.202 2.202 0 0038.044 11H27.186z"
        fill="var(--accent-primary)"
        className="opacity-20"
      ></path>
    </svg>
  );
}

export default function OtpPhoneIcon({ className }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-12", className)}
    >
      <rect
        x="17.334"
        y="4"
        width="24"
        height="40"
        rx="4"
        fill="#262626"
      ></rect>
      <path fill="#fff" d="M18.666 6.667h21.333v32H18.666z"></path>
      <path
        d="M25.333 28H8a4 4 0 01-4-4v-8a4 4 0 014-4h18.667a4 4 0 014 4v16l-5.334-4z"
        fill="var(--accent-primary)"
      ></path>
      <circle cx="9.333" cy="20" fill="#fff" r="1.333"></circle>
      <circle cx="14.667" cy="20" fill="#fff" r="1.333"></circle>
      <circle cx="20" cy="20" r="1.333" fill="#fff"></circle>
      <circle cx="25.333" cy="20" fill="#fff" r="1.333"></circle>
      <rect
        x="28"
        y="40"
        width="2.667"
        height="2.667"
        rx="1.333"
        fill="#757575"
      ></rect>
    </svg>
  );
}
