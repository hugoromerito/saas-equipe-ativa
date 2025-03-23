import type { Metadata } from 'next'
import './globals.css'
import WhatsappButton from '@/components/whatsapp-button'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Equipe Ativa',
  description: 'EA, do início ao fim.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute={'class'}
          defaultTheme="light"
          disableTransitionOnChange
        >
          <main className="mx-auto w-full max-w-[1200px] space-y-4 p-6">
            {children}
          </main>
          <WhatsappButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
