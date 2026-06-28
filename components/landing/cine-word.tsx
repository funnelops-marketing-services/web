"use client"

import { useRef, useState } from "react"

// Banda de brillo definida (transición corta = reflejo nítido), diagonal a 70°
// para que se incline hacia la izquierda, igual que el barrido del video.
const BAND = "#cdc6e2 0%, #cdc6e2 44%, #ffffff 48.5%, #ffffff 51.5%, #cdc6e2 56%, #cdc6e2 100%"

/**
 * Palabra "cine" con brillo: por defecto hace un barrido automático; al pasar
 * el mouse, el reflejo blanco diagonal sigue al cursor.
 */
export function CineWord() {
  const ref = useRef<HTMLSpanElement>(null)
  const [hover, setHover] = useState(false)

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const frac = (e.clientX - rect.left) / rect.width
    // background-position invertido: cursor a la izquierda → banda a la izquierda.
    el.style.setProperty("--mx", `${(1 - frac) * 100}%`)
  }

  return (
    <span
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      className="bg-clip-text text-transparent"
      style={{
        backgroundImage: `linear-gradient(70deg, ${BAND})`,
        backgroundSize: hover ? "300% 100%" : "250% 100%",
        backgroundPosition: hover ? "var(--mx,50%) 0" : undefined,
        animation: hover ? "none" : "cineShine 6.5s ease-in-out infinite",
      }}
    >
      cine
    </span>
  )
}
