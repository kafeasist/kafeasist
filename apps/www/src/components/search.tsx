import { Input } from "~/components/ui/Input/input";

interface SearchProps extends React.ComponentPropsWithoutRef<typeof Input> {}

export function Search({ className }: SearchProps) {
  return (
    <div className={className}>
      <Input
        type="search"
        placeholder="Ara..."
        className="h-9 md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}
