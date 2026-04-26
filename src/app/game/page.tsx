'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { useAutoRoll } from '@/hooks/useAutoRoll'
import TrackBoard from '@/components/TrackBoard'
import Dice3D from '@/components/Dice3D'
import ProgressBar from '@/components/ProgressBar'
import LogPanel from '@/components/LogPanel'
import BroadcastPanel from '@/components/BroadcastPanel'
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
  const bgmEnabled = useGameStore((s) => s.bgmEnabled)
  const resolveRoll = useGameStore((s) => s.resolveRoll)
  const setBgmEnabled = useGameStore((s) => s.setBgmEnabled)
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

      {/* Bottom strip: Slot(40%) | Broadcast(40%) | Log+Button(20%) — 30% of screen height */}
      <div className="flex-[3] min-h-0 overflow-hidden flex border-t border-white/5">

        {/* Slot area — 40% */}
        <div className="h-full flex flex-col gap-2 px-4 py-3" style={{ width: '40%' }}>
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

        {/* Broadcast area — 40% */}
        <div className="h-full" style={{ width: '40%' }}>
          <BroadcastPanel />
        </div>

        {/* Log area — 20% */}
        <div className="h-full flex flex-col overflow-hidden" style={{ width: '20%' }}>
          <div className="flex-none w-full border-b border-white/10 flex items-center">
            <button
              onClick={handleReset}
              className="flex-1 text-xs font-semibold text-white/40 hover:text-white/70
                         hover:bg-white/5 py-2 px-3 transition-colors text-left"
            >
              ← 다시하기
            </button>
            <button
              onClick={() => setBgmEnabled(!bgmEnabled)}
              className="flex-none text-xs font-semibold text-white/40 hover:text-white/70
                         hover:bg-white/5 py-2 px-3 transition-colors border-l border-white/10"
              title="배경음악 켜기/끄기"
            >
              {bgmEnabled ? '🔊 BGM' : '🔇 BGM'}
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <LogPanel history={history} />
          </div>
        </div>

      </div>

      <ResultOverlay />
    </main>
  )
}
