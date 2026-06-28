'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { ContactRead } from '@/lib/api/contacts'

interface ContactsTableProps {
  contacts: ContactRead[]
  selectedId: string | null
  onSelect: (contact: ContactRead) => void
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function ContactsTable({ contacts, selectedId, onSelect }: ContactsTableProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02]">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-zinc-400">Nombre</TableHead>
            <TableHead className="text-zinc-400">Teléfono</TableHead>
            <TableHead className="text-zinc-400">Alta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              onClick={() => onSelect(contact)}
              className={cn(
                'cursor-pointer border-white/5 hover:bg-white/[0.02]',
                selectedId === contact.id && 'bg-white/[0.04]',
              )}
            >
              <TableCell className="text-sm font-medium text-white">
                {contact.full_name ?? <span className="text-zinc-500">Sin nombre</span>}
              </TableCell>
              <TableCell className="text-sm text-zinc-300">{contact.phone}</TableCell>
              <TableCell className="text-sm text-zinc-500">
                {formatDate(contact.created_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
