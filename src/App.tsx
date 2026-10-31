"use client"
import * as React from "react"
import DiscCascadeCarousel, { type DiscCascadeItem } from "@/components/ui/disc-cascade-carousel"
import { Lines, ScrollWords, Reveal, ClipImage, Parallax, Counter, initScroll, scrollToId, scrollToY, lockScroll, useProgress, useScrollY, clamp, ease } from "@/components/ui/motion"
import { ALL, ARTISTS, MOODS, WORDS, BUKHATIR_ALBUMS, byArtist, artistOf } from "./artists"
import type { Nasheed } from "./data"
import { sceneUri } from "./scenes"
import { useGame, levelOf, BADGES, XP_LISTEN, XP_WORD } from "./game"
import Challenge from "./Challenge"
import { STORIES } from "./stories"

type Item = Nasheed & { artist: string }
type Game = ReturnType<typeof useGame>

const img = (n: Item) => sceneUri(n.scene, ALL.indexOf(n) + 1)
const yt = (n: Item) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(artistOf(n).name + " " + n.title + " nasheed")
const pad = (i: number) => String(i).padStart(2, "0")
const meaningOf = (n: Item) => (n.lang !== "Arabic" ? `Sung in ${n.lang}` : n.meaning === n.title ? "Arabic nasheed" : n.meaning)
const today = ALL[Math.floor(Date.now() / 86400000) % ALL.length]

// ───────────────────────────── chrome
function Nav({ g, onChallenge, inChallenge }: { g: Game; onChallenge: () => void; inChallenge: boolean }) {
  const L = levelOf(g.s.xp)
  const [hidden, setHidden] = React.useState(false)
  const last = React.useRef(0)
  useScrollY((y) => {
    setHidden(y > 400 && y > last.current)
    last.current = y
  })
  return (
    <header className={"nav" + (hidden ? " is-hidden" : "")}>
      <button className="nav-brand" onClick={() => scrollToY(0)}>Bila <span className="nav-brand-ar" dir="rtl">بلا</span></button>
      <nav className="nav-links" aria-label="Sections">
        {inChallenge ? null : [["discs", "Discs"], ["voices", "Voices"], ["moods", "Moods"], ["stories", "Stories"], ["words", "Words"], ["trail", "Your trail"]].map(([id, l]) => (
          <button key={id} onClick={() => scrollToId(id)}>{l}</button>
        ))}
      </nav>
      {inChallenge ? null : <button className="nav-ch" onClick={onChallenge}>7-day challenge</button>}
      <button className="nav-xp" onClick={() => scrollToId("trail")} aria-label={`${g.s.xp} XP, ${L.name}`}>
        <span className="nav-xp-num">{g.s.xp} XP</span>
        <span className="nav-xp-bar"><i style={{ transform: `scaleX(${L.max ? 1 : L.into / L.need})` }} /></span>
        <span className="nav-xp-lvl">{L.name}</span>
      </button>
    </header>
  )
}

function Toasts({ g }: { g: Game }) {
  return (
    <div className="toasts" aria-live="polite">
      {g.toasts.map((t) => (
        <div key={t.id} className={"toast toast-" + t.kind}><span className="toast-dot" />{t.text}</div>
      ))}
    </div>
  )
}

/** Keeps the page background in step with whichever section owns the middle of the screen. */
function useThemeTracker() {
  useScrollY(() => {
    const mid = window.innerHeight * 0.5
    let theme = "ink"
    document.querySelectorAll<HTMLElement>("[data-theme]").forEach((s) => {
      const r = s.getBoundingClientRect()
      if (r.top <= mid && r.bottom >= mid) theme = s.dataset.theme!
    })
    if (document.body.dataset.theme !== theme) document.body.dataset.theme = theme
  })
}

