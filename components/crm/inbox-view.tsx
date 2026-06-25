'use client'

import { useMemo, useState } from 'react'
import { Flame, MessageSquare, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useBoard } from '@/hooks/use-board'
import { ConversationPanel } from '@/components/crm/conversation-panel'
import type { Boards } from '@/lib/api/crm'

interface Row {
  cardId: string
  title: string
  stageName: string
  handedOff: boolean
}

/** Aplana los pipelines del board a una lista de conversaciones. El "derivado" se
 *  deduce del pipeline humano (mismo criterio que el badge del tablero). */
function toRows(boards: Boards | undefined): Row[] {
  if (!boards) return []
  const rows: Row[] = []
  for (const pipeline of boards.pipelines) {
    const handedOff = pipeline.kind === 'human'
    for (const stage of pipeline.stages) {
      for (const card of stage.cards) {
        rows.push({ cardId: card.id, title: card.title, stageName: stage.name, handedOff })
      }
    }
  }
  // Derivados (necesitan atención) primero, luego por título.
  return rows.sort((a, b) => {
    if (a.handedOff !== b.handedOff) return a.handedOff ? -1 : 1
    return a.title.localeCompare(b.title)
  })
}

function ListMessage({ text }: { text: string }) {
  return <p className="px-4 py-8 text-center text-sm font-normal text-zinc-500">{text}</p>
}

/** Inbox mínimo (SPEC_UAT_remediation Lote 4): lista buscable de conversaciones que
 *  abre el hilo + toggle IA en el panel reutilizado. Resuelve C1-C4 / E1-E3. */
export function InboxView() {
  const { data, isLoading, isError } = useBoard()
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const rows = useMemo(() => toRows(data), [data])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? rows.filter((r) => r.title.toLowerCase().includes(q)) : rows
  }, [rows, query])

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex w-full flex-col overflow-hidden lg:w-[55%]">
        <div className="border-b border-white/5 p-4">
          <h2 className="mb-3 text-xl font-bold text-white">Conversaciones</h2>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-600" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o número…"
              className="h-10 rounded-full border-white/10 bg-white/[0.03] pl-9 text-sm font-normal text-white placeholder:text-zinc-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl bg-white/[0.03]" />
              ))}
            </div>
          ) : isError ? (
            <ListMessage text="No se pudieron cargar las conversaciones. Reintentá en unos segundos." />
          ) : filtered.length === 0 ? (
            <ListMessage text={query ? 'Sin resultados para tu búsqueda.' : 'Todavía no hay conversaciones.'} />
          ) : (
            <ul className="p-2">
              {filtered.map((row) => {
                const active = row.cardId === selectedCardId
                return (
                  <li key={row.cardId}>
                    <button
                      type="button"
                      onClick={() => setSelectedCardId(row.cardId)}
                      aria-current={active ? 'true' : undefined}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors',
                        active
                          ? 'border-violet-500/30 bg-violet-500/15'
                          : 'border-transparent hover:bg-white/[0.04]',
                      )}
                    >
                      <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
                        {row.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">{row.title}</p>
                        <p className="truncate text-xs font-normal text-zinc-500">{row.stageName}</p>
                      </div>
                      {row.handedOff && (
                        <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-xs font-medium text-fuchsia-300">
                          <Flame className="size-3" />
                          Derivado
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="hidden w-[45%] flex-col border-l border-white/5 bg-zinc-950/40 lg:flex">
        {selectedCardId ? (
          <ConversationPanel
            key={selectedCardId}
            cardId={selectedCardId}
            onClose={() => setSelectedCardId(null)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="px-6 text-center">
              <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03]">
                <MessageSquare className="size-6 text-zinc-700" />
              </div>
              <p className="text-sm font-normal text-zinc-500">
                Elegí una conversación para ver el hilo
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
