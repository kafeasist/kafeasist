import { Suspense } from "react";

import { Spinner } from "@kafeasist/ui";

import { Verification } from "./_components/verification";

export default function VerifyEmail({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Suspense fallback={<Spinner />}>
      <Verification searchParams={searchParams} />
    </Suspense>
  );
}
