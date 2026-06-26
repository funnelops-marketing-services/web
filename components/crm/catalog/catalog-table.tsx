'use client'

import { useState } from 'react'
import { FileText, FileWarning, GripVertical, Pencil, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/components/crm/catalog/labels'
import { useDeleteOffer, useUpdateOffer } from '@/hooks/use-catalogo'
import type { OfferCategory, OfferRead } from '@/lib/api/catalogo'

interface CatalogTableProps {
  agentId: string
  offers: OfferRead[]
  onEdit: (offer: OfferRead) => void
}

export function CatalogTable({ agentId, offers, onEdit }: CatalogTableProps) {
  const update = useUpdateOffer(agentId)
  const remove = useDeleteOffer(agentId)
  const [dragId, setDragId] = useState<string | null>(null)

  function reorder(group: OfferRead[], fromId: string, toId: string) {
    if (fromId === toId) return
    const ids = group.map((o) => o.id)
    const next = [...ids]
    next.splice(next.indexOf(fromId), 1)
    next.splice(next.indexOf(toId), 0, fromId)
    // Reasigna los slots de `orden` ya existentes del grupo a la nueva secuencia.
    const slots = group.map((o) => o.orden).sort((a, b) => a - b)
    next.forEach((id, i) => {
      const offer = group.find((o) => o.id === id)
      if (offer && offer.orden !== slots[i]) {
        update.mutate({ offerId: id, body: { orden: slots[i] } })
      }
    })
  }

  return (
    <div className="space-y-8">
      {CATEGORY_ORDER.map((category) => {
        const group = offers
          .filter((o) => o.categoria === category)
          .sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre))
        if (group.length === 0) return null
        return (
          <section key={category} className="space-y-2">
            <h2 className="text-sm font-semibold text-zinc-300">
              {CATEGORY_LABELS[category as OfferCategory] ?? category}
            </h2>
            <div className="rounded-xl border border-white/5 bg-white/[0.02]">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-8" />
                    <TableHead className="text-zinc-400">Oferta</TableHead>
                    <TableHead className="text-zinc-400">Precio</TableHead>
                    <TableHead className="text-zinc-400">PDF</TableHead>
                    <TableHead className="text-zinc-400">Activa</TableHead>
                    <TableHead className="text-right text-zinc-400">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.map((offer) => (
                    <TableRow
                      key={offer.id}
                      draggable
                      onDragStart={() => setDragId(offer.id)}
                      onDragEnd={() => setDragId(null)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => dragId && reorder(group, dragId, offer.id)}
                      className={cn(
                        'border-white/5 hover:bg-white/[0.02]',
                        dragId === offer.id && 'opacity-50',
                        !offer.is_active && 'opacity-50',
                      )}
                    >
                      <TableCell className="cursor-grab text-zinc-600">
                        <GripVertical className="size-4" />
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-white">{offer.nombre}</p>
                        <p className="line-clamp-1 text-xs text-zinc-500">{offer.resumen}</p>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-300">{offer.precio}</TableCell>
                      <TableCell>
                        {offer.asset ? (
                          <span className="flex items-center gap-1 text-xs text-zinc-400">
                            <FileText className="size-3.5 text-emerald-400/70" /> PDF
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-zinc-600">
                            <FileWarning className="size-3.5" /> falta
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={offer.is_active}
                          onCheckedChange={(checked) =>
                            update.mutate({ offerId: offer.id, body: { is_active: checked } })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar"
                          onClick={() => onEdit(offer)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Desactivar"
                          disabled={!offer.is_active}
                          onClick={() => remove.mutate(offer.id)}
                          className="text-zinc-400 hover:text-red-400"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        )
      })}
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
        Arrastrá ⠿ para reordenar dentro de cada categoría
      </Badge>
    </div>
  )
}
