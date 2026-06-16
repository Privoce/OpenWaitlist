import type { MetadataRoute } from "next";
import { BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND_NAME} Demo`,
    short_name: BRAND_NAME,
    description:
      "Live product demo of the open-source restaurant waitlist app by Privoce.",
    start_url: "/kiosk/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fffaf5",
    theme_color: "#c44e14",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
