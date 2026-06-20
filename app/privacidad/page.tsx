import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/landing/site-footer"
import { type Block, LAST_UPDATED, SECTIONS } from "./content"

export const metadata: Metadata = {
  title: "Política de Privacidad — Mirko Calzadilla",
  description:
    "Cómo Mirko Calzadilla recoge, usa y protege tus datos cuando contactas por WhatsApp.",
}

function SectionBlock({ block }: { block: Block }) {
  if (block.type === "list") {
    return (
      <ul className="mt-4 space-y-2.5">
        {block.items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-zinc-300 text-sm md:text-base font-normal leading-relaxed"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <p className="mt-4 text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
      {block.text}
    </p>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Degradados sutiles de fondo (consistentes con la landing) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px]" />
      </div>

      <header className="sticky top-0 bg-black/40 backdrop-blur z-30 border-b border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-white font-bold text-sm tracking-[0.18em]">MIRKO CALZADILLA</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
            Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 tracking-tight">
            Política de Privacidad
          </h1>
          <p className="text-zinc-500 text-sm font-normal mt-4">
            Última actualización: {LAST_UPDATED}
          </p>
          <p className="mt-6 text-zinc-400 text-sm md:text-base font-normal leading-relaxed">
            Esta política explica qué datos recogemos cuando nos contactas por WhatsApp,
            para qué los usamos y con quién los compartimos.
          </p>

          <div className="mt-12 space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {section.title}
                </h2>
                {section.blocks.map((block, index) => (
                  <SectionBlock key={index} block={block} />
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
