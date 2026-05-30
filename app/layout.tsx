import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/query/provider'
import { Toaster } from '@/components/ui/sonner'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat'
});

export const metadata: Metadata = {
  title: 'Mirko Calzadilla',
  description: 'Cursos y producción audiovisual por Mirko Calzadilla',
  other: {
    'facebook-domain-verification': 'lqzg91iaq50gwivufzg1n32f0kvj5f',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark bg-black">
      <body className={`${montserrat.variable} font-sans antialiased bg-black text-white`}>
        <QueryProvider>
          {children}
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  )
}
