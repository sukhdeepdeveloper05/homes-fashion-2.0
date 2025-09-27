import { MEDIA_URL } from "@/config/Consts";
import formatDate from "@/utils/formatDate";
import Image from "next/image";

import { SkeletonBox } from "@/components/ui/Skeletons";
import { formatPhoneNumber } from "@/utils/formatPhone";

export function PartnerSkeleton() {
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

export default function PartnerTab({ partner, isLoading }) {
  if (isLoading) {
    return <PartnerSkeleton />;
  }

  if (!partner) {
    return <div>No partner assigned</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">Name:</span>
          <span>{partner?.name}</span>
        </p>
        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">Email:</span>
          <span>{partner?.email}</span>
        </p>
        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">Phone:</span>
          <span>{formatPhoneNumber(partner?.phone)}</span>
        </p>

        <p className="font-medium space-x-2">
          <span className="text-foreground-primary font-semibold">
            Date of Birth:
          </span>
          <span>{formatDate(partner?.dateOfBirth)}</span>
        </p>
      </div>

      <div className="flex flex-col items-center justify-start space-y-4 row-start-1 md:row-auto">
        {partner?.avatar?.src && (
          <Image
            src={`${MEDIA_URL}${partner.avatar.src}`}
            alt={partner.avatar.altText}
            width={150}
            height={150}
            className="rounded-full border aspect-square object-contain"
          />
        )}
      </div>
    </div>
  );
}
