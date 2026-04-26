import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ready Set Roll',
  description: '방송용 이름 기반 RNG 레이스 게임',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0814]">{children}</body>
    </html>
  )
}
