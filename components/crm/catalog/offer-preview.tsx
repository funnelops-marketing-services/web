'use client'

import { FileText } from 'lucide-react'

import { CLOSING_LABELS } from '@/components/crm/catalog/labels'
import type { OfferClosing } from '@/lib/api/catalogo'

interface PreviewOffer {
  nombre: string
  resumen: string
  detalle?: string | null
  precio: string
  moneda: string
  flujo_cierre: string
  materialName?: string | null
}

/** Cómo el bot le presenta esta oferta al lead: resumen breve + precio + material. */
export function OfferPreview({ offer }: { offer: PreviewOffer }) {
  const isUsd = offer.moneda === 'USD'
  const closing = CLOSING_LABELS[offer.flujo_cierre as OfferClosing] ?? offer.flujo_cierre

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        Vista previa (cómo lo ve el lead)
      </p>
      <p className="text-sm font-semibold text-white">{offer.nombre || 'Sin nombre'}</p>
      <p className="whitespace-pre-line text-sm text-zinc-300">
        {offer.resumen || 'Sin resumen.'}
      </p>
      <p className="text-sm text-violet-300">
        {offer.precio || '—'}
        {isUsd && (
          <span className="ml-1 text-xs text-zinc-500">
            (referencia; el equipo confirma el monto en Bs)
          </span>
        )}
      </p>
      {offer.detalle && (
        <p className="whitespace-pre-line text-xs text-zinc-400">{offer.detalle}</p>
      )}
      {offer.materialName && (
        <p className="flex items-center gap-1.5 text-xs text-zinc-400">
          <FileText className="size-3.5 text-zinc-500" />
          Envía: {offer.materialName}
        </p>
      )}
      <p className="text-xs text-zinc-500">Cierre: {closing}</p>
    </div>
  )
}

export type { PreviewOffer }
