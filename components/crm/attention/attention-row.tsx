'use client'

import { Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { formatPhone, formatTicketTime, isUnnamedLead, leadTitle } from '@/lib/format'
import type { AttentionItem } from '@/lib/crm/attention'
import { FlagBadges } from '@/components/crm/flag-badges'

/** Franja de severidad a la izquierda: el estado se lee por forma y color antes que por
 *  texto, así la cola se escanea sin leerla entera. */
function SeverityStripe({ blocking }: { blocking: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute top-0 bottom-0 left-0 w-0.5',
        blocking ? 'bg-rose-500' : 'bg-amber-500/60',
      )}
    />
  )
}

interface AttentionRowProps {
  item: AttentionItem
  onOpenCard: (cardId: string) => void
}

/** Una fila de la cola: quién espera, dónde quedó y por qué. La acción es siempre la
 *  misma — abrir la oportunidad, que es donde están el comprobante y los botones. */
export function AttentionRow({ item, onOpenCard }: AttentionRowProps) {
  const { card, pipelineName, stageName, reasons, severity } = item
  const blocking = severity === 'blocking'
  const unnamed = isUnnamedLead(card.title, card.phone)

  return (
    <TableRow className="relative border-white/5 hover:bg-white/[0.02]">
      <TableCell className="relative py-3">
        <SeverityStripe blocking={blocking} />
        <div className="pl-2">
          <p className="truncate text-sm font-semibold text-white">
            {leadTitle(card.title, card.phone)}
          </p>
          {card.phone && !unnamed && (
            <p className="truncate text-xs text-zinc-500">{formatPhone(card.phone)}</p>
          )}
        </div>
      </TableCell>
      <TableCell className="py-3">
        <div className="flex flex-wrap items-center gap-1">
          <FlagBadges flags={reasons} />
        </div>
      </TableCell>
      <TableCell className="py-3 text-sm whitespace-nowrap text-zinc-400">
        {stageName}
        <span className="block text-xs text-zinc-600">{pipelineName}</span>
      </TableCell>
      <TableCell className="py-3 text-sm whitespace-nowrap text-zinc-500 tabular-nums">
        {formatTicketTime(card.created_at)}
      </TableCell>
      <TableCell className="py-3 text-right">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label={`Abrir la oportunidad de ${leadTitle(card.title, card.phone)}`}
              onClick={() => onOpenCard(card.id)}
              className="gap-1.5 border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/10 hover:text-white"
            >
              <Eye className="size-3.5" />
              Abrir
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ver la oportunidad, su comprobante y el hilo</TooltipContent>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
