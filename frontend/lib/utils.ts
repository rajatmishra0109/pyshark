import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Severity } from '@/types'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }

  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

export function formatDuration(s: number): string {
  if (s < 1) {
    return `${Math.round(s * 1000)}ms`
  }

  return `${s.toFixed(1)}s`
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const deltaSec = Math.max(0, Math.floor((now - then) / 1000))

  if (deltaSec < 60) return `${deltaSec}s ago`
  const mins = Math.floor(deltaSec / 60)
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function isPrivateIP(ip: string): boolean {
  if (ip.startsWith('10.')) return true
  if (ip.startsWith('192.168.')) return true

  const octets = ip.split('.')
  if (octets.length !== 4) return false

  const first = Number.parseInt(octets[0], 10)
  const second = Number.parseInt(octets[1], 10)

  return first === 172 && second >= 16 && second <= 31
}

export function maskIP(ip: string): string {
  if (!isPrivateIP(ip)) return ip

  const octets = ip.split('.')
  if (octets.length !== 4) return ip

  return `${octets[0]}.${octets[1]}.x.x`
}

export function getSeverityFromScore(score: number): Severity {
  if (score < 30) return 'Low'
  if (score < 60) return 'Medium'
  if (score < 80) return 'High'
  return 'Critical'
}
