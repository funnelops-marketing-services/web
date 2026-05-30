import { Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { CONTACT, type ServicePackage } from "./data"
import { WhatsAppIcon } from "./icons"

export function PackageCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-colors",
        pkg.featured
          ? "border-violet-500/40 bg-violet-500/[0.05]"
          : "border-white/[0.07] bg-white/[0.015] hover:bg-white/[0.03]",
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <h4 className="text-white font-bold text-base">{pkg.name}</h4>
        {pkg.ai && (
          <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300">
            <Sparkles className="w-3 h-3" />
            IA
          </span>
        )}
      </div>

      <ul className="space-y-2.5 mb-5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300 font-normal">
            <Check className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {pkg.tiers && (
        <div className="mb-5 space-y-2 rounded-xl border border-white/[0.06] bg-black/30 p-3">
          {pkg.tiers.map((tier) => (
            <div key={tier.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-zinc-400 font-normal">{tier.label}</span>
              <span className="text-white font-bold">{tier.price}</span>
            </div>
          ))}
        </div>
      )}

      {pkg.price && (
        <div className="mb-5">
          <span className="text-2xl font-bold text-white">{pkg.price}</span>
        </div>
      )}

      {pkg.note && <p className="mb-5 text-xs leading-relaxed text-zinc-500 font-normal">{pkg.note}</p>}

      <a
        href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(`Hola Mirko, me interesa el paquete "${pkg.name}".`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-colors",
          pkg.featured
            ? "bg-emerald-500 hover:bg-emerald-400 text-white"
            : "border border-white/10 text-zinc-200 hover:bg-white/5",
        )}
      >
        <WhatsAppIcon className="w-4 h-4" />
        Reservar
      </a>
    </div>
  )
}
