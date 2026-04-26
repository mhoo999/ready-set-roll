import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ready Set Roll',
  description: '추첨 시뮬레이터',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0814]">{children}</body>
    </html>
  )
}
