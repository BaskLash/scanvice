export function formatCurrency(value: number | null | undefined, currency: string | null | undefined): string {
  if (value === null || value === undefined) return "—"
  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value)
    } catch {
      return `${value.toFixed(2)} ${currency}`
    }
  }
  return value.toFixed(2)
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—"
  return value.toLocaleString()
}

export function formatText(value: string | null | undefined): string {
  if (!value) return "—"
  return value
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}
