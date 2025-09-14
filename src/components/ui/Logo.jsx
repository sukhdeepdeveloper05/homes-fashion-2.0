export default function Logo() {
  return (
    <div className="flex flex-col text-foreground-primary dark:text-background-primary">
      <span className="text-2xl font-semibold">
        {process.env.NEXT_PUBLIC_APP_FIRST_NAME}
      </span>
      <span className="-mt-2.5 text-2xl font-semibold">
        {process.env.NEXT_PUBLIC_APP_LAST_NAME}
      </span>
    </div>
  );
}
