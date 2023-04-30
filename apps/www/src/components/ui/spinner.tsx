import { Loader2, LucideProps } from "lucide-react";

interface SpinnerProps extends LucideProps {}

const Spinner = (props: SpinnerProps) => {
  return <Loader2 className="animate-spin" {...props} />;
};

export { Spinner };
