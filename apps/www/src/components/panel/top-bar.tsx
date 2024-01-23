import { CompanySwitcher } from "../company-switcher";
import { Logo } from "../logo";

export default function TopBar() {
  return (
    <section className="fixed z-10 flex w-full items-center justify-between border border-b-border bg-secondary px-4">
      <div className="flex items-center space-x-1.5">
        <Logo width={50} />
        <span className="text-primary-foreground hidden text-2xl md:block">
          kafeasist
        </span>
      </div>
      <CompanySwitcher />
    </section>
  );
}
