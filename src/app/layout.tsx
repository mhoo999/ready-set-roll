import type { Metadata } from 'next'
import './globals.css'
import BgmPlayer from '@/components/BgmPlayer'

export const metadata: Metadata = {
  metadataBase: new URL('https://ready-set-roll.vercel.app'),
  title: '추첨 프로그램 | 추첨기 사이트 - Ready Set Roll',
  description: '무료 추첨 프로그램, 핀볼 추첨기, 뽑기 역할을 하는 완벽한 웹 추첨기 사이트입니다. 간편하게 인원수와 당첨자를 설정하고 추첨을 즐겨보세요!',
  keywords: ['추첨 프로그램', '추첨기 사이트', '추첨기 프로그램', '추첨', '추첨 핀볼', '제비뽑기', '온라인 추첨'],
  openGraph: {
    title: '완벽한 무료 추첨 프로그램 - Ready Set Roll',
    description: '무료 추첨기 사이트에서 화려한 핀볼 스타일로 재밌게 추첨을 진행해보세요.',
    url: 'https://ready-set-roll.vercel.app',
    siteName: 'Ready Set Roll 추첨기',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    title: '완벽한 무료 추첨 프로그램 - Ready Set Roll',
    description: '무료 추첨기 사이트에서 화려한 핀볼 스타일로 재밌게 추첨을 진행해보세요.',
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0814]">
        <BgmPlayer />
        {children}
      </body>
    </html>
  )
}
