"use client"

import { useEffect, type RefObject } from "react"

const pad = (n: number) => String(n).padStart(2, "0")

/**
 * Replica los efectos del diseño original sobre el árbol DOM del landing:
 * timecode 24fps, glow que sigue al cursor, tilt del showreel, barra de
 * progreso de scroll, fondo del nav al hacer scroll y contadores animados.
 * Opera por data-attributes para mantener las secciones declarativas.
 */
export function useLandingFx(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    // ── Timecode 24fps ───────────────────────────────────────────────
    const start = performance.now()
    const tcEls = root.querySelectorAll<HTMLElement>("[data-tc]")
    const tcId = window.setInterval(() => {
      const frames = Math.floor((performance.now() - start) / (1000 / 24))
      const f = frames % 24
      const s = Math.floor(frames / 24) % 60
      const m = Math.floor(frames / (24 * 60)) % 60
      const h = Math.floor(frames / (24 * 3600)) % 24
      const txt = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`
      tcEls.forEach((el) => (el.textContent = txt))
    }, 1000 / 24)

    // ── Glow del hero centrado al inicio ─────────────────────────────
    const glow = root.querySelector<HTMLElement>("[data-glow]")
    const hero = root.querySelector<HTMLElement>("[data-hero]")
    if (glow && hero) {
      const r = hero.getBoundingClientRect()
      glow.style.transform = `translate(${r.width / 2}px,${r.height * 0.42}px) translate(-50%,-50%)`
    }

    // ── Glow sigue al cursor + tilt del showreel ─────────────────────
    const onMove = (e: PointerEvent) => {
      if (hero && glow) {
        const rect = hero.getBoundingClientRect()
        if (e.clientY < rect.bottom + 200) {
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          glow.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`
        }
      }
      const tilt = root.querySelector<HTMLElement>("[data-tilt]")
      if (tilt) {
        const tr = tilt.getBoundingClientRect()
        if (tr.bottom > 0 && tr.top < window.innerHeight) {
          const dx = (e.clientX - (tr.left + tr.width / 2)) / tr.width
          const dy = (e.clientY - (tr.top + tr.height / 2)) / tr.height
          const rx = Math.max(-1, Math.min(1, dy)) * -4
          const ry = Math.max(-1, Math.min(1, dx)) * 5
          tilt.style.transform = `perspective(1300px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
        }
      }
    }

    // ── Barra de progreso + fondo del nav ────────────────────────────
    const bar = root.querySelector<HTMLElement>("[data-progress]")
    const nav = root.querySelector<HTMLElement>("[data-nav]")
    const onScroll = () => {
      const rect = root.getBoundingClientRect()
      const y = Math.max(0, -rect.top)
      const max = root.offsetHeight - window.innerHeight || 1
      const p = Math.max(0, Math.min(1, y / max))
      if (bar) bar.style.transform = `scaleX(${p})`
      if (nav) {
        const active = y > 36
        nav.style.background = active ? "rgba(10,7,18,.7)" : "transparent"
        nav.style.borderBottomColor = active ? "rgba(255,255,255,.08)" : "transparent"
        nav.style.backdropFilter = active ? "blur(18px) saturate(1.4)" : "none"
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true, capture: true })
    onScroll()

    // ── Contadores animados ──────────────────────────────────────────
    let io: IntersectionObserver | undefined
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const el = entry.target as HTMLElement
            io?.unobserve(el)
            const target = parseFloat(el.getAttribute("data-count") || "0") || 0
            const prefix = el.getAttribute("data-prefix") || ""
            const t0 = performance.now()
            const tick = (now: number) => {
              const k = Math.min(1, (now - t0) / 1300)
              const eased = 1 - Math.pow(1 - k, 3)
              el.textContent = prefix + Math.round(target * eased)
              if (k < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          })
        },
        { threshold: 0.6 },
      )
      root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => io?.observe(el))
    }

    return () => {
      window.clearInterval(tcId)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll, { capture: true })
      io?.disconnect()
    }
  }, [rootRef])
}
