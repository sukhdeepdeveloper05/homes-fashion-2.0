import { MEDIA_URL } from "@/config/Consts";
import Image from "next/image";

import { SkeletonBox } from "@/components/ui/Skeletons";
import formatDate from "@/utils/formatDate";

export function CustomerSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <SkeletonBox className="h-6 w-56" />
        <SkeletonBox className="h-6 w-56" />
        <SkeletonBox className="h-6 w-56" />
        <SkeletonBox className="h-6 w-56" />
      </div>
      <div className="flex flex-col items-center justify-start space-y-4 row-start-1 md:row-auto">
        <SkeletonBox className="h-[150px] w-[150px] rounded-full" />
      </div>
    </div>
  );
}

export default function CustomerTab({ customer, isLoading }) {
  if (isLoading) {
    return <CustomerSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">Name:</span>
          <span>{customer?.name}</span>
        </p>
        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">Email:</span>
          <span>{customer?.email}</span>
        </p>
        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">Phone:</span>
          <span>{customer?.phone}</span>
        </p>

        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">
            Date of Birth:
          </span>
          <span>{formatDate(customer?.dateOfBirth)}</span>
        </p>
      </div>

      <div className="flex flex-col items-center justify-start space-y-4 row-start-1 md:row-auto">
        {customer?.avatar?.src && (
          <Image
            src={`${MEDIA_URL}${customer.avatar.src}`}
            alt={customer.avatar.altText}
            width={150}
            height={150}
            className="rounded-full border aspect-square object-contain"
          />
        )}
      </div>
    </div>
  );
}
