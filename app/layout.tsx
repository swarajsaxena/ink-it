import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { getServerSession } from 'next-auth'
import { Toaster } from '@/components/ui/toaster'

import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvexClientProvider } from '@/components/providers/convex-provider'
import SessionProvider from '@/components/providers/SessionProvider'
import { ModalProvider } from '@/components/providers/modal-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ink It',
  description: 'The Connected Workspace where better, faster work happens.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  return (
    <SessionProvider session={session}>
      <html lang='en'>
        <body className={inter.className + 'max-w-[100wh] overflow-hidden'}>
          <ConvexClientProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              enableSystem
              disableTransitionOnChange
              storageKey='ink_it_2'
            >
              {children}
              <Toaster />
              <ModalProvider />
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
