"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiDownload,
  FiEye,
  FiEdit2,
  FiCheck,
  FiMoreVertical,
  FiLoader,
} from "react-icons/fi";
import { BiTrash } from "react-icons/bi";
import DeleteModal from "@/components/ui/modals/DeleteModal";

export default function ActionsCell({ row, actions }) {
  return (
    <div className="flex justify-end gap-2">
      {actions?.download && (
        <a
          href={row[actions.download] || "#"}
          target="_blank"
          className="rounded-md bg-blue p-2"
        >
          <FiDownload className="text-white" />
        </a>
      )}

      {actions?.view && (
        <Link
          href={actions.view.href + row.id}
          className="rounded-md bg-accent-primary size-8 flex items-center justify-center text-[17px]"
        >
          <FiEye className="text-white" />
        </Link>
      )}

      {actions?.edit && !row.hideEdit && (
        <button
          onClick={() => actions.edit(row)}
          className="rounded-md bg-accent-primary size-8 flex items-center justify-center"
        >
          <FiEdit2 className="text-white" />
        </button>
      )}

      {actions?.accept && row.status === "pending" && (
        <button
          onClick={() => actions.accept(row)}
          className="rounded-md bg-darkBlue size-8 flex items-center justify-center text-lg"
        >
          <FiCheck className="text-white" />
        </button>
      )}

      {actions?.delete && !row.hideDelete && (
        <DeleteActionButton col={{ actions }} row={row} />
      )}

      {actions?.menu && (
        <button
          onClick={() => actions.menu(row)}
          className="rounded-md bg-blue size-8 flex items-center justify-center text-lg"
        >
          <FiMoreVertical className="text-white" />
        </button>
      )}
    </div>
  );
}

function DeleteActionButton({ col, row }) {
  const [isDeleting, setIsDeleting] = useState(col.actions.delete?.isLoading);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await col.actions?.delete?.onDelete?.(row.id);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          if (col.actions.delete.showDialog) {
            setShowModal(true);
          } else {
            handleDelete();
          }
        }}
        disabled={isDeleting}
        className="rounded-md bg-red-600 size-8 flex items-center justify-center text-lg"
      >
        {isDeleting && !col.actions.delete.showDialog ? (
          <FiLoader className="animate-spin text-white" />
        ) : (
          <BiTrash className="text-white" />
        )}
      </button>

      <DeleteModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={async () => {
          await handleDelete(row.id);
          setShowModal(false);
        }}
        title={col.actions.delete.title}
        deleteLoading={isDeleting}
      />
    </>
  );
}
