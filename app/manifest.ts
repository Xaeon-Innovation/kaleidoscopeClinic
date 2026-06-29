import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Kaleidoscope",
    description:
      "Specialist-led implant and restorative dentistry in London.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#022c22",
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icon1.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/images/logo-gold.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
