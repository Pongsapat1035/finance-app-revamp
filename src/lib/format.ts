// Keep this export available while pages migrate to formatNumber in separate commits.
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number) {
  return value.toLocaleString('en-US', { maximumFractionDigits: 20 })
}
