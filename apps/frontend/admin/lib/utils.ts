import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

export function formatDateTime(date: Date | string) {
  return formatDate(date, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: Date | string) {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
  
  const now = new Date()
  const diffInSeconds = Math.round((dateObj.getTime() - now.getTime()) / 1000)
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second')
  }
  
  const diffInMinutes = Math.round(diffInSeconds / 60)
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute')
  }
  
  const diffInHours = Math.round(diffInMinutes / 60)
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour')
  }
  
  const diffInDays = Math.round(diffInHours / 24)
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day')
  }
  
  const diffInMonths = Math.round(diffInDays / 30)
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month')
  }
  
  const diffInYears = Math.round(diffInMonths / 12)
  return rtf.format(diffInYears, 'year')
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production use DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function parseLocale(locale: string | undefined): string {
  if (!locale) return 'pt-BR'
  
  // Normalize locale
  const normalized = locale.toLowerCase().replace('_', '-')
  
  // Support common locales
  if (normalized.startsWith('pt')) return 'pt-BR'
  if (normalized.startsWith('en')) return 'en-US'
  if (normalized.startsWith('es')) return 'es-ES'
  
  return 'pt-BR' // Default fallback
}

export function getLocalizedContent(content: Record<string, any>, locale: string = 'pt-BR'): any {
  if (!content || typeof content !== 'object') return content
  
  // If content has locale-specific versions
  if (content[locale]) return content[locale]
  
  // Fallback to pt-BR
  if (content['pt-BR']) return content['pt-BR']
  
  // Fallback to first available language
  const firstKey = Object.keys(content)[0]
  if (firstKey) return content[firstKey]
  
  return content
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'absolute'
    textArea.style.left = '-999999px'
    document.body.prepend(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      textArea.remove()
      return Promise.resolve(true)
    } catch (error) {
      textArea.remove()
      return Promise.resolve(false)
    }
  }
}