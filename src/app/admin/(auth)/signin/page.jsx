"use client";

import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "@/actions/auth";
import Input from "@/components/ui/fields/Input";
import Button from "@/components/ui/Button";
import CoverImg from "@/assets/images/auth-banner.webp";
import { useMutation } from "@tanstack/react-query";
import { Form } from "@/components/shadcn/form";
import { toast } from "sonner";

const schema = z.object({
  email: z
    .email("Enter a valid email")
    .max(50, "Email must not exceed 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must include uppercase, lowercase, number, and special character."
    ),
  userType: z.literal("admin"),
});

const FIELDS = [
  { name: "email", type: "email", label: "Email Address" },
  { name: "password", type: "password", label: "Password" },
];

export default function AdminSignInPage() {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["admin-signin"],
    mutationFn: async (values) => {
      const res = await signIn(values);
      if (res?.error) throw new Error(res.error.message);
      return res;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Login Successful");
      router.push("/admin");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.message || "Login Failed");
    },
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", userType: "admin" },
  });

  const onSubmit = async (values) => {
    await mutateAsync(values);
  };

  return (
    <div className="grid max-lg:grid-rows-[1fr_1.2fr] lg:grid-cols-[1fr_1.5fr] h-screen overflow-hidden p-0 lg:p-6">
      {/* Cover Image */}
      <div className="block w-full lg:rounded-2xl overflow-hidden">
        <Image
          alt="Auth Cover"
          src={CoverImg}
          placeholder="blur"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Sign In Form */}
      <div className="max-w-[550px] mx-auto w-full h-full py-10 sm:py-20 lg:py-10 px-5 relative flex flex-col items-center justify-center">
        <h2 className="text-3xl sm:text-5xl font-bold text-center">
          Sign in as Admin
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 w-full py-8 lg:py-12"
          >
            <Input type="hidden" name="userType" control={form.control} />

            {FIELDS.map(({ name, type, label }) => (
              <div key={name} className="flex flex-col gap-1">
                <Input
                  type={type}
                  label={label}
                  name={name}
                  control={form.control}
                />
              </div>
            ))}

            <Button
              type="submit"
              size="medium"
              variant="primary"
              appearance="solid"
              className="w-full"
              isLoading={isPending}
            >
              Sign In
            </Button>
          </form>
        </Form>

        <p className="w-full text-gray-500 text-sm text-center mx-auto font-medium pb-0 flex-shrink-0 lg:absolute lg:bottom-0">
          © {new Date().getFullYear()} Homes Fashion. All rights reserved.
        </p>
      </div>
    </div>
  );
}
