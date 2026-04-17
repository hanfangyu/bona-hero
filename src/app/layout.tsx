import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BONA CREATE',
  description: 'Cinematic landing page for bona-hero',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}