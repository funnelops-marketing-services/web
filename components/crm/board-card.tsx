'use client'

import { BotOff, GripVertical, MessageSquare } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Card } from '@/lib/api/crm'
import { RatingBadge } from '@/components/crm/rating-badge'
import { AlertBadge } from '@/components/crm/alert-badge'

interface BoardCardProps {
  card: Card
  selected: boolean
  dragging: boolean
  onSelect: (cardId: string) => void
  onDragStart: (cardId: string) => void
  onDragEnd: () => void
}

/** Tarjeta de lead arrastrable; click abre el detalle. */
export function BoardCard({
  card,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
}: BoardCardProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(card.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(card.id)}
      className={cn(
        'group cursor-pointer rounded-xl border bg-zinc-950/80 p-3.5 transition-all',
        selected
          ? 'border-violet-500/60 bg-violet-950/20 shadow-[0_0_25px_-10px_rgba(139,92,246,0.6)]'
          : card.awaiting_human
            ? // Sin responder: anillo rosa para que salte a la vista aunque no esté seleccionada.
              'border-rose-500/50 bg-rose-950/10 hover:border-rose-500/70'
            : 'border-white/5 hover:border-violet-500/30 hover:bg-white/[0.03]',
        dragging && 'opacity-50',
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 size-3.5 cursor-grab text-zinc-700 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-start justify-between gap-2">
            <p className="truncate text-sm font-bold text-white">{card.title}</p>
            <div className="flex flex-shrink-0 items-center gap-1">
              {/* IA apagada (takeover): la card la atiende un humano, no el agente. */}
              {!card.is_ai_active && (
                <span
                  className="inline-flex items-center rounded-full border border-zinc-600/40 bg-zinc-500/10 p-0.5 text-zinc-400"
                  title="Agente IA apagado — atendés vos"
                >
                  <BotOff className="size-3 flex-shrink-0" />
                </span>
              )}
              <AlertBadge alert={card.alert} />
              <RatingBadge rating={card.rating} />
            </div>
          </div>
          {card.phone && card.phone !== card.title && (
            <p className="mb-1.5 truncate text-xs font-normal text-zinc-500">{card.phone}</p>
          )}
          {card.awaiting_human ? (
            // Señal fuerte: hay un mensaje del lead sin responder y la IA está apagada.
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-500/70" />
                <span className="relative inline-flex size-2 rounded-full bg-rose-500" />
              </span>
              <span>Sin responder · te esperan</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
              <MessageSquare className="size-2.5" />
              <span className="font-normal">Ver conversación</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
