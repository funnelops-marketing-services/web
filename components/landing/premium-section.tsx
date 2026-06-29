import { Eyebrow } from "./atoms"
import { PREMIUM_PROGRAMS, whatsappLink } from "./data"

export function PremiumSection() {
  return (
    <section className="relative z-[2] py-[clamp(70px,9vw,120px)]">
      <div className="mx-auto w-[min(1240px,90vw)]">
        <div className="reveal-up mx-auto max-w-[64ch] text-center">
          <Eyebrow centered>Programas premium</Eyebrow>
          <h2 className="mt-[18px] font-display text-[clamp(26px,4.6vw,58px)] font-bold leading-[1.05] tracking-[-0.03em]">
            Para marcas que quieren <em className="font-serif font-normal text-gradient">evolucionar</em>
          </h2>
        </div>

        <div className="reveal-up mt-12 grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {PREMIUM_PROGRAMS.map((program) => (
            <article
              key={program.title}
              className="relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,.045),rgba(255,255,255,.012))] p-9"
            >
              <div
                className="pointer-events-none absolute -right-[60px] -top-[60px] h-[240px] w-[240px] rounded-full blur-[70px]"
                style={{
                  background: program.glow === "a1" ? "var(--a1)" : "var(--a2)",
                  opacity: program.glow === "a1" ? 0.4 : 0.34,
                }}
              />
              <div className="relative flex flex-1 flex-col">
                <div className="font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--a2)]">{program.badge}</div>
                <h3 className="mt-3.5 font-display text-[clamp(24px,2.4vw,32px)] font-bold tracking-[-0.02em]">
                  {program.title}
                </h3>
                <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.65] text-[#bcb3d6]">{program.description}</p>
                <div className="mt-auto flex flex-wrap gap-2.5 pt-[26px] font-mono text-[11px] tracking-[0.06em] text-[#cdc6e0]">
                  {program.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/[0.14] px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={whatsappLink(program.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center gap-2.5 border-b border-[var(--a2)] pb-1.5 text-[15px] font-semibold text-[#f3f0fa] transition-all hover:gap-4"
                >
                  Consultá disponibilidad <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
