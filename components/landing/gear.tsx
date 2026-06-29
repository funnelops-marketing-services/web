import { Eyebrow, ImageSlot } from "./atoms"
import { GEAR } from "./data"

export function Gear() {
  return (
    <section className="relative z-[2] py-[clamp(70px,9vw,120px)]">
      <div className="reveal-up mx-auto grid w-[min(1240px,90vw)] grid-cols-1 items-center gap-[clamp(40px,5vw,64px)] md:grid-cols-[1.35fr_0.65fr]">
        <ImageSlot
          placeholder="Arrastrá una foto de set"
          aspect="16/9"
          src="/landing/herramientas.png"
          alt="Equipo de cine: cámara, lentes, gimbal e iluminación"
        />
        <div>
          <Eyebrow>El fierro</Eyebrow>
          <h2 className="mt-[18px] font-display text-[clamp(26px,4.4vw,56px)] font-bold leading-[1.05] tracking-[-0.03em]">
            Equipo de cine
          </h2>
          <p className="mt-3.5 max-w-[44ch] text-[13.5px] leading-[1.5] text-[#a99fc8]">
            Cámara, óptica y luz de nivel profesional. Lo necesario para que cada pieza se vea como lo que cobrás.
          </p>
          <div className="mt-5 flex flex-col">
            {GEAR.map((row, i) => (
              <div
                key={row.label}
                className={`flex justify-between gap-4 border-t border-white/10 py-2.5 ${
                  i === GEAR.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="min-w-[118px] font-mono text-[10.5px] tracking-[0.12em] text-[var(--a2)]">
                  {row.label}
                </span>
                <span className="text-right text-[13px] text-[#e3def0]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
