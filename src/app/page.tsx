'use client'

import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import InputPanel from '@/components/InputPanel'
import ControlPanel from '@/components/ControlPanel'

export default function SetupPage() {
  const router = useRouter()
  const playerNames = useGameStore((s) => s.playerNames)
  const target = useGameStore((s) => s.target)
  const startGame = useGameStore((s) => s.startGame)

  const count = playerNames.length
  const canStart = count >= 2

  function handleStart() {
    startGame()
    router.push('/game')
  }

  return (
    <main className="min-h-screen bg-[#0a0814] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-black tracking-tight">
          <span className="text-purple-400">READY</span>
          <span className="text-yellow-400">SET</span>
          <span className="text-pink-400">ROLL</span>
        </h1>
        <p className="text-white/30 text-sm mt-2 tracking-widest uppercase">추첨 시뮬레이터</p>
        <h2 className="sr-only">무료 이벤트 추첨, 웹 추첨기 사이트, 추첨 프로그램, 재미있는 추첨 핀볼</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <InputPanel />
        <div className="border-t border-white/10" />
        <ControlPanel />

        {/* Start button */}
        <button
          disabled={!canStart}
          onClick={handleStart}
          className={`
            w-full py-4 rounded-xl font-black text-lg tracking-wider transition-all duration-200
            ${canStart
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] active:scale-[0.98]'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
            }
          `}
        >
          {canStart ? `🎲 게임 시작 (${count}명 · ${target}칸)` : '참가자를 2명 이상 입력하세요'}
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 w-full max-w-lg text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <a
            href="https://www.thinghoon.com/"
            className="w-full sm:w-auto px-6 py-3 border border-white/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all active:translate-y-[1px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            다른 서비스 이용해보기
          </a>
          <a
            href="https://buymeacoffee.com/hoonsdev"
            className="w-full sm:w-auto px-6 py-3 border border-white/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-medium transition-all active:translate-y-[1px]"
            target="_blank"
            rel="noopener noreferrer"
          >
            개발자 커피 한잔 사주기
          </a>
        </div>
        <div className="text-white/40 text-sm">
          mhoo999@naver.com
        </div>
      </footer>
    </main>
  )
}
