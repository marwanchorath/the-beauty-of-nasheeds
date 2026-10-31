import * as esbuild from "esbuild"
import fs from "node:fs"
const r = await esbuild.build({ entryPoints: ["src/main.tsx"], bundle: true, minify: true, write: false, outdir: "out", jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' }, tsconfig: "tsconfig.json", target: "es2020", logLevel: "warning" })
const js = r.outputFiles.find(f => f.path.endsWith(".js")).text
const css = r.outputFiles.find(f => f.path.endsWith(".css")).text
const fonts = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Reem+Kufi:wght@500;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;600;700;800&family=Oswald:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap"
const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bila · Voices Without Instruments</title><meta name="description" content="Bila (بلا, \"without\"): instrument-free nasheeds with their meanings, themes and verses, and a seven-day challenge.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${fonts}">
<style>${css}</style></head><body><div id="root"></div><script>${js.replace(/<\/script/gi, "<\\/script")}</script></body></html>`
fs.mkdirSync("dist", { recursive: true }); fs.writeFileSync("dist/index.html", html)
console.log("built", (html.length / 1024).toFixed(0) + " KB")
