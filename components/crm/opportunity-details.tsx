'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Phone, UserCheck, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCard, cardKeys } from '@/hooks/use-card'
import { useBoard } from '@/hooks/use-board'
import type { Boards } from '@/lib/api/crm'
import { OpportunityHistory } from '@/components/crm/opportunity-history'
import { OpportunityEditForm } from '@/components/crm/opportunity-edit-form'
import { OpportunityDeleteDialog } from '@/components/crm/opportunity-delete-dialog'
import { ContactCreateSheet } from '@/components/crm/contacts/contact-create'
import { RatingBadge } from '@/components/crm/rating-badge'

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

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="mb-3 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
      {children}
    </h3>
  )
}

/** Columna izquierda del popup: datos + notas + historial, con edición (nombre/notas)
 *  y baja (doble confirmación) de la oportunidad (#54). */
export function OpportunityDetails({
  cardId,
  onDeleted,
}: {
  cardId: string | null
  onDeleted: () => void
}) {
  const { data: card, isLoading, isError } = useCard(cardId)
  const { data: boards } = useBoard()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [contactSheetOpen, setContactSheetOpen] = useState(false)

  if (!cardId) return null
  if (isLoading) return <StateMessage text="Cargando oportunidad…" />
  if (isError || !card) return <StateMessage text="No se pudo cargar la oportunidad" />

  const location = locateStage(boards, card.stage_id)

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-base font-bold text-white">
          {card.title.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-white">{card.title}</p>
          {card.phone && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-normal text-zinc-500">
              <Phone className="size-3 flex-shrink-0" />
              {card.phone}
            </p>
          )}
          {card.phone &&
            (card.contact ? (
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                <UserCheck className="size-3 flex-shrink-0" />
                Ya es contacto
                {card.contact.full_name ? ` · ${card.contact.full_name}` : ''}
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setContactSheetOpen(true)}
                className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300"
              >
                <UserPlus className="size-3 flex-shrink-0" />
                Convertir en contacto
              </button>
            ))}
        </div>
        {!editing && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Editar oportunidad"
            onClick={() => setEditing(true)}
            className="size-8 flex-shrink-0 rounded-lg text-zinc-500 hover:bg-white/5 hover:text-white"
          >
            <Pencil className="size-4" />
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <RatingBadge rating={card.rating} showLabel className="px-2.5 py-0.5 text-xs" />
        {location && (
          <>
            <Badge>{location.pipelineName}</Badge>
            <Badge>{location.stageName}</Badge>
          </>
        )}
      </div>

      {editing ? (
        <div className="mt-5 border-t border-white/5 pt-5">
          <OpportunityEditForm
            cardId={card.id}
            initialName={card.full_name ?? ''}
            initialNotes={card.notes ?? ''}
            onDone={() => setEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="mt-5 border-t border-white/5 pt-5">
            <SectionTitle>Resumen IA</SectionTitle>
            {card.ai_summary ? (
              <p className="text-sm font-normal whitespace-pre-wrap text-zinc-300">
                {card.ai_summary}
              </p>
            ) : (
              <p className="text-sm font-normal text-zinc-600">
                Sin resumen todavía. Se genera a medida que el lead avanza.
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-white/5 pt-5">
            <SectionTitle>Notas</SectionTitle>
            {card.notes ? (
              <p className="text-sm font-normal whitespace-pre-wrap text-zinc-300">{card.notes}</p>
            ) : (
              <p className="text-sm font-normal text-zinc-600">Sin notas todavía.</p>
            )}
          </div>

          <div className="mt-5 border-t border-white/5 pt-5">
            <SectionTitle>Historial de movimientos</SectionTitle>
            <OpportunityHistory moves={card.moves} />
          </div>

          <div className="mt-auto border-t border-white/5 pt-4">
            <OpportunityDeleteDialog
              cardId={card.id}
              cardTitle={card.title}
              onDeleted={onDeleted}
            />
          </div>
        </>
      )}

      <ContactCreateSheet
        open={contactSheetOpen}
        onOpenChange={setContactSheetOpen}
        defaultPhone={card.phone}
        onCreated={() =>
          queryClient.invalidateQueries({ queryKey: cardKeys.detail(card.id) })
        }
      />
    </div>
  )
}
