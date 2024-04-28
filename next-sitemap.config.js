import {env} from "~/env.js";

/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: env.WEBSITE_URL,
    generateRobotsTxt: true
}

export default config;