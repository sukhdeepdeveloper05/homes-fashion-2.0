"use client";

import Link from "next/link";
import {
  FiDownload,
  FiEye,
  FiEdit2,
  FiCheck,
  FiMoreVertical,
} from "react-icons/fi";
import DeleteButton from "@/components/ui/DeleteButton";

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
        <DeleteButton
          deleteId={row.id}
          onDelete={actions?.delete?.onDelete}
          isLoading={actions?.delete?.isLoading}
          showDialog={actions?.delete?.showDialog}
          title={actions?.delete?.title}
          description={actions?.delete?.description}
        />
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
