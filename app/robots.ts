import type { MetadataRoute } from "next";
import { getSiteBaseUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${getSiteBaseUrl()}/sitemap.xml`,
  };
}

