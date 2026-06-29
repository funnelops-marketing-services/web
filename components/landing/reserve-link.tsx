import { cn } from "@/lib/utils"
import { whatsappLink } from "./data"

/** Botón "Reservar →" hacia WhatsApp, con variantes según jerarquía. */
export function ReserveLink({
  message,
  variant = "outline",
  className,
  children = "Reservar",
}: {
  message: string
  variant?: "outline" | "gradient"
  className?: string
  children?: React.ReactNode
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-between gap-2.5 rounded-[13px] px-[18px] py-3.5 text-sm font-semibold transition-all",
        variant === "gradient"
          ? "shine-btn btn-grad text-white shadow-[0_12px_36px_rgba(239,68,136,.32)] hover:-translate-y-0.5"
          : "border border-white/[0.16] text-[#f3f0fa] hover:border-[var(--a2)] hover:bg-[rgba(239,68,136,.08)]",
        className,
      )}
    >
      {children} <span>→</span>
    </a>
  )
}

/** Sello "IA" reutilizable. */
export function AiBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full border border-[color-mix(in_srgb,var(--a2)_50%,transparent)] font-mono tracking-[0.16em] text-[var(--a2)]",
        small ? "px-2 py-1 text-[10px]" : "px-2.5 py-[5px] text-[11px]",
      )}
    >
      IA
    </span>
  )
}
