import { Eyebrow } from "./atoms"
import { PROCESS_STEPS } from "./data"

export function Process() {
  return (
    <section className="relative z-[2] py-[clamp(70px,9vw,120px)]">
      <div className="reveal-up mx-auto w-[min(1240px,90vw)]">
        <Eyebrow>El proceso</Eyebrow>
        <h2 className="mt-[18px] font-display text-[clamp(30px,4.4vw,56px)] font-bold leading-[1.03] tracking-[-0.03em]">
          Cómo trabajo
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className="border-t border-white/[0.14] pt-[22px]">
              <div className="font-mono text-[13px] tracking-[0.1em] text-[var(--a2)]">{item.step}</div>
              <h3 className="mt-4 font-display text-[21px] font-semibold">{item.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-[#a99fc8]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
