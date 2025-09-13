"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useCartContext } from "@/store/cartContext";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "sonner";

import SlotStep from "./SlotStep";
import AddressStep from "./AddressStep";
import { useCreateMutation, useListQuery } from "@/hooks/queries";
import { SkeletonBox } from "@/components/ui/Skeletons";
import { Separator } from "@/components/shadcn/separator";
import QuantityButton from "@/components/user/ui/QuantityButton";
import { useRouter } from "next/navigation";

const TAX_RATE = 5;

export default function CheckoutContent({ params, isLoggedIn }) {
  const router = useRouter();

  if (!isLoggedIn) {
    throw new Error("You must be logged in to checkout");
  }

  const { id: checkoutId } = use(params);

  const {
    cart,
    updateItemMutation,
    isLoaded: isCartLoaded,
    isUpdating,
  } = useCartContext();

  let item;

  if (isCartLoaded) {
    item = cart.items.find((i) => i.id === checkoutId);
  }

  const [steps, setSteps] = useState([
    { id: "address", label: "Address", data: null },
    { id: "slot", label: "Slot", data: null },
    { id: "payment", label: "Payment", data: null },
  ]);

  const [activeStep, setActiveStep] = useState("address");
  const currentIndex = steps.findIndex((s) => s.id === activeStep);
  const currentStep = steps[currentIndex];

  const goToStep = (id) => setActiveStep(id);

  const nextStep = async () => {
    if (!currentStep.data) {
      return toast.error("Please complete this step first.");
    }

    let canProceed = true;

    if (activeStep === "address") {
      canProceed = await handleAddressStep(
        currentStep,
        item,
        checkoutId,
        updateItemMutation
      );
    }

    if (activeStep === "slot") {
      canProceed = await handleSlotStep(
        currentStep,
        item,
        checkoutId,
        updateItemMutation
      );
    }

    if (canProceed && currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1].id);
    }
  };

  const { data: { savedAddresses } = {}, isLoading: isSavedAddressesLoading } =
    useListQuery({
      handle: "savedAddresses",
      url: "/addresses",
      queryKey: ["savedAddresses"],
      requiresAuth: true,
      queryOptions: {
        enabled: !!item,
      },
    });

  const createOrder = useCreateMutation({
    url: "/orders/checkout",
    handle: "order",
  });

  async function handlePayment() {
    try {
      const { data } = await createOrder.mutateAsync({
        values: { cartItemId: checkoutId },
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // Your Razorpay Key ID
        ...data,

        handler: () => {
          router.push("/bookings");
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error(response.error.reason);
      });
      rzp1.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment initialization failed!");
    }
  }

  if (isCartLoaded && !item) {
    throw {
      message: "Item not found in cart",
    };
  }

  if (!isCartLoaded || isSavedAddressesLoading) {
    return (
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 min-h-[540px]">
        {/* LEFT SIDE Skeleton */}
        <div className="space-y-6">
          <SkeletonBox className="h-10 w-full" />
          <SkeletonBox className="h-60 w-full" />
        </div>

        {/* RIGHT SIDE Skeleton */}
        <div className="space-y-6">
          <SkeletonBox className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 min-h-[540px]">
      {/* LEFT SIDE - Steps */}
      <div>
        {/* Step header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center cursor-default">
                <span
                  className={cn(
                    "px-3 py-1 rounded-sm text-sm font-medium transition text-foreground-primary",
                    activeStep === step.id
                      ? "bg-gray-200"
                      : "bg-gray-100 text-foreground-secondary"
                  )}
                >
                  {step.label}
                </span>
                {i < steps.length - 1 && (
                  <span className="mx-2 text-gray-400">›</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-x-2">
            <Button
              disabled={currentIndex === 0}
              onClick={prevStep}
              size="small"
            >
              Back
            </Button>
            <Button
              disabled={currentIndex === steps.length - 1}
              onClick={nextStep}
              size="small"
              isLoading={isUpdating}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Step content */}
        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="w-full"
            >
              <div className="border rounded-lg p-6 shadow-sm flex-1">
                <h3 className="text-2xl font-bold mb-3">{currentStep.label}</h3>

                {activeStep === "address" && (
                  <AddressStep
                    savedAddresses={savedAddresses}
                    updateAddress={(data) => {
                      setSteps((prev) =>
                        prev.map((s) =>
                          s.id === "address" ? { ...s, data } : s
                        )
                      );
                    }}
                    item={item}
                    step={currentStep}
                  />
                )}

                {activeStep === "slot" && (
                  <SlotStep
                    step={currentStep}
                    updateSlot={(data) => {
                      setSteps((prev) =>
                        prev.map((s) => (s.id === "slot" ? { ...s, data } : s))
                      );
                    }}
                  />
                )}

                {activeStep === "payment" && (
                  <Button
                    className="w-full"
                    onClick={handlePayment}
                    isLoading={createOrder.isPending}
                  >
                    Proceed to pay
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT SIDE - Summary */}
      <div className="space-y-6">
        <div className="border rounded-lg p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="flex items-center justify-between">
              <div>
                <p>{item?.product?.title}</p>
              </div>
              <div className="flex items-center gap-16">
                <QuantityButton item={item} />
                <span>{formatPrice(item?.totalPrice)}</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-4 text-sm">
            <h2 className="text-lg font-semibold">Payment Summary</h2>
            <div className="flex justify-between items-center">
              <span>Item total</span>
              <span className="font-semibold">
                {formatPrice(item?.totalPrice)}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold">{formatPrice(item?.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const handleAddressStep = async (
  currentStep,
  item,
  checkoutId,
  updateItemMutation
) => {
  if (!currentStep.data) return false;

  // If same as existing, skip mutation
  if (item.address && item.address.id === currentStep.data.id) {
    return true;
  }

  // Update
  await updateItemMutation.mutateAsync({
    id: checkoutId,
    address: currentStep.data.id,
  });

  return true;
};

const handleSlotStep = async (
  currentStep,
  item,
  checkoutId,
  updateItemMutation
) => {
  if (!currentStep.data) return false;

  // If same as existing, skip mutation
  if (item.scheduledAt && item.scheduledAt === currentStep.data) {
    return true;
  }

  // Update
  await updateItemMutation.mutateAsync({
    id: checkoutId,
    bookingTime: currentStep.data,
  });

  return true;
};
