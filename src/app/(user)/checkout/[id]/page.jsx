"use client";

import { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useCart } from "@/store/cartContext";
import { formatPrice } from "@/utils/formatPrice";
import { toast } from "sonner";
import useUserLocation from "@/hooks/location";

const TAX_RATE = 5;

export default function CheckoutPage({ params }) {
  const { id: checkoutId } = use(params);
  const { cart } = useCart();

  const item = cart.items.find((i) => i.id === checkoutId);

  const [steps, setSteps] = useState([
    { id: "address", label: "Address", isCompleted: false },
    { id: "slot", label: "Slot", isCompleted: false },
    { id: "payment", label: "Payment", isCompleted: false },
  ]);
  const [activeStep, setActiveStep] = useState("address");

  const currentIndex = steps.findIndex((s) => s.id === activeStep);

  const goToStep = (id) => {
    setActiveStep(id);
  };

  const nextStep = () => {
    if (currentIndex < steps.length - 1) {
      if (steps[currentIndex + 1].isCompleted) {
        goToStep(steps[currentIndex + 1].id);
      } else {
        toast.error("Please complete this step first.");
      }
    }
  };

  const prevStep = () => {
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1].id);
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 py-10">
      <div className="order-2 lg:order-2 space-y-6">
        <div className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span>Item total</span>
              <span className="font-semibold">
                {formatPrice(item?.totalPrice)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taxes & Fee</span>
              <span className="font-semibold">
                {formatPrice((item?.totalPrice * TAX_RATE) / 100)}
              </span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="font-bold">₹1,087</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT → Steps */}
      <div className="order-1 lg:order-1">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => goToStep(step.id)}
                  className={cn(
                    "px-3 py-1 rounded-sm text-sm font-medium transition text-foreground-primary",
                    activeStep === step.id
                      ? "bg-gray-200"
                      : "bg-gray-100 text-foreground-secondary hover:bg-gray-200"
                  )}
                >
                  {step.label}
                </button>
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
              className=""
              size="small"
            >
              Back
            </Button>
            <Button
              disabled={currentIndex === steps.length - 1}
              onClick={nextStep}
              size="small"
              className=""
            >
              Next
            </Button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <StepsContent
              key={activeStep}
              step={steps[currentIndex]}
              markComplete={() =>
                setSteps((prevSteps) =>
                  prevSteps.map((s) =>
                    s.id === activeStep ? { ...s, isCompleted: true } : s
                  )
                )
              }
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const fadeVariants = {
  enter: {
    opacity: 0,
    filter: "blur(2px)",
    position: "absolute",
    inset: 0,
  },
  center: {
    opacity: 1,
    filter: "blur(0px)",
    position: "relative",
  },
  exit: {
    opacity: 0,
    filter: "blur(2px)",
    position: "absolute",
    inset: 0,
  },
};

function StepsContent({ step, markComplete }) {
  const [pickedAddress, setPickedAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const { location, error, loading: locationLoading } = useUserLocation();

  const handlePickAddress = () => {
    console.log(location);
    toast.success(location);
    error && toast.error(error);
  };

  return (
    <motion.div
      key={step.id}
      variants={fadeVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="border rounded-lg p-6 shadow-sm flex-1">
        <h3 className="font-semibold mb-3">{step.label}</h3>

        {step.id === "address" && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {pickedAddress
                ? pickedAddress
                : "No address selected yet. Pick your location below."}
            </p>
            <Button
              onClick={handlePickAddress}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Fetching..." : "Pick Address using GPS"}
            </Button>
          </>
        )}

        {step.id === "slot" && (
          <button className="w-full bg-primary text-white py-2 rounded-xl">
            Select Time & Date
          </button>
        )}

        {step.id === "payment" && (
          <button className="w-full border py-2 rounded-xl">
            Pay on Delivery
          </button>
        )}
      </div>
    </motion.div>
  );
}
