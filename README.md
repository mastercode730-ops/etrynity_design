# Etrynity — Website Design (static)

A static HTML/CSS preview of the Etrynity website design. It has no build step and no dependencies.

## Pages

| URL | Screen |
|---|---|
| `/` | Home |
| `/services` | Services |
| `/about` | About |
| `/contact` | Contact (the form is a front-end demo only, nothing is sent) |
| `/mobile` | Home at phone size (390px) |
| `/style-guide` | Logo, colours, type, buttons, icons |
| `/screens` | Gallery linking every screen |

## Deploy on Vercel

**Option A: drag and drop.** Go to vercel.com/new, choose to deploy without Git, and drop this `etrynity_design` folder in.

**Option B: CLI**
```
npm i -g vercel
cd etrynity_design
vercel          # preview
vercel --prod   # production
```
When asked for settings, choose Framework: **Other**, leave the build command empty, and set the output directory to `.`

**Option C: GitHub.** Push this folder to a repo and import it on Vercel with the root directory set to `etrynity_design`.

## Preview locally
Open `index.html` in a browser, or run `npx serve .` inside this folder.
