import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
} from "@trpc/server/adapters/fetch";

import { appRouter } from "@kafeasist/api";
import { getSessionFromCookie } from "@kafeasist/auth";
import { prisma } from "@kafeasist/db";

function setCorsHeaders(res: Response) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
}

export function OPTIONS() {
  const response = new Response(null, {
    status: 204,
  });

  setCorsHeaders(response);
  return response;
}

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,

    createContext: async (opts: FetchCreateContextFnOptions) => {
      const session = await getSessionFromCookie(opts.req.headers);

      return {
        session,
        prisma,
        headers: opts.resHeaders,
      };
    },
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);

      if (error.code === "INTERNAL_SERVER_ERROR") {
        // TODO: Send error to Sentry
      }
    },
  });
};

export { handler as GET, handler as POST };
