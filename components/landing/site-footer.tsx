import { Instagram, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CONTACT } from "./data"

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
        <div className="flex flex-col items-start gap-3 text-[13.5px] text-[#bcb3d6]">
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
          >
            <Instagram className="size-4" aria-hidden />
            @{CONTACT.instagram}
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
          >
            <Mail className="size-4" aria-hidden />
            {CONTACT.email}
          </a>
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
