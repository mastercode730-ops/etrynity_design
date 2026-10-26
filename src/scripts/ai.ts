// Etrynity AI client: chat assistant, Solution Finder and contact-message drafting.
// All three stream from POST /api/chat. Failures produce clear, honest messages.
import { SITE } from "../data/site";
import { track } from "./analytics";

export const CONTACT_EMAIL = SITE.email;

type Mode = "chat" | "finder" | "draft";
type Msg = { role: "user" | "assistant"; content: string };

export class AiError extends Error {
  constructor(public kind: "unavailable" | "rate" | "invalid" | "network", message: string) {
    super(message);
  }
}

const ROUTES = /(^|[\s(])(\/(?:services(?:\/[a-z-]+)?|contact|about|our-approach))(?=[\s).,;:!?]|$)/g;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Minimal, safe formatter: escape everything, then allow **bold**, "## " headings, "- " bullets and site links. */
export function formatAi(text: string): string {
  const out: string[] = [];
  let list = false;
  for (const raw of escapeHtml(text).split("\n")) {
    let line = raw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    line = line.replace(ROUTES, '$1<a href="$2">$2</a>');
    line = line.split(CONTACT_EMAIL).join(`<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`);
    if (/^\s*[-•]\s+/.test(line)) {
      if (!list) { out.push("<ul>"); list = true; }
      out.push(`<li>${line.replace(/^\s*[-•]\s+/, "")}</li>`);
      continue;
    }
    if (list) { out.push("</ul>"); list = false; }
    if (/^#{2,3}\s+/.test(line)) out.push(`<h4>${line.replace(/^#{2,3}\s+/, "")}</h4>`);
    else if (line.trim()) out.push(`<p>${line}</p>`);
  }
  if (list) out.push("</ul>");
  return out.join("");
}

/** Streams a reply from the server. Throws AiError with a user-facing message on failure. */
export async function streamAi(mode: Mode, messages: Msg[], onText: (text: string) => void): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, messages }),
    });
  } catch {
    throw new AiError("network", "We couldn't reach Etrynity AI. Please check your connection and try again.");
  }
  if (!res.ok || !res.body) {
    if (res.status === 429) throw new AiError("rate", "You've sent several requests in a short time. Please wait a minute and try again.");
    if (res.status === 400) throw new AiError("invalid", "That message couldn't be processed. Please rephrase it and try again.");
    throw new AiError("unavailable", `Etrynity AI is unavailable right now. You can reach our team at ${CONTACT_EMAIL} or through the contact form.`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    onText(text);
  }
  text += decoder.decode();
  if (!text.trim()) throw new AiError("unavailable", `Etrynity AI didn't return an answer. Please try again, or contact us at ${CONTACT_EMAIL}.`);
  onText(text);
  return text;
}

/* ---------- Chat assistant ---------- */
export function initAssistant() {
  const launch = document.querySelector<HTMLButtonElement>("[data-eai-launch]");
  const panel = document.querySelector<HTMLElement>("[data-eai-panel]");
  if (!launch || !panel) return;
  const log = panel.querySelector<HTMLElement>("[data-eai-log]")!;
  const suggest = panel.querySelector<HTMLElement>("[data-eai-suggest]")!;
  const form = panel.querySelector<HTMLFormElement>("[data-eai-form]")!;
  const input = form.querySelector("textarea")!;
  const closeBtn = panel.querySelector<HTMLButtonElement>("[data-eai-close]")!;
  const history: Msg[] = [];
  let busy = false;
  launch.hidden = false;

  const addMsg = (role: "user" | "bot", html: string, isText = false) => {
    const m = document.createElement("div");
    m.className = `eai-msg ${role}${role === "bot" ? " ai-format" : ""}`;
    if (isText) m.textContent = html; else m.innerHTML = html;
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  };

  function open(question?: string) {
    panel!.classList.add("is-open");
    track("ai_assistant_open", { page: location.pathname });
    launch!.setAttribute("aria-expanded", "true");
    window.setTimeout(() => input.focus(), 120);
    if (question) send(question);
  }
  function close() {
    panel!.classList.remove("is-open");
    launch!.setAttribute("aria-expanded", "false");
    launch!.focus();
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    busy = true;
    suggest.hidden = true;
    addMsg("user", text, true);
    history.push({ role: "user", content: text });
    const bot = addMsg("bot", '<span class="typing" aria-label="Etrynity AI is typing"><i></i><i></i><i></i></span>');
    try {
      const reply = await streamAi("chat", history, (t) => {
        bot.innerHTML = formatAi(t);
        log.scrollTop = log.scrollHeight;
      });
      history.push({ role: "assistant", content: reply });
      track("ai_assistant_message", { result: "success" });
    } catch (err) {
      history.pop();
      track("ai_assistant_message", { result: err instanceof AiError ? err.kind : "error" });
      bot.classList.add("error");
      const msg = err instanceof AiError ? err.message : "Something went wrong. Please try again.";
      bot.innerHTML = formatAi(msg);
    } finally {
      busy = false;
    }
  }

  launch.addEventListener("click", () => (panel.classList.contains("is-open") ? close() : open()));
  closeBtn.addEventListener("click", close);
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  suggest.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-eai-question]");
    if (b) send(b.dataset.eaiQuestion!);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const t = input.value;
    input.value = "";
    send(t);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });
  // Any element with data-ask="question" or data-ai-open opens the assistant.
  document.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-ask], [data-ai-open]");
    if (!t) return;
    e.preventDefault();
    open(t.dataset.ask || undefined);
  });
}
