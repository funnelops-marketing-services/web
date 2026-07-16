'use client'

import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useExportContacts } from '@/hooks/use-contacts'
import { usePermissions } from '@/hooks/use-permissions'

/** Export CSV de leads (#113): todos o solo fríos (recontacto manual). Oculto para
 * staff — extracción masiva de datos; el endpoint igual responde 403 (server#176). */
export function ContactsExportMenu() {
  const { canExportContacts } = usePermissions()
  const exportMutation = useExportContacts()

  if (!canExportContacts) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={exportMutation.isPending}
          className="gap-2 border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
        >
          <Download className="size-4" />
          {exportMutation.isPending ? 'Exportando…' : 'Exportar'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-white/10 bg-zinc-950 text-zinc-200">
        <DropdownMenuItem onSelect={() => exportMutation.mutate(undefined)}>
          Todos los leads
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => exportMutation.mutate('cold')}>
          Solo leads fríos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
