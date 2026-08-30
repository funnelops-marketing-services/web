'use client'

import {
  BadgeDollarSign,
  CalendarOff,
  Clock,
  Layers,
  Link2Off,
  PackageX,
  ReceiptText,
  ScanEye,
  TriangleAlert,
  UserPen,
  Users,
  type LucideIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface FlagConfig {
  /** Texto visible del pill: corto, para que dos o tres avisos entren en una card. */
  label: string
  /** Qué pasó y qué hacer, en el tooltip. */
  hint: string
  icon: LucideIcon
}

// Avisos operativos de la entrega automática (server#270). El backend manda códigos y
// el copy en español vive acá: agregar un aviso nuevo no toca la DB.
const FLAGS: Record<string, FlagConfig> = {
  needs_name: {
    label: 'Falta el nombre',
    hint: 'Se entregó, pero falta el nombre del lead para poder cerrar la oportunidad.',
    icon: UserPen,
  },
  delivery_pending: {
    label: 'Entrega pendiente',
    hint: 'La ventana de 24 h de WhatsApp está cerrada: la entrega se reintenta cuando el lead vuelva a escribir.',
    icon: Clock,
  },
  extra_receipt: {
    label: 'Comprobante extra',
    hint: 'Llegó otro comprobante con el pago ya procesado: revisá si hubo un pago doble.',
    icon: ReceiptText,
  },
  no_modality: {
    label: 'Sin modalidad',
    hint: 'El servicio no tiene modalidad cargada, así que no se sabe qué entregar.',
    icon: PackageX,
  },
  missing_link: {
    label: 'Falta un link',
    hint: 'Falta un link de entrega (por ejemplo, un curso virtual sin grupo ni reunión).',
    icon: Link2Off,
  },
  ambiguous_service: {
    label: 'Más de un servicio',
    hint: 'La oportunidad tiene más de un servicio aceptado: revisá cuál corresponde entregar.',
    icon: Layers,
  },
  // Validación del comprobante por visión (server#272).
  receipt_review: {
    label: 'Revisar comprobante',
    hint: 'El comprobante que mandó el lead no pasó las verificaciones automáticas: mirá el panel del comprobante en la card y decidí.',
    icon: ScanEye,
  },
  payment_unconfirmed: {
    label: 'Pago por confirmar',
    hint: 'El pago se aprobó solo y todavía falta confirmarlo contra el banco.',
    icon: BadgeDollarSign,
  },
  // Eventos y cupo (server#276 / server#290). El lead ya recibió la confirmación del pago;
  // lo que falta es la fecha a la que da acceso la entrada.
  no_event: {
    label: 'Sin evento en Agenda',
    hint: 'El servicio es presencial o híbrido pero no tiene ninguna fecha próxima cargada en Agenda. Creá el evento y la entrada sale sola.',
    icon: CalendarOff,
  },
  capacity_full: {
    label: 'Cupo lleno',
    hint: 'El evento llegó a su cupo, así que no se emitió la entrada. Ampliá el cupo o cargá otra fecha en Agenda y la entrega se reintenta sola.',
    icon: Users,
  },
}

/** Un código que el front todavía no conoce (backend más nuevo) se muestra crudo en vez
 *  de desaparecer: es un aviso real y esconderlo es peor que mostrarlo sin traducir. */
function flagConfig(code: string): FlagConfig {
  return (
    FLAGS[code] ?? {
      label: code,
      hint: 'Aviso nuevo del sistema: revisá la oportunidad a mano.',
      icon: TriangleAlert,
    }
  )
}

const PILL =
  'inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 font-medium text-amber-400'

function FlagPill({ code, size }: { code: string; size: 'sm' | 'md' }) {
  const { label, hint, icon: Icon } = flagConfig(code)
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            PILL,
            size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
          )}
        >
          <Icon className="size-3 shrink-0" />
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-64">{hint}</TooltipContent>
    </Tooltip>
  )
}

/** Avisos de la card (`flags`, server#270): qué quedó a medias en la entrega automática.
 *  Devuelve los pills sueltos — el contenedor (y su wrap) lo pone quien los usa, así la
 *  card angosta y la fila del detalle los acomodan distinto sin romperse. */
export function FlagBadges({
  flags,
  size = 'sm',
}: {
  flags: string[]
  size?: 'sm' | 'md'
}) {
  return (
    <>
      {flags.map((code, idx) => (
        <FlagPill key={`${code}-${idx}`} code={code} size={size} />
      ))}
    </>
  )
}
