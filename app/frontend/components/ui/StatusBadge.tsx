import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeStyles = cva('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', {
  variants: {
    tone: {
      neutral: 'bg-canvas text-ink-muted ring-1 ring-line ring-inset',
      brand: 'bg-brand-50 text-brand-800',
      gold: 'bg-accent-100 text-accent-700',
      danger: 'bg-danger-50 text-danger',
    },
  },
  defaultVariants: { tone: 'neutral' },
})

type StatusBadgeProps = VariantProps<typeof badgeStyles> & { children: ReactNode; className?: string }

/** Small status label. Text always uses the dark shade of the badge's own colour. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return <span className={cn(badgeStyles({ tone }), className)}>{children}</span>
}
