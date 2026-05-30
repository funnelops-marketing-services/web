import { WhatsAppCta } from "./whatsapp-cta"

export function ContactSection() {
  return (
    <section id="contacto" className="relative z-10 px-6 py-20 md:py-28 border-t border-white/[0.04]">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
          Contacto
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4 tracking-tight">
          ¿Listo para empezar?
        </h2>
        <p className="text-zinc-400 text-base font-normal mb-10 leading-relaxed">
          Escríbeme y armamos el paquete que tu marca necesita.
        </p>

        <div className="flex justify-center">
          <WhatsAppCta />
        </div>
      </div>
    </section>
  )
}
