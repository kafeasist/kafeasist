import { cx, type CxOptions } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export { Avatar } from "./components/avatar";
export { Skeleton } from "./components/skeleton";
export { Tooltip } from "./components/tooltip";
export { Button, buttonVariants } from "./components/button";
export { Input } from "./components/input";
export { Separator } from "./components/separator";
export { Alert } from "./components/alert";
export { Progress } from "./components/progress";
export { Spinner } from "./components/spinner";
export { Banner } from "./components/banner";
export * from "./components/form";
export { useElementSize } from "./hooks/use-element-size";

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs));
}
