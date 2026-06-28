'use client'

import { useMemo, useState } from 'react'
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
import { useDeleteService, useUpdateService } from '@/hooks/use-catalogo'
import type { ServiceRead } from '@/lib/api/catalogo'

interface CatalogTableProps {
  agentId: string
  services: ServiceRead[]
  onEdit: (service: ServiceRead) => void
}

const NO_CATEGORY = '__none__'

export function CatalogTable({ agentId, services, onEdit }: CatalogTableProps) {
  const update = useUpdateService(agentId)
  const remove = useDeleteService(agentId)
  const [dragId, setDragId] = useState<string | null>(null)

  // Agrupa por categoría dinámica (#106); los sin categoría van al final.
  const groups = useMemo(() => {
    const map = new Map<string, { label: string; orden: number; items: ServiceRead[] }>()
    for (const service of services) {
      const key = service.category_id ?? NO_CATEGORY
      const existing = map.get(key)
      if (existing) {
        existing.items.push(service)
      } else {
        map.set(key, {
          label: service.category?.nombre ?? 'Sin categoría',
          orden: service.category?.orden ?? Number.MAX_SAFE_INTEGER,
          items: [service],
        })
      }
    }
    for (const group of map.values()) {
      group.items.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre))
    }
    return [...map.entries()]
      .map(([key, value]) => ({ key, ...value }))
      .sort((a, b) => a.orden - b.orden || a.label.localeCompare(b.label))
  }, [services])

  function reorder(group: ServiceRead[], fromId: string, toId: string) {
    if (fromId === toId) return
    const ids = group.map((o) => o.id)
    const next = [...ids]
    next.splice(next.indexOf(fromId), 1)
    next.splice(next.indexOf(toId), 0, fromId)
    // Reasigna los slots de `orden` ya existentes del grupo a la nueva secuencia.
    const slots = group.map((o) => o.orden).sort((a, b) => a - b)
    next.forEach((id, i) => {
      const service = group.find((o) => o.id === id)
      if (service && service.orden !== slots[i]) {
        update.mutate({ serviceId: id, body: { orden: slots[i] } })
      }
    })
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.key} className="space-y-2">
          <h2 className="text-sm font-semibold text-zinc-300">{group.label}</h2>
          <div className="rounded-xl border border-white/5 bg-white/[0.02]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="w-8" />
                  <TableHead className="text-zinc-400">Servicio</TableHead>
                  <TableHead className="text-zinc-400">Precio</TableHead>
                  <TableHead className="text-zinc-400">PDF</TableHead>
                  <TableHead className="text-zinc-400">Activo</TableHead>
                  <TableHead className="text-right text-zinc-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.items.map((service) => (
                  <TableRow
                    key={service.id}
                    draggable
                    onDragStart={() => setDragId(service.id)}
                    onDragEnd={() => setDragId(null)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => dragId && reorder(group.items, dragId, service.id)}
                    className={cn(
                      'border-white/5 hover:bg-white/[0.02]',
                      dragId === service.id && 'opacity-50',
                      !service.is_active && 'opacity-50',
                    )}
                  >
                    <TableCell className="cursor-grab text-zinc-600">
                      <GripVertical className="size-4" />
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-white">{service.nombre}</p>
                      <p className="line-clamp-1 text-xs text-zinc-500">{service.resumen}</p>
                    </TableCell>
                    <TableCell className="text-sm text-zinc-300">{service.precio}</TableCell>
                    <TableCell>
                      {service.asset ? (
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
                        checked={service.is_active}
                        onCheckedChange={(checked) =>
                          update.mutate({ serviceId: service.id, body: { is_active: checked } })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar"
                        onClick={() => onEdit(service)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Eliminar"
                        disabled={!service.is_active}
                        onClick={() => remove.mutate(service.id)}
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
      ))}
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-300">
        Arrastrá ⠿ para reordenar dentro de cada categoría
      </Badge>
    </div>
  )
}
