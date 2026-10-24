# Etrynity — website

The Etrynity company website: [Astro](https://astro.build) static pages for speed and SEO, plus two Vercel serverless functions — **Etrynity AI** (`/api/chat`) and the **contact form** (`/api/contact`).

## Pages

| URL | Page |
|---|---|
| `/` | Home |
| `/services` | Services overview |
| `/services/it-technology` | IT & Technology |
| `/services/ai-business-automation` | AI & Business Automation |
| `/services/bpo-global-services` | BPO & Global Services |
| `/services/logistics-supply-chain` | Logistics & Supply Chain |
| `/services/education-training` | Education & Training |
| `/our-approach` | Our Approach / How We Work |
| `/about` | About Us |
| `/contact` | Contact Us (enquiry form) |
| `/privacy-policy` | Privacy policy |
| `/insights`, `/case-studies` | Generated automatically once the first entry is published (see below) |

## Where to edit content

- **Company facts** (email, Instagram, values, process, engagement models): `src/data/site.ts`. Every page reads contact details from here.
- **Service pages** (headings, offerings, benefits, steps, FAQs, SEO title and description): `src/data/services.ts`.
- **What Etrynity AI knows:** it is built from the two files above. Extra rules are in `src/pages/api/chat.ts`.
- **Page layouts:** `src/pages/*.astro`. Shared pieces (header, footer, CTA, FAQ, illustrations) live in `src/components/`.
- **Design system** (colours, type scale, components, motion): `src/styles/global.css`.

Only publish verified information: no invented clients, statistics, team members or testimonials.

## Deploy on Vercel

The repo includes `vercel.json`, so Vercel builds it as an Astro project on Node 24. In **Project → Settings → Environment Variables**, add the variables below, then redeploy.

| Variable | Required | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes, for AI | Etrynity AI assistant, Solution Finder and message drafting (Claude `claude-opus-5-5`). |
| `RESEND_API_KEY` | Yes, for the form | Delivers contact-form enquiries. |
| `CONTACT_TO` | No | Inbox for enquiries (default `info@etrynity.com`). |
| `CONTACT_FROM` | No | Sender (default `Etrynity Website <info@etrynity.com>`); the domain must be verified in Resend. |
| `CONTACT_AUTOREPLY` | No | Set to `false` to stop the confirmation email sent to visitors. |
| `PUBLIC_GA_ID` | No | Google Analytics 4 ID. Analytics loads only after the visitor accepts the cookie banner. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Search Console HTML-tag token. |
| `SITE_URL` | No | Canonical URL override. By default this is Vercel's production domain, which becomes your custom domain once you attach one. |

Without the keys the site still works. The AI features show a clear "unavailable" message (the Solution Finder falls back to a keyword-based suggestion), and the form asks visitors to email info@etrynity.com.

### Resend setup (contact form)

1. Create a Resend account and add the domain **etrynity.com**. Add the DNS records Resend shows you, and wait for it to report "Verified".
2. Create an API key and save it as `RESEND_API_KEY` in Vercel.
3. Send a test enquiry from `/contact` and confirm it arrives at info@etrynity.com.

### Google Search Console & Analytics

1. **Search Console:** add the site as a URL-prefix property and choose **HTML tag** verification. Put the token in `PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, click **Verify**, then submit `https://<your-domain>/sitemap-index.xml` under **Sitemaps**.
2. **Analytics:** create a GA4 property and web stream, put the measurement ID in `PUBLIC_GA_ID`, and redeploy.

## Adding insights and case studies

Copy `src/content/insights/_template.md` (or `src/content/case-studies/_template.md`) to a new file without the leading underscore, fill in the front matter, and set `draft: false`. The listing page, the article page, sitemap entries, structured data and footer links are all created automatically. Case studies require `clientApproved: true`.

## Local development

This needs Node 24 (Astro 7 requires Node 22.23 or later).

```
npm install
cp .env.example .env   # add keys if you want the AI and form to work locally
npm run dev            # http://localhost:4321
npm run build          # production build into .vercel/output
```

## SEO built in

- A unique title, description and canonical URL on every page.
- Open Graph and Twitter cards with a branded share image.
- JSON-LD structured data: Organization, WebSite, WebPage and BreadcrumbList on every page, plus Service, OfferCatalog and FAQPage on service pages.
- `sitemap-index.xml`, a generated `robots.txt`, and descriptive alt text on all images.
- Self-hosted fonts, and images optimised to AVIF/WebP.
