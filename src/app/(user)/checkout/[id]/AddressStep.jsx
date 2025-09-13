"use client";

import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group";
import AddressModal from "@/components/ui/AddressModal";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { queryClient } from "@/services/Providers";

export default function AddressStep({
  step,
  item,
  updateAddress,
  savedAddresses,
}) {
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const [selectedAddress, setSelectedAddress] = useState(
    (item.address && savedAddresses?.find((a) => a.id === item.address.id)) ??
      savedAddresses?.[0] ??
      null
  );

  useEffect(() => {
    if (step.id === "address" && selectedAddress && !step.isCompleted) {
      updateAddress(selectedAddress);
    }
  }, [step.id, selectedAddress, step.isCompleted]);

  return (
    <>
      {savedAddresses?.length > 0 && (
        <RadioGroup
          className="my-4"
          onValueChange={(v) => {
            setSelectedAddress(savedAddresses.find((a) => a.id === v));
          }}
          defaultValue={selectedAddress?.id}
        >
          {savedAddresses.map((addr) => (
            <label
              key={addr.id}
              htmlFor={addr.id}
              className={cn(
                "flex items-center gap-3 border rounded-md p-3 cursor-pointer hover:bg-background-secondary",
                {
                  "bg-background-secondary": addr.id === selectedAddress?.id,
                }
              )}
            >
              <RadioGroupItem id={addr.id} value={addr.id} />
              <div>
                <p className="font-semibold">{addr.label}</p>
                <p className="text-xs text-foreground-secondary">
                  {addr.formattedAddress}
                </p>
              </div>
            </label>
          ))}
        </RadioGroup>
      )}

      <div>
        <Button onClick={() => setAddressModalOpen(true)} className="w-full">
          Add new Address
        </Button>
        <AddressModal
          open={addressModalOpen}
          onOpenChange={setAddressModalOpen}
          onSuccess={(address) => {
            queryClient.setQueryData(["savedAddresses"], (old) => ({
              ...old,
              data: [...(old?.data ?? []), address],
            }));
            setAddressModalOpen(false);
          }}
        />
      </div>
    </>
  );
}
