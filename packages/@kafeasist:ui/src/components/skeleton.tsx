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
        "bg-primary/10 animate-pulse",
        className,
        rounded ? "rounded-full" : "rounded-md",
      )}
      {...props}
    />
  );
}
