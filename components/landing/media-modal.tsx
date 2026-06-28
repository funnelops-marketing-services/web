"use client"

import { useEffect } from "react"

/**
 * Popup central para ver una pieza en grande. Se cierra al hacer click fuera,
 * al scrollear o con Escape.
 */
export function MediaModal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("wheel", onClose, { passive: true })
    window.addEventListener("touchmove", onClose, { passive: true })
    window.addEventListener("scroll", onClose, { passive: true, capture: true })
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("wheel", onClose)
      window.removeEventListener("touchmove", onClose)
      window.removeEventListener("scroll", onClose, { capture: true })
    }
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      style={{ animation: "revealUp .25s ease both" }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-5 top-5 text-[32px] leading-none text-white/80 transition-colors hover:text-white"
      >
        ×
      </button>
      <div onClick={(e) => e.stopPropagation()} className="relative flex max-h-[88vh] max-w-[92vw] items-center justify-center">
        {children}
      </div>
    </div>
  )
}
