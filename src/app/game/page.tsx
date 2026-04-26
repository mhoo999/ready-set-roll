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
  const rollCount = useGameStore((s) => s.rollCount)

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

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4 py-2 border-b border-white/5">
        <button
          onClick={handleReset}
          className="text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          ← 처음으로
        </button>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="font-mono">Roll #{rollCount}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase
            ${phase === 'ROLLING' ? 'bg-purple-500/20 text-purple-300 animate-pulse' : ''}
            ${phase === 'RESULT'  ? 'bg-green-500/20 text-green-300'   : ''}
            ${phase === 'DELAY'   ? 'bg-blue-500/20  text-blue-300'    : ''}
            ${phase === 'FINISHED'? 'bg-yellow-500/20 text-yellow-300' : ''}
          `}>
            {phase}
          </span>
        </div>
        <div className="text-xs text-white/30">
          목표 <span className="text-white/60 font-mono">{target}칸</span>
        </div>
      </div>

      {/* Track — fills remaining space */}
      <div className="flex-1 min-h-0 overflow-auto p-3">
        <TrackBoard
          players={players}
          target={target}
          currentRollWinnerId={currentRollWinnerId}
          winnerId={winnerId}
        />
      </div>

      {/* Bottom strip: Slot(7) | Log(3) — fixed height so track always fills the rest */}
      <div className="flex-none flex border-t border-white/5 h-[90px]">

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
        <div className="h-full overflow-hidden" style={{ width: '30%' }}>
          <LogPanel history={history} />
        </div>

      </div>

      <ResultOverlay />
    </main>
  )
}
