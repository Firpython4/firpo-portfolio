/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXT_PUBLIC_VERCEL_URL,
    output: "export",
    generateRobotsTxt: true
}

export default config;