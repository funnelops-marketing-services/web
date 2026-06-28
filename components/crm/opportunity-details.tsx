'use client'

import { Phone } from 'lucide-react'

import { useCard } from '@/hooks/use-card'
import { useBoard } from '@/hooks/use-board'
import type { Boards } from '@/lib/api/crm'
import { OpportunityHistory } from '@/components/crm/opportunity-history'

function StateMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <p className="text-sm font-normal text-zinc-500">{text}</p>
    </div>
  )
}

/** Pipeline + stage donde vive la card, resueltos del board por `stage_id`. */
function locateStage(boards: Boards | undefined, stageId: string) {
  for (const pipeline of boards?.pipelines ?? []) {
    const stage = pipeline.stages.find((s) => s.id === stageId)
    if (stage) return { pipelineName: pipeline.name, stageName: stage.name }
  }
  return null
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
      {children}
    </span>
  )
}

/** Columna izquierda del popup: datos de la oportunidad + historial de movimientos. */
export function OpportunityDetails({ cardId }: { cardId: string | null }) {
  const { data: card, isLoading, isError } = useCard(cardId)
  const { data: boards } = useBoard()

  if (!cardId) return null
  if (isLoading) return <StateMessage text="Cargando oportunidad…" />
  if (isError || !card) return <StateMessage text="No se pudo cargar la oportunidad" />

  const location = locateStage(boards, card.stage_id)

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <div className="flex items-center gap-3">
        <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-bold text-white">
          {card.title.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">{card.title}</p>
          {card.phone && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-zinc-500">
              <Phone className="size-3 flex-shrink-0" />
              {card.phone}
            </p>
          )}
        </div>
      </div>

      {location && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>{location.pipelineName}</Badge>
          <Badge>{location.stageName}</Badge>
        </div>
      )}

      <div className="mt-6 mb-3 border-t border-white/5 pt-5">
        <h3 className="mb-4 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          Historial de movimientos
        </h3>
        <OpportunityHistory moves={card.moves} />
      </div>
    </div>
  )
}
