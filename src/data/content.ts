import { getCollection } from "astro:content";

// Evaluated once per build; used to show Insights / Case studies links only when content exists.
export const published = (async () => ({
  insights: (await getCollection("insights", (e) => !e.data.draft)).length,
  caseStudies: (await getCollection("case-studies", (e) => !e.data.draft)).length,
}))();
