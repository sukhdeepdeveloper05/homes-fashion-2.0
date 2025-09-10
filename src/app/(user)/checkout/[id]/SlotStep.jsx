import { useEffect, useState } from "react";
import { Separator } from "@/components/shadcn/separator";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import generateSlots from "@/utils/generateSlots";

const slots = generateSlots(30, 2);

function formatTime(time) {
  return new Date(time).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function SlotStep({ step, updateSlot }) {
  const [selectedDateId, setSelectedDateId] = useState(slots[0].id);
  const [selectedTime, setSelectedTime] = useState(step.data ?? null);

  const selectedDate = slots.find((s) => s.id === selectedDateId);

  return (
    <div className="flex flex-col gap-4">
      {/* Date Picker */}
      <div className="grid grid-cols-8 gap-3">
        {slots.map((slot) => {
          const day = slot.date.toLocaleDateString("en-IN", {
            weekday: "short",
          });
          const dateNum = String(slot.date.getDate()).padStart(2, "0");

          const isSelected = slot.id === selectedDateId;

          return (
            <Button
              key={slot.id}
              onClick={() => {
                setSelectedDateId(slot.id);
                setSelectedTime(null); // reset when new date is chosen
              }}
              className={cn(
                "flex flex-col gap-0 aspect-square text-xs items-center justify-center border border-input rounded-md p-2 cursor-pointer bg-background-primary",
                isSelected && "bg-accent-primary/10 border-accent-primary"
              )}
            >
              <div>
                <p className="text-foreground-secondary">{day}</p>
                <p className="text-foreground-primary text-sm font-bold">
                  {dateNum}
                </p>
              </div>
            </Button>
          );
        })}
      </div>

      <Separator />

      {/* Time Picker */}
      <div className="grid grid-cols-4 gap-3">
        {selectedDate?.times.map((time, idx) => {
          const isSelected = selectedTime === time;

          return (
            <Button
              key={idx}
              onClick={() => {
                setSelectedTime(time);
                updateSlot(time);
              }}
              className={`border border-input bg-background-primary rounded-md text-sm py-3 text-foreground-primary ${
                isSelected ? "bg-accent-primary/10 border-accent-primary" : ""
              }`}
            >
              <span>{formatTime(time)}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
