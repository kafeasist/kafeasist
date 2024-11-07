import { QueryClient } from "@tanstack/react-query";

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid refetching data when the window regains focus
        staleTime: 30 * 1000,
      },
      // dehydrate: {
      //   serializeData: SuperJSON.serialize,
      //   shouldDehydrateQuery: (query) =>
      //     defaultShouldDehydrateQuery(query) ||
      //     query.state.status === "pending",
      // },
      // hydrate: {
      //   deserializeData: SuperJSON.deserialize,
      // },
    },
  });
