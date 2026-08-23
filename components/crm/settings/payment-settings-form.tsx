'use client'

import { useForm, type UseFormRegister } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdatePaymentSettings } from '@/hooks/use-payment-settings'
import {
  BENEFICIARY_MAX,
  QR_URL_MAX,
  type PaymentSettingsRead,
  type PaymentSettingsUpdate,
} from '@/lib/api/payment-settings'
import { httpUrl } from '@/lib/validation'

interface FormValues {
  expected_beneficiary: string
  payment_qr_url: string
}

const QR_RULE = {
  validate: (value: string) => {
    // Vacío = borrar el propio y volver al QR global de la plataforma.
    if (value.trim() === '') return true
    const parsed = httpUrl(QR_URL_MAX).safeParse(value)
    return parsed.success || (parsed.error.issues[0]?.message ?? 'Link inválido.')
  },
}

/** Beneficiario esperado + QR de pago de la organización (#178). */
export function PaymentSettingsForm({ settings }: { settings: PaymentSettingsRead }) {
  const update = useUpdatePaymentSettings()
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      expected_beneficiary: settings.expected_beneficiary ?? '',
      payment_qr_url: settings.payment_qr_url,
    },
  })

  // Solo se manda lo que el operador tocó: el GET devuelve el QR ya resuelto, y
  // reenviarlo sin cambios convertiría el global de la plataforma en uno propio.
  const onSubmit = handleSubmit((form) => {
    const body: PaymentSettingsUpdate = {}
    if (dirtyFields.expected_beneficiary) {
      body.expected_beneficiary = form.expected_beneficiary.trim() || null
    }
    if (dirtyFields.payment_qr_url) {
      body.payment_qr_url = form.payment_qr_url.trim() || null
    }
    if (Object.keys(body).length > 0) update.mutate(body)
  })

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-5"
    >
      <div className="space-y-1.5">
        <Label htmlFor="expected_beneficiary" className="text-xs font-medium text-zinc-400">
          Beneficiario esperado
        </Label>
        <Input
          id="expected_beneficiary"
          maxLength={BENEFICIARY_MAX}
          placeholder="Mirko Calzadilla"
          {...register('expected_beneficiary', {
            maxLength: { value: BENEFICIARY_MAX, message: `Máx. ${BENEFICIARY_MAX} caracteres.` },
          })}
          className="border-white/10 bg-white/[0.03] text-sm text-white"
        />
        {errors.expected_beneficiary ? (
          <p className="text-[11px] text-rose-400">{errors.expected_beneficiary.message}</p>
        ) : (
          <p className="text-[11px] text-zinc-500">
            Nombre que debería figurar como destinatario en el comprobante. El matching es
            tolerante y, si no coincide, el pago <span className="text-zinc-300">no se rechaza</span>
            : queda para revisión humana. Vacío = no se compara el destinatario.
          </p>
        )}
      </div>

      <QrUrlField
        register={register}
        error={errors.payment_qr_url?.message}
        settings={settings}
        onReset={() => update.mutate({ payment_qr_url: null })}
        resetting={update.isPending}
      />

      <Button
        type="submit"
        disabled={update.isPending || !isDirty}
        className="bg-gradient-to-b from-violet-500 to-violet-700 text-white"
      >
        {update.isPending ? 'Guardando…' : 'Guardar cambios'}
      </Button>
    </form>
  )
}

interface QrUrlFieldProps {
  register: UseFormRegister<FormValues>
  error?: string
  settings: PaymentSettingsRead
  onReset: () => void
  resetting: boolean
}

function QrUrlField({ register, error, settings, onReset, resetting }: QrUrlFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor="payment_qr_url" className="text-xs font-medium text-zinc-400">
          QR de pago
        </Label>
        {settings.is_qr_url_custom ? (
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[11px] text-violet-200">
            QR propio de la organización
          </span>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-400">
            QR global de la plataforma
          </span>
        )}
      </div>
      <Input
        id="payment_qr_url"
        maxLength={QR_URL_MAX}
        placeholder="https://…/qr-pago.png"
        {...register('payment_qr_url', QR_RULE)}
        className="border-white/10 bg-white/[0.03] text-sm text-white"
      />
      {error ? (
        <p className="text-[11px] text-rose-400">{error}</p>
      ) : (
        <p className="text-[11px] text-zinc-500">
          Imagen que el bot le manda al lead para pagar. Si dejás el campo vacío y guardás, vuelve
          al QR global de la plataforma.
        </p>
      )}
      {settings.payment_qr_url && (
        <img
          src={settings.payment_qr_url}
          alt="QR de pago vigente"
          className="mt-2 size-28 rounded-lg border border-white/10 bg-white/5 object-contain p-1"
        />
      )}
      {settings.is_qr_url_custom && (
        <Button
          type="button"
          variant="ghost"
          onClick={onReset}
          disabled={resetting}
          className="h-8 px-0 text-xs text-violet-300 hover:text-violet-200"
        >
          Volver al QR global de la plataforma
        </Button>
      )}
    </div>
  )
}
