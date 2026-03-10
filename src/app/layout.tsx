import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nativefier Studio',
  description:
    'Wrap any website into a beautiful desktop app — with dark mode, ad blocking, custom CSS/JS injection, and more.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head />
      <body className="min-h-screen bg-surface-900">{children}</body>
    </html>
  )
}
