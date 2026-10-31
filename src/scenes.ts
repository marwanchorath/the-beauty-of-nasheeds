import type { Scene } from "./data"

// Hand-drawn SVG scenes, one mood per theme. Seeded so every render matches.
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const stars = (r: () => number, n: number, maxY = 360, color = "#fff") => {
  let s = ""
  for (let i = 0; i < n; i++) {
    const x = (r() * 600).toFixed(1), y = (r() * maxY).toFixed(1), rad = (0.6 + r() * 1.8).toFixed(2)
    s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${color}" opacity="${(0.35 + r() * 0.65).toFixed(2)}"/>`
  }
  return s
}

const crescent = (cx: number, cy: number, r: number, bg: string, color = "#f6e7b4") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/><circle cx="${cx + r * 0.38}" cy="${cy - r * 0.18}" r="${r * 0.86}" fill="${bg}"/>`

// An eight-point star (khatam) used as a geometric motif.
const khatam = (cx: number, cy: number, r: number, fill: string, op = 1) => {
  const sq = (rot: number) => `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" transform="rotate(${rot} ${cx} ${cy})" fill="${fill}" opacity="${op}"/>`
  return sq(0) + sq(45)
}

const lattice = (color: string, op: number) => {
  let s = `<g opacity="${op}" fill="none" stroke="${color}" stroke-width="1.2">`
  for (let y = 0; y <= 600; y += 75)
    for (let x = 0; x <= 600; x += 75) {
      s += `<rect x="${x - 22}" y="${y - 22}" width="44" height="44"/><rect x="${x - 22}" y="${y - 22}" width="44" height="44" transform="rotate(45 ${x} ${y})"/>`
    }
  return s + "</g>"
}

const dunes = (c1: string, c2: string) =>
  `<path d="M0 430 Q150 370 300 420 T600 400 V600 H0Z" fill="${c1}"/><path d="M0 480 Q200 430 380 490 T600 470 V600 H0Z" fill="${c2}"/>`

const mosque = (fill: string, x = 300, base = 470, s = 1) => {
  const w = 120 * s
  return `<g fill="${fill}">
    <rect x="${x - w}" y="${base - 90 * s}" width="${w * 2}" height="${90 * s}"/>
    <path d="M${x - 80 * s} ${base - 90 * s} Q${x - 80 * s} ${base - 200 * s} ${x} ${base - 230 * s} Q${x + 80 * s} ${base - 200 * s} ${x + 80 * s} ${base - 90 * s}Z"/>
    <rect x="${x - 3 * s}" y="${base - 262 * s}" width="${6 * s}" height="${34 * s}"/>
    <rect x="${x - w - 34 * s}" y="${base - 250 * s}" width="${22 * s}" height="${250 * s}"/>
    <path d="M${x - w - 40 * s} ${base - 250 * s} L${x - w - 23 * s} ${base - 290 * s} L${x - w - 6 * s} ${base - 250 * s}Z"/>
    <rect x="${x + w + 12 * s}" y="${base - 250 * s}" width="${22 * s}" height="${250 * s}"/>
    <path d="M${x + w + 6 * s} ${base - 250 * s} L${x + w + 23 * s} ${base - 290 * s} L${x + w + 40 * s} ${base - 250 * s}Z"/>
  </g>`
}

const palm = (x: number, base: number, h: number, fill: string) => {
  let s = `<path d="M${x} ${base} Q${x + 12} ${base - h / 2} ${x + 6} ${base - h}" stroke="${fill}" stroke-width="9" fill="none" stroke-linecap="round"/>`
  const tx = x + 6, ty = base - h
  for (const a of [-160, -125, -90, -55, -20, 200, 160]) {
    const rad = (a * Math.PI) / 180
    const ex = tx + Math.cos(rad) * 70, ey = ty + Math.sin(rad) * 40 + 30
    s += `<path d="M${tx} ${ty} Q${(tx + ex) / 2} ${ty - 30} ${ex} ${ey}" stroke="${fill}" stroke-width="7" fill="none" stroke-linecap="round"/>`
  }
  return s
}

