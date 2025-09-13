"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BiTrash } from "react-icons/bi";
import { FiLoader } from "react-icons/fi";
import DeleteModal from "./DeleteModal";

export default function DeleteButton({
  isLoading,
  onDelete,
  deleteId,
  showDialog,
  title,
  description,
  buttonClass = "",
  modalClass = "",
}) {
  const [isDeleting, setIsDeleting] = useState(isLoading);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(deleteId);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={async (e) => {
          e.stopPropagation();
          if (showDialog) {
            setShowModal(true);
          } else {
            await handleDelete();
          }
        }}
        disabled={isDeleting}
        className={cn(
          "rounded-md bg-red-600 size-8 flex items-center justify-center text-lg",
          buttonClass
        )}
      >
        {isDeleting && !showDialog ? (
          <FiLoader className="animate-spin text-white" />
        ) : (
          <BiTrash className="text-white" />
        )}
      </button>

      <DeleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          await handleDelete(deleteId);
          setShowModal(false);
        }}
        className={modalClass}
        title={title}
        description={description}
        deleteLoading={isDeleting}
      />
    </>
  );
}
