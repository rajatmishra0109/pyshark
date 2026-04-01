'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Map,
  Settings,
  Shield,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/sessions', label: 'Sessions', icon: Shield },
  { href: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/threat-map', label: 'Threat Map', icon: Map },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    const collapsed = window.localStorage.getItem('xti.sidebar.collapsed')
    if (collapsed) {
      setIsCollapsed(collapsed === '1')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem('xti.sidebar.collapsed', isCollapsed ? '1' : '0')
  }, [isCollapsed])

  return (
    <TooltipProvider>
      <aside
        className={cn(
          'flex h-screen flex-col border-r border-[var(--border)] bg-surface transition-[width] duration-200',
          isCollapsed ? 'w-16' : 'w-60',
        )}
      >
        <div className='flex-1 py-3'>
          <nav className='space-y-1'>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              const link = (
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    'mx-2 flex items-center gap-3 rounded-r-md border-l-2 px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'border-cyan bg-elevated text-primary'
                      : 'border-transparent text-muted hover:bg-elevated hover:text-primary',
                  )}
                >
                  <item.icon className='h-5 w-5 shrink-0' />
                  {!isCollapsed ? <span>{item.label}</span> : null}
                </Link>
              )

              if (!isCollapsed) return <div key={item.href}>{link}</div>

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side='right'>{item.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </nav>
        </div>

        <div className='border-t border-border p-2'>
          <div className={cn('mb-2 flex items-center', isCollapsed ? 'justify-center' : 'justify-between')}>
            {!isCollapsed ? <span className='text-xs text-muted'>Demo Mode</span> : null}
            <Switch
              checked={demoMode}
              onCheckedChange={setDemoMode}
              aria-label='Toggle demo mode'
            />
          </div>
          <Button
            variant='ghost'
            className={cn('w-full justify-start', isCollapsed ? 'px-2' : 'px-3')}
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label='Toggle sidebar collapse'
          >
            {isCollapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
            {!isCollapsed ? <span className='ml-2 text-xs'>Collapse</span> : null}
          </Button>
          {!isCollapsed ? (
            <p className='mt-2 text-[10px] text-subtle'>v1.0.0 · Lab Edition</p>
          ) : null}
        </div>
      </aside>
    </TooltipProvider>
  )
}
