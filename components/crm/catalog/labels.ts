import type { ServiceClosing, ServiceCurrency } from '@/lib/api/catalogo'

export const CURRENCY_LABELS: Record<ServiceCurrency, string> = {
  BOB: 'Bs (BOB)',
  USD: 'USD (tipo de cambio paralelo)',
}

export const CLOSING_LABELS: Record<ServiceClosing, string> = {
  pago_qr: 'Pago con QR',
  handoff_consultivo: 'Derivar a humano (consultivo)',
}
