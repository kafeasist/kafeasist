/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds and Linting.
 */
// !process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */

const config = {
  reactStrictMode: true,
  transpilePackages: [
    "@kafeasist/api",
    "@kafeasist/auth",
    "@radix-ui/react-dialog",
    "@radix-ui/react-hover-card",
    "@radix-ui/react-popover",
  ],
  eslint: { ignoreDuringBuilds: !!process.env.CI },
  typescript: { ignoreBuildErrors: !!process.env.CI },
};

export default config;
