import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type CardProps = {
  title?: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
}

/** A white surface on the canvas. Thin border, no heavy shadow. */
export function Card({ title, subtitle, action, children, className }: CardProps) {
  return (
    <section className={cn('rounded-xl border border-line bg-surface p-4', className)}>
      {(title || action) && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="truncate text-base font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}
