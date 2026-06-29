'use client'

import { GripVertical, MessageSquare } from 'lucide-react'

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
              <AlertBadge alert={card.alert} />
              <RatingBadge rating={card.rating} />
            </div>
          </div>
          {card.phone && card.phone !== card.title && (
            <p className="mb-1.5 truncate text-xs font-normal text-zinc-500">{card.phone}</p>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
            <MessageSquare className="size-2.5" />
            <span className="font-normal">Ver conversación</span>
          </div>
        </div>
      </div>
    </div>
  )
}
