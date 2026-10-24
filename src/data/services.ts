// Content for the five service divisions. Each entry renders /services/<slug>.
// Keep claims factual: no statistics, client names or prices unless verified.
export type IconName = "it" | "ai" | "bpo" | "logistics" | "education";

export interface Service {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  motto: string;
  seo: { title: string; description: string; keywords: string[] };
  heading: string;
  lead: string;
  summary: string;
  highlights: string[];
  challenges: { title: string; text: string }[];
  offerings: { title: string; text: string; points: string[] }[];
  benefits: { title: string; text: string }[];
  steps: { name: string; text: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "it-technology",
    name: "IT & Technology",
    short: "IT & Technology",
    icon: "it",
    motto: "Build · Innovate · Transform",
    seo: {
      title: "IT & Technology Services: Software & Cloud",
      description:
        "Custom software, web and mobile apps, cloud infrastructure, data and legacy modernisation — designed, built and supported around how your business works.",
      keywords: ["IT services", "custom software development", "cloud migration", "digital transformation", "legacy modernisation"],
    },
    heading: "IT & technology services built for growth",
    lead:
      "From custom software and cloud infrastructure to modernising ageing systems, Etrynity designs, builds and supports technology that fits how your business actually works.",
    summary: "Custom software, cloud, data and modernisation — designed around your workflows.",
    highlights: ["Custom software & web apps", "Cloud & infrastructure", "Data & modernisation"],
    challenges: [
      { title: "Systems that don't talk to each other", text: "Information trapped in disconnected tools, manual re-entry and reports nobody fully trusts." },
      { title: "Legacy software holding you back", text: "Ageing platforms that are costly to maintain, risky to change and hard to hire for." },
      { title: "A product that needs to ship", text: "A clear idea for a web or mobile product, but no in-house team to design and build it." },
      { title: "Infrastructure that can't keep up", text: "Slow performance, rising hosting costs and security gaps as usage grows." },
    ],
    offerings: [
      {
        title: "Custom software & web applications",
        text: "Business applications, customer portals and internal tools designed around your workflows rather than forcing you into someone else's.",
        points: ["Web applications and portals", "Mobile applications", "APIs and system integrations"],
      },
      {
        title: "Cloud & infrastructure",
        text: "Architecture, migration and day-to-day operations for reliable, secure and cost-aware infrastructure.",
        points: ["Cloud migration and architecture", "DevOps and automated deployments", "Monitoring and cost optimisation"],
      },
      {
        title: "Digital transformation & modernisation",
        text: "Practical roadmaps that replace or modernise legacy systems in phases, without disrupting the business.",
        points: ["Legacy system modernisation", "Process digitisation", "Technology roadmaps"],
      },
      {
        title: "Data & analytics",
        text: "Bring data together so decisions are based on numbers people trust.",
        points: ["Dashboards and reporting", "Data pipelines and integration", "Data quality and governance"],
      },
      {
        title: "Support & maintenance",
        text: "Keep live systems healthy, secure and improving after launch.",
        points: ["Application support", "Updates and security patching", "Performance improvements"],
      },
    ],
    benefits: [
      { title: "One accountable partner", text: "Design, build and support handled by one team, with a single point of contact." },
      { title: "Built to scale", text: "Architecture chosen for where your business is going, not just where it is today." },
      { title: "Security by design", text: "Access control, data protection and safe deployment practices from the first sprint." },
      { title: "Transparent delivery", text: "Working software at each milestone, so progress is visible rather than promised." },
    ],
    steps: [
      { name: "Discovery", text: "Understand users, workflows, existing systems and constraints." },
      { name: "Architecture & plan", text: "Agree the solution, phases, milestones and estimates." },
      { name: "Iterative build", text: "Deliver in short cycles with regular demos and feedback." },
      { name: "Launch & support", text: "Go live safely, then monitor, maintain and improve." },
    ],
    faqs: [
      {
        q: "What kinds of technology projects does Etrynity take on?",
        a: "Web and mobile applications, internal business tools, customer portals, system integrations, cloud migrations, data and reporting solutions, and the modernisation of legacy systems.",
      },
      {
        q: "Can you work with the systems we already have?",
        a: "Yes. Most projects involve existing tools and data. We map what you have in discovery and integrate with or gradually replace systems, depending on what serves the business best.",
      },
      {
        q: "How are cost and timelines estimated?",
        a: "After discovery we share a phased proposal with scope, milestones and estimates. Because every project is different, we don't quote fixed prices before understanding the work.",
      },
      {
        q: "Do you provide support after launch?",
        a: "Yes. Support and maintenance — monitoring, updates, security patching and improvements — can be part of the engagement or arranged once the system is live.",
      },
      {
        q: "Can technology work be combined with other Etrynity services?",
        a: "Often it should be. A new system may benefit from AI automation, a BPO team to operate it, or training so your people adopt it quickly — all coordinated by one partner.",
      },
    ],
    related: ["ai-business-automation", "education-training"],
  },
  {
    slug: "ai-business-automation",
    name: "AI & Business Automation",
    short: "AI & Automation",
    icon: "ai",
    motto: "Automate · Augment · Accelerate",
    seo: {
      title: "AI & Business Automation Services",
      description:
        "Practical AI and workflow automation: use-case discovery, AI assistants, document processing, process automation and analytics — with people kept in control.",
      keywords: ["AI automation", "business process automation", "AI consulting", "AI chatbot", "workflow automation"],
    },
    heading: "AI & business automation that saves real time",
    lead:
      "We help businesses put AI and automation to practical use — removing repetitive work, speeding up decisions and giving teams more time for the work that matters.",
    summary: "Practical AI and workflow automation that removes repetitive work.",
    highlights: ["AI strategy & use cases", "Assistants & chatbots", "Workflow automation"],
    challenges: [
      { title: "Hours lost to repetitive work", text: "Copying data between systems, chasing approvals and producing the same reports every week." },
      { title: "Slow responses", text: "Customer and internal questions waiting in inboxes because the answers are hard to find." },
      { title: "Information buried in documents", text: "Invoices, forms and contracts that have to be read and keyed in by hand." },
      { title: "AI pilots that go nowhere", text: "Interest in AI, but no clear view of where it fits, what it costs or how to take it into production." },
    ],
    offerings: [
      {
        title: "AI readiness & strategy",
        text: "Find the use cases worth doing first, check your data and processes, and build a roadmap focused on measurable value.",
        points: ["Use-case discovery workshops", "Data and process assessment", "Value-focused roadmap"],
      },
      {
        title: "Workflow & process automation",
        text: "Automate the repetitive steps between people and systems so work flows without manual hand-offs.",
        points: ["Data entry and document routing", "Approvals and notifications", "System-to-system integrations"],
      },
      {
        title: "AI assistants & chatbots",
        text: "Assistants that answer questions from your own information — for customers, staff or website visitors.",
        points: ["Customer support assistants", "Internal knowledge assistants", "Website and enquiry assistants"],
      },
      {
        title: "Document intelligence",
        text: "Extract, classify and summarise information from documents so people review exceptions instead of typing.",
        points: ["Invoice and form processing", "Contract and document summaries", "Classification and routing"],
      },
      {
        title: "Analytics & forecasting",
        text: "Use your data to anticipate demand, spot issues earlier and automate routine reporting.",
        points: ["Demand forecasting", "Automated reporting", "Insight dashboards"],
      },
      {
        title: "Responsible AI & governance",
        text: "Guardrails that keep AI useful and safe: human review, privacy controls and ongoing monitoring.",
        points: ["Human-in-the-loop review", "Data privacy controls", "Quality monitoring"],
      },
    ],
    benefits: [
      { title: "Outcomes first", text: "We start from the business result — time saved, faster responses, fewer errors — not the technology." },
      { title: "People stay in control", text: "Automation handles the routine; people make the decisions that matter." },
      { title: "Works with your tools", text: "Solutions connect to the systems you already use instead of adding another silo." },
      { title: "Prove, then scale", text: "A focused pilot shows the value on one workflow before wider roll-out." },
    ],
    steps: [
      { name: "Find the opportunities", text: "Map workflows and rank use cases by value and feasibility." },
      { name: "Prove value", text: "Build a focused pilot on one workflow and measure the impact." },
      { name: "Integrate & scale", text: "Connect to your systems and roll out to more teams." },
      { name: "Monitor & improve", text: "Track quality and results, and refine over time." },
    ],
    faqs: [
      {
        q: "Do we need a lot of data to start using AI?",
        a: "Not always. Many useful automations rely on your existing documents, emails and systems. Discovery shows what is possible with the data you already have and what would need to improve.",
      },
      {
        q: "Will AI replace our team?",
        a: "Our approach is to remove repetitive tasks so people can focus on judgement, relationships and higher-value work. Decisions that matter stay with your team, with clear review steps.",
      },
      {
        q: "How do you keep our data secure?",
        a: "Every solution is designed with data protection in mind: limited access, sharing only the data a task needs, and human review for sensitive decisions. Specific security requirements are agreed during discovery.",
      },
      {
        q: "Which AI tools and models do you use?",
        a: "We choose tools for each task based on quality, cost, privacy and how well they fit your existing systems, rather than tying you to a single vendor.",
      },
      {
        q: "How soon can we see results?",
        a: "We start with a focused pilot on a single workflow so you can measure the impact early, before deciding whether to scale it.",
      },
    ],
    related: ["it-technology", "bpo-global-services"],
  },
  {
    slug: "bpo-global-services",
    name: "BPO & Global Services",
    short: "BPO & Global Services",
    icon: "bpo",
    motto: "People · Process · Performance",
    seo: {
      title: "BPO & Global Services: Support & Back-Office",
      description:
        "Customer support, back-office operations and dedicated teams with documented processes and clear performance reporting, so you can scale with confidence.",
      keywords: ["BPO services", "business process outsourcing", "customer support outsourcing", "back office services", "dedicated teams"],
    },
    heading: "BPO & global services that keep operations running",
    lead:
      "Dedicated teams, documented processes and clear performance reporting — so you can scale customer and back-office operations without the overhead of building it all in-house.",
    summary: "Customer support, back-office and dedicated teams with clear reporting.",
    highlights: ["Customer experience", "Back-office operations", "Dedicated teams"],
    challenges: [
      { title: "Support volumes outgrowing the team", text: "Queues get longer, response times slip and customers notice." },
      { title: "Back-office work crowding out growth", text: "Skilled people spend their days on data entry, admin and processing." },
      { title: "Hiring and retention pressure", text: "Recruiting, training and keeping operational staff takes time you don't have." },
      { title: "No visibility on quality", text: "Without clear processes and reporting it is hard to know how well work is being done." },
    ],
    offerings: [
      {
        title: "Customer experience & support",
        text: "Friendly, well-trained teams that represent your brand across the channels your customers use.",
        points: ["Email, chat and voice support", "Order and account enquiries", "Customer onboarding"],
      },
      {
        title: "Back-office operations",
        text: "Reliable processing of the work that keeps the business running.",
        points: ["Data entry and processing", "Finance and accounting support", "Administrative support"],
      },
      {
        title: "Data & content services",
        text: "Clean, accurate and well-organised information for sales, operations and e-commerce.",
        points: ["Data cleansing and enrichment", "Catalogue and content management", "Research support"],
      },
      {
        title: "Staffing & dedicated teams",
        text: "Teams that work as an extension of yours, with capacity that flexes as your needs change.",
        points: ["Dedicated remote teams", "Recruitment support", "Flexible capacity"],
      },
      {
        title: "Quality & process excellence",
        text: "Documented procedures, quality checks and reporting that make performance visible and improvable.",
        points: ["Standard operating procedures", "Quality assurance reviews", "Agreed KPIs and reporting"],
      },
      {
        title: "AI-assisted operations",
        text: "People supported by automation and AI, so routine steps are faster and more consistent.",
        points: ["Automated triage and routing", "Suggested responses", "Workflow automation"],
      },
    ],
    benefits: [
      { title: "Scale on demand", text: "Add or reduce capacity as volumes change, without long hiring cycles." },
      { title: "Documented processes", text: "Every process is written down, so quality doesn't depend on any one person." },
      { title: "Transparent reporting", text: "KPIs agreed up front and reported regularly, so you always know how things are going." },
      { title: "Technology-enabled", text: "Automation and AI built in where they make teams faster and more accurate." },
    ],
    steps: [
      { name: "Process discovery", text: "Document how the work is done today and what good looks like." },
      { name: "Transition", text: "Knowledge transfer, training and a controlled hand-over." },
      { name: "Go-live", text: "Operate against agreed KPIs with regular reporting." },
      { name: "Improve", text: "Refine processes and introduce automation where it helps." },
    ],
    faqs: [
      {
        q: "Which processes can we outsource?",
        a: "Customer support, back-office processing, data and content work, and administrative tasks are common starting points. If a process is repeatable and can be documented, it can usually be supported.",
      },
      {
        q: "How do you make sure the quality is right?",
        a: "Through documented procedures, training before go-live, regular quality reviews and KPIs agreed with you at the start and reported throughout.",
      },
      {
        q: "How is our customer data protected?",
        a: "Teams work with access limited to what each role needs, and data-handling requirements are agreed and documented as part of the transition.",
      },
      {
        q: "Can we start small?",
        a: "Yes. Many engagements begin with a single process or a small team, then expand once the results are proven.",
      },
      {
        q: "Do you offer dedicated teams?",
        a: "Yes. A dedicated team works exclusively on your processes, learns your business in depth and scales with your needs.",
      },
    ],
    related: ["ai-business-automation", "education-training"],
  },
  {
    slug: "logistics-supply-chain",
    name: "Logistics & Supply Chain",
    short: "Logistics & Supply Chain",
    icon: "logistics",
    motto: "Move · Connect · Grow",
    seo: {
      title: "Logistics & Supply Chain Solutions",
      description:
        "Freight coordination, warehousing, shipment visibility and supply-chain consulting that help businesses move goods reliably and plan with confidence.",
      keywords: ["logistics services", "supply chain consulting", "freight coordination", "warehousing and fulfilment", "shipment tracking"],
    },
    heading: "Logistics & supply chain solutions that keep goods moving",
    lead:
      "From freight coordination and warehousing to shipment visibility and network planning, we help businesses move goods reliably and build supply chains that can handle change.",
    summary: "Freight, warehousing, visibility and planning for reliable supply chains.",
    highlights: ["Freight & distribution", "Warehousing & fulfilment", "Visibility & planning"],
    challenges: [
      { title: "Late or unpredictable deliveries", text: "Customers waiting, promises missed and teams firefighting every day." },
      { title: "No visibility on shipments", text: "Not knowing where goods are until something has already gone wrong." },
      { title: "Rising logistics costs", text: "Freight, storage and handling costs growing faster than the business." },
      { title: "Stock in the wrong place", text: "Stock-outs in one location and excess inventory in another." },
    ],
    offerings: [
      {
        title: "Freight & distribution coordination",
        text: "Plan and coordinate the movement of goods with the right carriers and routes.",
        points: ["Carrier selection and coordination", "Route and load planning", "Last-mile delivery planning"],
      },
      {
        title: "Warehousing & fulfilment",
        text: "Organised storage and fulfilment processes that get orders out accurately.",
        points: ["Storage and inventory management", "Pick, pack and dispatch processes", "Returns handling"],
      },
      {
        title: "Shipment visibility & tracking",
        text: "Know where goods are and act on exceptions before customers are affected.",
        points: ["Tracking and status updates", "Exception alerts", "Delivery performance reporting"],
      },
      {
        title: "Supply-chain consulting",
        text: "Review how goods flow through your business and redesign it for cost, speed and resilience.",
        points: ["Network and route design", "Cost-to-serve analysis", "Supplier coordination"],
      },
      {
        title: "Data-driven planning",
        text: "Use data and AI to forecast demand and position stock where it is needed.",
        points: ["Demand forecasting", "Inventory optimisation", "Planning dashboards"],
      },
    ],
    benefits: [
      { title: "Reliability", text: "Fewer missed deliveries through better planning and coordination." },
      { title: "Visibility", text: "Clear tracking and reporting from origin to destination." },
      { title: "Efficiency", text: "Lower cost-to-serve through smarter routing, storage and processes." },
      { title: "Resilience", text: "Supply chains designed to adapt when demand or conditions change." },
    ],
    steps: [
      { name: "Assess", text: "Map current flows, costs, partners and pain points." },
      { name: "Design", text: "Plan routes, storage, processes and tools." },
      { name: "Implement", text: "Coordinate partners and put the new setup into action." },
      { name: "Optimise", text: "Measure performance and improve continuously." },
    ],
    faqs: [
      {
        q: "Can you work with our existing carriers and warehouses?",
        a: "Yes. We can coordinate your current partners, improve how they work together, and recommend changes only where they clearly add value.",
      },
      {
        q: "How do you improve shipment visibility?",
        a: "By connecting tracking data from carriers and systems into one view, with alerts for exceptions and regular delivery-performance reporting.",
      },
      {
        q: "How can you help reduce logistics costs?",
        a: "We analyse your cost-to-serve, routes, storage and handling, then identify where consolidation, better planning or process changes reduce cost without hurting service.",
      },
      {
        q: "Do you support both domestic and cross-border supply chains?",
        a: "Tell us about your routes and requirements; we'll confirm during the assessment how we can support your specific flows.",
      },
      {
        q: "Where does technology fit in?",
        a: "Data, forecasting and automation from our IT and AI divisions can be added to make planning faster and visibility better.",
      },
    ],
    related: ["ai-business-automation", "it-technology"],
  },
  {
    slug: "education-training",
    name: "Education & Training",
    short: "Education & Training",
    icon: "education",
    motto: "Learn · Upskill · Build Future",
    seo: {
      title: "Education & Corporate Training Programmes",
      description:
        "Practical professional courses, corporate training, AI skills for the workforce and career-readiness programmes that turn learning into real capability.",
      keywords: ["corporate training", "professional courses", "upskilling", "AI training for employees", "career readiness"],
    },
    heading: "Education & training that builds future-ready skills",
    lead:
      "Practical programmes for professionals, teams and organisations — from technology and AI skills to career readiness — designed to turn learning into real capability.",
    summary: "Courses, corporate upskilling and AI skills that turn learning into capability.",
    highlights: ["Professional courses", "Corporate upskilling", "AI skills"],
    challenges: [
      { title: "Skills gaps slowing change", text: "New tools and systems arrive faster than teams can learn to use them well." },
      { title: "Training that doesn't stick", text: "Generic courses that people complete but rarely apply to their real work." },
      { title: "Graduates not yet job-ready", text: "Strong potential, but missing the practical skills employers look for." },
      { title: "No way to measure impact", text: "Training budgets spent without clear evidence of what changed." },
    ],
    offerings: [
      {
        title: "Professional courses",
        text: "Practical, industry-aligned courses that build skills people use immediately.",
        points: ["Technology and software skills", "Data and digital literacy", "Business and professional skills"],
      },
      {
        title: "Corporate training & upskilling",
        text: "Programmes designed around your teams, tools and goals.",
        points: ["Custom team programmes", "Leadership and management development", "New-system roll-out training"],
      },
      {
        title: "AI skills for the workforce",
        text: "Help people use AI tools effectively, safely and responsibly in their everyday work.",
        points: ["Practical AI tools for daily work", "Responsible and secure AI use", "Prompting and workflow design"],
      },
      {
        title: "Career readiness",
        text: "Prepare learners for the workplace with practical projects and guidance.",
        points: ["Interview preparation and mentoring", "Portfolio and project work", "Workplace skills"],
      },
      {
        title: "Certification preparation",
        text: "Structured preparation for industry certifications that strengthen careers.",
        points: ["Exam-focused study plans", "Practice assessments", "Guided revision"],
      },
      {
        title: "Learning design",
        text: "Curriculum and content design for organisations building their own learning programmes.",
        points: ["Curriculum design", "E-learning content", "Assessments and evaluation"],
      },
    ],
    benefits: [
      { title: "Practical & hands-on", text: "Learning built around real tasks, tools and scenarios." },
      { title: "Tailored to your goals", text: "Programmes shaped around your teams and the outcomes you need." },
      { title: "Flexible delivery", text: "Formats arranged to fit how your people work and learn." },
      { title: "Measurable outcomes", text: "Assessments and follow-up that show what has improved." },
    ],
    steps: [
      { name: "Skills assessment", text: "Understand current skills, goals and gaps." },
      { name: "Programme design", text: "Shape content, format and schedule around your needs." },
      { name: "Delivery", text: "Engaging, practical sessions with hands-on work." },
      { name: "Measure & reinforce", text: "Assess outcomes and reinforce learning over time." },
    ],
    faqs: [
      {
        q: "Do you train individuals or only organisations?",
        a: "Both. We work with organisations on team programmes and with individual professionals and learners who want to build their skills and careers.",
      },
      {
        q: "Can programmes be customised for our company?",
        a: "Yes. Corporate programmes are designed around your tools, processes and goals, so the learning applies directly to people's work.",
      },
      {
        q: "Can you train our teams on AI?",
        a: "Yes. Our AI skills programmes help people use AI tools productively and responsibly, drawing on the hands-on work of our AI & Business Automation division.",
      },
      {
        q: "Can training support a new system roll-out?",
        a: "Yes. Training can be planned alongside a technology project so people are ready to use new systems from day one.",
      },
      {
        q: "How do you measure whether training worked?",
        a: "We agree the intended outcomes up front and use assessments and follow-up to show what has changed after the programme.",
      },
    ],
    related: ["ai-business-automation", "it-technology"],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const serviceUrl = (slug: string) => `/services/${slug}`;
