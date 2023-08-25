import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface HelpTooltipProps {
  text: string;
}

export const HelpTooltip = (props: HelpTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger className="hover:cursor-help" asChild>
          <HelpCircle className="ml-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
        </TooltipTrigger>
        <TooltipContent className="max-w-md">
          <p>{props.text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
