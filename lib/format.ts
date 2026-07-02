import { digitsOnly } from '@/lib/validation/fields'

// Canonical display formatters (#140). Every money/phone value rendered in the UI
// goes through these so the whole app reads the same.

const CURRENCY_LABELS: Record<string, string> = { BOB: 'Bs', USD: 'US$' }

/** "1800" + "BOB" → "Bs 1.800" (es-BO grouping). Unknown/invalid values degrade
 *  to the raw amount so a bad price never renders as "NaN". */
export function formatMoney(amount: string | number, currency: string): string {
  const label = CURRENCY_LABELS[currency] ?? currency
  const value = typeof amount === 'number' ? amount : Number(amount)
  if (!Number.isFinite(value)) return `${label} ${amount}`
  return `${label} ${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 }).format(value)}`
}

/** wa_id "59169005037" → "+591 6900 5037". Non-BO numbers keep their digits with
 *  a leading "+"; empty/garbage input returns the input as-is. */
export function formatPhone(phone: string): string {
  const digits = digitsOnly(phone)
  if (digits.length === 0) return phone
  if (digits.length === 11 && digits.startsWith('591')) {
    return `+591 ${digits.slice(3, 7)} ${digits.slice(7)}`
  }
  return `+${digits}`
}

/** True when the card has no real name and its title is just the phone/wa_id. */
export function isUnnamedLead(title: string, phone: string | null | undefined): boolean {
  return !!phone && (title === phone || digitsOnly(title) === digitsOnly(phone))
}

/** Display title for a lead anywhere in the app: real name, or formatted phone. */
export function leadTitle(title: string, phone: string | null | undefined): string {
  return isUnnamedLead(title, phone) && phone ? formatPhone(phone) : title
}
