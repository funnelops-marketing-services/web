'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { digitsOnly } from '@/lib/validation/fields'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useBoard } from '@/hooks/use-board'
import { useMoveCard } from '@/hooks/use-card-mutations'
import { PipelineBoard } from '@/components/crm/pipeline-board'
import { CardDetailDialog } from '@/components/crm/card-detail-dialog'
import type { Card, Pipeline } from '@/lib/api/crm'

function BoardSkeleton() {
  return (
    <div className="grid flex-1 grid-cols-3 gap-4 p-6">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-full w-full rounded-2xl bg-white/[0.03]" />
      ))}
    </div>
  )
}

function CenteredMessage({ text }: { text: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <p className="text-sm font-normal text-zinc-500">{text}</p>
    </div>
  )
}

/** Una card matchea si el texto está en el nombre (title) o los dígitos en el teléfono
 *  (coincidencia parcial: tolera el prefijo de país del número guardado). */
function cardMatches(card: Card, q: string, qDigits: string): boolean {
  if (card.title.toLowerCase().includes(q)) return true
  return qDigits.length > 0 && digitsOnly(card.phone).includes(qDigits)
}

/** Pipeline con las cards de cada stage filtradas por la búsqueda. */
function filterPipeline(pipeline: Pipeline, q: string, qDigits: string): Pipeline {
  return {
    ...pipeline,
    stages: pipeline.stages.map((stage) => ({
      ...stage,
      cards: stage.cards.filter((card) => cardMatches(card, q, qDigits)),
    })),
  }
}

function cardCount(pipeline: Pipeline): number {
  return pipeline.stages.reduce((n, s) => n + s.cards.length, 0)
}

/** Tablero CRM real: tabs por pipeline (IA + Gestión Humana) + panel del hilo. */
export function CrmBoard() {
  const { data, isLoading, isError } = useBoard()
  const moveCard = useMoveCard()
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const qDigits = digitsOnly(query)
  const pipelines = useMemo(() => {
    const sorted = [...(data?.pipelines ?? [])].sort((a, b) => a.position - b.position)
    return q ? sorted.map((p) => filterPipeline(p, q, qDigits)) : sorted
  }, [data, q, qDigits])
  const activeId = activePipelineId ?? pipelines[0]?.id ?? ''

  const handleMove = (cardId: string, stageId: string) =>
    moveCard.mutate({ cardId, stageId })

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex h-full w-full flex-col overflow-hidden p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Oportunidades activas</h2>
            <p className="mt-0.5 text-xs font-normal text-zinc-500">
              Arrastrá las tarjetas entre columnas para actualizar el estado.
            </p>
          </div>
          <div className="relative w-64 flex-shrink-0">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-600" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o número…"
              className="h-10 rounded-full border-white/10 bg-white/[0.03] pl-9 text-sm font-normal text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        {isLoading ? (
          <BoardSkeleton />
        ) : isError ? (
          <CenteredMessage text="No se pudo cargar el tablero. Reintentá en unos segundos." />
        ) : pipelines.length === 0 ? (
          <CenteredMessage text="Todavía no hay pipelines configurados." />
        ) : (
          <Tabs
            value={activeId}
            onValueChange={setActivePipelineId}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList className="w-fit border border-white/5 bg-white/[0.03]">
              {pipelines.map((pipeline) => {
                const count = cardCount(pipeline)
                // El pipeline humano con leads = derivados sin atender → señal de alerta.
                const alert = pipeline.kind === 'human' && count > 0
                return (
                  <TabsTrigger
                    key={pipeline.id}
                    value={pipeline.id}
                    className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                  >
                    {pipeline.name}
                    {count > 0 && (
                      <span
                        className={cn(
                          'ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold',
                          alert ? 'bg-fuchsia-500 text-white' : 'bg-white/10 text-zinc-400',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {pipelines.map((pipeline) => (
              <TabsContent
                key={pipeline.id}
                value={pipeline.id}
                className="mt-4 min-h-0 flex-1"
              >
                {q && cardCount(pipeline) === 0 ? (
                  <CenteredMessage text="Sin resultados para tu búsqueda." />
                ) : (
                  <PipelineBoard
                    pipeline={pipeline}
                    selectedCardId={selectedCardId}
                    onSelectCard={setSelectedCardId}
                    onMoveCard={handleMove}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <CardDetailDialog
        cardId={selectedCardId}
        onClose={() => setSelectedCardId(null)}
      />
    </div>
  )
}
