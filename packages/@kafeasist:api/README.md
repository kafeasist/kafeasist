# @kafeasist:api

This is the API of kafeasist. The API is written in [TypeScript](https://typescriptlang.org) and it is using [tRPC](https://trpc.io) to manage data.

## Table of contents

- [About `kafeasist:api`](#about-kafeasistapi)
  - [tRPC](#trpc)
- [Context](#context)
  - [Session](#session)
  - [Protected routes](#protected-routes)
- [Routers](#routers)
  - [auth](#auth)
    - [`getSession` (Public)](#getsession-public)
      - [Parameters](#parameters)
      - [Usage](#usage)

## About `kafeasist:api`

### tRPC

[tRPC](https://trpc.io) is a library that makes managing data between the client and the backend type-safe. It has _queries_, which are `GET` simply requests called by the client, and _mutations_, which are `POST` requests that change data. These are called _procedures_.

The reason why [tRPC](https://trpc.io) was chosen is because it is great for projects that have their backend and their client in [TypeScript](https://typescriptlang.org).

## Context

The context is a type that is passed to every procedure. It is defined in `src/trpc.ts`, and is used to pass data to the query and mutations, such as the database connection.

```typescript
type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  session: Session | null;
  prisma: PrismaClient;
};
```

With this, we can access the context from every procedure.

### Session

To get user's session, we use the `getSessionFromCookie` function from `@kafeasist/auth` package. You can find mode information about this function in [@kafeasist:auth](../@kafeasist:auth/).

```typescript
// src/trpc.ts

const session = getSessionFromCookie(req);
```

### Protected routes

Some routes are protected, meaning that they can only be accessed by authenticated users. To do this, we use the `session` property of the context. If the user is not authenticated, the `session` property will be `null`. If the user is authenticated, the `session` property will be an object with the user's data.

```typescript
// src/trpc.ts

/**
 * Middleware to check if the user is authenticated.
 * @see https://trpc.io/docs/server/middleware
 */
const isUserAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx });
});

/**
 * Private procedure (authentication required).
 * Only authenticated users can call this procedure.
 */
export const protectedProcedure = t.procedure.use(isUserAuthed);
```

## Routers

This section contains information about the routers. You can find the routers in the `src/routers` folder. Whenever a new router is created, it should be added to here for documentation.

### auth

### `getSession` (Public)

This procedure is used to get the user's session. It is used to check if the user is authenticated.

#### Parameters

This procedure does not take any parameters.

#### Usage

```typescript
const { data } = trpc.auth.getSession.useQuery();
//		 ^?	Session | null
```

[⬆ Back to top](#table-of-contents)
