import { Flame, Snowflake, Thermometer, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface RatingConfig {
  label: string
  icon: LucideIcon
  className: string
}

// Calificación del lead (#53). Default a 'frío' ante valores desconocidos.
const RATINGS: Record<string, RatingConfig> = {
  hot: {
    label: 'Caliente',
    icon: Flame,
    className: 'border-red-500/20 bg-red-500/10 text-red-400',
  },
  medium: {
    label: 'Tibio',
    icon: Thermometer,
    className: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  },
  cold: {
    label: 'Frío',
    icon: Snowflake,
    className: 'border-sky-500/20 bg-sky-500/10 text-sky-400',
  },
}

/** Badge de calificación del lead (hot/medium/cold). `showLabel` muestra el texto;
 *  en la cara de la card va solo el ícono. */
export function RatingBadge({
  rating,
  showLabel = false,
  className,
}: {
  rating: string
  showLabel?: boolean
  className?: string
}) {
  const config = RATINGS[rating] ?? RATINGS.cold
  const Icon = config.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium',
        config.className,
        className,
      )}
      title={config.label}
    >
      <Icon className="size-3 flex-shrink-0" />
      {showLabel && config.label}
    </span>
  )
}
