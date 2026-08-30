'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { EventDeleteDialog } from '@/components/crm/agenda/event-delete-dialog'
import { EventEditor } from '@/components/crm/agenda/event-editor'
import { EventTable } from '@/components/crm/agenda/event-table'
import { hasPassed } from '@/components/crm/agenda/labels'
import { useEvents } from '@/hooks/use-agenda'
import type { EventRead } from '@/lib/api/agenda'

/** Agenda de eventos (web#189 / server#276).
 *
 *  El backend ya tenía el ABM completo pero no había pantalla: sin un evento cargado,
 *  un servicio presencial no entrega la entrada sola y el selector del escáner queda
 *  vacío. Esto es esa pantalla. */
export function AgendaScreen() {
  const { data: events, isLoading, isError } = useEvents()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<EventRead | null>(null)
  const [deleting, setDeleting] = useState<EventRead | null>(null)

  const list = events ?? []
  const proximos = list.filter((event) => !hasPassed(event)).length

  function openNew() {
    setEditing(null)
    setEditorOpen(true)
  }

  function openEdit(event: EventRead) {
    setEditing(event)
    setEditorOpen(true)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Agenda</h1>
          <p className="text-sm text-zinc-500">
            {proximos} {proximos === 1 ? 'evento próximo' : 'eventos próximos'} de {list.length} en
            total.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={openNew}
          className="gap-2 border-white/10 bg-white/[0.03] text-white"
        >
          <Plus className="size-4" /> Nuevo evento
        </Button>
      </div>

      <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-zinc-400">
        Cada evento es <span className="text-zinc-300">una fecha concreta</span> de un servicio
        presencial o híbrido. El servicio (nombre, precio, modalidad) se carga en{' '}
        <Link href="/catalogo" className="text-violet-300 underline-offset-2 hover:underline">
          Catálogo
        </Link>
        ; acá va la edición: cuándo, dónde y para cuántos. Sin un evento próximo cargado, al
        validarse el pago se le confirma al lead pero la entrada{' '}
        <span className="text-zinc-300">no sale sola</span> y la oportunidad queda con el aviso
        &quot;Sin evento en Agenda&quot;; en cuanto lo cargás acá, esas entradas salen solas. La
        fecha y el lugar viajan en el mensaje que recibe quien compra, y en la puerta el escáner
        rechaza las entradas de otra fecha.
      </p>

      {isLoading && (
        <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-white/[0.04]" />
          ))}
        </div>
      )}

      {isError && (
        <Empty className="border border-dashed border-white/10">
          <EmptyHeader>
            <EmptyTitle className="text-white">No se pudo cargar la agenda</EmptyTitle>
            <EmptyDescription className="text-zinc-500">Reintentá en unos segundos.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {!isLoading && !isError && list.length === 0 && (
        <Empty className="border border-dashed border-white/10">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-white/5 text-zinc-400">
              <CalendarDays />
            </EmptyMedia>
            <EmptyTitle className="text-white">Todavía no hay eventos</EmptyTitle>
            <EmptyDescription className="text-zinc-500">
              Creá el primero con “Nuevo evento”: hasta entonces, los cursos presenciales no
              entregan la entrada solos.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {list.length > 0 && <EventTable events={list} onEdit={openEdit} onDelete={setDeleting} />}

      {editorOpen && (
        <EventEditor
          key={editing?.id ?? 'new'}
          event={editing}
          open={editorOpen}
          onOpenChange={setEditorOpen}
        />
      )}
      <EventDeleteDialog event={deleting} onOpenChange={() => setDeleting(null)} />
    </div>
  )
}
