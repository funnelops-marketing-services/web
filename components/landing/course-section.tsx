import { Eyebrow } from "./atoms"
import { COURSE_BUNDLE, COURSE_WORKSHOPS, whatsappLink } from "./data"

export function CourseSection() {
  return (
    <section id="curso" className="relative z-[2] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto w-[min(1240px,90vw)]">
        <div className="reveal-up">
          <Eyebrow>Formación</Eyebrow>
          <h2 className="mt-[18px] max-w-[18ch] font-display text-[clamp(26px,4.6vw,58px)] font-bold leading-[1.04] tracking-[-0.03em]">
            Curso de Producción Audiovisual <em className="font-serif font-normal text-gradient">+ IA</em>
          </h2>
          <p className="mt-[18px] max-w-[54ch] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-[#a99fc8]">
            De cero a producir como un profesional. Cuatro talleres que se complementan: tomá uno suelto o el curso
            completo con descuento.
          </p>
        </div>

        <div className="reveal-up mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COURSE_WORKSHOPS.map((w) => (
            <div
              key={w.step}
              className="rounded-[18px] border border-white/[0.09] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--a2)_40%,transparent)]"
            >
              <div className="font-mono text-xs tracking-[0.1em] text-[var(--a2)]">{w.step}</div>
              <h3 className="mt-3 font-display text-[19px] font-semibold">{w.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-[1.55] text-[#a99fc8]">{w.description}</p>
              <div className="mt-[18px] font-display text-[18px] font-bold text-[#e3def0]">{w.price}</div>
            </div>
          ))}
        </div>

        <div className="mt-[18px] flex flex-wrap items-center justify-between gap-6 rounded-[20px] border border-[color-mix(in_srgb,var(--a2)_32%,transparent)] bg-[linear-gradient(100deg,color-mix(in_srgb,var(--a1)_14%,rgba(255,255,255,.03)),color-mix(in_srgb,var(--a2)_10%,rgba(255,255,255,.02)))] px-[30px] py-7">
          <div className="flex flex-wrap items-baseline gap-4">
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] text-[var(--a2)]">{COURSE_BUNDLE.badge}</div>
              <div className="mt-2 font-display text-[34px] font-bold tracking-[-0.02em]">{COURSE_BUNDLE.price}</div>
            </div>
            <div className="font-mono text-[13px] text-[#8a7fb0]">
              sueltos suman <span className="line-through">{COURSE_BUNDLE.strikethrough}</span>
            </div>
          </div>
          <a
            className="shine-btn btn-grad inline-flex items-center gap-2.5 rounded-full px-[26px] py-[15px] text-[15px] font-semibold text-white shadow-[0_12px_38px_rgba(239,68,136,.32)] transition-transform hover:-translate-y-0.5"
            href={whatsappLink(COURSE_BUNDLE.message)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quiero el curso <span>→</span>
          </a>
        </div>
        <p className="mt-4 font-mono text-xs tracking-[0.06em] text-[#6f6790]">
          Cupos limitados · curso presencial e íntimo.
        </p>
      </div>
    </section>
  )
}
