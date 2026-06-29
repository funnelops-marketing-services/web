"use client"

import Image from "next/image"
import { useState } from "react"
import { NAV_ITEMS, whatsappLink } from "./data"

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav
        data-nav
        className="fixed inset-x-0 top-0 z-[120] flex items-center justify-between gap-6 border-b border-transparent px-[clamp(18px,4vw,52px)] py-[15px] transition-[background,border-color,backdrop-filter] duration-300"
      >
        <a href="#top" className="flex items-center gap-2.5 font-mono text-[10.5px] font-bold tracking-[0.28em] text-[#f3f0fa] sm:text-[11.5px] sm:tracking-[0.32em]">
          <Image
            src="/landing/logo-mirko.svg"
            alt="Mirko Calzadilla"
            width={20}
            height={32}
            className="h-6.5 w-auto sm:h-7.5"
            priority
          />
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
            className="shine-btn btn-grad mt-3.5 rounded-full px-7 py-[15px] font-semibold text-white"
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