function svg(scene: Scene, seed: number): string {
  const r = rng(seed * 7919 + 3)
  const grad = (id: string, a: string, b: string, c?: string) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/>${c ? `<stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/>` : `<stop offset="1" stop-color="${b}"/>`}</linearGradient>`
  let body = ""
  switch (scene) {
    case "night":
      body = `<defs>${grad("g", "#050816", "#14204a", "#2b2a5c")}</defs><rect width="600" height="600" fill="url(#g)"/>${stars(r, 120)}${crescent(400, 170, 62, "#0b1230")}${dunes("#1b1840", "#0f0d26")}`
      break
    case "dome":
      body = `<defs>${grad("g", "#2a0f3d", "#c2553a", "#f2b35b")}</defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="300" r="150" fill="#ffd98a" opacity=".55"/>${stars(r, 30, 200)}${mosque("#1b0b24")}<rect y="470" width="600" height="130" fill="#1b0b24"/>`
      break
    case "lantern": {
      body = `<defs>${grad("g", "#0d1a2b", "#1d3550")}<radialGradient id="glow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs><rect width="600" height="600" fill="url(#g)"/>${lattice("#e8c27a", 0.12)}`
      const lamps: [number, number, number][] = [[170, 260, 1], [320, 330, 1.3], [470, 240, 0.9]]
      for (const [x, y, s] of lamps) {
        body += `<line x1="${x}" y1="0" x2="${x}" y2="${y - 70 * s}" stroke="#c9a35a" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${110 * s}" fill="url(#glow)"/>
          <path d="M${x - 30 * s} ${y - 40 * s} L${x} ${y - 75 * s} L${x + 30 * s} ${y - 40 * s}Z" fill="#c9a35a"/>
          <rect x="${x - 30 * s}" y="${y - 40 * s}" width="${60 * s}" height="${80 * s}" rx="${8 * s}" fill="#f4c768" stroke="#8a6526" stroke-width="${4 * s}"/>
          <path d="M${x} ${y - 30 * s} V${y + 30 * s} M${x - 30 * s} ${y} H${x + 30 * s}" stroke="#8a6526" stroke-width="${3 * s}"/>
          <path d="M${x - 22 * s} ${y + 40 * s} L${x} ${y + 62 * s} L${x + 22 * s} ${y + 40 * s}Z" fill="#c9a35a"/>`
      }
      body += crescent(90, 90, 30, "#0f1d30")
      break
    }
    case "book":
      body = `<defs>${grad("g", "#06231f", "#0f4a3f", "#1c6b57")}<radialGradient id="glow" cx=".5" cy=".55"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".95"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient></defs>
        <rect width="600" height="600" fill="url(#g)"/>${lattice("#d9c48a", 0.1)}<circle cx="300" cy="320" r="230" fill="url(#glow)"/>
        ${(() => { let s = ""; for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (i - 6.5) * 0.17; s += `<line x1="300" y1="360" x2="${300 + Math.cos(a) * 300}" y2="${360 + Math.sin(a) * 300}" stroke="#fff3c4" stroke-width="2" opacity=".25"/>` } return s })()}
        <path d="M120 400 Q210 360 300 400 Q390 360 480 400 L480 450 Q390 410 300 450 Q210 410 120 450Z" fill="#7a4a1e"/>
        <path d="M130 395 Q215 350 300 392 V440 Q215 400 130 440Z" fill="#fbf3dc"/><path d="M470 395 Q385 350 300 392 V440 Q385 400 470 440Z" fill="#f1e5c4"/>
        ${(() => { let s = ""; for (let i = 0; i < 4; i++) { s += `<path d="M150 ${402 + i * 9} Q215 ${372 + i * 9} 285 ${402 + i * 9}" stroke="#5d4a2a" stroke-width="1.6" fill="none" opacity=".5"/><path d="M315 ${402 + i * 9} Q385 ${372 + i * 9} 450 ${402 + i * 9}" stroke="#5d4a2a" stroke-width="1.6" fill="none" opacity=".5"/>` } return s })()}
        <path d="M200 470 H400 L380 500 H220Z" fill="#4a2c12"/>${khatam(300, 170, 26, "#f6dc8c", 0.85)}`
      break
    case "sea":
      body = `<defs>${grad("g", "#0a2440", "#2d6f8f", "#f0b071")}</defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="330" r="70" fill="#ffd9a0"/>${stars(r, 30, 160)}
        <rect y="330" width="600" height="270" fill="#0d3049"/>
        ${(() => { let s = ""; for (let i = 0; i < 9; i++) { const y = 345 + i * 26; s += `<path d="M0 ${y} Q75 ${y - 8} 150 ${y} T300 ${y} T450 ${y} T600 ${y}" stroke="#7fb3c9" stroke-width="2" fill="none" opacity="${(0.5 - i * 0.04).toFixed(2)}"/>` } return s })()}
        <rect x="290" y="340" width="20" height="200" fill="#ffd9a0" opacity=".25"/>
        <path d="M200 400 H400 L370 435 H230Z" fill="#1a1208"/><path d="M300 400 V230 L390 390Z" fill="#f4ead2"/><path d="M296 400 V250 L230 390Z" fill="#e5d7b8"/>`
      break
    case "drop":
      body = `<defs>${grad("g", "#2a0a14", "#6e1427", "#a52a3a")}<radialGradient id="d" cx=".4" cy=".35"><stop offset="0" stop-color="#ff8a8a"/><stop offset="1" stop-color="#b3132b"/></radialGradient></defs>
        <rect width="600" height="600" fill="url(#g)"/>${lattice("#ffb3b3", 0.08)}
        <path d="M300 120 C300 120 170 290 170 370 A130 130 0 0 0 430 370 C430 290 300 120 300 120Z" fill="url(#d)"/>
        <path d="M300 330 C280 300 235 310 238 350 C242 385 300 420 300 420 C300 420 358 385 362 350 C365 310 320 300 300 330Z" fill="#fff" opacity=".92"/>
        <ellipse cx="245" cy="300" rx="18" ry="34" fill="#fff" opacity=".35" transform="rotate(25 245 300)"/>`
      break
    case "oasis":
      body = `<defs>${grad("g", "#f7c88a", "#f39a6b", "#c96a5a")}</defs><rect width="600" height="600" fill="url(#g)"/><circle cx="420" cy="260" r="80" fill="#fff1c9" opacity=".8"/>
        ${dunes("#d4875a", "#b06648")}<ellipse cx="300" cy="510" rx="190" ry="34" fill="#3d8f8a"/><ellipse cx="300" cy="505" rx="150" ry="20" fill="#7fc4b8" opacity=".6"/>
        ${palm(170, 510, 200, "#3b2418")}${palm(410, 515, 160, "#3b2418")}${palm(250, 520, 120, "#4a2d1d")}`
      break
    case "dawn":
      body = `<defs>${grad("g", "#1b2a4e", "#e07a5f", "#f7d08a")}</defs><rect width="600" height="600" fill="url(#g)"/>${stars(r, 30, 140)}
        <circle cx="300" cy="420" r="110" fill="#fff0c2"/>
        ${(() => { let s = ""; for (let i = 0; i < 18; i++) { const a = Math.PI + (i / 17) * Math.PI; s += `<line x1="${300 + Math.cos(a) * 130}" y1="${420 + Math.sin(a) * 130}" x2="${300 + Math.cos(a) * 260}" y2="${420 + Math.sin(a) * 260}" stroke="#fff0c2" stroke-width="3" opacity=".35"/>` } return s })()}
        <path d="M0 440 L120 360 L220 430 L330 340 L450 440 L540 380 L600 420 V600 H0Z" fill="#3a2a48"/><path d="M0 500 Q300 440 600 500 V600 H0Z" fill="#21182d"/>`
      break
    case "path":
      body = `<defs>${grad("g", "#0f1a2e", "#3b4f7a", "#c78c6b")}</defs><rect width="600" height="600" fill="url(#g)"/>${stars(r, 60, 260)}${crescent(470, 110, 34, "#1b2740")}
        <rect y="360" width="600" height="240" fill="#2b2238"/>
        <path d="M285 360 L315 360 L470 600 L130 600Z" fill="#d8b98c"/><path d="M297 360 L303 360 L310 600 L290 600Z" fill="#fff6dd" opacity=".7"/>
        <path d="M0 360 Q120 330 240 360Z M360 360 Q480 320 600 360Z" fill="#3e3352"/>`
      break
    case "hands":
      body = `<defs>${grad("g", "#0b1f2f", "#1f4d5c", "#d7b67a")}<radialGradient id="glow"><stop offset="0" stop-color="#fff2c0" stop-opacity=".9"/><stop offset="1" stop-color="#fff2c0" stop-opacity="0"/></radialGradient></defs>
        <rect width="600" height="600" fill="url(#g)"/>${stars(r, 50, 240)}<circle cx="300" cy="200" r="170" fill="url(#glow)"/>${crescent(300, 150, 40, "#f5e2a8", "#ffffff")}
        <path d="M150 600 C150 470 190 390 250 360 C268 352 282 362 280 382 L268 470 C265 500 280 520 290 600Z" fill="#c99a6b"/>
        <path d="M450 600 C450 470 410 390 350 360 C332 352 318 362 320 382 L332 470 C335 500 320 520 310 600Z" fill="#b7875a"/>
        <path d="M190 600 C200 520 230 470 262 450" stroke="#8a5f3a" stroke-width="3" fill="none" opacity=".5"/><path d="M410 600 C400 520 370 470 338 450" stroke="#7a5030" stroke-width="3" fill="none" opacity=".5"/>`
      break
    case "city": {
      body = `<defs>${grad("g", "#1a1036", "#7a3b69", "#f0a35e")}</defs><rect width="600" height="600" fill="url(#g)"/><circle cx="300" cy="380" r="120" fill="#ffd69a" opacity=".7"/>${stars(r, 30, 180)}`
      let x = 0
      while (x < 600) {
        const w = 30 + r() * 50, h = 80 + r() * 170
        body += `<rect x="${x}" y="${470 - h}" width="${w}" height="${h}" fill="#241536"/>`
        for (let wy = 470 - h + 14; wy < 460; wy += 22) for (let wx = x + 8; wx < x + w - 8; wx += 14) if (r() > 0.55) body += `<rect x="${wx}" y="${wy}" width="5" height="8" fill="#ffd27a" opacity=".8"/>`
        x += w + 4
      }
      body += mosque("#170c24", 300, 470, 0.7) + `<rect y="470" width="600" height="130" fill="#120a1d"/><path d="M0 520 H600" stroke="#ffd27a" stroke-width="2" opacity=".3"/>`
      break
    }
    case "star": {
      body = `<defs>${grad("g", "#0d0b2b", "#251b5e")}</defs><rect width="600" height="600" fill="url(#g)"/>${stars(r, 90)}`
      for (let i = 0; i < 6; i++) body += khatam(300, 300, 220 - i * 34, i % 2 ? "#251b5e" : "#d9b45a", 1)
      body += `<circle cx="300" cy="300" r="40" fill="#fff4cf"/>`
      break
    }
    case "rain":
      body = `<defs>${grad("g", "#18222e", "#3b4b5c", "#64788a")}</defs><rect width="600" height="600" fill="url(#g)"/>
        ${(() => { let s = ""; for (let i = 0; i < 110; i++) { const x = r() * 640, y = r() * 600; s += `<line x1="${x}" y1="${y}" x2="${x - 10}" y2="${y + 34}" stroke="#cfe3f2" stroke-width="1.4" opacity="${(0.2 + r() * 0.4).toFixed(2)}"/>` } return s })()}
        ${mosque("#121a24", 300, 520, 0.8)}<rect y="520" width="600" height="80" fill="#121a24"/>
        <rect x="285" y="420" width="30" height="40" rx="15" fill="#ffd27a" opacity=".9"/>`
      break
    case "mountain":
      body = `<defs>${grad("g", "#0e2238", "#3d6a8a", "#a9c7d6")}</defs><rect width="600" height="600" fill="url(#g)"/>${stars(r, 40, 180)}${crescent(130, 120, 36, "#173049")}
        <path d="M0 470 L170 230 L250 330 L360 160 L600 470Z" fill="#20374f"/><path d="M360 160 L410 225 L380 220 L360 250 L340 215 L318 222Z" fill="#e8f1f5"/>
        <path d="M0 520 L140 380 L300 500 L460 360 L600 480 V600 H0Z" fill="#132535"/>
        <path d="M352 168 V120 L392 132 L352 144" fill="#d9b45a"/>`
      break
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">${body}</svg>`
}

const cache = new Map<string, string>()
export function sceneUri(scene: Scene, seed: number): string {
  const k = scene + seed
  let v = cache.get(k)
  if (!v) {
    v = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg(scene, seed))
    cache.set(k, v)
  }
  return v
}
