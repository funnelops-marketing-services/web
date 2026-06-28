'use client'

import { useState } from 'react'
import { Plus, UploadCloud } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { CatalogTable } from '@/components/crm/catalog/catalog-table'
import { CategoryManager } from '@/components/crm/catalog/category-manager'
import { ServiceEditor } from '@/components/crm/catalog/service-editor'
import { useServices, usePublishCatalog } from '@/hooks/use-catalogo'
import type { ServiceRead } from '@/lib/api/catalogo'

export function CatalogScreen({ agentId }: { agentId: string }) {
  const { data: services, isLoading, isError } = useServices(agentId)
  const publish = usePublishCatalog(agentId)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<ServiceRead | null>(null)

  const list = services ?? []
  const nextOrden = list.reduce((max, o) => Math.max(max, o.orden), -1) + 1

  function openNew() {
    setEditing(null)
    setEditorOpen(true)
  }

  function openEdit(service: ServiceRead) {
    setEditing(service)
    setEditorOpen(true)
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Catálogo</h1>
          <p className="text-sm text-zinc-500">
            {list.length} servicios · el bot los resume y manda el PDF al elegir.
          </p>
        </div>
        <div className="flex gap-2">
          <CategoryManager />
          <Button
            variant="outline"
            onClick={openNew}
            className="gap-2 border-white/10 bg-white/[0.03] text-white"
          >
            <Plus className="size-4" /> Nuevo servicio
          </Button>
          <Button
            onClick={() => publish.mutate()}
            disabled={publish.isPending || list.length === 0}
            className="gap-2 bg-gradient-to-b from-violet-500 to-violet-700 text-white"
          >
            <UploadCloud className="size-4" />
            {publish.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </div>
      </div>

      <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-200/80">
        Publicar aplica el catálogo activo al agente (versionado, reversible). El bot lo
        consumirá en Fase 2 — no publiques en producción hasta entonces.
      </p>

      {isLoading && <p className="text-sm text-zinc-500">Cargando catálogo…</p>}
      {isError && <p className="text-sm text-zinc-500">No se pudo cargar el catálogo.</p>}
      {!isLoading && !isError && list.length === 0 && (
        <p className="text-sm text-zinc-500">Todavía no hay servicios. Creá la primera.</p>
      )}
      {list.length > 0 && <CatalogTable agentId={agentId} services={list} onEdit={openEdit} />}

      {editorOpen && (
        <ServiceEditor
          key={editing?.id ?? 'new'}
          agentId={agentId}
          service={editing}
          defaultOrden={nextOrden}
          open={editorOpen}
          onOpenChange={setEditorOpen}
        />
      )}
    </div>
  )
}
