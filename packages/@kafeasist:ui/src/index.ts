import { cx, type CxOptions } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export { Avatar } from "./components/avatar";
export { Skeleton } from "./components/skeleton";
export { Tooltip } from "./components/tooltip";
export { Button, buttonVariants } from "./components/button";
export { Input } from "./components/input";

export default function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs));
}
