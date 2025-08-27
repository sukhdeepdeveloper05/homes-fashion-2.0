"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import Button from "../Button";

export default function DeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Delete item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  deleteLoading = false,
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent
        className="px-4 py-8 gap-4 items-center max-w-lg"
        overlayClassName={"overlay"}
        showCloseButton={false}
      >
        <DialogHeader className="sm:text-center p-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base leading-relaxed text-gray-600 my-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex sm:justify-center gap-4 p-0">
          <Button
            variant="primary"
            size="medium"
            onClick={onConfirm}
            isLoading={deleteLoading}
          >
            Delete
          </Button>
          <Button
            variant="foreground"
            appearance="outline"
            size="medium"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
