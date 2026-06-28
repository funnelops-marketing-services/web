import { Eyebrow } from "./atoms"
import { CONTACT } from "./data"
import { WorkGallery } from "./work-gallery"

export function Work() {
  return (
    <section id="trabajo" className="relative z-[2] py-[clamp(70px,9vw,120px)]">
      <div className="mx-auto w-[min(1240px,90vw)]">
        <div className="reveal-up flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Trabajo</Eyebrow>
            <h2 className="mt-[18px] font-display text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.03] tracking-[-0.03em]">
              Selección de piezas
            </h2>
          </div>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-white/20 pb-1 font-mono text-xs tracking-[0.14em] text-[#bcb3d6] transition-colors hover:text-white"
          >
            VER MÁS EN INSTAGRAM →
          </a>
        </div>
        <WorkGallery />
      </div>
    </section>
  )
}
