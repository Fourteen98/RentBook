import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

/**
 * Variants are declared once here instead of repeating class strings on every
 * button. Restraint rule: one `primary` button per screen; the rest are
 * `secondary` or `ghost`.
 */
export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
    'disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-700',
        secondary: 'border border-line bg-surface text-brand-700 hover:bg-brand-50',
        ghost: 'text-ink-muted hover:bg-brand-50 hover:text-ink',
        danger: 'border border-danger/30 bg-surface text-danger hover:bg-danger-50',
      },
      size: {
        // md is 44px tall: the minimum comfortable tap target on a phone.
        md: 'h-11 px-4 text-sm',
        // sm is for dense desktop toolbars only, never primary mobile actions.
        sm: 'h-9 px-3 text-sm',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles> & {
    icon?: ReactNode
    loading?: boolean
  }

export function Button({ variant, size, block, icon, loading, className, children, type, disabled, ...rest }: ButtonProps) {
  return (
    <button
      type={type ?? 'button'}
      className={cn(buttonStyles({ variant, size, block }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  )
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  )
}
