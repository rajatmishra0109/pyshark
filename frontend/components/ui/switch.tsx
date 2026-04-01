'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-border bg-elevated transition-colors data-[state=checked]:bg-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className='pointer-events-none block h-4 w-4 translate-x-0.5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-4' />
    </SwitchPrimitive.Root>
  )
}
