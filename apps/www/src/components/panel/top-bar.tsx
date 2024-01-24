import { CompanySwitcher } from "../company-switcher";
import { Logo } from "../logo";

export default function TopBar() {
  return (
    <section className="fixed z-10 flex w-full items-center justify-between border border-border bg-secondary px-4 py-4">
      <div className="flex items-center space-x-3">
        <Logo width={39} />
        <span className="invisible text-2xl md:visible">kafeasist</span>
      </div>
      <CompanySwitcher />
    </section>
  );
}
