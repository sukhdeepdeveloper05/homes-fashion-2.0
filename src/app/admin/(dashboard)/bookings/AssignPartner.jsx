"use client";

import Checkbox from "@/components/ui/fields/Checkbox";
import SidebarModal from "@/components/admin/ui/modals/SidebarModal";
import Image from "next/image";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import {
  invalidateQueries,
  useInfiniteListQuery,
  useListQuery,
  useUpdateMutation,
} from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import z from "zod";
import { toast } from "sonner";
import { useController, useForm } from "react-hook-form";
import { MEDIA_URL } from "@/config/Consts";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AssignPartnerModal() {
  const {
    initialData: { id: bookingId, partner } = {},
    isShown,
    close,
  } = useSidebarFormContext();

  const [search, setSearch] = useState("");

  const assignPartnerMutation = useUpdateMutation({
    handle: "booking",
    url: `/bookings`,
  });

  const schema = z.object({
    partner: z.string().nonempty({ error: "Partner is required" }),
  });

  async function handleSubmit(values, form) {
    try {
      await assignPartnerMutation.mutateAsync({
        id: bookingId,
        values: { partner: values.partner },
      });
      form.reset();
      close();
      invalidateQueries("bookings");
      invalidateQueries(bookingId);
    } catch (error) {}
  }

  const fields = [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search Partners",
      size: "md",
      wrapperClass: "w-full",
      value: search,
      onKeyDown: (e) => e.key === "Enter" && e.preventDefault(),
      onSearch: setSearch,
    },
  ];

  return (
    <SidebarModal
      open={isShown}
      onClose={close}
      schema={schema}
      defaultValues={{ partner: partner?.id || partner || "" }}
      title={`Assign Partner`}
      list={fields}
      submitLabel={"Assign"}
      loading={assignPartnerMutation.isPending}
      onSubmit={handleSubmit}
    >
      <PartnersList search={search} />
    </SidebarModal>
  );
}

function PartnersList({ search }) {
  const { data: { partners = [], pagination = {} } = {}, isFetching } =
    useListQuery({
      handle: "partners",
      url: "/partners",
      queryKey: ["partners", search],
      params: { search },
      requiresAuth: true,
    });

  const {
    field: { value, onChange },
  } = useController({
    name: "partner",
  });

  return (
    <div className="flex-1 overflow-y-auto border-t border-gray-200">
      <RadioGroup
        className="min-h-1/2"
        onValueChange={(v) => {
          console.log(v);
          onChange(v);
        }}
        defaultValue={value || ""}
      >
        {partners.map((partner) => (
          <label
            key={partner.id}
            className="border-b border-gray-200 py-3 text-sm flex items-center justify-between px-4 select-none cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex-shrink-0 rounded-md overflow-hidden bg-foreground-secondary flex items-center justify-center uppercase text-xl font-bold text-white size-10`}
              >
                {partner.avatar ? (
                  <Image
                    src={`${MEDIA_URL}${partner.avatar.src}`}
                    alt=""
                    width={100}
                    height={100}
                    className="size-full object-cover"
                  />
                ) : (
                  partner.name[0]
                )}
              </span>
              <span className="line-clamp-1 text-ellipsis">{partner.name}</span>
            </div>
            <RadioGroupItem id={partner.id} value={partner.id} />
          </label>
        ))}
      </RadioGroup>

      {isFetching && (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      )}
    </div>
  );
}
