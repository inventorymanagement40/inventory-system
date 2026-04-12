const phpCurrencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

export function formatPhpCurrency(value) {
  return phpCurrencyFormatter.format(Number(value) || 0)
}
