import { cn } from "../";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: boolean;
}

export function Skeleton({
  className,
  rounded = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/40",
        className,
        rounded ? "rounded-full" : "rounded-md",
      )}
      {...props}
    />
  );
}
