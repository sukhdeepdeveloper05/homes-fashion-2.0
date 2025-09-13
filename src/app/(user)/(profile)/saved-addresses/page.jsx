"use client";

import { cn } from "@/lib/utils";
import { BiTrash } from "react-icons/bi";
import { FiEdit2, FiLoader } from "react-icons/fi";
import { useDeleteMutation, useListQuery } from "@/hooks/queries";
import { useRef, useState } from "react";
import AddressModal from "@/components/ui/AddressModal";
import Script from "next/script";
import { queryClient } from "@/services/Providers";
import Button from "@/components/ui/Button";
import { SkeletonBox } from "@/components/ui/Skeletons";
import DeleteButton from "@/components/ui/DeleteButton";

export default function SavedAddressesPage() {
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  const selectedAddress = useRef(null);

  const { data: { savedAddresses } = {}, isLoading } = useListQuery({
    handle: "savedAddresses",
    url: "/addresses",
    queryKey: ["user-saved-addresses"],
    requiresAuth: true,
  });

  const { mutateAsync: deleteAddress, isLoading: isDeleting } =
    useDeleteMutation({
      handle: "deleteAddress",
      url: "/addresses",
      mutationOptions: {
        onSuccess: (_, id) => {
          queryClient.setQueryData(["user-saved-addresses"], (oldData) => ({
            ...oldData,
            data: oldData.data.filter((a) => a.id !== id),
          }));
        },
      },
    });

  return (
    <>
      <Script
        src="https://www.unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js"
        async
      ></Script>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <Button
            size="small"
            onClick={() => {
              selectedAddress.current = null;
              setAddressModalOpen(true);
            }}
          >
            Add Address
          </Button>
        </div>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonBox key={i} className="w-full h-[66px] rounded-md" />
            ))}
          </div>
        )}

        {(!savedAddresses || savedAddresses?.length <= 0) && !isLoading && (
          <div className="flex items-center justify-center flex-1">
            <p className="text-foreground-secondary">
              No saved addresses found
            </p>
          </div>
        )}

        {savedAddresses && savedAddresses?.length > 0 && (
          <>
            <ul className="space-y-4">
              {savedAddresses.map((addr) => (
                <li
                  key={addr.id}
                  htmlFor={addr.id}
                  className={cn(
                    "flex items-center justify-between gap-3 border rounded-md p-3"
                  )}
                >
                  <div>
                    <p className="font-semibold">{addr.label}</p>
                    <p className="text-xs text-foreground-secondary">
                      {addr.formattedAddress}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        selectedAddress.current = addr;
                        setAddressModalOpen(true);
                      }}
                      className="rounded-md bg-accent-primary size-8 flex items-center justify-center"
                    >
                      <FiEdit2 className="text-white" />
                    </button>

                    <DeleteButton
                      deleteId={addr.id}
                      onDelete={deleteAddress}
                      title={"Delete Address"}
                      description={
                        "Are you sure you want to delete this address?"
                      }
                      isLoading={isDeleting}
                      showDialog={true}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <AddressModal
          open={addressModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setAddressModalOpen(false);
            }
          }}
          onSuccess={(address) => {
            queryClient.setQueryData(["user-saved-addresses"], (oldData) => {
              const exists = oldData.data.some((a) => a.id === address.id);

              return {
                ...oldData,
                data: exists
                  ? oldData.data.map((a) => (a.id === address.id ? address : a))
                  : [...oldData.data, address],
              };
            });

            selectedAddress.current = null;
            setAddressModalOpen(false);
          }}
          initialData={selectedAddress.current}
        />
      </div>
    </>
  );
}
