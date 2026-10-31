# Bila (بلا) · Voices Without Instruments

Bila means "without". A site of instrument-free nasheeds from seven voices (Ahmed Bukhatir, Mishary Alafasy, Muhammad al-Muqit, Mishary Al-Arada, Mohamed Tarek, Omar Esa, Muad). Each nasheed has its title, the meaning of the title, a theme, and a Qur'an verse or hadith. XP is earned only by listening on YouTube and by learning word cards.

## Structure (shadcn-style)

```
src/
  components/ui/disc-cascade-carousel.tsx   ← the disc component, copied unchanged
  components/ui/motion.tsx                  ← inertial scroll engine + scroll-linked primitives
                                              (masked line reveals, scroll-lit words, parallax, clip reveals)
  data.ts      ← Ahmed Bukhatir's discography
  artists.ts   ← the other voices, moods and word cards
  scenes.ts    ← the SVG illustrations used as disc labels and card art (no external images)
  game.ts      ← XP, levels, badges (saved in localStorage)
  App.tsx      ← page sections
  styles.css
```

`components/ui` is where shadcn expects UI primitives, and the `@/components/ui/...` import alias resolves there, so other shadcn components drop in beside these without path changes.

## Running it in a Next.js + shadcn project

```bash
npx create-next-app@latest bila --typescript --tailwind --app
cd bila
npx shadcn@latest init          # creates components/ui and the @/ alias
```

Then copy `src/components/ui/*` into `components/ui/`, put `data.ts`, `artists.ts`, `scenes.ts`, `game.ts` and `App.tsx` in `components/` (or `app/`), import `styles.css` in `app/layout.tsx`, and render `<App />` from `app/page.tsx`. Every file starts with `"use client"`. Add the Google Fonts link (Amiri, Reem Kufi, Instrument Serif, Inter, Oswald, JetBrains Mono) in the layout.

The only runtime dependency is React. There is no Tailwind class usage inside the components, so they work with or without Tailwind.

## Building the single-file version

`build.mjs` bundles everything with esbuild into `dist/index.html`:

```bash
npm i react react-dom esbuild
node build.mjs
```

## About the content

Lyrics are not reproduced (they are copyrighted). Themes marked "Documented" come from published descriptions of the songs; the rest are drawn from the title. Sources: Wikipedia (Bukhatir, Alafasy, Al-Arada), The National, and published discographies.
