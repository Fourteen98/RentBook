/**
 * Money is always an integer number of pesewas (100 pesewas = GH₵ 1).
 * Never use floats for money: 0.1 + 0.2 !== 0.3 in JavaScript.
 *
 * Temporary home for the formatter used by <Money>. Step 5 adds tests and the
 * matching Ruby module.
 */
const cedisFormatter = new Intl.NumberFormat('en-GH', { maximumFractionDigits: 0 })

export function formatPesewas(pesewas: number): string {
  if (!Number.isSafeInteger(pesewas)) {
    throw new Error(`formatPesewas expects an integer number of pesewas, got ${pesewas}`)
  }
  const sign = pesewas < 0 ? '−' : ''
  const abs = Math.abs(pesewas)
  const cedis = Math.trunc(abs / 100)
  const rest = abs % 100
  return `${sign}GH₵ ${cedisFormatter.format(cedis)}.${String(rest).padStart(2, '0')}`
}
