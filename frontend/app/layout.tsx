import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'XTI-SOC',
  description: 'Security Operations Center Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('xti-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();",
          }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <div className='flex min-h-screen bg-base text-primary'>
          <Sidebar />
          <div className='flex min-h-screen flex-1 flex-col'>
            <TopBar />
            <main className='flex-1'>{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
