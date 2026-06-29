import Image from "next/image"
import Link from "next/link"
import { CONTACT, whatsappLink } from "./data"

const LINKS = [
  { label: "WhatsApp", href: whatsappLink(), external: true },
  { label: "Instagram", href: CONTACT.instagramUrl, external: true },
]

export function SiteFooter() {
  return (
    <footer className="relative z-[2] border-t border-white/[0.08] px-[clamp(18px,4vw,52px)] py-[46px]">
      <div className="mx-auto flex w-[min(1240px,92vw)] flex-col items-start justify-between gap-7 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5">
          <Image src="/landing/logo-mirko.svg" alt="Mirko Calzadilla" width={22} height={36} className="h-9 w-auto" />
          <div>
            <div className="font-mono text-[11px] font-bold tracking-[0.28em] text-[#f3f0fa]">MIRKO CALZADILLA</div>
            <div className="mt-1 text-[12.5px] text-[#8a7fb0]">Productor audiovisual · {CONTACT.location}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-[22px] text-[13.5px] text-[#bcb3d6]">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
      <div className="mx-auto mt-[30px] flex w-[min(1240px,92vw)] flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-[22px] font-mono text-[11.5px] tracking-[0.06em] text-[#6f6790] sm:flex-row sm:items-center">
        <span>© 2026 Mirko Calzadilla · Todos los derechos reservados.</span>
        <Link href="/privacidad" className="transition-colors hover:text-white">
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
