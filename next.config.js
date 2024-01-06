import withExportImages from 'next-export-optimize-images'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = withExportImages({
  reactStrictMode: true,
  output: "export",
});

export default config;
