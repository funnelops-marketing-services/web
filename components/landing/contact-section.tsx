import { Eyebrow } from "./atoms"
import { CONTACT, whatsappLink } from "./data"

export function ContactSection() {
  return (
    <section id="contacto" className="relative z-[2] py-[clamp(90px,12vw,160px)]">
      <div className="relative mx-auto w-[min(1000px,90vw)] text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-[40%] h-[600px] max-w-[90vw] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]"
          style={{ opacity: "calc(.34*var(--glow))", background: "radial-gradient(circle,var(--a1),transparent 60%)" }}
        />
        <div className="relative">
          <Eyebrow centered>Contacto</Eyebrow>
          <h2 className="mx-auto mt-[22px] max-w-[18ch] text-balance font-display text-[clamp(34px,5.6vw,76px)] font-bold leading-[1.02] tracking-[-0.035em]">
            ¿Listo para que tu marca se vea como lo que <em className="font-serif font-normal text-gradient">cobrás</em>?
          </h2>
          <p className="mx-auto mt-[26px] max-w-[48ch] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-[#bcb3d6]">
            Escribime y armamos el paquete que tu marca necesita.
          </p>
          <div className="mt-10">
            <a
              className="shine-btn inline-flex items-center gap-3 rounded-full bg-[linear-gradient(100deg,var(--a1),var(--a2))] px-9 py-[18px] text-[16.5px] font-semibold text-white shadow-[0_18px_56px_rgba(239,68,136,.4)] transition-transform hover:-translate-y-[3px]"
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablar por WhatsApp <span className="text-[18px]">→</span>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2 font-mono text-[13px] tracking-[0.04em] text-[#9a90bb]">
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
              @{CONTACT.instagram}
            </a>
            <span className="opacity-40">·</span>
            <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-white">
              {CONTACT.email}
            </a>
          </div>
          <p className="mt-[46px] font-serif text-[clamp(22px,3vw,36px)] italic text-[#e9e4f5]">
            No te lo prometo, te lo muestro.
          </p>
        </div>
      </div>
    </section>
  )
}
