interface LeadProps {
  children?: React.ReactNode;
}

export function Lead({ children }: LeadProps) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}
