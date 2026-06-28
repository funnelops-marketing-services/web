import type { ServiceCategory, ServiceClosing, ServiceCurrency } from '@/lib/api/catalogo'

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  formacion: 'Formación',
  produccion: 'Producción audiovisual',
  edicion: 'Edición de videos',
  general: 'Programa general',
}

/** Orden de presentación de las categorías en la pantalla y el preview. */
export const CATEGORY_ORDER: readonly ServiceCategory[] = [
  'formacion',
  'produccion',
  'edicion',
  'general',
]

export const CURRENCY_LABELS: Record<ServiceCurrency, string> = {
  BOB: 'Bs (BOB)',
  USD: 'USD (tipo de cambio paralelo)',
}

export const CLOSING_LABELS: Record<ServiceClosing, string> = {
  pago_qr: 'Pago con QR',
  handoff_consultivo: 'Derivar a humano (consultivo)',
}
