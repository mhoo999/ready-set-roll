'use client'

import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import InputPanel from '@/components/InputPanel'
import ControlPanel from '@/components/ControlPanel'
import { computeTarget } from '@/lib/gameLogic'

export default function SetupPage() {
  const router = useRouter()
  const playerNames = useGameStore((s) => s.playerNames)
  const target = useGameStore((s) => s.target)
  const startGame = useGameStore((s) => s.startGame)

  const count = playerNames.length
  const effective = computeTarget(count, target)
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
        <p className="text-white/30 text-sm mt-2 tracking-widest uppercase">이름 기반 RNG 레이스</p>
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
          {canStart ? `🎲 게임 시작 (${count}명 · ${effective}칸)` : '참가자를 2명 이상 입력하세요'}
        </button>
      </div>

      <p className="mt-6 text-white/15 text-xs text-center">
        Vercel 배포 준비 완료 · 방송/스트리밍 최적화
      </p>
    </main>
  )
}