// ───────────────────────────── hero (pinned)
function Hero({ onOpen }: { onOpen: (n: Item) => void }) {
  const disc = React.useRef<HTMLDivElement>(null)
  const copy = React.useRef<HTMLDivElement>(null)
  const ar = React.useRef<HTMLDivElement>(null)
  const ref = useProgress<HTMLElement>((p) => {
    const e = ease(clamp(p * 1.25))
    if (disc.current) disc.current.style.transform = `translate3d(${-e * 18}vw, ${e * 8}vh, 0) rotate(${p * 220}deg) scale(${1 + e * 0.25})`
    if (copy.current) {
      copy.current.style.transform = `translate3d(0, ${-e * 14}vh, 0)`
      copy.current.style.opacity = String(1 - clamp(p * 2.2))
    }
    if (ar.current) ar.current.style.transform = `translate3d(${-p * 30}vw, 0, 0)`
  }, "pin")
  return (
    <section className="hero" ref={ref} data-theme="ink">
      <div className="hero-pin">
        <div className="hero-ar" ref={ar} aria-hidden="true">أناشيد بلا معازف</div>
        <div className="hero-disc" ref={disc} aria-hidden="true">
          <div className="hero-disc-face" style={{ backgroundImage: `url("${img(today)}")` }} />
          <div className="hero-disc-hub" />
          <div className="hero-disc-sheen" />
        </div>
        <div className="hero-copy" ref={copy}>
          <p className="kicker"><Lines text="Bila · بلا · nasheeds without instruments" immediate step={30} /></p>
          <h1 className="hero-title">
            <Lines text="Voices," as="span" className="hero-l1" immediate delay={150} />
            <Lines text="and nothing else." as="span" className="hero-l2" immediate delay={320} />
          </h1>
          <div className="hero-meta">
            <div><span className="mono">Voices</span><b><Counter to={ARTISTS.length} /></b></div>
            <div><span className="mono">Nasheeds</span><b><Counter to={ALL.length} /></b></div>
            <div><span className="mono">Instruments</span><b>00</b></div>
          </div>
          <button className="today" onClick={() => onOpen(today)}>
            <span className="mono">Nasheed of the day</span>
            <span className="today-title"><bdi>{today.title}</bdi>{today.ar ? <> · <bdi className="ar">{today.ar}</bdi></> : null}</span>
            <span className="today-by">{artistOf(today).name} <i>→</i></span>
          </button>
        </div>
        <div className="hero-foot mono"><span>Scroll</span><span className="hero-line" /></div>
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto" data-theme="ink">
      <p className="mono sec-num">§ 01 — Why this exists</p>
      <ScrollWords text="A nasheed needs nothing but a voice and something worth saying. These are the singers who kept it that way: a Sharjah boy trained in tajwid, the imam of Kuwait's Grand Mosque, a young Saudi writing his own verses, and voices from London and beyond. No strings, no drums. Read what each title means, sit with a verse beside it, then go and listen." />
    </section>
  )
}

function Invite({ onChallenge }: { onChallenge: () => void }) {
  return (
    <section className="invite" data-theme="paper">
      <div className="invite-in">
        <p className="mono sec-num">The seven-day challenge</p>
        <h2 className="h2"><Lines text="One week. No music. See what changes." /></h2>
        <p className="sub">Choose silence, or voices only. Each day brings a verse, a small practice, and a question to answer honestly.</p>
        <button className="btn" onClick={onChallenge}>Take the challenge →</button>
      </div>
      <div className="invite-days" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => <Reveal key={i} delay={i * 80}><span className="invite-day"><b>{i + 1}</b></span></Reveal>)}
      </div>
    </section>
  )
}

