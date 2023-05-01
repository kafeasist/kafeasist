import { Input } from "~/components/ui/Input/input";

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Ara..."
        className="h-9 md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
