'use client'

import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FileText, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CategorySelect } from '@/components/crm/catalog/category-select'
import { CLOSING_LABELS, CURRENCY_LABELS } from '@/components/crm/catalog/labels'
import { ServicePreview } from '@/components/crm/catalog/service-preview'
import {
  Field,
  FieldError,
  LIMITS,
  RULES,
  SelectField,
  serviceDefaults,
} from '@/components/crm/catalog/service-form'
import { useCreateService, useUpdateService, useUploadAsset } from '@/hooks/use-catalogo'
import { serviceClosings, serviceCurrencies, type ServiceRead } from '@/lib/api/catalogo'

interface ServiceEditorProps {
  agentId: string
  service: ServiceRead | null
  defaultOrden: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ServiceEditor({ agentId, service, defaultOrden, open, onOpenChange }: ServiceEditorProps) {
  const isEdit = service !== null
  const create = useCreateService(agentId)
  const update = useUpdateService(agentId)
  const upload = useUploadAsset()
  const fileRef = useRef<HTMLInputElement>(null)
  const [assetId, setAssetId] = useState<string | null>(service?.asset_id ?? null)
  const [assetName, setAssetName] = useState<string | null>(service?.asset?.filename ?? null)
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ defaultValues: serviceDefaults(service), mode: 'onChange' })
  const values = watch()

  async function onPickFile(file: File | undefined) {
    if (!file) return
    const asset = await upload.mutateAsync(file)
    setAssetId(asset.id)
    setAssetName(asset.filename)
    toast.success('PDF subido')
  }

  const onSubmit = handleSubmit(async (form) => {
    const payload = {
      ...form,
      category_id: form.category_id || null,
      detalle: form.detalle.trim() || null,
      asset_id: assetId,
    }
    if (isEdit) {
      await update.mutateAsync({ serviceId: service.id, body: payload })
      toast.success('Servicio actualizado')
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
          <SheetTitle className="text-white">{isEdit ? 'Editar servicio' : 'Nuevo servicio'}</SheetTitle>
          <SheetDescription>El bot usa estos datos para resumir y enviar el material.</SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 px-4 pb-8">
          <Field label="Slug (identificador, no se edita)" htmlFor="slug">
            <Input id="slug" disabled={isEdit} maxLength={LIMITS.slug} placeholder="curso-edicion" {...register('slug', RULES.slug)} className="border-white/10 bg-white/[0.03] text-sm text-white disabled:opacity-60" />
            {errors.slug ? <FieldError message={errors.slug.message} /> : <p className="text-[11px] text-zinc-500">Minúsculas, números y guiones (ej. curso-edicion).</p>}
          </Field>
          <Field label="Nombre" htmlFor="nombre">
            <Input id="nombre" maxLength={LIMITS.nombre} {...register('nombre', RULES.nombre)} className="border-white/10 bg-white/[0.03] text-sm text-white" />
            <FieldError message={errors.nombre?.message} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Categoría" htmlFor="category_id">
              <Controller
                control={control}
                name="category_id"
                render={({ field }) => <CategorySelect value={field.value} onChange={field.onChange} />}
              />
            </Field>
            <Field label="Cierre" htmlFor="flujo_cierre">
              <SelectField name="flujo_cierre" control={control} options={serviceClosings} labels={CLOSING_LABELS} />
            </Field>
          </div>
          <Field label="Resumen (1–2 líneas, lo que dice el bot)" htmlFor="resumen">
            <Textarea id="resumen" rows={3} maxLength={LIMITS.resumen} {...register('resumen', RULES.resumen)} className="border-white/10 bg-white/[0.03] text-sm text-white" />
            <FieldError message={errors.resumen?.message} />
          </Field>
          <Field label="Detalle (opcional, para despejar dudas)" htmlFor="detalle">
            <Textarea id="detalle" rows={3} maxLength={LIMITS.detalle} {...register('detalle', RULES.detalle)} className="border-white/10 bg-white/[0.03] text-sm text-white" />
            <FieldError message={errors.detalle?.message} />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Precio (display)" htmlFor="precio">
              <Input id="precio" inputMode="decimal" placeholder="650" {...register('precio', RULES.precio)} className="border-white/10 bg-white/[0.03] text-sm text-white" />
              <FieldError message={errors.precio?.message} />
            </Field>
            <Field label="Moneda" htmlFor="moneda">
              <SelectField name="moneda" control={control} options={serviceCurrencies} labels={CURRENCY_LABELS} />
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
                  Servicio activo
                </label>
              )}
            />
          )}

          <ServicePreview
            service={{
              nombre: values.nombre,
              resumen: values.resumen,
              detalle: values.detalle,
              precio: values.precio,
              moneda: values.moneda,
              flujo_cierre: values.flujo_cierre,
              materialName: assetName,
            }}
          />

          <Button type="submit" disabled={saving || !isValid} className="w-full bg-gradient-to-b from-violet-500 to-violet-700 text-white">
            {saving ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear servicio'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
