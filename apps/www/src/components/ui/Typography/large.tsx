interface LargeProps {
  children?: React.ReactNode;
}

export function Large({ children }: LargeProps) {
  return <div className="text-lg font-semibold">{children}</div>;
}
