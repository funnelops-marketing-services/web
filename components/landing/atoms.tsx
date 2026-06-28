import Image from "next/image"
import { cn } from "@/lib/utils"

/** Etiqueta mono con guion(es), usada como antetítulo de cada sección. */
export function Eyebrow({
  children,
  centered = false,
  className,
}: {
  children: React.ReactNode
  centered?: boolean
  className?: string
}) {
  const dash = <span className="h-px w-[26px] bg-[var(--a2)]" />
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.3em] text-[var(--a2)]",
        centered && "justify-center",
        className,
      )}
    >
      {dash}
      {children}
      {centered && dash}
    </div>
  )
}

/**
 * Marco placeholder para una imagen aún no cargada. En el diseño original
 * era un custom element `image-slot`; acá es un frame con etiqueta para que
 * el cliente reemplace con su foto.
 */
export function ImageSlot({
  placeholder,
  aspect,
  src,
  alt,
  radius = "rounded-[20px]",
  className,
}: {
  placeholder: string
  /** Ej: "4/5", "9/16", "16/9". */
  aspect: string
  /** Imagen real; si falta, se muestra el placeholder. */
  src?: string
  alt?: string
  radius?: string
  className?: string
}) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden border border-white/[0.12] bg-white/[0.014] text-center",
          radius,
        )}
        style={{ aspectRatio: aspect }}
      >
        {src ? (
          <Image src={src} alt={alt ?? placeholder} fill sizes="(max-width:768px) 90vw, 45vw" className="object-cover" />
        ) : (
          <span className="px-4 font-mono text-[11px] tracking-[0.12em] text-[#f3f0fa]/50">{placeholder}</span>
        )}
      </div>
    </div>
  )
}
