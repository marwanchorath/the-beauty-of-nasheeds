"use client"
import * as React from "react"
import { Lines, Reveal } from "@/components/ui/motion"

// The seven-day challenge: one week of either silence (Qur'an and dhikr only)
// or voices only (instrument-free nasheeds). Progress lives in this browser.

type Path = "silence" | "voices"
type DayState = "kept" | "slipped"
type CState = { path: Path | null; start: number | null; days: Record<number, DayState>; notes: Record<number, string> }
const KEY = "nasheed-atlas-challenge-v1"
const EMPTY: CState = { path: null, start: null, days: {}, notes: {} }
const load = (): CState => {
  try {
    const r = localStorage.getItem(KEY)
    return r ? { ...EMPTY, ...JSON.parse(r) } : EMPTY
  } catch {
    return EMPTY
  }
}
const save = (s: CState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

const DAYS: { title: string; ar: string; text: { ar: string; en: string; ref: string }; why: string; do: Record<Path, string>; ask: string }[] = [
  { title: "Intention", ar: "النية", text: { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", en: "Actions are only by intentions.", ref: "Hadith · Bukhari & Muslim" },
    why: "Before you give anything up, decide who you are doing it for. Seven days done for Allah weigh more than seventy done to prove a point.",
    do: { silence: "Move every music app off your home screen. Say your intention once, quietly, in your own words.", voices: "Move every music app off your home screen. Save three nasheeds from Bila to replace your usual first song of the day." },
    ask: "Why does this matter to you, honestly?" },
  { title: "Your ears are a trust", ar: "السمع أمانة", text: { ar: "إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا", en: "Hearing, sight and the heart: each of these will be asked about.", ref: "Al-Isra 17:36" },
    why: "What goes in through the ears settles somewhere. Today, notice what you hear without choosing to: shops, ads, other people's phones.",
    do: { silence: "Make one journey in complete silence. No earphones. Just you and your thoughts.", voices: "Make one journey with only a nasheed, or nothing at all. Notice which you reach for." },
    ask: "What did you hear today that you didn't choose?" },
  { title: "Fill the gap", ar: "الذكر", text: { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Truly, in the remembrance of Allah hearts find rest.", ref: "Ar-Ra'd 13:28" },
    why: "The hardest part isn't the silence. It's the urge to fill it. Give that urge somewhere better to go.",
    do: { silence: "Each time you reach for music, say SubhanAllah, Alhamdulillah, Allahu Akbar instead. Count how many times it happens.", voices: "Each time you reach for music, play a nasheed or say a short dhikr instead. Count how many times it happens." },
    ask: "How many times did you reach for music? When did it happen most?" },
  { title: "Listen to the best voice", ar: "الإنصات", text: { ar: "وَإِذَا قُرِئَ الْقُرْآنُ فَاسْتَمِعُوا لَهُ وَأَنصِتُوا لَعَلَّكُمْ تُرْحَمُونَ", en: "When the Qur'an is recited, listen to it and be silent, so that you may receive mercy.", ref: "Al-A'raf 7:204" },
    why: "Every voice on Bila learned from this one. Give the Qur'an the place music used to have, even for ten minutes.",
    do: { silence: "Listen to one short surah, recited, with its meaning open beside you. Mishary Alafasy's recitation is a good start.", voices: "Listen to one short surah, recited, with its meaning open beside you. Then listen to one nasheed. Notice the difference." },
    ask: "Which verse stayed with you?" },
  { title: "Leaving something for Allah", ar: "من ترك شيئًا لله", text: { ar: "إِنَّكَ لَنْ تَدَعَ شَيْئًا لِلَّهِ إِلَّا بَدَّلَكَ اللَّهُ بِهِ مَا هُوَ خَيْرٌ لَكَ مِنْهُ", en: "You will never leave something for Allah's sake except that Allah will replace it with something better.", ref: "Hadith · Musnad Ahmad" },
    why: "Halfway. This is usually the day it feels hardest, and the day it starts to feel different.",
    do: { silence: "Clear one playlist you know you'd go back to. Not forever, just to make the door a little heavier.", voices: "Build a short nasheed playlist for the moments you used to need music: the gym, the drive, the evening." },
    ask: "What has come into the space music left?" },
  { title: "Small and steady", ar: "أدومها", text: { ar: "أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", en: "The deeds most beloved to Allah are the most constant, even if small.", ref: "Hadith · Bukhari & Muslim" },
    why: "You don't need a dramatic change. You need something small you can keep.",
    do: { silence: "Pick one daily moment that stays silent or Qur'an-only after this week. Name it.", voices: "Pick one daily moment that stays music-free after this week. Name it." },
    ask: "What is your one small thing to keep?" },
  { title: "The road opens", ar: "لنهدينهم سبلنا", text: { ar: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", en: "Those who strive for Us, We will surely guide them to Our ways.", ref: "Al-Ankabut 29:69" },
    why: "Seven days of striving, however imperfect. Whatever happened this week, the effort was seen.",
    do: { silence: "Read back everything you wrote this week. Then make du'a for the habit to stay.", voices: "Read back everything you wrote this week. Then make du'a for the habit to stay." },
    ask: "What would you tell yourself from seven days ago?" },
]

const DAY_MS = 86400000
const dayIndexNow = (start: number) => Math.floor((Date.now() - start) / DAY_MS) // 0-based, can exceed 6

function Ring({ s }: { s: CState }) {
  const r = 54, c = 2 * Math.PI * r, seg = c / 7
  return (
    <svg className="ring" viewBox="0 0 140 140" aria-hidden="true">
      {DAYS.map((_, i) => {
        const st = s.days[i]
        return <circle key={i} cx="70" cy="70" r={r} fill="none" strokeWidth={st ? 6 : 2} className={"ring-seg " + (st ?? "")}
          strokeDasharray={`${seg - 6} ${c - seg + 6}`} strokeDashoffset={-i * seg} transform="rotate(-90 70 70)" />
      })}
    </svg>
  )
}

export default function Challenge({ onBack }: { onBack: () => void }) {
  const [s, setS] = React.useState<CState>(load)
  const [open, setOpen] = React.useState<number | null>(null)
  const [copied, setCopied] = React.useState(false)
  const set = (f: (p: CState) => CState) => setS((p) => {
    const n = f(p)
    save(n)
    return n
  })
  const started = s.path && s.start
  const today = started ? dayIndexNow(s.start!) : -1
  const kept = Object.values(s.days).filter((d) => d === "kept").length
  const done = Object.keys(s.days).length
  React.useEffect(() => {
    if (started) setOpen(Math.min(today, 6))
  }, [started, today])

  const share = async () => {
    const text = done >= 7
      ? `I finished seven days of ${s.path === "silence" ? "silence" : "voices only"}: no music, ${kept} of 7 days kept. Try it with me.`
      : `Day ${Math.min(today, 6) + 1} of 7: a week without music${s.path === "voices" ? ", voices only" : ""}. Join me on Bila.`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="ch" data-theme="paper">
      <header className="ch-top">
        <button className="link-btn" onClick={onBack}>← Back to Bila</button>
        <span className="mono">The seven-day challenge</span>
      </header>

      <section className="ch-hero">
        <p className="mono sec-num">Seven days · one intention</p>
        <h1 className="ch-title">
          <Lines text="Give your ears" as="span" immediate />
          <Lines text="back to Allah." as="span" className="ch-title-2" immediate delay={200} />
        </h1>
        <Reveal delay={350}>
          <p className="ch-lead">
            For one week, no music. Either nothing at all, or only voices. It sounds small until you try it, and notice how often your hand reaches for it.
            Most people find the quiet uncomfortable for a few days, and then they find something in it. Seven days won't make you a different person.
            But what you feed your heart shapes it, and this week you choose what goes in.
          </p>
        </Reveal>
      </section>

      {!started ? (
        <section className="ch-choose">
          <p className="mono sec-num">Choose your path</p>
          <div className="paths">
            {([
              ["silence", "Silence", "صمت", "Nothing but Qur'an and dhikr. The harder road, and the quieter one.", "Hardest"],
              ["voices", "Voices only", "صوت", "Instrument-free nasheeds allowed, from Bila or elsewhere. Nothing with instruments.", "A gentler start"],
            ] as const).map(([id, name, ar, d, tag]) => (
              <button key={id} className={"path" + (s.path === id ? " on" : "")} onClick={() => set((p) => ({ ...p, path: id }))}>
                <span className="path-ar" dir="rtl">{ar}</span>
                <span className="path-name">{name}</span>
                <span className="path-d">{d}</span>
                <span className="mono path-tag">{tag}</span>
              </button>
            ))}
          </div>
          <div className={"pledge" + (s.path ? " on" : "")}>
            <p className="pledge-ar" dir="rtl">اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ</p>
            <p className="pledge-en">O Allah, help me to remember You, to thank You, and to worship You well.</p>
            <button className="btn" disabled={!s.path} onClick={() => set((p) => ({ ...p, start: new Date().setHours(0, 0, 0, 0), days: {}, notes: {} }))}>
              Begin today, bismillah →
            </button>
            <p className="mono pledge-note">Your progress stays private, in this browser only.</p>
          </div>
        </section>
      ) : (
        <section className="ch-run">
          <div className="ch-status">
            <div className="ring-wrap">
              <Ring s={s} />
              <div className="ring-txt">
                <b>{done >= 7 ? "7" : Math.min(today, 6) + 1}</b>
                <span className="mono">{done >= 7 ? "complete" : "of 7"}</span>
              </div>
            </div>
            <div>
              <p className="mono sec-num">{s.path === "silence" ? "Path: Silence" : "Path: Voices only"}</p>
              <p className="ch-status-line">
                {done >= 7
                  ? `You finished. ${kept} of 7 days kept. Alhamdulillah.`
                  : today > 6
                    ? "Your week has passed. Mark any days you missed, then finish."
                    : `Day ${today + 1}: ${DAYS[today].title}.`}
              </p>
              <div className="ch-actions">
                <button className="btn" onClick={share}>{copied ? "Copied ✓" : "Copy a message to invite a friend"}</button>
                <button className="link-btn" onClick={() => set(() => ({ ...EMPTY }))}>Start over</button>
              </div>
            </div>
          </div>

          <ol className="days">
            {DAYS.map((d, i) => {
              const locked = i > today
              const st = s.days[i]
              const isOpen = open === i && !locked
              return (
                <li key={i} className={"day" + (locked ? " locked" : "") + (st ? " " + st : "") + (isOpen ? " open" : "")}>
                  <button className="day-head" disabled={locked} onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                    <span className="mono day-n">Day {i + 1}</span>
                    <span className="day-title">{d.title}</span>
                    <span className="day-ar" dir="rtl">{d.ar}</span>
                    <span className="mono day-st">{locked ? "Opens " + (i - today === 1 ? "tomorrow" : `in ${i - today} days`) : st === "kept" ? "Kept ✓" : st === "slipped" ? "Slipped" : i === today ? "Today" : "Not marked"}</span>
                  </button>
                  <div className="day-body">
                    <div className="day-inner">
                      <div className="day-text">
                        <p className="day-ar-text" dir="rtl" lang="ar">{d.text.ar}</p>
                        <p className="day-en">{d.text.en}</p>
                        <p className="mono day-ref">{d.text.ref}</p>
                      </div>
                      <div className="day-do">
                        <p>{d.why}</p>
                        <p className="mono label">Today's practice</p>
                        <p className="day-practice">{d.do[s.path!]}</p>
                        <p className="mono label">Write it down</p>
                        <textarea
                          placeholder={d.ask}
                          value={s.notes[i] ?? ""}
                          onChange={(e) => set((p) => ({ ...p, notes: { ...p.notes, [i]: e.target.value } }))}
                          rows={3}
                        />
                        <div className="day-mark">
                          <button className={"mark" + (st === "kept" ? " on" : "")} onClick={() => set((p) => ({ ...p, days: { ...p.days, [i]: "kept" } }))}>I kept it today</button>
                          <button className={"mark" + (st === "slipped" ? " on slipped" : "")} onClick={() => set((p) => ({ ...p, days: { ...p.days, [i]: "slipped" } }))}>I slipped</button>
                        </div>
                        {st === "slipped" ? <p className="day-slip">That's alright. A slip doesn't end the week. Seek forgiveness, and carry on tomorrow.</p> : null}
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      )}
    </div>
  )
}
