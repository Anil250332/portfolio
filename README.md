# Anil Sahu — Portfolio

A professional, editorial single-page portfolio built with **React**, **TypeScript**, and **Tailwind CSS v4** (Vite + Framer Motion). The design language and **animations** are inspired by vadimcarazan.com — a near-black monochrome theme, serif-italic display type (Instrument Serif), Inter Tight sans, hairline separators, glass panels, k/v micro-labels, and an immersive scroll-driven "flight" through the work.

## 🎬 Animations (homepage)

- **Loader** — a monogram is drawn by a pen stroke with a progress line, then fades out.
- **Signature** — a hand-drawn underline "writes" itself beneath the hero name.
- **Flight** — a cinematic, scroll-driven corridor where each project flies toward you (scale + parallax + rotation) with a live HUD number/title in the style of "fly through the work".
- **Glass project modal** — slide/fade in with backdrop blur.
- Scroll-reveals, hover scales, and underline-on-hover nav throughout.

## 🖼️ Images

Work images are **generated locally** (deterministic abstract gradient art via `src/components/art.ts` → `workImage(i)`). They render reliably with no network dependency. To use real screenshots, replace `workImage(i)` with actual URLs in `Flight.tsx`, `Work.tsx`, and the modal.

## 🚀 Quick Start

```bash
# install dependencies
npm install

# start dev server (http://localhost:5173)
npm run dev

# production build
npm run build

# preview the production build
npm run preview
```

## 📁 Structure

```
src/
  components/
    primitives.tsx   # shared Reveal + SectionTitle + Label helpers
    TopBar.tsx       # fixed top bar: mark, k/v facts, clock, mobile menu
    Hero.tsx         # giant serif name + lead + "Explore the work"
    Work.tsx         # "Selected work" list + glass project modal
    About.tsx        # serif bio + facts grid
    Skills.tsx
    Experience.tsx
    Education.tsx
    Contact.tsx      # brief form with chip selectors
    Footer.tsx
    icons.tsx
  data/resume.ts      # ★ ALL your content lives here
  App.tsx
  index.css           # Tailwind theme (monochrome + serif) + shared motifs
```

## ✏️ Customizing Content

Everything (name, email, links, experience, projects, skills, education) is driven by the single data file **`src/data/resume.ts`**. Edit that file to update the site — no component changes needed.

### Styling

- The design system (fonts, colors, dark surface palette, accent gradient) is defined in **`src/index.css`** under the `@theme` block and `.text-gradient` utilities.
- Accent colors: cyan → violet gradient (`--color-accent-400` / `--color-violet-500`). Change the two gradient stops to re-theme the whole site.

## 🎨 Features

- Dark, modern UI with glassmorphism cards, gradient text, and subtle grid/glow backgrounds
- Smooth scroll navigation with a sticky, blur-on-scroll navbar
- Framer Motion scroll-reveal animations (reduced-motion friendly)
- Fully responsive from mobile to desktop
- SEO-ready: meta description + semantic headings

## ⚠️ Note

`npm audit` currently reports a **moderate/low-severity advisory in `esbuild`** (a Vite dev dependency). It only affects the **local development server**, not the deployed production bundle. To silence it, run `npm audit fix --force` (upgrades Vite to v8 — a breaking change) or pin a patched esbuild via npm `overrides`.

## 🚢 Deploy

The project builds to a static `dist/` folder. Deploy anywhere: **Vercel**, **Netlify**, **GitHub Pages**, or **Hostinger** (static hosting).

- Vercel/Netlify: import the repo, build command `npm run build`, output dir `dist`.
- GitHub Pages: set `base` in `vite.config.ts` to your repo name.
