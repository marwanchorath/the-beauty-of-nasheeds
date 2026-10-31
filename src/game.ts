import * as React from "react"
import { ALL, ARTISTS, WORDS } from "./artists"

// XP is earned in exactly two ways: opening a nasheed on YouTube to listen
// (first time per nasheed), and learning an Arabic word card. Nothing else.
export const XP_LISTEN = 20
export const XP_WORD = 10

export type GameState = { xp: number; listened: string[]; words: string[]; reflected: string[]; best: number; badges: string[] }
const KEY = "nasheed-atlas-v2"
const EMPTY: GameState = { xp: 0, listened: [], words: [], reflected: [], best: 0, badges: [] }

export const LEVELS = ["Seeker", "Listener", "Attentive", "Traveller", "Hafiz of Words", "Companion of Voices", "Lantern Bearer"]
const STEP = 120
export const levelOf = (xp: number) => {
  const i = Math.min(LEVELS.length - 1, Math.floor(xp / STEP))
  return { i, name: LEVELS[i], into: xp - i * STEP, need: STEP, max: i === LEVELS.length - 1 }
}

const artistsHeard = (s: GameState) => new Set(ALL.filter((n) => s.listened.includes(n.id)).map((n) => n.artist)).size

export const BADGES: { id: string; name: string; ar: string; desc: string; test: (s: GameState) => boolean }[] = [
  { id: "first", name: "First listen", ar: "أول الطريق", desc: "Open one nasheed on YouTube", test: (s) => s.listened.length >= 1 },
  { id: "three", name: "Three voices", ar: "ثلاثة أصوات", desc: "Listen to three different artists", test: (s) => artistsHeard(s) >= 3 },
  { id: "every", name: "Every voice", ar: "كل الأصوات", desc: `Listen to all ${ARTISTS.length} artists`, test: (s) => artistsHeard(s) >= ARTISTS.length },
  { id: "twenty", name: "Twenty listens", ar: "عشرون", desc: "Listen to twenty nasheeds", test: (s) => s.listened.length >= 20 },
  { id: "words6", name: "First words", ar: "كلمات", desc: "Learn six Arabic words", test: (s) => s.words.length >= 6 },
  { id: "words", name: "Word keeper", ar: "حافظ الكلمات", desc: "Learn every word card", test: (s) => s.words.length >= WORDS.length },
]

function load(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}
const save = (s: GameState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

export type Toast = { id: number; text: string; kind: "xp" | "badge" | "level" }

export function useGame() {
  const [s, setS] = React.useState<GameState>(load)
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const tid = React.useRef(0)
  const toast = (text: string, kind: Toast["kind"]) => {
    const id = ++tid.current
    setToasts((t) => [...t, { id, text, kind }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }

  const apply = (fn: (p: GameState) => GameState, gained: number, why: string) => {
    setS((prev) => {
      const n = { ...fn(prev), xp: prev.xp + gained }
      const fresh = BADGES.filter((b) => !n.badges.includes(b.id) && b.test(n))
      if (fresh.length) n.badges = [...n.badges, ...fresh.map((b) => b.id)]
      const up = levelOf(n.xp).i > levelOf(prev.xp).i ? levelOf(n.xp).name : null
      window.setTimeout(() => {
        if (gained) toast(`+${gained} XP — ${why}`, "xp")
        fresh.forEach((b) => toast(`${b.name} — ${b.desc.toLowerCase()}`, "badge"))
        if (up) toast(`You are now: ${up}`, "level")
      }, 0)
      save(n)
      return n
    })
  }
  const plain = (fn: (p: GameState) => GameState) =>
    setS((p) => {
      const n = fn(p)
      save(n)
      return n
    })

  return {
    s,
    toasts,
    listen: (id: string) => {
      if (s.listened.includes(id)) return
      apply((p) => ({ ...p, listened: [...p.listened, id] }), XP_LISTEN, "listened")
    },
    learnWord: (ar: string) => {
      if (s.words.includes(ar)) return
      apply((p) => ({ ...p, words: [...p.words, ar] }), XP_WORD, "new word")
    },
    // no XP: a private bookmark
    toggleReflect: (id: string) => plain((p) => ({ ...p, reflected: p.reflected.includes(id) ? p.reflected.filter((x) => x !== id) : [...p.reflected, id] })),
    bestStreak: (n: number) => plain((p) => (n > p.best ? { ...p, best: n } : p)),
    reset: () => {
      try {
        localStorage.removeItem(KEY)
      } catch {}
      setS(EMPTY)
    },
  }
}
