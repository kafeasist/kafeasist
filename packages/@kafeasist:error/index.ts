import * as Sentry from "@sentry/node";

/**
 * Sentry middleware for tRPC
 * @see https://docs.sentry.io/platforms/node/configuration/integrations/pluggable-integrations/#trpc-middleware
 */
export const sentryTRPC = Sentry.Handlers.trpcMiddleware;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Default Sentry options
 * @see https://docs.sentry.io/platforms/node/configuration/options/
 */
const defaultOptions: Sentry.NodeOptions = {
  /**
   * Sentry DSN comes from the environment variable
   * @see https://docs.sentry.io/platforms/node/configuration/options/#dsn
   */
  dsn: process.env.SENTRY_DSN,

  /**
   * The Sentry environment name
   * @type {"production" | "development"}
   * @see https://docs.sentry.io/platforms/node/configuration/environments
   */
  environment: process.env.NODE_ENV,

  /**
   * Enable debug mode if the app is not in production
   * @see https://docs.sentry.io/platforms/node/configuration/options/#debug
   */
  debug: !IS_PRODUCTION,

  /**
   * A number between 0 and 1, controlling the percentage chance a given transaction will be sent to Sentry.
   * @see https://docs.sentry.io/platforms/node/configuration/options/#traces-sample-rate
   */
  tracesSampleRate: IS_PRODUCTION ? 0.2 : 1.0,
};

export function reportError(error: Error): string {
  Sentry.init(defaultOptions);

  return Sentry.captureException(error);
}
