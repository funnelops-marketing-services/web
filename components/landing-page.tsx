"use client"

import { Button } from "@/components/ui/button"

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-violet-700/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-white font-bold text-sm tracking-[0.18em]">MIRKO CALZADILLA</span>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#cursos" className="text-zinc-400 hover:text-white text-sm font-normal transition-colors">
              Cursos
            </a>
            <a href="#beneficios" className="text-zinc-400 hover:text-white text-sm font-normal transition-colors">
              Beneficios
            </a>
            <a href="#contacto" className="text-zinc-400 hover:text-white text-sm font-normal transition-colors">
              Contacto
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex items-center justify-center px-6 min-h-[calc(100vh-80px)]">
        <div className="max-w-3xl w-full text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/[0.04] mb-10">
            <div className="w-1 h-1 rounded-full bg-violet-400" />
            <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
              Coach de Diseño Audiovisual
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-balance leading-[1.05] tracking-tight">
            Mejora la marca
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500 bg-clip-text text-transparent">
              de tu empresa
            </span>
          </h1>

          <p className="text-base text-zinc-400 mb-12 max-w-md mx-auto font-normal leading-relaxed">
            Mentoría 1:1 y cursos de diseño audiovisual para creadores y empresas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-6 rounded-full shadow-[0_0_30px_-8px_rgba(16,185,129,0.5)] transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hablar por WhatsApp
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-zinc-300 hover:text-white hover:bg-white/5 font-normal px-6 py-6 rounded-full"
            >
              Ver más
            </Button>
          </div>
        </div>
      </main>

      {/* Cursos */}
      <section id="cursos" className="relative z-10 px-6 py-28 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
              Cursos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 tracking-tight">
              Programas disponibles
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
            <div className="bg-black p-8 hover:bg-white/[0.02] transition-colors">
              <div className="text-xs text-violet-400 font-normal tracking-widest uppercase mb-4">01</div>
              <h3 className="text-white font-bold text-lg mb-3">Fundamentos</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                Composición, luz y narrativa visual para empezar con bases sólidas.
              </p>
            </div>
            <div className="bg-black p-8 hover:bg-white/[0.02] transition-colors">
              <div className="text-xs text-violet-400 font-normal tracking-widest uppercase mb-4">02</div>
              <h3 className="text-white font-bold text-lg mb-3">Producción</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                Tomas de cámara, dirección y flujo de grabación nivel profesional.
              </p>
            </div>
            <div className="bg-black p-8 hover:bg-white/[0.02] transition-colors">
              <div className="text-xs text-violet-400 font-normal tracking-widest uppercase mb-4">03</div>
              <h3 className="text-white font-bold text-lg mb-3">Marca</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-normal">
                Estrategia visual para elevar la marca de empresas e influencers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="relative z-10 px-6 py-28 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
              Beneficios
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 tracking-tight">
              Lo que vas a lograr
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="text-violet-400 text-xs font-normal tracking-widest uppercase mb-2">
                — Mentoría 1:1
              </div>
              <p className="text-zinc-300 text-base leading-relaxed font-normal">
                Sesiones personalizadas adaptadas a tu marca, tu equipo y tus objetivos reales.
              </p>
            </div>
            <div>
              <div className="text-violet-400 text-xs font-normal tracking-widest uppercase mb-2">
                — Resultados visibles
              </div>
              <p className="text-zinc-300 text-base leading-relaxed font-normal">
                Contenido más profesional, consistente y alineado a tu identidad visual.
              </p>
            </div>
            <div>
              <div className="text-violet-400 text-xs font-normal tracking-widest uppercase mb-2">
                — Método probado
              </div>
              <p className="text-zinc-300 text-base leading-relaxed font-normal">
                Sistema desarrollado con marcas e influencers que escalan su producción.
              </p>
            </div>
            <div>
              <div className="text-violet-400 text-xs font-normal tracking-widest uppercase mb-2">
                — Acompañamiento
              </div>
              <p className="text-zinc-300 text-base leading-relaxed font-normal">
                Soporte continuo durante el proceso, no solo durante las clases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="relative z-10 px-6 py-28 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
            Contacto
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4 tracking-tight">
            ¿Listo para empezar?
          </h2>
          <p className="text-zinc-400 text-base font-normal mb-10 leading-relaxed">
            Agenda una llamada y conversemos sobre tu proyecto.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-6 rounded-full shadow-[0_0_30px_-8px_rgba(16,185,129,0.5)] transition-all"
            >
              Hablar por WhatsApp
            </Button>
            <a
              href="mailto:hola@mirkocalzadilla.com"
              className="text-zinc-300 hover:text-white text-sm font-normal transition-colors px-4"
            >
              hola@mirkocalzadilla.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs font-normal tracking-wide">
            &copy; 2026 Mirko Calzadilla
          </p>
          <p className="text-zinc-600 text-xs font-normal tracking-wide">
            Coach de Diseño Audiovisual
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a
        href="#contacto"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(16,185,129,0.7)] hover:scale-105 transition-all"
        aria-label="Chatear por WhatsApp"
      >
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  )
}
