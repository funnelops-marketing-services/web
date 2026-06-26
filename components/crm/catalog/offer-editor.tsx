'use client'

import { useRef, useState } from 'react'
import { Controller, useForm, type Control } from 'react-hook-form'
import { FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CATEGORY_LABELS, CLOSING_LABELS, CURRENCY_LABELS } from '@/components/crm/catalog/labels'
import { OfferPreview } from '@/components/crm/catalog/offer-preview'
import { useCreateOffer, useUpdateOffer, useUploadAsset } from '@/hooks/use-catalogo'
import {
  offerCategories,
  offerClosings,
  offerCurrencies,
  type OfferCategory,
  type OfferClosing,
  type OfferCurrency,
  type OfferRead,
} from '@/lib/api/catalogo'

interface FormValues {
  slug: string
  nombre: string
  categoria: OfferCategory
  resumen: string
  detalle: string
  precio: string
  moneda: OfferCurrency
  flujo_cierre: OfferClosing
  is_active: boolean
}

interface OfferEditorProps {
  agentId: string
  offer: OfferRead | null
  defaultOrden: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

function defaults(offer: OfferRead | null): FormValues {
  return {
    slug: offer?.slug ?? '',
    nombre: offer?.nombre ?? '',
    categoria: (offer?.categoria as OfferCategory) ?? 'formacion',
    resumen: offer?.resumen ?? '',
    detalle: offer?.detalle ?? '',
    precio: offer?.precio ?? '',
    moneda: (offer?.moneda as OfferCurrency) ?? 'BOB',
    flujo_cierre: (offer?.flujo_cierre as OfferClosing) ?? 'pago_qr',
    is_active: offer?.is_active ?? true,
  }
}

export function OfferEditor({ agentId, offer, defaultOrden, open, onOpenChange }: OfferEditorProps) {
  const isEdit = offer !== null
  const create = useCreateOffer(agentId)
  const update = useUpdateOffer(agentId)
  const upload = useUploadAsset()
  const fileRef = useRef<HTMLInputElement>(null)
  const [assetId, setAssetId] = useState<string | null>(offer?.asset_id ?? null)
  const [assetName, setAssetName] = useState<string | null>(offer?.asset?.filename ?? null)
  const { control, register, handleSubmit, watch } = useForm<FormValues>({ defaultValues: defaults(offer) })
  const values = watch()

  async function onPickFile(file: File | undefined) {
    if (!file) return
    const asset = await upload.mutateAsync(file)
    setAssetId(asset.id)
    setAssetName(asset.filename)
    toast.success('PDF subido')
  }

  const onSubmit = handleSubmit(async (form) => {
    const payload = { ...form, detalle: form.detalle.trim() || null, asset_id: assetId }
    if (isEdit) {
      await update.mutateAsync({ offerId: offer.id, body: payload })
      toast.success('Oferta actualizada')
    } else {
      await create.mutateAsync({ ...payload, orden: defaultOrden })
    }
    onOpenChange(false)
  })

  const saving = create.isPending || update.isPending

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-zinc-950 text-white sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-white">{isEdit ? 'Editar oferta' : 'Nueva oferta'}</SheetTitle>
          <SheetDescription>El bot usa estos datos para resumir y enviar el material.</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-8">
          <Field label="Slug (identificador, no se edita)" htmlFor="slug">
            <Input id="slug" disabled={isEdit} placeholder="curso-contenido-edicion" {...register('slug')} className="border-white/10 bg-white/[0.03] text-sm text-white disabled:opacity-60" />
          </Field>
          <Field label="Nombre" htmlFor="nombre">
            <Input id="nombre" {...register('nombre')} className="border-white/10 bg-white/[0.03] text-sm text-white" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoría" htmlFor="categoria">
              <SelectField name="categoria" control={control} options={offerCategories} labels={CATEGORY_LABELS} />
            </Field>
            <Field label="Moneda" htmlFor="moneda">
              <SelectField name="moneda" control={control} options={offerCurrencies} labels={CURRENCY_LABELS} />
            </Field>
          </div>
          <Field label="Resumen (1–2 líneas, lo que dice el bot)" htmlFor="resumen">
            <Textarea id="resumen" rows={3} {...register('resumen')} className="border-white/10 bg-white/[0.03] text-sm text-white" />
          </Field>
          <Field label="Detalle (opcional, para despejar dudas)" htmlFor="detalle">
            <Textarea id="detalle" rows={3} {...register('detalle')} className="border-white/10 bg-white/[0.03] text-sm text-white" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (display)" htmlFor="precio">
              <Input id="precio" placeholder="650 Bs" {...register('precio')} className="border-white/10 bg-white/[0.03] text-sm text-white" />
            </Field>
            <Field label="Cierre" htmlFor="flujo_cierre">
              <SelectField name="flujo_cierre" control={control} options={offerClosings} labels={CLOSING_LABELS} />
            </Field>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-400">Material (PDF)</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" disabled={upload.isPending} onClick={() => fileRef.current?.click()} className="gap-2 border-white/10 bg-white/[0.03] text-white">
                <Upload className="size-3.5" />
                {upload.isPending ? 'Subiendo…' : assetName ? 'Reemplazar PDF' : 'Subir PDF'}
              </Button>
              {assetName && (
                <span className="flex items-center gap-1 truncate text-xs text-zinc-400">
                  <FileText className="size-3.5" /> {assetName}
                </span>
              )}
            </div>
            <input ref={fileRef} type="file" accept="application/pdf" hidden onChange={(e) => onPickFile(e.target.files?.[0])} />
          </div>

          {isEdit && (
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <label className="flex items-center gap-3 text-sm text-zinc-300">
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                  Oferta activa
                </label>
              )}
            />
          )}

          <OfferPreview
            offer={{
              nombre: values.nombre,
              resumen: values.resumen,
              detalle: values.detalle,
              precio: values.precio,
              moneda: values.moneda,
              flujo_cierre: values.flujo_cierre,
              materialName: assetName,
            }}
          />

          <Button type="submit" disabled={saving} className="w-full bg-gradient-to-b from-violet-500 to-violet-700 text-white">
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear oferta'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
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
  name: 'categoria' | 'moneda' | 'flujo_cierre'
  control: Control<FormValues>
  options: readonly T[]
  labels: Record<T, string>
}

function SelectField<T extends string>({ name, control, options, labels }: SelectFieldProps<T>) {
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
