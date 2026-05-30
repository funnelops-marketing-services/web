import { cn } from "@/lib/utils"
import { CONTACT } from "./data"
import { WhatsAppIcon } from "./icons"

type WhatsAppCtaProps = {
  label?: string
  /** Mensaje prellenado en el chat de WhatsApp. */
  message?: string
  className?: string
}

/** Botón principal de WhatsApp usado en hero, curso y contacto. */
export function WhatsAppCta({ label = "Hablar por WhatsApp", message, className }: WhatsAppCtaProps) {
  const href = message
    ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}`
    : CONTACT.whatsappUrl
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-7 py-4 rounded-full shadow-[0_0_30px_-8px_rgba(16,185,129,0.5)] transition-all",
        className,
      )}
    >
      <WhatsAppIcon className="w-5 h-5" />
      {label}
    </a>
  )
}

/** Botón flotante fijo, presente en toda la página. */
export function WhatsAppFab() {
  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-[0_0_30px_-5px_rgba(16,185,129,0.7)] hover:scale-105 transition-all"
      aria-label="Chatear por WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7 text-white" />
    </a>
  )
}
