import type { DetailedHTMLProps, LiHTMLAttributes, ReactElement } from "react";

interface ListProps {
  children?:
    | ReactElement<
        DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
      >
    | Array<
        ReactElement<
          DetailedHTMLProps<LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>
        >
      >;
}

export function List({ children }: ListProps) {
  return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
}
