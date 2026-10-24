// Content collections for future articles and case studies.
// Add Markdown files to src/content/insights or src/content/case-studies; files
// starting with "_" (like the templates) are ignored. Listing and article pages
// are generated automatically once the first published entry exists.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const serviceSlug = z.enum([
  "it-technology",
  "ai-business-automation",
  "bpo-global-services",
  "logistics-supply-chain",
  "education-training",
]);

const insights = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/insights" }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(160),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    author: z.string().optional(),
    services: z.array(serviceSlug).default([]),
    draft: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().min(50).max(160),
    client: z.string(),
    industry: z.string(),
    services: z.array(serviceSlug).min(1),
    date: z.coerce.date(),
    /** Only publish once the client has approved the case study. */
    clientApproved: z.literal(true),
    draft: z.boolean().default(false),
  }),
});

export const collections = { insights, "case-studies": caseStudies };
