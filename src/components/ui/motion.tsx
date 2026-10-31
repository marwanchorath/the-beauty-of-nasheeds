"use client"
// Scroll and motion primitives. One inertial scroll engine drives everything,
// so parallax, pinned sections and reveals all move on the same eased clock.
import * as React from "react"

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const ease = (t: number) => 1 - Math.pow(1 - t, 3)

// ───────────────── scroll engine (inertial wheel, native everywhere else)
type Sub = (y: number) => void
const subs = new Set<Sub>()
let current = 0, target = 0, raf = 0, started = false, locked = false

function tick() {
  const d = target - current
  current = Math.abs(d) < 0.4 ? target : current + d * 0.085
  window.scrollTo(0, current)
  if (current !== target) raf = requestAnimationFrame(tick)
  else raf = 0
}
function emit() {
  const y = window.scrollY
  subs.forEach((f) => f(y))
}
export function lockScroll(v: boolean) {
  locked = v
  document.documentElement.style.overflow = v ? "hidden" : ""
}
export function initScroll() {
  if (started) return
  started = true
  current = target = window.scrollY
  let pending = false
  window.addEventListener("scroll", () => {
    // A scroll we did not cause (keyboard, scrollbar, touch, a jump): hand control back.
    if (Math.abs(window.scrollY - current) > 3) {
      cancelAnimationFrame(raf)
      raf = 0
      current = target = window.scrollY
    }
    if (!pending) {
      pending = true
      requestAnimationFrame(() => {
        pending = false
        emit()
      })
    }
  }, { passive: true })
  window.addEventListener("resize", emit)
  if (reduced() || matchMedia("(pointer: coarse)").matches) return
  window.addEventListener("wheel", (e) => {
    if (locked || e.ctrlKey) return
    const el = e.target as Element
    if (el.closest?.("[data-native-scroll]")) return
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
    e.preventDefault()
    const max = document.documentElement.scrollHeight - window.innerHeight
    const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY
    target = clamp(target + dy, 0, max)
    if (!raf) raf = requestAnimationFrame(tick)
  }, { passive: false })
}
export function scrollToY(y: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  target = clamp(y, 0, max)
  if (reduced()) return window.scrollTo(0, target)
  if (!raf) raf = requestAnimationFrame(tick)
}
export function scrollToId(id: string, offset = 0) {
  const el = document.getElementById(id)
  if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - offset)
}

export function useScrollY(fn: Sub) {
  const ref = React.useRef(fn)
  ref.current = fn
  React.useEffect(() => {
    const f: Sub = (y) => ref.current(y)
    subs.add(f)
    f(window.scrollY)
    return () => void subs.delete(f)
  }, [])
}

/** 0 when the element's top meets the viewport bottom, 1 when its bottom leaves the top. */
export function useProgress<T extends HTMLElement>(fn: (p: number, el: T) => void, mode: "pass" | "pin" = "pass") {
  const ref = React.useRef<T | null>(null)
  useScrollY(() => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const p = mode === "pin" ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height)
    fn(clamp(p), el)
  })
  return ref
}

export function useInView<T extends Element>(margin = "0px 0px -10% 0px") {
  const ref = React.useRef<T | null>(null)
  const [on, set] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (set(true), io.disconnect()), { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, on] as const
}

// ───────────────── text
/** Each word rises from behind a mask, one after another. */
export function Lines({ text, as: Tag = "span", className = "", delay = 0, step = 45, immediate = false }: { text: string; as?: any; className?: string; delay?: number; step?: number; immediate?: boolean }) {
  const [ref, seen] = useInView<HTMLElement>()
  const [boot, setBoot] = React.useState(false)
  React.useEffect(() => {
    if (!immediate) return
    const t = window.setTimeout(() => setBoot(true), 60)
    return () => window.clearTimeout(t)
  }, [immediate])
  const on = immediate ? boot : seen
  return (
    <Tag ref={ref} className={"m-lines " + (on ? "is-on " : "") + className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <React.Fragment key={i}>{i ? " " : null}<span className="m-mask" aria-hidden="true">
          <span className="m-word" style={{ transitionDelay: delay + i * step + "ms" }}>{w}</span>
        </span></React.Fragment>
      ))}
    </Tag>
  )
}

/** A paragraph whose words light up as it scrolls through the middle of the screen. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ")
  const spans = React.useRef<(HTMLSpanElement | null)[]>([])
  const ref = useProgress<HTMLParagraphElement>((p) => {
    const t = clamp((p - 0.18) / 0.5) * words.length
    spans.current.forEach((s, i) => s && (s.style.opacity = String(0.14 + 0.86 * clamp(t - i))))
  })
  return (
    <p ref={ref} className={"m-scrollwords " + className}>
      {words.map((w, i) => (
        <span key={i} ref={(el) => void (spans.current[i] = el)}>{w} </span>
      ))}
    </p>
  )
}

export function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: any }) {
  const [ref, on] = useInView<HTMLElement>()
  return (
    <Tag ref={ref} className={"m-reveal " + (on ? "is-on " : "") + className} style={{ transitionDelay: delay + "ms" }}>
      {children}
    </Tag>
  )
}

/** An image that opens from the bottom edge while settling from a slight zoom. */
export function ClipImage({ src, className = "", alt = "" }: { src: string; className?: string; alt?: string }) {
  const [ref, on] = useInView<HTMLDivElement>("0px 0px -15% 0px")
  return (
    <div ref={ref} className={"m-clip " + (on ? "is-on " : "") + className} role={alt ? "img" : undefined} aria-label={alt || undefined}>
      <div className="m-clip-img" style={{ backgroundImage: `url("${src}")` }} />
    </div>
  )
}

/** Moves its child against the scroll. speed 0.1 is subtle, 0.4 is strong. */
export function Parallax({ children, speed = 0.15, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useProgress<HTMLDivElement>((p, el) => {
    if (reduced()) return
    el.style.transform = `translate3d(0, ${((0.5 - p) * speed * 400).toFixed(1)}px, 0)`
  })
  return <div ref={ref} className={className} style={{ willChange: "transform" }}>{children}</div>
}

export function Counter({ to, duration = 1600 }: { to: number; duration?: number }) {
  const [ref, on] = useInView<HTMLSpanElement>()
  const [v, set] = React.useState(0)
  React.useEffect(() => {
    if (!on) return
    if (reduced()) return set(to)
    const t0 = performance.now()
    let r = 0
    const f = (t: number) => {
      const p = clamp((t - t0) / duration)
      set(Math.round(to * ease(p)))
      if (p < 1) r = requestAnimationFrame(f)
    }
    r = requestAnimationFrame(f)
    return () => cancelAnimationFrame(r)
  }, [on, to, duration])
  return <span ref={ref}>{String(v).padStart(String(to).length, "0")}</span>
}
