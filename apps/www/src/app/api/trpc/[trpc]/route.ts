import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createContext } from "@kafeasist/api";
import { reportError } from "@kafeasist/error";

function setCorsHeaders(res: Response) {
  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "*",
  );
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

const handler = async (req: Request) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,

    createContext: (opts) =>
      createContext({ req: opts.req, headers: opts.resHeaders }),

    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`);

      if (error.code === "INTERNAL_SERVER_ERROR") {
        const { message, stack, name, cause } = error;

        const sentryError = new Error(message);
        sentryError.stack = stack;
        sentryError.name = name;
        sentryError.cause = cause;

        const sentryErrorId = reportError(sentryError);

        console.error(`>>> Sentry Error ID: ${sentryErrorId}`);
      }
    },

    responseMeta: ({ ctx, errors, type }) => {
      const isOk = errors.length === 0;
      const isQuery = type === "query";

      if (ctx?.headers && isOk && isQuery) {
        // TODO: Temporarily disable cache
        // const ONE_HOUR = 60 * 60;
        const NO_CACHE = 1;

        return {
          headers: {
            "Cache-Control": `public, s-maxage=${NO_CACHE}`,
          },
        };
      }

      return {};
    },
  });

  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
