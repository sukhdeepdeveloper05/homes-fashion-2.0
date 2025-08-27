import clsx from "clsx";
import Image from "next/image";

export default function Profile({
  user = {},
  wrapperClass = "size-11",
  imageClass = "object-cover",
  size = 40,
}) {
  const initials = (() => {
    const { firstName = "", lastName = "" } = user;
    return (
      lastName ? firstName[0] + lastName[0] : firstName.slice(0, 2)
    ).toUpperCase();
  })();

  const src = user.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}/${user.avatar}`
    : null;

  return src ? (
    <figure
      className={clsx(
        "flex-shrink-0 overflow-hidden rounded-full",
        wrapperClass
      )}
    >
      <Image
        src={src}
        alt={user.firstName || "avatar"}
        width={size}
        height={size}
        className={imageClass + " w-full h-full"}
      />
    </figure>
  ) : (
    <span
      className={clsx(
        " flex-shrink-0 rounded-full bg-foreground-secondary flex items-center justify-center uppercase font-bold text-white select-none",
        wrapperClass
      )}
    >
      {initials}
    </span>
  );
}
