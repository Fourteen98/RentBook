import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }

/** 44px tall text input. Use inside <Field> so label and errors are wired up. */
export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'block h-11 w-full rounded-lg border-line bg-surface px-3 text-base text-ink placeholder:text-ink-muted/70',
        'focus:border-brand-600 focus:ring-brand-600',
        invalid && 'border-danger focus:border-danger focus:ring-danger',
        className,
      )}
      {...rest}
    />
  )
}
