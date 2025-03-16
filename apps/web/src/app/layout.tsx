import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
