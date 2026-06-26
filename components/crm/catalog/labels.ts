import type { OfferCategory, OfferClosing, OfferCurrency } from '@/lib/api/catalogo'

export const CATEGORY_LABELS: Record<OfferCategory, string> = {
  formacion: 'Formación',
  produccion: 'Producción audiovisual',
  edicion: 'Edición de videos',
  general: 'Programa general',
}

/** Orden de presentación de las categorías en la pantalla y el preview. */
export const CATEGORY_ORDER: readonly OfferCategory[] = [
  'formacion',
  'produccion',
  'edicion',
  'general',
]

export const CURRENCY_LABELS: Record<OfferCurrency, string> = {
  BOB: 'Bs (BOB)',
  USD: 'USD (tipo de cambio paralelo)',
}

export const CLOSING_LABELS: Record<OfferClosing, string> = {
  pago_qr: 'Pago con QR',
  handoff_consultivo: 'Derivar a humano (consultivo)',
}
