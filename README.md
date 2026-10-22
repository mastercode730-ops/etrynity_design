# Etrynity — Website

The Etrynity website: static HTML/CSS pages with a motion layer and AI features, plus one Vercel serverless function (`api/chat.js`) that calls the Claude API.

## Pages

| URL | Screen |
|---|---|
| `/` | Home: AI hero, AI-at-the-core section, AI Solution Finder |
| `/services` | Services, with an "Ask AI about this" button on each division |
| `/about` | About |
| `/contact` | Contact, with "Draft my message with AI" (the form itself is a demo; nothing is sent) |
| `/mobile` | Home at phone size (390px) |
| `/style-guide` | Logo, colours, type, buttons, icons |
| `/screens` | Gallery linking every screen |

## AI features

- **Etrynity AI assistant:** a floating chat button on every page. It streams answers about Etrynity's services.
- **AI Solution Finder (home page):** a visitor describes a business challenge and gets the recommended divisions plus first steps.
- **Draft with AI (contact page):** writes the enquiry message from the selected interests and details.

All three call `POST /api/chat`, which uses `claude-opus-5-5` with streaming. The company facts the AI may use are in the `COMPANY` prompt in `api/chat.js`; update them there as details change (contact info, team, etc.).

**Demo mode:** if the API key is missing or the endpoint can't be reached (for example when you open the files locally), the features still work. They answer from built-in company info and show a small "Demo mode" note.

## Animations and effects

These live in `assets/fx.css` and `assets/fx.js`, with no libraries:

- a neural-network canvas in the hero that reacts to the mouse
- headline word cascade and gold shimmer text
- orbiting light trails over the globe image
- glass sticky navigation and a scroll progress bar
- scroll reveals, card spotlight and 3D tilt, and magnetic buttons
- cursor glow, a capabilities marquee and soft page transitions

Everything respects the visitor's "reduce motion" setting.

## Deploy on Vercel

1. Import the GitHub repo at vercel.com/new. Leave the framework as **Other** and the build command empty.
2. In **Project → Settings → Environment Variables**, add `ANTHROPIC_API_KEY` with a key from console.anthropic.com, then redeploy.

Without the key the site still deploys and runs in demo mode.

## Preview locally

- `npx vercel dev` runs the pages and the AI endpoint.
- `npx serve .` runs the pages only, with the AI in demo mode.
