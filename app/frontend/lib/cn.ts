import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Join class names, dropping falsy ones, and let later Tailwind classes win
 * over earlier conflicting ones: cn('px-4', 'px-2') === 'px-2'.
 * This is what lets a caller pass className="w-full" to a component safely.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
