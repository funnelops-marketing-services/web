"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

const NAV_ITEMS = [
  { href: "#curso", label: "Curso" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 bg-black/40 backdrop-blur z-30 border-b border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="text-white font-bold text-sm tracking-[0.18em]">MIRKO CALZADILLA</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-zinc-400 hover:text-white text-sm font-normal transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="md:hidden text-zinc-300 hover:text-white transition-colors"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <nav className="md:hidden border-t border-white/[0.04] bg-black/80 backdrop-blur px-6 py-4 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-zinc-300 hover:text-white text-sm font-normal transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