// ───────────────────────────── discs
function Discs({ onOpen }: { onOpen: (n: Item) => void }) {
  const [who, setWho] = React.useState("all")
  const list = who === "all" ? ALL : byArtist(who)
  const items: DiscCascadeItem[] = React.useMemo(
    () =>
      list.map((n) => ({
        title: n.title,
        src: img(n),
        alt: n.meaning,
        labelStyle: n.title.length > 14 ? "block" : "arc",
        credits: [
          { label: "Voice", value: artistOf(n).name },
          { label: "Arabic", value: n.ar ?? "—" },
          { label: "From", value: n.album },
          { label: "Year", value: n.year ? String(n.year) : "—" },
        ],
        reviews: [
          { source: n.lang === "Arabic" ? "Title meaning" : "Sung in", quote: n.lang === "Arabic" ? n.meaning : n.lang },
          { source: "Theme", quote: n.tags.join(" · ") },
        ],
        fine: [artistOf(n).name, n.ar, n.album].filter(Boolean).join("  ·  "),
      })),
    [list],
  )
  return (
    <section className="discs" id="discs" data-theme="ink">
      <div className="sec-head">
        <p className="mono sec-num">§ 02 — The collection</p>
        <h2 className="h2"><Lines text="Every nasheed, pressed to a disc." /></h2>
        <div className="tabs" role="tablist" aria-label="Filter by voice">
          {[{ id: "all", name: "All voices" }, ...ARTISTS].map((a) => (
            <button key={a.id} role="tab" aria-selected={who === a.id} className={"tab" + (who === a.id ? " on" : "")} onClick={() => setWho(a.id)}>
              {a.name}<sup>{a.id === "all" ? ALL.length : byArtist(a.id).length}</sup>
            </button>
          ))}
        </div>
      </div>
      <DiscCascadeCarousel
        key={who}
        items={items}
        brand="BILA"
        indexLabel={`Index · ${list.length}`}
        defaultIndex={Math.min(2, list.length - 1)}
        loop={list.length > 3}
        background="radial-gradient(110% 80% at 50% 45%, #1a1712, #0d0c0a)"
        color="#ece4d3"
        serif='"Instrument Serif", "Amiri", Georgia, serif'
        sans='"Inter", ui-sans-serif, system-ui, sans-serif'
        display='"Oswald", "Reem Kufi", Impact, sans-serif'
        hint="Drag · ← → · Click the front disc"
        ariaLabel="Nasheed discs"
        frame={false}
        onSelect={(_, i) => onOpen(list[i])}
        height="min(100svh, 860px)"
      />
    </section>
  )
}

// ───────────────────────────── voices (pinned artist chapters + cursor preview)
function Preview({ src }: { src: string | null }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    let x = 0, y = 0, tx = 0, ty = 0, r = 0
    const move = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    const loop = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      if (ref.current) ref.current.style.transform = `translate3d(${x + 28}px, ${y - 90}px, 0) rotate(${(tx - x) * 0.04}deg)`
      r = requestAnimationFrame(loop)
    }
    window.addEventListener("pointermove", move)
    r = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener("pointermove", move)
      cancelAnimationFrame(r)
    }
  }, [])
  return (
    <div className={"preview" + (src ? " on" : "")} ref={ref} aria-hidden="true">
      <div className="preview-img" style={src ? { backgroundImage: `url("${src}")` } : undefined} />
    </div>
  )
}

