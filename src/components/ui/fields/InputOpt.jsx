"use client";

import {
  InputOTP as SInputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/shadcn/input-otp";
import { useState } from "react";

export default function InputOTP({ maxLength = 6, form, name, ...props }) {
  return (
    <SInputOTP maxLength={maxLength} name={name} {...props}>
      <InputOTPGroup>
        <InputOTPSlot
          index={0}
          className="w-10 h-12 text-lg sm:w-12 sm:h-14 sm:text-xl"
        />
        <InputOTPSlot
          index={1}
          className="w-10 h-12 text-lg sm:w-12 sm:h-14 sm:text-xl"
        />
        <InputOTPSlot
          index={2}
          className="w-10 h-12 text-lg sm:w-12 sm:h-14 sm:text-xl"
        />
        <InputOTPSlot
          index={3}
          className="w-10 h-12 text-lg sm:w-12 sm:h-14 sm:text-xl"
        />
        <InputOTPSlot
          index={4}
          className="w-10 h-12 text-lg sm:w-12 sm:h-14 sm:text-xl"
        />
        <InputOTPSlot
          index={5}
          className="w-10 h-12 text-lg sm:w-12 sm:h-14 sm:text-xl"
        />
      </InputOTPGroup>
    </SInputOTP>
  );
}
