import { formatPesewas } from '@/lib/money'
import { cn } from '@/lib/cn'

type MoneyProps = { pesewas: number; className?: string }

/** Displays an integer pesewa amount as "GH₵ 19,500.00". Tabular digits keep columns aligned. */
export function Money({ pesewas, className }: MoneyProps) {
  return <span className={cn('tabular-nums', className)}>{formatPesewas(pesewas)}</span>
}
