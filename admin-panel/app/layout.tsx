import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from '@/components/providers'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Talari Admin Panel',
  description: 'Manage Talari users, transactions, and analytics',
  generator: 'Next.js',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#038E7D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
