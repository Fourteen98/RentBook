import { useId, type ReactNode } from 'react'

type FieldProps = {
  label: string
  hint?: string
  /** Rails validation errors arrive as string[] via Inertia; a plain string also works. */
  error?: string | string[]
  /** Receives the ids to wire onto the input so screen readers link label, hint and error. */
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

/** Label + input + hint + error, laid out the same way everywhere. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const message = Array.isArray(error) ? error[0] : error
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = message ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, describedBy, invalid: !!message })}
      {message ? (
        <p id={errorId} className="text-sm text-danger">
          {message}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-sm text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
