"use client"

import { useState } from "react"
import { CONTACT, NAV_ITEMS, whatsappLink } from "./data"

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav
        data-nav
        className="fixed inset-x-0 top-0 z-[120] flex items-center justify-between gap-6 border-b border-transparent px-[clamp(18px,4vw,52px)] py-[15px] transition-[background,border-color,backdrop-filter] duration-300"
      >
        <a href="#top" className="flex items-center gap-3 font-mono text-[11.5px] font-bold tracking-[0.32em] text-[#f3f0fa]">
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[7px] bg-[linear-gradient(100deg,var(--a1),var(--a2))] text-[15px] font-extrabold text-white">
            M
          </span>
          MIRKO&nbsp;CALZADILLA
        </a>

        <div className="hidden items-center gap-[34px] md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#bcb3d6] transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <a
            className="shine-btn rounded-full bg-[linear-gradient(100deg,var(--a1),var(--a2))] px-5 py-[11px] text-sm font-semibold text-white shadow-[0_8px_28px_rgba(239,68,136,.32)] transition-transform hover:-translate-y-0.5"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex flex-col gap-[5px] p-2 md:hidden"
          aria-label="Abrir menú"
        >
          <span className="h-0.5 w-6 bg-[#f3f0fa]" />
          <span className="h-0.5 w-6 bg-[#f3f0fa]" />
          <span className="h-0.5 w-4 bg-[#f3f0fa]" />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-[30px] bg-[rgba(9,6,16,.97)] backdrop-blur-[22px]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 text-[30px] leading-none text-[#f3f0fa]"
            aria-label="Cerrar menú"
          >
            ×
          </button>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-semibold text-[#f3f0fa]"
            >
              {item.label}
            </a>
          ))}
          <a
            className="shine-btn mt-3.5 rounded-full bg-[linear-gradient(100deg,var(--a1),var(--a2))] px-7 py-[15px] font-semibold text-white"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Hablar por WhatsApp
          </a>
        </div>
      )}
    </>
  )
}
