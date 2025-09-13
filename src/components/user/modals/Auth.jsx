"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { Form } from "@/components/shadcn/form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/fields/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import OtpPhoneIcon, { MessagePhoneIcon } from "@/assets/icons/Phone";
import { useState } from "react";
import InputOTP from "@/components/ui/fields/InputOpt";
import { requestOtp, signIn } from "@/actions/auth";
import { useRouter } from "nextjs-toploader/app";

export default function AuthModal({ open, onOpenChange }) {
  const [step, setStep] = useState(1);

  const loginForm = useForm({
    resolver: zodResolver(
      z.object({
        phone: z
          .string()
          .regex(/^\d{10}$/, { message: "" })
          .nonempty({ error: "Phone is required" }),
      })
    ),
    defaultValues: { phone: "" },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onOpenChange(false);
        setStep(1);
      }}
    >
      <DialogContent
        className="sm:max-w-md rounded-2xl min-w-[580px]"
        overlayClassName="overlay"
        showCloseButton={false}
      >
        {step === 1 ? (
          <LoginContent form={loginForm} onSuccess={() => setStep(2)} />
        ) : (
          <OptContent loginForm={loginForm} onSuccess={onOpenChange} />
        )}

        <DialogClose className="fixed -top-10 right-1 z-[1000] bg-white rounded-full p-2">
          <XIcon />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function LoginContent({ form, onSuccess }) {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["user-signin"],
    mutationFn: async (values) => {
      return await requestOtp({
        phone: "+91" + values.phone,
        userType: "customer",
      });
    },
  });

  async function onSubmit(data) {
    try {
      const response = await mutateAsync(data);
      toast.success(response?.message || "OTP Sent");
      onSuccess();
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4">
          <MessagePhoneIcon />
        </DialogTitle>
        <DialogDescription className="gap-y-1 flex flex-col">
          <span className="text-[28px] font-bold text-foreground-primary">
            Enter your phone number
          </span>
          <span className="text-sm text-foreground-primary">
            We’ll send you a text with a verification code. Standard tariff may
            apply.
          </span>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex">
            <Input
              id="phone"
              type="text"
              inputMode="numeric"
              placeholder="Enter your phone number"
              name="phone"
              maxLength={10}
              className="rounded-l-none aria-invalid:ring-transparent aria-invalid:border-input"
              beforeContent={
                <button
                  disabled
                  className="px-6 py-3 rounded-l-lg border-input border border-r-0 text-muted-foreground flex items-center justify-center gap-0.5"
                >
                  <span>+91</span>
                  <IoIosArrowDown className="opacity-60" />
                </button>
              }
            />
          </div>
          <Button
            type="submit"
            className="w-full disabled:opacity-50"
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
      <DialogFooter className="sm:justify-start">
        <p className="text-xs text-foreground-secondary">
          By continuing, you agree to our T&C and Privacy policy.
        </p>
      </DialogFooter>
    </>
  );
}

function OptContent({ loginForm, onSuccess }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      z.object({
        otp: z
          .string()
          .length(6, { error: "Invalid otp" })
          .nonempty({ error: "otp is required" }),
      })
    ),
    defaultValues: { otp: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["user-signin-verify"],
    mutationFn: async (values) =>
      await signIn({
        phone: "+91" + loginForm.watch("phone"),
        secretCode: values.otp,
        userType: "customer",
      }),
  });

  async function onSubmit(data) {
    try {
      const response = await mutateAsync(data);
      toast.success(response?.message || "Login Successful");
      onSuccess();
      router.refresh();
    } catch (error) {
      toast.error(error?.message || "Invalid OTP");
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold mb-4">
          <OtpPhoneIcon />
        </DialogTitle>
        <DialogDescription className="gap-y-1 flex flex-col">
          <span className="text-[28px] font-bold text-foreground-primary">
            Enter verification code
          </span>
          <span className="text-sm text-foreground-primary">
            A 6-digit verification code has been sent to +91{" "}
            {loginForm.watch("phone")}
          </span>
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex">
            <Controller
              name="otp"
              control={form.control}
              render={({ field }) => (
                <InputOTP
                  disabled={isPending}
                  maxLength={6}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  autofocus={true}
                  className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full disabled:opacity-50"
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid}
            isLoading={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
      <DialogFooter className="sm:justify-start">
        <p className="text-xs text-foreground-secondary">
          By continuing, you agree to our T&C and Privacy policy.
        </p>
      </DialogFooter>
    </>
  );
}
