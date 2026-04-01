import { type MetadataRoute } from "next";
import getUrl from "../url";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getUrl()}/sitemap.xml`,
  };
}
