import type { Metadata } from 'next'
import Script from 'next/script'
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
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} bg-background`}>
      <body className="font-mono antialiased">
        {gtmId && (
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <Analytics />
      </body>
    </html>
  )
}
