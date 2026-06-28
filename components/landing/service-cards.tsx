import { cn } from "@/lib/utils"
import { whatsappLink, type EditingPlan, type IndividualService, type ProductionPackage } from "./data"
import { AiBadge, ReserveLink } from "./reserve-link"

export function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[#8a7fb0]">{children}</div>
  )
}

export function ProductionCard({ pkg }: { pkg: ProductionPackage }) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-[22px] p-[30px] transition-all duration-[400ms] hover:-translate-y-1.5",
        pkg.featured
          ? "border border-[color-mix(in_srgb,var(--a2)_45%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--a1)_12%,rgba(255,255,255,.04)),rgba(255,255,255,.02))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--a2)_20%,transparent),0_30px_80px_color-mix(in_srgb,var(--a1)_18%,transparent)]"
          : "border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.018))] hover:border-white/20 hover:shadow-[0_30px_70px_rgba(0,0,0,.4)]",
      )}
    >
      <div className="flex items-center justify-between gap-2.5">
        <span
          className={cn(
            "rounded-full font-mono text-[11px] tracking-[0.16em]",
            pkg.featured
              ? "bg-[linear-gradient(100deg,var(--a1),var(--a2))] px-3 py-[5px] text-white"
              : "border border-white/[0.16] px-3 py-[5px] text-[#9a90bb]",
          )}
        >
          {pkg.badge}
        </span>
        {pkg.ai && <AiBadge />}
      </div>
      <h3 className="mt-[22px] font-display text-[26px] font-bold">{pkg.name}</h3>
      <p className="mt-2 text-sm text-[#bcb3d6]">{pkg.description}</p>
      <ul className="mt-[22px] flex flex-col gap-[11px] text-[14.5px] text-[#e3def0]">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span className="mt-2 h-[5px] w-[5px] flex-none rounded-full bg-[var(--a2)]" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-[26px] font-display text-[32px] font-bold tracking-[-0.02em]">{pkg.price}</div>
      <ReserveLink message={pkg.message} variant={pkg.featured ? "gradient" : "outline"} className="mt-[22px]" />
    </article>
  )
}

export function EditingCard({ plan }: { plan: EditingPlan }) {
  return (
    <article className="flex flex-col rounded-[22px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.018))] p-[30px] transition-all duration-[400ms] hover:-translate-y-1.5 hover:border-white/20">
      <div className="flex items-center justify-between gap-2.5">
        <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
        {plan.ai && <AiBadge />}
      </div>
      <p className="mt-2 text-sm text-[#a99fc8]">{plan.description}</p>
      <div className="mt-6 flex flex-col">
        {plan.tiers.map((tier) => (
          <div key={tier.label} className="flex items-center justify-between border-t border-white/10 py-[13px]">
            <span className="text-[14.5px] text-[#cdc6e0]">{tier.label}</span>
            <span className="font-display text-[19px] font-bold">{tier.price}</span>
          </div>
        ))}
      </div>
      <ReserveLink message={plan.message} className="mt-auto pt-6" />
    </article>
  )
}

export function IndividualCard({ service }: { service: IndividualService }) {
  return (
    <article className="flex flex-col rounded-[20px] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.014))] p-[26px] transition-all duration-[400ms] hover:-translate-y-[5px] hover:border-white/20">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-[19px] font-semibold">{service.name}</h3>
        {service.ai && <AiBadge small />}
      </div>
      <p className="mt-2.5 text-[13.5px] leading-[1.55] text-[#a99fc8]">{service.description}</p>
      <div className="mt-5 font-display text-2xl font-bold">{service.price}</div>
      <a
        href={whatsappLink(service.message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-[18px] font-mono text-xs tracking-[0.12em] text-[var(--a2)]"
      >
        RESERVAR →
      </a>
    </article>
  )
}
