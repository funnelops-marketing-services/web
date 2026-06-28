import { Eyebrow } from "./atoms"
import { EDITING_NOTE, EDITING_PLANS, INDIVIDUAL_SERVICES, PRODUCTION_PACKAGES } from "./data"
import { BlockLabel, EditingCard, IndividualCard, ProductionCard } from "./service-cards"

export function ServicesSection() {
  return (
    <section id="servicios" className="relative z-[2] py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto w-[min(1240px,90vw)]">
        <div className="reveal-up mx-auto max-w-[60ch] text-center">
          <Eyebrow centered>Servicios</Eyebrow>
          <h2 className="mt-[18px] font-display text-[clamp(32px,4.8vw,62px)] font-bold leading-[1.02] tracking-[-0.03em]">
            Paquetes exclusivos
          </h2>
          <p className="mt-[18px] text-[clamp(15px,1.2vw,18px)] leading-[1.6] text-[#a99fc8]">
            Elegí el nivel. Yo me encargo del resto.
          </p>
        </div>

        <BlockLabel>01 — Producción audiovisual</BlockLabel>
        <div className="mt-[18px] grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {PRODUCTION_PACKAGES.map((pkg) => (
            <ProductionCard key={pkg.name} pkg={pkg} />
          ))}
        </div>

        <BlockLabel>02 — Edición de videos · plan mensual</BlockLabel>
        <div className="mt-[18px] grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {EDITING_PLANS.map((plan) => (
            <EditingCard key={plan.name} plan={plan} />
          ))}
        </div>
        <p className="mt-4 font-mono text-xs tracking-[0.04em] text-[#6f6790]">{EDITING_NOTE}</p>

        <BlockLabel>03 — Servicios individuales</BlockLabel>
        <div className="mt-[18px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 md:grid-cols-3">
          {INDIVIDUAL_SERVICES.map((service) => (
            <IndividualCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
