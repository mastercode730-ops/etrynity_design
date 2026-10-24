// Verified company facts. Every page reads contact details from here so they
// stay consistent; add new details only once they are confirmed.
export const SITE = {
  name: "Etrynity",
  legalName: "Etrynity",
  tagline: "Infinite Possibilities",
  description:
    "Etrynity brings technology, intelligent automation and operational expertise together to help businesses solve practical challenges and grow with confidence.",
  email: "info@etrynity.com",
  instagram: { handle: "@etrynity", url: "https://www.instagram.com/etrynity" },
  locale: "en_GB",
  themeColor: "#050D1A",
} as const;

export const NAV = [
  { label: "Services", href: "/services" },
  { label: "Our Approach", href: "/our-approach" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const PILLARS = [
  { name: "Technology", text: "Modern tools, applied with purpose." },
  { name: "People", text: "Talent and trust at the centre of every engagement." },
  { name: "Progress", text: "Measurable improvement, not activity for its own sake." },
  { name: "Together", text: "Long-term partnerships rather than one-off transactions." },
] as const;

export const PROCESS = [
  {
    step: "01",
    name: "Discover",
    summary: "We listen first — your goals, constraints, systems and the people involved.",
    detail:
      "We start with conversations and, where useful, a short workshop to understand the problem behind the request. We look at how work happens today, what is slowing it down and what success should look like.",
    deliverables: ["Clear problem statement", "Agreed goals and success measures", "Initial scope and priorities"],
  },
  {
    step: "02",
    name: "Design",
    summary: "A tailored plan that combines the right people, process and technology.",
    detail:
      "We turn what we learned into a practical plan: the solution, the team, the phases and the decisions you need to make. You see the full picture — scope, milestones and estimates — before any commitment.",
    deliverables: ["Solution outline and phased roadmap", "Team and responsibilities", "Proposal with milestones and estimates"],
  },
  {
    step: "03",
    name: "Deliver",
    summary: "Focused execution with transparency, milestones and accountability.",
    detail:
      "We deliver in phases, sharing progress at every milestone so you can see results early and adjust direction with evidence. One point of contact keeps communication simple.",
    deliverables: ["Working results at each milestone", "Regular progress updates", "Documentation and handover"],
  },
  {
    step: "04",
    name: "Grow",
    summary: "Continuous improvement so results compound over time.",
    detail:
      "Once a solution is live we measure it against the goals agreed in Discover, then refine, extend and scale what works — with support arranged around your needs.",
    deliverables: ["Performance review against goals", "Improvement backlog", "Support and scaling plan"],
  },
] as const;

export const ENGAGEMENT_MODELS = [
  {
    name: "Defined project",
    text: "A clear outcome with agreed scope and milestones — for example a new application, a process automation or a training programme.",
  },
  {
    name: "Dedicated team",
    text: "A team that works as an extension of yours, scaled up or down as your needs change — common for BPO and ongoing development.",
  },
  {
    name: "Ongoing partnership",
    text: "Continuous support and improvement across one or more divisions, reviewed regularly against your goals.",
  },
] as const;
