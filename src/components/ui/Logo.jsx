export default function Logo() {
  return (
    <div className="flex flex-col items-start text-foreground-primary dark:text-background-primary">
      <span className="text-[22px] font-bold uppercase tracking-wider">
        {process.env.NEXT_PUBLIC_APP_FIRST_NAME}
      </span>
      <span className="-mt-2 text-[22px] font-bold uppercase tracking-wider">
        {process.env.NEXT_PUBLIC_APP_LAST_NAME}
      </span>
    </div>
  );
}
