// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

// Canonical site URL. SITE_URL wins; otherwise Vercel's production domain
// (your custom domain once one is attached); otherwise the default vercel.app URL.
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://etrynity-design.vercel.app");

export default defineConfig({
  site,
  output: "static",
  adapter: vercel(),
  trailingSlash: "never",
  build: { format: "file" },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !/\/(404|contact\/thank-you)$/.test(page),
    }),
  ],
  redirects: {
    "/mobile": "/",
    "/style-guide": "/",
    "/screens": "/",
    "/approach": "/our-approach",
    "/services/it": "/services/it-technology",
    "/services/ai": "/services/ai-business-automation",
    "/services/bpo": "/services/bpo-global-services",
    "/services/logistics": "/services/logistics-supply-chain",
    "/services/education": "/services/education-training",
  },
});
