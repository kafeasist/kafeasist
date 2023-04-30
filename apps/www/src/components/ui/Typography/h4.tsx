interface H4Props {
  children?: React.ReactNode;
}

export function H4({ children }: H4Props) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}
