import { createTRPCReact } from "@trpc/react-query";

import { AppRouter } from "@kafeasist/api";

export const api = createTRPCReact<AppRouter>();
