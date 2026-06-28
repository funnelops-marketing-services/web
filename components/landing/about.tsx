import { Eyebrow, ImageSlot } from "./atoms"
import { STATS } from "./data"

export function About() {
  return (
    <section className="relative z-[2] py-[clamp(90px,12vw,150px)]">
      <div className="reveal-up mx-auto grid w-[min(1240px,90vw)] grid-cols-1 items-center gap-[clamp(40px,6vw,84px)] md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow>Quién soy</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(34px,5vw,62px)] font-bold leading-[1.02] tracking-[-0.03em]">
            Hago ver <em className="font-serif font-normal text-gradient">premium</em> a tu marca.
          </h2>
          <p className="mt-[26px] max-w-[52ch] text-pretty text-[clamp(15px,1.2vw,18px)] leading-[1.7] text-[#bcb3d6]">
            Productor audiovisual desde hace más de 5 años. He trabajado con más de 50 empresas a nivel nacional,
            llevando su presencia digital a un nivel cinematográfico y estratégico. Dirijo cada pieza de la idea a la
            entrega.
          </p>
          <div className="mt-10 flex flex-wrap gap-12">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex gap-12">
                {i > 0 && <div className="w-px bg-white/10" />}
                <div>
                  <div
                    data-count={stat.value}
                    data-prefix={stat.prefix}
                    className="font-display text-[clamp(38px,4vw,54px)] font-bold leading-none tracking-[-0.03em]"
                  >
                    {stat.prefix}
                    {stat.value}
                  </div>
                  <div className="mt-2 font-mono text-xs tracking-[0.06em] text-[#8a7fb0]">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ImageSlot
          placeholder="Arrastrá tu retrato"
          aspect="4/5"
          src="/landing/mirko.png"
          alt="Mirko Calzadilla con cámara y gimbal"
        />
      </div>

      <div className="reveal-up mx-auto mt-[clamp(70px,9vw,120px)] w-[min(1100px,90vw)] text-center">
        <p className="text-balance font-serif text-[clamp(28px,4.6vw,58px)] italic leading-[1.18] tracking-[-0.01em] text-[#e9e4f5]">
          “La luz no es para ver. Es para hacer <span className="text-gradient">sentir</span>”
        </p>
      </div>
    </section>
  )
}
