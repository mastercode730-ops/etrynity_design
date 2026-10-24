// Contact-form endpoint: validates the enquiry and delivers it by email via Resend.
// Environment variables (Vercel project settings):
//   RESEND_API_KEY     required — API key from resend.com
//   CONTACT_TO         optional — inbox that receives enquiries (default info@etrynity.com)
//   CONTACT_FROM       optional — verified sender (default "Etrynity Website <info@etrynity.com>")
//   CONTACT_AUTOREPLY  optional — set to "false" to stop the confirmation email to visitors
import type { APIRoute } from "astro";
import { Resend } from "resend";
import { SERVICES } from "../../data/services";
import { SITE } from "../../data/site";
import { rateLimit, clientIp, json } from "../../lib/rate-limit";

export const prerender = false;

const INTEREST_LABELS: Record<string, string> = Object.fromEntries([
  ...SERVICES.map((s) => [s.slug, s.name]),
  ["other", "Something else"],
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 3000;

interface Enquiry {
  name: string; email: string; company: string; role: string; message: string;
  interests: string[]; consent: boolean; website: string; startedAt: number; page: string;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v : v == null ? "" : String(v)).trim().slice(0, max);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function readEnquiry(request: Request): Promise<{ data: Enquiry; isForm: boolean }> {
  const type = request.headers.get("content-type") ?? "";
  const isForm = !type.includes("application/json");
  const src: Record<string, unknown> = {};
  if (isForm) {
    const fd = await request.formData();
    fd.forEach((v, k) => {
      if (k === "interests") (src.interests as unknown[] | undefined)?.push(v) ?? (src.interests = [v]);
      else src[k] = v;
    });
  } else {
    Object.assign(src, await request.json());
  }
  return {
    isForm,
    data: {
      name: oneLine(str(src.name, 120)),
      email: oneLine(str(src.email, 200)),
      company: oneLine(str(src.company, 160)),
      role: oneLine(str(src.role, 120)),
      message: str(src.message, 5000),
      interests: (Array.isArray(src.interests) ? src.interests : [])
        .map((i) => String(i))
        .filter((i) => i in INTEREST_LABELS),
      consent: src.consent === true || src.consent === "yes",
      website: str(src.website, 200),
      startedAt: Number(src.startedAt) || 0,
      page: str(src.page, 200),
    },
  };
}

function validate(d: Enquiry) {
  const fields: Record<string, string> = {};
  if (!d.name) fields.name = "Please enter your name.";
  if (!EMAIL_RE.test(d.email)) fields.email = "Please enter a valid email address.";
  if (d.message.length < 10) fields.message = "Please tell us a little more (at least 10 characters).";
  if (!d.consent) fields.consent = "Please confirm you agree so we can respond.";
  return fields;
}

function notificationEmail(d: Enquiry) {
  const interests = d.interests.map((i) => INTEREST_LABELS[i]).join(", ") || "Not specified";
  const rows: [string, string][] = [
    ["Name", d.name], ["Email", d.email], ["Company", d.company || "—"], ["Role", d.role || "—"], ["Interested in", interests],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nMessage:\n${d.message}\n\nSent from ${d.page || "/contact"}`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0A1424;line-height:1.6">
  <h2 style="margin:0 0 16px;font-size:20px">New website enquiry</h2>
  <table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#4A5568;vertical-align:top">${k}</td><td style="padding:4px 0"><strong>${esc(v)}</strong></td></tr>`)
    .join("")}</table>
  <h3 style="margin:24px 0 8px;font-size:16px">Message</h3>
  <p style="white-space:pre-wrap;margin:0">${esc(d.message)}</p>
  <p style="margin-top:24px;color:#8C97A8;font-size:13px">Sent from the contact form on ${esc(d.page || "/contact")}. Reply to this email to respond directly.</p>
</div>`;
  return { text, html };
}

function confirmationEmail(d: Enquiry) {
  const first = d.name.split(" ")[0];
  const text = `Hi ${first},\n\nThank you for contacting Etrynity. We've received your message and a member of our team will reply by email.\n\nFor reference, here is what you sent:\n\n${d.message}\n\nKind regards,\nEtrynity\n${SITE.email}`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0A1424;line-height:1.6;max-width:560px">
  <p style="font-family:Georgia,serif;letter-spacing:4px;color:#7A5A26;margin:0 0 24px">ETRYNITY</p>
  <p>Hi ${esc(first)},</p>
  <p>Thank you for contacting Etrynity. We've received your message and a member of our team will reply by email.</p>
  <p style="color:#4A5568">For reference, here is what you sent:</p>
  <blockquote style="margin:0;padding:12px 16px;border-left:3px solid #C9A46A;background:#F7F2E9;white-space:pre-wrap">${esc(d.message)}</blockquote>
  <p>Kind regards,<br>Etrynity<br><a href="mailto:${SITE.email}" style="color:#7A5A26">${SITE.email}</a></p>
</div>`;
  return { text, html };
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  let parsed: { data: Enquiry; isForm: boolean };
  try {
    parsed = await readEnquiry(request);
  } catch {
    return json({ ok: false, error: "We couldn't read your message." }, 400);
  }
  const { data, isForm } = parsed;
  const done = (ok: boolean, status: number, extra: Record<string, unknown> = {}) =>
    isForm ? redirect(ok ? "/contact/thank-you" : "/contact?status=error", 303) : json({ ok, ...extra }, status);

  // Spam traps: hidden field filled in, or submitted faster than a person could type.
  if (data.website || (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS)) return done(true, 200);

  const fields = validate(data);
  if (Object.keys(fields).length) return done(false, 422, { error: "Please check the highlighted fields.", fields });

  if (!rateLimit(`contact:${clientIp(request, clientAddress)}`, 5, 10 * 60_000))
    return done(false, 429, { error: "You've sent several messages in a short time. Please wait a few minutes." });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Contact form: RESEND_API_KEY is not set");
    return done(false, 503, { error: "Our contact form is temporarily unavailable." });
  }

  const resend = new Resend(key);
  const from = process.env.CONTACT_FROM || `Etrynity Website <${SITE.email}>`;
  const to = process.env.CONTACT_TO || SITE.email;
  const subject = `New enquiry from ${data.name}${data.company ? ` (${data.company})` : ""}`;

  try {
    const { error } = await resend.emails.send({ from, to, replyTo: data.email, subject, ...notificationEmail(data) });
    if (error) throw error;
  } catch (error) {
    console.error("Contact form: delivery failed", error);
    return done(false, 502, { error: "We couldn't send your message just now." });
  }

  if (process.env.CONTACT_AUTOREPLY !== "false") {
    try {
      const { error } = await resend.emails.send({
        from, to: data.email, replyTo: to, subject: "We've received your message — Etrynity", ...confirmationEmail(data),
      });
      if (error) console.error("Contact form: confirmation email failed", error);
    } catch (error) {
      console.error("Contact form: confirmation email failed", error);
    }
  }
  return done(true, 200);
};
