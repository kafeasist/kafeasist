import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@kafeasist/api";

export const api = createTRPCReact<AppRouter>();
