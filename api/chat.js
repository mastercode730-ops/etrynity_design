// Etrynity AI — streaming chat endpoint (Vercel Node.js function).
// Requires the ANTHROPIC_API_KEY environment variable in the Vercel project.
import Anthropic from "@anthropic-ai/sdk";

let client;
const MODEL = "claude-opus-5-5";

const MAX_TURNS = 12;
const MAX_CHARS = 2000;

const COMPANY = `You are Etrynity AI, the assistant on the website of Etrynity ("Infinite Possibilities").

About Etrynity:
- A multi-industry company that brings together innovation, expertise and a global mindset to create sustainable solutions across industries. Tagline: "Building a smarter, stronger tomorrow." Signature: "Together for a better future."
- Four pillars: Technology, People, Progress, Together.
- The infinity emblem stands for long-term vision (infinity), multiple industries (layered lines), growth and progress (upward flow), and identity and excellence (the letter "E").
- Four divisions:
  1. IT & Technology (Build · Innovate · Transform): custom software, web and mobile apps; cloud and infrastructure; data, AI and automation; digital transformation.
  2. BPO & Global Services (People · Process · Performance): customer experience and multichannel support; back-office operations; staffing and workforce solutions; process excellence.
  3. Logistics & Supply Chain (Move · Connect · Grow): freight and distribution; warehousing and fulfilment; shipment visibility; supply-chain consulting.
  4. Education & Training (Learn · Upskill · Build Future): professional courses; corporate training; career readiness; certification.
- How we work: Discover, Design, Deliver, Grow.
- Website pages: Home (/), Services (/services), About (/about), Contact (/contact). Instagram: @etrynity.

Rules:
- Only state facts listed above. You do not know prices, timelines, office addresses, phone numbers, team members, client names or company figures; when asked, say the team will share specifics and point to the Contact page.
- Stay on topics related to Etrynity, its services, and how they could help the visitor's business or career. Politely steer unrelated requests back.
- Write in plain text. You may use short "- " bullet lists and **bold** for emphasis; no tables, no code blocks, no headings other than lines starting with "## ".
- Be warm, confident and concise.`;

const MODE_INSTRUCTIONS = {
  chat: "Answer the visitor in at most 120 words unless they ask for detail.",
  finder:
    "The visitor describes a business challenge. Reply with: a line '## Recommended for you' followed by the 1–2 most relevant Etrynity divisions in bold with one sentence each on why; then '## First steps' with exactly 3 short bullets describing how Etrynity would start (Discover/Design/Deliver style); then one closing sentence inviting them to the Contact page. Keep it under 170 words.",
  draft:
    "Write the body of a short, professional enquiry message (60–110 words) that the visitor will send to Etrynity through the contact form, in the first person, based on the details provided. Output only the message text, with no greeting line and no signature.",
};

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return null;
  const msgs = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return null;
  return msgs;
}

function statusFor(error) {
  if (error instanceof Anthropic.RateLimitError) return 429;
  if (error instanceof Anthropic.AuthenticationError) return 503;
  if (error instanceof Anthropic.BadRequestError) return 400;
  if (error instanceof Anthropic.APIError) return 502;
  return 500;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: "AI is not configured" });
  }
  client ??= new Anthropic();

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const mode = MODE_INSTRUCTIONS[body.mode] ? body.mode : "chat";
  const messages = cleanMessages(body.messages);
  if (!messages) return res.status(400).json({ error: "Invalid messages" });

  let started = false;
  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [
        { type: "text", text: COMPANY, cache_control: { type: "ephemeral" } },
        { type: "text", text: MODE_INSTRUCTIONS[mode] },
      ],
      messages,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        if (!started) {
          started = true;
          res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
          });
        }
        res.write(event.delta.text);
      }
    }

    const final = await stream.finalMessage();
    if (!started) {
      const text =
        final.stop_reason === "refusal"
          ? "I can't help with that one, but I'm happy to tell you about Etrynity's services or connect you with our team via the Contact page."
          : "Sorry, I couldn't come up with an answer. Please try rephrasing your question.";
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
      res.write(text);
    }
    res.end();
  } catch (error) {
    console.error("Etrynity AI error:", error);
    if (!started) return res.status(statusFor(error)).json({ error: "AI request failed" });
    res.end("\n\n[Connection interrupted — please try again.]");
  }
}