function Chapter({ a, i, onOpen, g, setPreview }: { a: (typeof ARTISTS)[number]; i: number; onOpen: (n: Item) => void; g: Game; setPreview: (s: string | null) => void }) {
  const list = byArtist(a.id)
  const groups = a.id === "bukhatir" ? BUKHATIR_ALBUMS.map((al) => ({ head: `${al.name} · ${al.year}`, items: list.filter((n) => n.album === al.name) })) : [{ head: "", items: list }]
  const years = list.map((n) => n.year).filter(Boolean) as number[]
  const span = years.length ? (Math.min(...years) === Math.max(...years) ? `${years[0]}` : `${Math.min(...years)}–${Math.max(...years)}`) : ""
  return (
    <article className="chapter" id={"voice-" + a.id}>
      <aside className="chapter-side">
        <div className="chapter-num">{pad(i + 1)}</div>
        {a.ar ? <p className="chapter-ar" dir="rtl">{a.ar}</p> : null}
        <h3 className="chapter-name"><Lines text={a.name} immediate step={40} /></h3>
        <p className="mono chapter-where">{[a.origin, a.years].filter(Boolean).join(" — ")}</p>
        <p className="chapter-line">{a.line}</p>
        <ul className="chapter-facts">
          {a.facts.map((f, k) => <li key={k} style={{ animationDelay: 200 + k * 70 + "ms" }}>{f}</li>)}
        </ul>
      </aside>
      <div className="chapter-list">
        <p className="mono list-head"><span>{list.length} nasheeds{span ? ` · ${span}` : ""}</span><span>Year</span></p>
        <div className="list-scroll" data-native-scroll>
          {groups.map((gr, gi) => (
            <div key={gi}>
              {gr.head ? <p className="mono group-head">{gr.head}</p> : null}
              <ol className="rows">
                {gr.items.map((n, k) => (
                  <li key={n.id} style={{ animationDelay: Math.min(k, 10) * 40 + "ms" }}>
                    <button
                      className="row"
                      onClick={() => onOpen(n)}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(img(n))}
                      onPointerLeave={() => setPreview(null)}
                    >
                      <span className="row-n mono">{pad(ALL.indexOf(n) + 1)}</span>
                      <span className="row-t">{n.title}<em>{meaningOf(n) !== n.title ? meaningOf(n) : ""}</em></span>
                      <span className="row-ar" dir="rtl">{n.ar ?? ""}</span>
                      <span className="row-y mono">{g.s.listened.includes(n.id) ? "heard" : n.year ?? "—"}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}

function Voices({ onOpen, g }: { onOpen: (n: Item) => void; g: Game }) {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [who, setWho] = React.useState(0)
  const a = ARTISTS[who]
  return (
    <section className="voices" id="voices" data-theme="ink">
      <div className="sec-head">
        <p className="mono sec-num">§ 03 — The voices</p>
        <h2 className="h2"><Lines text={`${ARTISTS.length} voices. Not one instrument.`} /></h2>
        <p className="sub">Choose a voice to see their nasheeds.</p>
      </div>
      <div className="picker" role="tablist" aria-label="Choose a voice">
        {ARTISTS.map((x, i) => {
          const first = byArtist(x.id)[0]
          return (
            <button key={x.id} role="tab" aria-selected={who === i} className={"pick" + (who === i ? " on" : "")} onClick={() => { setWho(i); setPreview(null) }}>
              <span className="pick-disc" style={{ backgroundImage: `url("${img(first)}")` }}><i /></span>
              <span className="mono pick-n">{pad(i + 1)}</span>
              <span className="pick-name">{x.name}</span>
              <span className="mono pick-c">{byArtist(x.id).length} nasheeds</span>
            </button>
          )
        })}
      </div>
      <div className="chapter-wrap" key={a.id}>
        <Chapter a={a} i={who} onOpen={onOpen} g={g} setPreview={setPreview} />
      </div>
      <Preview src={preview} />
    </section>
  )
}

// ───────────────────────────── moods
function Moods({ onOpen }: { onOpen: (n: Item) => void }) {
  const [mood, setMood] = React.useState(MOODS[0].id)
  const [seed, setSeed] = React.useState(0)
  const m = MOODS.find((x) => x.id === mood)!
  const pool = ALL.filter((n) => n.tags.some((t) => m.tags.includes(t)))
  const picks = React.useMemo(() => {
    const a = [...pool]
    for (let i = a.length - 1; i > 0; i--) {
      const j = (i * 7 + seed * 13 + 3) % (i + 1)
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a.slice(0, 3)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, seed])
  return (
    <section className="moods" id="moods" data-theme="paper">
      <div className="sec-head">
        <p className="mono sec-num">§ 04 — For how you feel</p>
        <h2 className="h2"><Lines text="Tell us your heart. We'll find a voice." /></h2>
      </div>
      <div className="mood-picker" role="radiogroup" aria-label="Mood">
        {MOODS.map((x) => (
          <button key={x.id} role="radio" aria-checked={mood === x.id} className={"mood" + (mood === x.id ? " on" : "")} onClick={() => { setMood(x.id); setSeed(0) }}>
            <span className="mood-ar" dir="rtl">{x.ar}</span>
            <span>{x.label}</span>
          </button>
        ))}
      </div>
      <div className="mood-results" key={mood + seed}>
        {picks.map((n, i) => (
          <button className="mood-card" key={n.id} onClick={() => onOpen(n)} style={{ animationDelay: i * 90 + "ms" }}>
            <ClipImage src={img(n)} className="mood-img" />
            <span className="mono mood-by">{artistOf(n).name}</span>
            <span className="mood-title">{n.title}</span>
            <span className="mood-mean">{meaningOf(n)}</span>
          </button>
        ))}
      </div>
      {pool.length > 3 ? <button className="link-btn" onClick={() => setSeed((s) => s + 1)}>Show me three others ({pool.length} match) →</button> : null}
    </section>
  )
}

// ───────────────────────────── stories
function Stories() {
  const STEP = 5
  const [shown, setShown] = React.useState(STEP)
  const [open, setOpen] = React.useState<string | null>(null)
  const [theme, setTheme] = React.useState<string>("All")
  const themes = ["All", ...Array.from(new Set(STORIES.map((x) => x.theme)))]
  const list = STORIES.filter((x) => theme === "All" || x.theme === theme)
  const visible = list.slice(0, shown)
  return (
    <section className="stories" id="stories" data-theme="ink">
      <div className="sec-head">
        <p className="mono sec-num">§ 05 — Stories</p>
        <h2 className="h2"><Lines text="From the lives that came before us." /></h2>
        <p className="sub">Short moments from the life of the Prophet ﷺ and his Companions, each with its source. Read one. Sit with it.</p>
        <div className="tabs" role="tablist" aria-label="Theme">
          {themes.map((t) => (
            <button key={t} role="tab" aria-selected={theme === t} className={"tab" + (theme === t ? " on" : "")} onClick={() => { setTheme(t); setShown(STEP); setOpen(null) }}>
              {t}<sup>{t === "All" ? STORIES.length : STORIES.filter((x) => x.theme === t).length}</sup>
            </button>
          ))}
        </div>
      </div>
      <ol className="story-grid">
        {visible.map((st, i) => {
          const isOpen = open === st.id
          return (
            <li key={st.id} className={"story" + (isOpen ? " open" : "")} style={{ animationDelay: (i % STEP) * 60 + "ms" }}>
              <button className="story-head" onClick={() => setOpen(isOpen ? null : st.id)} aria-expanded={isOpen}>
                <span className="mono story-n">{pad(STORIES.indexOf(st) + 1)} · {st.theme}</span>
                <span className="story-title">{st.title}</span>
                <span className="mono story-who">{st.who}</span>
                {st.ar ? <span className="story-ar" dir="rtl" lang="ar">{st.ar}</span> : null}
                <span className="story-more mono">{isOpen ? "Close" : "Read"}</span>
              </button>
              <div className="story-body">
                <div className="story-inner">
                  {st.arEn ? <p className="story-aren">“{st.arEn}”</p> : null}
                  <p className="story-text">{st.body}</p>
                  <p className="story-sit"><span className="mono">Sit with this</span>{st.sit}</p>
                  <p className="mono story-src">{st.source}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      {shown < list.length ? (
        <button className="more" onClick={() => setShown((n) => n + STEP)}>
          <span className="more-ar" dir="rtl">رَبِّ زِدْنِي عِلْمًا</span>
          <span className="more-en">Draw more from the well</span>
          <span className="mono">{list.length - shown} more stories</span>
        </button>
      ) : (
        <p className="more-end"><span dir="rtl">وَاللَّهُ أَعْلَمُ</span> · And Allah knows best.</p>
      )}
    </section>
  )
}

// ───────────────────────────── words (XP)
function Words({ g }: { g: Game }) {
  const [open, setOpen] = React.useState<string[]>([])
  return (
    <section className="words-sec" id="words" data-theme="paper">
      <div className="sec-head">
        <p className="mono sec-num">§ 06 — Words in the titles</p>
        <h2 className="h2"><Lines text="Learn the words. Earn your way." /></h2>
        <p className="sub">Each new word is worth {XP_WORD} XP. {g.s.words.length} of {WORDS.length} learned.</p>
      </div>
      <div className="words">
        {WORDS.map((w, i) => {
          const on = open.includes(w.ar)
          const learned = g.s.words.includes(w.ar)
          return (
            <Reveal key={w.ar} delay={(i % 4) * 60}>
              <button className={"word" + (on ? " on" : "") + (learned ? " learned" : "")} onClick={() => {
                setOpen((o) => (on ? o.filter((x) => x !== w.ar) : [...o, w.ar]))
                g.learnWord(w.ar)
              }} aria-label={on ? `${w.tr}: ${w.en}` : `Word ${i + 1}: reveal`}>
                <span className="word-in">
                  <span className="word-f"><span dir="rtl">{w.ar}</span><i className="mono">{learned ? "learned" : `+${XP_WORD} XP`}</i></span>
                  <span className="word-b"><b>{w.tr}</b><span>{w.en}</span></span>
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

// ───────────────────────────── trail
function Trail({ g, onOpen }: { g: Game; onOpen: (n: Item) => void }) {
  const L = levelOf(g.s.xp)
  const heard = ALL.filter((n) => g.s.listened.includes(n.id))
  return (
    <section className="trail" id="trail" data-theme="ink">
      <div className="sec-head">
        <p className="mono sec-num">§ 07 — Your trail</p>
        <h2 className="h2"><Lines text="Where you have listened." /></h2>
        <p className="sub">XP comes from two things only: listening on YouTube (+{XP_LISTEN} the first time for each nasheed) and learning words (+{XP_WORD}).</p>
      </div>
      <div className="trail-grid">
        <div className="trail-level">
          <span className="mono">Level {L.i + 1}</span>
          <b>{L.name}</b>
          <span className="trail-xp">{g.s.xp} XP{L.max ? "" : ` · ${L.need - L.into} to the next`}</span>
          <span className="trail-bar"><i style={{ transform: `scaleX(${L.max ? 1 : L.into / L.need})` }} /></span>
        </div>
        <ul className="badges">
          {BADGES.map((b) => {
            const got = g.s.badges.includes(b.id)
            return (
              <li key={b.id} className={got ? "got" : ""}>
                <span className="badge-ar" dir="rtl">{b.ar}</span>
                <span className="badge-name">{b.name}</span>
                <span className="badge-desc">{b.desc}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="heard">
        <p className="mono group-head">Listened · {heard.length} of {ALL.length}</p>
        {heard.length ? (
          <ol className="rows">
            {heard.map((n) => (
              <li key={n.id}>
                <button className="row" onClick={() => onOpen(n)}>
                  <span className="row-n mono">{pad(ALL.indexOf(n) + 1)}</span>
                  <span className="row-t">{n.title}<em>{artistOf(n).name}</em></span>
                  <span className="row-ar" dir="rtl">{n.ar ?? ""}</span>
                  <span className="row-y mono">heard</span>
                </button>
              </li>
            ))}
          </ol>
        ) : <p className="empty">Nothing yet. Open any nasheed and press “Listen on YouTube”.</p>}
      </div>
      <button className="reset mono" onClick={g.reset}>Reset progress</button>
    </section>
  )
}

// ───────────────────────────── modal
function Modal({ n, g, onClose, onStep }: { n: Item | null; g: Game; onClose: () => void; onStep: (d: number) => void }) {
  React.useEffect(() => {
    if (!n) return
    lockScroll(true)
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onStep(1)
      if (e.key === "ArrowLeft") onStep(-1)
    }
    window.addEventListener("keydown", k)
    return () => {
      window.removeEventListener("keydown", k)
      lockScroll(false)
    }
  }, [n, onClose, onStep])
  if (!n) return null
  const a = artistOf(n)
  const heard = g.s.listened.includes(n.id)
  const kept = g.s.reflected.includes(n.id)
  return (
    <div className="modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={n.title}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} key={n.id} data-native-scroll>
        <button className="sheet-x mono" onClick={onClose}>Close ✕</button>
        <div className="sheet-art">
          <div className="sheet-img" style={{ backgroundImage: `url("${img(n)}")` }} />
          <div className="sheet-disc" style={{ backgroundImage: `url("${img(n)}")` }}><i /></div>
        </div>
        <div className="sheet-body">
          <p className="mono sheet-meta">{pad(ALL.indexOf(n) + 1)} — {a.name} — {n.album}{n.year ? ` — ${n.year}` : ""}</p>
          {n.ar ? <p className="sheet-ar" dir="rtl">{n.ar}</p> : null}
          <h3 className="sheet-title">{n.title}</h3>
          <p className="sheet-mean">{n.lang === "Arabic" ? (n.meaning !== n.title ? `“${n.meaning}”` : "") : `Sung in ${n.lang}`}</p>
          <div className="sheet-block">
            <p className="mono label">About <span className={"tag" + (n.known ? " known" : "")}>{n.known ? "Documented" : "From the title"}</span></p>
            <p>{n.theme}</p>
          </div>
          <div className="sheet-verse">
            <p className="mono label">Sit with this</p>
            <p className="verse-ar" dir="rtl" lang="ar">{n.verse.ar}</p>
            <p className="verse-en">{n.verse.en}</p>
            <p className="mono verse-ref">{n.verse.ref}</p>
          </div>
          <div className="sheet-actions">
            <a className={"btn btn-listen" + (heard ? " done" : "")} href={yt(n)} target="_blank" rel="noreferrer" onClick={() => g.listen(n.id)}>
              {heard ? "Listen again on YouTube ↗" : <>Listen on YouTube ↗ <span className="xp">+{XP_LISTEN} XP</span></>}
            </a>
            <button className={"link-btn" + (kept ? " on" : "")} onClick={() => g.toggleReflect(n.id)}>{kept ? "✓ Kept for reflection" : "Keep for reflection"}</button>
          </div>
          <div className="sheet-nav mono">
            <button onClick={() => onStep(-1)}>← Prev</button>
            <span>{pad(ALL.indexOf(n) + 1)} / {ALL.length}</span>
            <button onClick={() => onStep(1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer" data-theme="ink">
      <Parallax speed={0.2}><p className="footer-ar" dir="rtl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</p></Parallax>
      <div className="footer-cols">
        <div>
          <p className="mono label">About the content</p>
          <p>Lyrics are the artists' copyrighted work, so this site does not reproduce them. Each nasheed has its title, what the title means, a short theme, and a Qur'an verse or hadith on the same theme. Themes marked <i>Documented</i> come from published descriptions; the rest are drawn from the title. Verse translations are renderings of meaning.</p>
        </div>
        <div>
          <p className="mono label">Instrument-free</p>
          <p>The page itself plays no audio. Every artist here is documented as singing with voice only, or the tracks listed are documented vocals-only versions. Listening happens on YouTube.</p>
        </div>
        <div>
          <p className="mono label">Sources</p>
          <p>
            <a href="https://en.wikipedia.org/wiki/Ahmed_Bukhatir" target="_blank" rel="noreferrer">Ahmed Bukhatir</a>, <a href="https://en.wikipedia.org/wiki/Mishari_bin_Rashid_Alafasy" target="_blank" rel="noreferrer">Mishary Alafasy</a> and <a href="https://en.wikipedia.org/wiki/Meshary_Al-Arada" target="_blank" rel="noreferrer">Mishary Al-Arada</a> on Wikipedia; <a href="https://www.thenationalnews.com/arts-culture/music/2026/02/16/nasheed-songs-ramadan/" target="_blank" rel="noreferrer">The National</a> on nasheeds; <a href="https://www.deezer.com/artist/10466017" target="_blank" rel="noreferrer">al-Muqit's discography</a>.
          </p>
        </div>
      </div>
      <p className="mono footer-small">A fan-made tribute. Not affiliated with any of the artists.</p>
    </footer>
  )
}

const readView = () => (typeof location !== "undefined" && location.hash === "#challenge" ? "challenge" : "atlas")

export default function App() {
  const g = useGame()
  const [cur, setCur] = React.useState<Item | null>(null)
  const [view, setView] = React.useState<"atlas" | "challenge">(readView)
  React.useEffect(() => initScroll(), [])
  React.useEffect(() => {
    const on = () => {
      setView(readView())
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  const goChallenge = React.useCallback(() => {
    location.hash = "challenge"
  }, [])
  const goAtlas = React.useCallback(() => {
    history.replaceState(null, "", location.pathname + location.search)
    setView("atlas")
    window.scrollTo(0, 0)
  }, [])
  useThemeTracker()
  const close = React.useCallback(() => setCur(null), [])
  const step = React.useCallback((d: number) => setCur((c) => (c ? ALL[(ALL.indexOf(c) + d + ALL.length) % ALL.length] : c)), [])
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav g={g} onChallenge={goChallenge} inChallenge={view === "challenge"} />
      {view === "challenge" ? <Challenge onBack={goAtlas} /> : <>
      <main>
        <Hero onOpen={setCur} />
        <Manifesto />
        <Invite onChallenge={goChallenge} />
        <Discs onOpen={setCur} />
        <Voices onOpen={setCur} g={g} />
        <Moods onOpen={setCur} />
        <Stories />
        <Words g={g} />
        <Trail g={g} onOpen={setCur} />
      </main>
      <Footer />
      </>}
      <Modal n={cur} g={g} onClose={close} onStep={step} />
      <Toasts g={g} />
    </>
  )
}
