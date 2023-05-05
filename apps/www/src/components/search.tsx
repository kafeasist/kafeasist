import { Input } from "~/components/ui/Input/input";

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Ara..."
        className="hidden h-9 md:block md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
