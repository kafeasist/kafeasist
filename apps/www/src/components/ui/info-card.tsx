import { AlertTriangle, Info, XCircle } from "lucide-react";

import { cn } from "~/lib/utils";

export type Severity = "warning" | "error" | "info";

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  severity: Severity;
  footer?: React.ReactNode;
}

export function InfoCard({
  className,
  severity,
  footer,
  ...props
}: InfoCardProps) {
  let color = "bg-orange-100 dark:bg-orange-800";

  if (severity === "info") {
    color = "bg-blue-100 dark:bg-blue-950";
  } else if (severity === "error") {
    color = "bg-rose-100 dark:bg-rose-800";
  }

  return (
    <div
      className={cn(color, "rounded-md p-4 shadow-sm", className)}
      {...props}
    >
      <div className="flex items-center">
        {severity === "warning" ? (
          <AlertTriangle className="mr-4 h-16 w-16 lg:h-8 lg:w-8" />
        ) : severity === "error" ? (
          <XCircle className="mr-4 h-16 w-16 lg:h-8 lg:w-8" />
        ) : (
          <Info className="mr-4 h-16 w-16 lg:h-8 lg:w-8" />
        )}
        <span>{props.children}</span>
      </div>
      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}
