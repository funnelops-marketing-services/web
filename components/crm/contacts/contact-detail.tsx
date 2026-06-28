'use client'

import { useState } from 'react'
import { Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDeleteContact, useUpdateContact } from '@/hooks/use-contacts'
import type { ContactRead } from '@/lib/api/contacts'

interface ContactDetailProps {
  contact: ContactRead
  onClose: () => void
}

export function ContactDetail({ contact, onClose }: ContactDetailProps) {
  const update = useUpdateContact()
  const remove = useDeleteContact()
  const [name, setName] = useState(contact.full_name ?? '')

  const dirty = (contact.full_name ?? '') !== name

  function save() {
    update.mutate({ contactId: contact.id, body: { full_name: name.trim() || null } })
  }

  function onDelete() {
    remove.mutate(contact.id, { onSuccess: onClose })
  }

  return (
    <aside className="w-full space-y-5 rounded-xl border border-white/5 bg-white/[0.02] p-5 lg:max-w-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-300">Ficha del contacto</h2>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Cerrar"
          onClick={onClose}
          className="text-zinc-400 hover:text-white"
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-name" className="text-xs text-zinc-500">
          Nombre
        </label>
        <Input
          id="contact-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Sin nombre"
          className="border-white/10 bg-white/[0.03] text-white"
        />
      </div>

      <div className="space-y-1">
        <p className="text-xs text-zinc-500">Teléfono</p>
        <p className="text-sm text-white">{contact.phone}</p>
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <Button
          onClick={save}
          disabled={!dirty || update.isPending}
          className="bg-gradient-to-b from-violet-500 to-violet-700 text-white"
        >
          {update.isPending ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button
          variant="ghost"
          onClick={onDelete}
          disabled={remove.isPending}
          className="gap-2 text-zinc-400 hover:text-red-400"
        >
          <Trash2 className="size-4" /> Eliminar
        </Button>
      </div>
    </aside>
  )
}
