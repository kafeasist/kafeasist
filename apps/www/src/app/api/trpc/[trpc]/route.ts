import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";

import { appRouter } from "@kafeasist/api";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts: FetchCreateContextFnOptions) => {
      return {
        session: null,
        headers: opts.req.headers,
      };
    },
  });
};

export { handler as GET, handler as POST };
