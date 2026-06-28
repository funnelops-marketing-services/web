import { CineWord } from "./cine-word"
import { whatsappLink } from "./data"

export function Hero() {
  return (
    <header
      id="top"
      data-hero
      className="relative z-[2] flex min-h-[100svh] flex-col items-center justify-center px-[clamp(20px,5vw,56px)] pb-[70px] pt-[130px] text-center"
    >
      <div
        data-glow
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 h-[560px] w-[560px] rounded-full mix-blend-screen blur-[50px]"
        style={{
          opacity: "calc(.5*var(--glow))",
          background: "radial-gradient(circle,var(--a2),transparent 62%)",
          transform: "translate(-50%,-50%)",
          transition: "transform .18s ease-out",
        }}
      />

      <div
        className="relative z-[1] mb-[30px] flex flex-wrap items-center justify-center gap-4"
        style={{ animation: "introUp .8s cubic-bezier(.2,.75,.25,1) both" }}
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] px-3.5 py-[7px] font-mono text-[11px] tracking-[0.22em] text-[#f3f0fa]">
          <span className="h-[7px] w-[7px] rounded-full bg-[#ff3b6b] shadow-[0_0_10px_#ff3b6b]" style={{ animation: "blink 1.6s ease-in-out infinite" }} />
          REC
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] text-[#9a90bb]">SANTA&nbsp;CRUZ&nbsp;·&nbsp;BOLIVIA</span>
        <span data-tc className="font-mono text-[11px] tracking-[0.1em] text-[var(--a2)]">00:00:00:00</span>
      </div>

      <h1
        className="relative z-[1] m-0 max-w-[15ch] text-balance font-display text-[clamp(40px,7.4vw,104px)] font-bold leading-[0.98] tracking-[-0.035em]"
        style={{ animation: "introUp .9s cubic-bezier(.2,.75,.25,1) .14s both" }}
      >
        Hacemos que tu marca se{" "}
        <em className="font-serif font-normal italic text-gradient">sienta</em> como{" "}
        <CineWord />.
      </h1>

      <p
        className="relative z-[1] mt-[30px] max-w-[60ch] text-pretty text-[clamp(16px,1.5vw,20px)] leading-[1.6] text-[#bcb3d6]"
        style={{ animation: "introUp .9s cubic-bezier(.2,.75,.25,1) .22s both" }}
      >
        Video, fotografía y edición con IA para empresas y creadores que quieren verse premium. Post de cine:
        After&nbsp;Effects · Premiere · DaVinci.
      </p>

      <div
        className="relative z-[1] mt-10 flex flex-wrap items-center justify-center gap-3.5"
        style={{ animation: "introUp .9s cubic-bezier(.2,.75,.25,1) .3s both" }}
      >
        <a
          className="shine-btn inline-flex items-center gap-2.5 rounded-full bg-[linear-gradient(100deg,var(--a1),var(--a2))] px-[30px] py-4 text-[15.5px] font-semibold text-white shadow-[0_14px_46px_rgba(239,68,136,.36)] transition-transform hover:-translate-y-[3px]"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hablar por WhatsApp <span className="text-[17px]">→</span>
        </a>
        <a
          href="#servicios"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.22] px-7 py-4 text-[15.5px] font-semibold text-[#f3f0fa] transition-colors hover:border-white/45 hover:bg-white/[0.06]"
        >
          Ver paquetes
        </a>
      </div>

      <div
        className="relative z-[1] mt-[34px] flex flex-wrap items-center justify-center gap-x-[26px] gap-y-2.5 font-mono text-xs tracking-[0.06em] text-[#8a7fb0]"
        style={{ animation: "introUp .9s cubic-bezier(.2,.75,.25,1) .38s both" }}
      >
        <span>
          <span className="text-[var(--a2)]">+5</span> años de experiencia
        </span>
        <span className="opacity-40">/</span>
        <span>
          <span className="text-[var(--a2)]">+50</span> empresas a nivel nacional
        </span>
      </div>

      <div className="absolute bottom-[30px] left-1/2 z-[1] flex -translate-x-1/2 flex-col items-center gap-2.5">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#6f6790]">DESLIZÁ</span>
        <span className="relative block h-[30px] w-5 rounded-[12px] border border-white/[0.22]">
          <span
            className="absolute left-1/2 top-[6px] h-[6px] w-[3px] -translate-x-1/2 rounded-sm bg-[var(--a2)]"
            style={{ animation: "scrollDot 1.8s ease-in-out infinite" }}
          />
        </span>
      </div>
    </header>
  )
}
