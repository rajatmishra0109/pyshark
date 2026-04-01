import type { ReactNode } from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return <div className='mx-auto w-full max-w-[1400px] p-4 md:p-6'>{children}</div>
}
