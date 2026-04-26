'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { useAutoRoll } from '@/hooks/useAutoRoll'
import TrackBoard from '@/components/TrackBoard'
import Dice3D from '@/components/Dice3D'
import ProgressBar from '@/components/ProgressBar'
import LogPanel from '@/components/LogPanel'
import ResultOverlay from '@/components/ResultOverlay'

export default function GamePage() {
  const router = useRouter()

  useAutoRoll()

  const phase = useGameStore((s) => s.phase)
  const players = useGameStore((s) => s.players)
  const target = useGameStore((s) => s.target)
  const currentRollWinnerId = useGameStore((s) => s.currentRollWinnerId)
  const pendingWinnerIdx = useGameStore((s) => s.pendingWinnerIdx)
  const winnerId = useGameStore((s) => s.winnerId)
  const history = useGameStore((s) => s.history)
  const delayMs = useGameStore((s) => s.delayMs)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const resolveRoll = useGameStore((s) => s.resolveRoll)
  const resetGame = useGameStore((s) => s.resetGame)

  useEffect(() => {
    if (phase === 'IDLE' && players.length === 0) {
      router.push('/')
    }
  }, [phase, players.length, router])

  function handleReset() {
    resetGame()
    router.push('/')
  }

  return (
    <main className="h-screen bg-[#0a0814] flex flex-col overflow-hidden">

      {/* Track — 70% of screen height */}
      <div className="flex-[7] min-h-0 overflow-hidden p-3">
        <TrackBoard
          players={players}
          target={target}
          currentRollWinnerId={currentRollWinnerId}
          winnerId={winnerId}
        />
      </div>

      {/* Bottom strip: Slot(70%) | Log+Button(30%) — 30% of screen height */}
      <div className="flex-[3] flex border-t border-white/5">

        {/* Slot area — 70% */}
        <div className="flex flex-col gap-2 px-4 py-3" style={{ width: '70%' }}>
          <Dice3D
            players={players}
            phase={phase}
            pendingWinnerIdx={pendingWinnerIdx}
            currentRollWinnerId={currentRollWinnerId}
            soundEnabled={soundEnabled}
            onAnimationComplete={resolveRoll}
          />
          <ProgressBar phase={phase} delayMs={delayMs} />
        </div>

        {/* Log area — 30% */}
        <div className="h-full flex flex-col overflow-hidden" style={{ width: '30%' }}>
          <button
            onClick={handleReset}
            className="flex-none w-full text-xs font-semibold text-white/40 hover:text-white/70
                       hover:bg-white/5 border-b border-white/10 py-2 px-3 transition-colors text-left"
          >
            ← 다시하기
          </button>
          <div className="flex-1 min-h-0 overflow-hidden">
            <LogPanel history={history} />
          </div>
        </div>

      </div>

      <ResultOverlay />
    </main>
  )
}
