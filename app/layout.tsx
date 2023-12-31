import { Toaster } from 'sonner'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ConvextClientProvider } from '@/components/providers/convex-provider'

const inter = Inter({ subsets: ['latin'] })

// metadata指的是网站的元数据，包括网站的标题、描述、图标等
export const metadata: Metadata = {
  title: 'Jotion',
  description: 'The connected workspace where better, faster work happens',
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.svg",
        href: "/logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo-dark.svg",
        href: "/logo-dark.svg",
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvextClientProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
            enableSystem
            storageKey='jotion-theme-2'
          >
            <Toaster position="bottom-center" />
            {children}
          </ThemeProvider>
        </ConvextClientProvider>
      </body>
    </html>
  )
}
