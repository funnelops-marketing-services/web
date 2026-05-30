import { WhatsAppCta } from "./whatsapp-cta"

export function HeroSection() {
  return (
    <main className="relative z-10 flex items-center justify-center px-6 min-h-[calc(100vh-80px)]">
      <div className="max-w-3xl w-full text-center py-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/[0.04] mb-10">
          <div className="w-1 h-1 rounded-full bg-violet-400" />
          <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
            Productor Audiovisual
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 text-balance leading-[1.05] tracking-tight">
          Producción de video
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
            para tu marca
          </span>
        </h1>

        <p className="text-base text-zinc-400 mb-12 max-w-md mx-auto font-normal leading-relaxed">
          Video, fotografía y edición con IA para empresas y creadores.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <WhatsAppCta />
          <a
            href="#servicios"
            className="inline-flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/5 font-normal px-6 py-4 rounded-full text-lg transition-colors"
          >
            Ver paquetes
          </a>
        </div>
      </div>
    </main>
  )
}
