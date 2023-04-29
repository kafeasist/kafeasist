# @kafeasist:redis

This is the caching package of kafeasist. It is used to cache data in Redis. It is used by the API package. It uses [Upstash](https://upstash.com/) as the Redis provider.

## Table of contents

- [About `kafeasist:redis`](#about-kafeasistredis)
  - [Temporary storage](#temporary-storage)
- [Caching](#caching)
  - [Redis](#redis)
  - [Upstash](#upstash)
  - [Cache invalidation](#cache-invalidation)
- [Usage](#usage)
  - [setCache](#setcache)
  - [getCache](#getcache)
  - [invalidateCache](#invalidatecache)

## About `kafeasist:redis`

### Temporary storage

The `@kafeasist:redis` package is used to store temporary data using [Redis](https://redis.io/).

## Caching

### Redis

[Redis](https://redis.io/) is an open source, in-memory data structure store, used as a database, cache, and message broker.

### Upstash

[Upstash](https://upstash.com/) is a serverless Redis cloud service. It is the main [Redis](https://redis.io/) provider for `@kafeasist:redis` package.

### Cache invalidation

The `@kafeasist:redis` package uses the [Redis](https://redis.io/) `DEL` command to invalidate the cache. It is used within the `@kafeasist:api` package.

## Usage

### setCache

```typescript
import { setCache } from "@kafeasist/redis";

await setCache("key", "value", 60);
```

### getCache

```typescript
import { getCache } from "@kafeasist/redis";

await getCache("key");
```

### invalidateCache

```typescript
import { invalidateCache } from "@kafeasist/redis";

await invalidateCache("key");
```

[⬆ Back to top](#table-of-contents)
