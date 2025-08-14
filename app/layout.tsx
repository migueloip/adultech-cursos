import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { PWAProvider } from '@/components/pwa-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'AdulTech Cursos',
  description: 'Plataforma educativa para enseñar tecnología básica a adultos mayores',
  generator: 'Next.js',
  manifest: '/manifest.json',
  icons: {
    icon: '/images/adultech-logo.png',
    shortcut: '/images/adultech-logo.png',
    apple: '/images/adultech-logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AdulTech Cursos'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  )
}
