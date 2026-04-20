import type { Metadata } from 'next'
import { Syne, DM_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmMono = DM_Mono({ 
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ScanVice - Stop Wasting Hours on Receipts',
  description: 'Capture, organize, and understand your expenses instantly. AI-powered receipt scanning that eliminates manual data entry and keeps you audit-ready.',
  keywords: ['receipt scanner', 'expense tracking', 'bookkeeping', 'receipt organizer', 'AI receipt', 'expense management'],
  authors: [{ name: 'ScanVice' }],
  openGraph: {
    title: 'ScanVice - Stop Wasting Hours on Receipts',
    description: 'Capture, organize, and understand your expenses instantly. AI-powered receipt scanning.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScanVice - Stop Wasting Hours on Receipts',
    description: 'Capture, organize, and understand your expenses instantly.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} bg-background`}>
      <body className="font-mono antialiased">
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Analytics />
      </body>
    </html>
  )
}
