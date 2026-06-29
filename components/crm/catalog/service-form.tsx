'use client'

import { Controller, type Control } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { ServiceClosing, ServiceCurrency, ServiceRead } from '@/lib/api/catalogo'

export interface FormValues {
  slug: string
  nombre: string
  category_id: string
  resumen: string
  detalle: string
  precio: string
  moneda: ServiceCurrency
  flujo_cierre: ServiceClosing
  is_active: boolean
}

// Límites alineados con la validación server-side (#107).
export const LIMITS = { nombre: 50, slug: 40, resumen: 200, detalle: 300 } as const
const PRECIO_MAX = 100000

export const RULES = {
  slug: {
    required: 'Requerido.',
    maxLength: { value: LIMITS.slug, message: `Máx. ${LIMITS.slug} caracteres.` },
    pattern: {
      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      message: 'Minúsculas, números y guiones (ej. curso-edicion).',
    },
  },
  nombre: {
    required: 'Requerido.',
    maxLength: { value: LIMITS.nombre, message: `Máx. ${LIMITS.nombre} caracteres.` },
  },
  resumen: {
    required: 'Requerido.',
    maxLength: { value: LIMITS.resumen, message: `Máx. ${LIMITS.resumen} caracteres.` },
  },
  detalle: {
    maxLength: { value: LIMITS.detalle, message: `Máx. ${LIMITS.detalle} caracteres.` },
  },
  precio: {
    required: 'Requerido.',
    pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Solo números, hasta 2 decimales.' },
    validate: (v: string) => Number(v) <= PRECIO_MAX || `Máx. ${PRECIO_MAX}.`,
  },
} as const

export function serviceDefaults(service: ServiceRead | null): FormValues {
  return {
    slug: service?.slug ?? '',
    nombre: service?.nombre ?? '',
    category_id: service?.category_id ?? '',
    resumen: service?.resumen ?? '',
    detalle: service?.detalle ?? '',
    precio: service?.precio ?? '',
    moneda: (service?.moneda as ServiceCurrency) ?? 'BOB',
    flujo_cierre: (service?.flujo_cierre as ServiceClosing) ?? 'pago_qr',
    is_active: service?.is_active ?? true,
  }
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[11px] text-rose-400">{message}</p>
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs font-medium text-zinc-400">
        {label}
      </Label>
      {children}
    </div>
  )
}

interface SelectFieldProps<T extends string> {
  name: 'moneda' | 'flujo_cierre'
  control: Control<FormValues>
  options: readonly T[]
  labels: Record<T, string>
}

export function SelectField<T extends string>({ name, control, options, labels }: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger className="border-white/10 bg-white/[0.03] text-sm text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {labels[opt]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
