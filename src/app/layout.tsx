import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FluxPay — Kinetic Engine',
  description: 'Solana payment gateway dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
