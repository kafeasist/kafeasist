interface BlockquoteProps {
  children?: React.ReactNode;
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>
  );
}
