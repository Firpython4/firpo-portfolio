import env from "./src/env.js";

/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: env.NEXT_PUBLIC_VERCEL_URL,
    output: "export",
    generateRobotsTxt: true
}

export default config;