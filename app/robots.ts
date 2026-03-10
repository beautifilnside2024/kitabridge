import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/fachkraft/", "/arbeitgeber/dashboard/", "/api/"],
    },
    sitemap: "https://www.kitabridge.de/sitemap.xml",
  };
}