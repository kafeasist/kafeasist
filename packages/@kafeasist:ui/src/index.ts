import { cx, type CxOptions } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

export * from "./components/alert-modal";
export * from "./components/alert";
export * from "./components/avatar";
export * from "./components/badge";
export * from "./components/banner";
export * from "./components/button";
export * from "./components/card";
export * from "./components/chart";
export * from "./components/checkbox";
export * from "./components/command";
export * from "./components/table/data-table";
export * from "./components/table/data-table-filter-box";
export * from "./components/table/data-table-reset-filter";
export * from "./components/table/data-table-skeleton";
export * from "./components/table/data-table-search";
export * from "./components/dialog";
export * from "./components/dropdown";
export * from "./components/form";
export * from "./components/input";
export * from "./components/input-otp";
export * from "./components/label";
export * from "./components/modal";
export * from "./components/popover";
export * from "./components/progress";
export * from "./components/radio-group";
export * from "./components/scroll-area";
export * from "./components/separator";
export * from "./components/sheet";
export * from "./components/select";
export * from "./components/skeleton";
export * from "./components/spinner";
export * from "./components/table";
export * from "./components/tooltip";

export * from "./hooks/use-element-size";

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs));
}
