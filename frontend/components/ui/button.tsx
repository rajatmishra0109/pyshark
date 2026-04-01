import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type Variant = 'default' | 'ghost' | 'destructive'
type Size = 'default' | 'sm' | 'icon'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  default: 'bg-accent text-white hover:bg-blue-600',
  ghost: 'bg-transparent text-muted hover:bg-elevated hover:text-primary',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes: Record<Size, string> = {
  default: 'h-9 px-4 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  icon: 'h-9 w-9',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
