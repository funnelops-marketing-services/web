'use client'

import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useBoard } from '@/hooks/use-board'
import { useMoveCard } from '@/hooks/use-card-mutations'
import { PipelineBoard } from '@/components/crm/pipeline-board'
import { ConversationPanel } from '@/components/crm/conversation-panel'

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

/** Tablero CRM real: tabs por pipeline (IA + Gestión Humana) + panel del hilo. */
export function CrmBoard() {
  const { data, isLoading, isError } = useBoard()
  const moveCard = useMoveCard()
  const [activePipelineId, setActivePipelineId] = useState<string | null>(null)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const pipelines = useMemo(
    () => [...(data?.pipelines ?? [])].sort((a, b) => a.position - b.position),
    [data],
  )
  const activeId = activePipelineId ?? pipelines[0]?.id ?? ''

  const handleMove = (cardId: string, stageId: string) =>
    moveCard.mutate({ cardId, stageId })

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex w-full flex-col overflow-hidden p-6 lg:w-[70%]">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">Oportunidades activas</h2>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">
            Arrastrá las tarjetas entre columnas para actualizar el estado.
          </p>
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
                const count = pipeline.stages.reduce((n, s) => n + s.cards.length, 0)
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
                <PipelineBoard
                  pipeline={pipeline}
                  selectedCardId={selectedCardId}
                  onSelectCard={setSelectedCardId}
                  onMoveCard={handleMove}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      {selectedCardId && (
        <div className="hidden w-[30%] flex-col border-l border-white/5 bg-zinc-950/40 lg:flex">
          <ConversationPanel
            key={selectedCardId}
            cardId={selectedCardId}
            onClose={() => setSelectedCardId(null)}
          />
        </div>
      )}
    </div>
  )
}
