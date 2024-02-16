import { cn } from "@kafeasist/ui";

interface InnerTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const InnerTitle = (props: InnerTitleProps) => {
  return (
    <div className={cn("space-y-1.5", props.className)} {...props}>
      <h1 className="text-2xl font-bold">{props.title}</h1>
      <h2 className="text-sm text-muted-foreground">{props.subtitle}</h2>
    </div>
  );
};
