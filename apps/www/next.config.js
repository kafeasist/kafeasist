/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * Enables the hot reloading for local packages without needing the build step.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages
   */
  transpilePackages: [
    "@kafeasist/eslint",
    "@kafeasist/prettier",
    "@kafeasist/ui",
    "@kafeasist/tailwind",
  ],

  /**
   * The checking of ESLint and TypeScript is disabled during the build process.
   * This is because the ESLint and TypeScript checking is already done during the CI.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/eslint
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/typescript
   */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default config;
