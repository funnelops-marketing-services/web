'use client'

import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { MODALITY_CHOICES, MODALITY_LABELS } from '@/components/crm/catalog/labels'
import {
  Field,
  FieldError,
  Hint,
  RULES,
  SelectField,
  type FormValues,
} from '@/components/crm/catalog/service-form'
import { ServiceLinksManager } from '@/components/crm/catalog/service-links-manager'
import type { ServiceCurrency } from '@/lib/api/catalogo'

interface ServiceDeliverySectionProps {
  control: Control<FormValues>
  register: UseFormRegister<FormValues>
  errors: FieldErrors<FormValues>
  moneda: ServiceCurrency
  priceAmount: string
  /** null mientras el servicio no existe: los links necesitan un id. */
  serviceId: string | null
}

/** Entrega post-pago (#178): modalidad, monto comparable y links. */
export function ServiceDeliverySection({
  control,
  register,
  errors,
  moneda,
  priceAmount,
  serviceId,
}: ServiceDeliverySectionProps) {
  const manualReview = priceAmount.trim() === '' || moneda === 'USD'

  return (
    <section className="space-y-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
      <div>
        <p className="text-sm font-semibold text-white">Entrega y validación del pago</p>
        <Hint>
          Define qué recibe el lead cuando el comprobante queda validado. No cambia lo que el bot
          ofrece durante la conversación.
        </Hint>
      </div>

      <Field label="Modalidad" htmlFor="modality">
        <SelectField
          name="modality"
          control={control}
          options={MODALITY_CHOICES}
          labels={MODALITY_LABELS}
        />
        <Hint>
          <span className="text-zinc-300">Presencial</span>: se entrega la entrada con QR ·{' '}
          <span className="text-zinc-300">Virtual</span>: se envían los links de abajo ·{' '}
          <span className="text-zinc-300">Híbrido</span>: las dos cosas en un mismo mensaje, para un
          curso que tiene módulos presenciales y por Zoom ·{' '}
          <span className="text-zinc-300">Sin entrega</span>: el bot no manda nada después del pago
          (el equipo sigue a mano).
        </Hint>
      </Field>

      <Field label="Monto a cobrar (para comparar con el comprobante)" htmlFor="price_amount">
        <Input
          id="price_amount"
          inputMode="decimal"
          placeholder="650.00"
          {...register('price_amount', RULES.price_amount)}
          className="border-white/10 bg-white/[0.03] text-sm text-white"
        />
        <FieldError message={errors.price_amount?.message} />
        <Hint>
          Es el número que se compara contra el monto del comprobante — distinto del{' '}
          <span className="text-zinc-300">Precio (display)</span>, que es el texto que lee el lead.
          Dejalo vacío si no querés comparación automática.
        </Hint>
        {manualReview && (
          <p className="text-[11px] text-amber-300/90">
            {moneda === 'USD'
              ? 'En USD el comprobante llega en Bs: el pago se valida a mano igual.'
              : 'Sin monto cargado, cada pago de este servicio se valida a mano.'}
          </p>
        )}
      </Field>

      {serviceId ? (
        <ServiceLinksManager serviceId={serviceId} />
      ) : (
        <Hint>
          Guardá el servicio primero y volvé a abrirlo para cargar los links de entrega.
        </Hint>
      )}
    </section>
  )
}
