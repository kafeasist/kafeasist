import { cx, type CxOptions } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export * from "./components/avatar";
export * from "./components/skeleton";
export * from "./components/tooltip";
export * from "./components/button";
export * from "./components/input";
export * from "./components/separator";
export * from "./components/alert";
export * from "./components/progress";
export * from "./components/spinner";
export * from "./components/banner";
export * from "./components/form";
export * from "./components/dropdown";
export * from "./hooks/use-element-size";

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs));
}
