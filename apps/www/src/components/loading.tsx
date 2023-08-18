import { Spinner, SpinnerProps } from "./ui/spinner";

interface LoadingProps extends SpinnerProps {}

export const Loading = (props: LoadingProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4">
      <Spinner variant="long" {...props} />
    </div>
  );
};
