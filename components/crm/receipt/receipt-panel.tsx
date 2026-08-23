'use client'

import { CircleCheck, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatTicketTime } from '@/lib/format'
import { receiptPassed, type Receipt } from '@/lib/api/receipt'
import { useReceipt } from '@/hooks/use-receipt'
import { SectionTitle } from '@/components/crm/section-title'
import { ReceiptActions } from '@/components/crm/receipt/receipt-actions'
import { ReceiptChecks } from '@/components/crm/receipt/receipt-checks'
import { ReceiptExtracted } from '@/components/crm/receipt/receipt-extracted'
import { ReceiptImage } from '@/components/crm/receipt/receipt-image'

function VerdictBadge({ passed }: { passed: boolean }) {
  const Icon = passed ? CircleCheck : TriangleAlert
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
        passed
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-300',
      )}
    >
      <Icon className="size-3 shrink-0" />
      {passed ? 'Las verificaciones cerraron' : 'Necesita tu revisión'}
    </span>
  )
}

function VerdictHint({ passed }: { passed: boolean }) {
  return (
    <p className="text-xs font-normal text-zinc-400">
      {passed
        ? 'El monto, el destinatario y la fecha coinciden con lo esperado: podés validar el pago con un click y la entrega sale sola.'
        : 'El sistema no lo aprobó solo. Mirá abajo qué no cerró y, si igual corresponde cobrarlo, validalo dejando escrito por qué.'}
    </p>
  )
}

function HumanNote({ note }: { note: string }) {
  return (
    <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.07] px-2.5 py-2">
      <p className="text-[11px] font-medium text-violet-300">Validado a mano. Motivo:</p>
      <p className="text-xs font-normal whitespace-pre-wrap text-zinc-300">{note}</p>
    </div>
  )
}

function ReceiptBody({ receipt }: { receipt: Receipt }) {
  const passed = receiptPassed(receipt)
  const okCount = receipt.checks.filter((check) => check.passed).length

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <VerdictBadge passed={passed} />
        <span className="text-[11px] font-normal text-zinc-500">
          Recibido {formatTicketTime(receipt.created_at)}
        </span>
      </div>

      <VerdictHint passed={passed} />

      <div className="grid gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
        <ReceiptImage url={receipt.image_url} />
        <ReceiptExtracted extracted={receipt.extracted} />
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <p className="mb-2 text-[11px] font-medium text-zinc-400">
          Verificaciones ({okCount} de {receipt.checks.length} pasaron)
        </p>
        <ReceiptChecks checks={receipt.checks} />
      </div>

      {receipt.human_note && <HumanNote note={receipt.human_note} />}

      <ReceiptActions cardId={receipt.card_id} passed={passed} />
    </div>
  )
}

/** Panel del comprobante de pago en el detalle de la card (web#182 / server#272): la
 *  imagen, lo que el sistema leyó y el semáforo de verificaciones, para decidir sin
 *  descifrar la foto ni hacer cuentas.
 *
 *  No se renderiza nada si el lead no mandó comprobante (el endpoint devuelve `null`):
 *  una sección vacía sería ruido en cada card que nunca llegó a pagar. */
export function ReceiptPanel({ cardId }: { cardId: string }) {
  const { data: receipt } = useReceipt(cardId)
  if (!receipt) return null

  return (
    <div className="mt-5 border-t border-white/5 pt-5">
      <SectionTitle>Comprobante de pago</SectionTitle>
      <ReceiptBody receipt={receipt} />
    </div>
  )
}
