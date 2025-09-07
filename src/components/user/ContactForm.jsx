"use client";

import { Form } from "@/components/shadcn/form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/fields/Input";
import TextArea from "@/components/ui/fields/TextArea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().nonempty({ error: "Product name is required" }),
        email: z.email().nonempty({ error: "Email is required" }),
        phone: z
          .string()
          .max(10, { error: "Invalid phone number" })
          .nonempty({ error: "Phone is required" }),
        subject: z.string().nonempty({ error: "Subject is required" }),
        message: z.string().nonempty({ error: "Message is required" }),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // You can integrate API here
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => onSubmit(data, form))}
        className="space-y-5"
      >
        <div className="flex gap-4">
          <Input
            key={"name-input"}
            type="text"
            label="Name"
            name="name"
            form={form}
            required={true}
          />
          <Input
            key={"email-input"}
            type="email"
            label="Email"
            name="email"
            form={form}
            required={true}
          />
        </div>
        <div className="flex gap-4">
          <Input
            key={"phone-input"}
            type="number"
            label="Phone"
            name="phone"
            form={form}
            required={true}
          />
          <Input
            key={"subject-input"}
            type="text"
            label="Subject"
            name="subject"
            form={form}
            required={true}
          />
        </div>
        <TextArea
          key={"message-input"}
          label="Message"
          name="message"
          form={form}
          required={true}
        />
        <Button type="submit" appearance="solid" variant="primary">
          Submit
        </Button>
      </form>
    </Form>
  );
}
