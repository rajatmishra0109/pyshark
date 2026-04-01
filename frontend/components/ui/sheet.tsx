'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

export function SheetContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Content>) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className='fixed inset-0 z-40 bg-black/50' />
      <Dialog.Content
        className={cn(
          'fixed right-0 top-0 z-50 h-full w-full max-w-[440px] border-l border-border bg-surface p-4 animate-fade-in focus:outline-none',
          className,
        )}
        {...props}
      >
        {children}
        <Dialog.Close className='absolute right-3 top-3 rounded-sm p-1 text-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-4 space-y-2', className)} {...props} />
)

export const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-sm font-semibold text-primary', className)} {...props} />
)

export const SheetDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-xs text-muted', className)} {...props} />
)
