'use client'

import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { ContactCreateSheet } from '@/components/crm/contacts/contact-create'
import { ContactDetail } from '@/components/crm/contacts/contact-detail'
import { ContactsTable } from '@/components/crm/contacts/contacts-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContacts } from '@/hooks/use-contacts'
import type { ContactRead } from '@/lib/api/contacts'

export function ContactsScreen() {
  const { data: contacts, isLoading, isError } = useContacts()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const list = contacts ?? []

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return list
    return list.filter(
      (contact) =>
        contact.phone.toLowerCase().includes(term) ||
        (contact.full_name ?? '').toLowerCase().includes(term),
    )
  }, [list, query])

  // Keep selection valid if the contact was deleted or filtered out.
  const selected = selectedId ? (list.find((c) => c.id === selectedId) ?? null) : null

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Contactos</h1>
          <p className="text-sm text-zinc-500">
            {list.length} contactos · se crean al ganar una oportunidad.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-gradient-to-b from-violet-500 to-violet-700 text-white"
        >
          <Plus className="size-4" /> Nuevo contacto
        </Button>
      </div>

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nombre o teléfono…"
        className="max-w-sm border-white/10 bg-white/[0.03] text-white"
      />

      {isLoading && <p className="text-sm text-zinc-500">Cargando contactos…</p>}
      {isError && <p className="text-sm text-zinc-500">No se pudieron cargar los contactos.</p>}
      {!isLoading && !isError && list.length === 0 && (
        <p className="text-sm text-zinc-500">
          Todavía no hay contactos. Se crean al ganar una oportunidad.
        </p>
      )}
      {!isLoading && !isError && list.length > 0 && filtered.length === 0 && (
        <p className="text-sm text-zinc-500">Sin resultados para “{query}”.</p>
      )}

      {filtered.length > 0 && (
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <ContactsTable
              contacts={filtered}
              selectedId={selected?.id ?? null}
              onSelect={(contact: ContactRead) => setSelectedId(contact.id)}
            />
          </div>
          {selected && (
            <ContactDetail contact={selected} onClose={() => setSelectedId(null)} />
          )}
        </div>
      )}

      <ContactCreateSheet open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
