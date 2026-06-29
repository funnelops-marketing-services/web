import { TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'

// Etiqueta de alerta de la oportunidad, derivada del motivo de handoff (#94). Solo
// 'unknown_service' (el lead pidió un servicio fuera del catálogo) tiene representación
// visible; cualquier otro valor (o null) no renderiza nada.
const ALERTS: Record<string, string> = {
  unknown_service: 'Solicitud desconocida',
}

/** Badge de alerta de la card. `showLabel` muestra el texto (detalle); en la cara de la
 *  card va solo el ícono. Devuelve null cuando no hay alerta conocida. */
export function AlertBadge({
  alert,
  showLabel = false,
  className,
}: {
  alert?: string | null
  showLabel?: boolean
  className?: string
}) {
  const label = alert ? ALERTS[alert] : undefined
  if (!label) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-400',
        className,
      )}
      title={label}
    >
      <TriangleAlert className="size-3 flex-shrink-0" />
      {showLabel && label}
    </span>
  )
}
