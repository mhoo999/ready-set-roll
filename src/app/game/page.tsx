'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/useGameStore'
import { useAutoRoll } from '@/hooks/useAutoRoll'
import TrackBoard from '@/components/TrackBoard'
import Dice3D from '@/components/Dice3D'
import ProgressBar from '@/components/ProgressBar'
import SidebarLogo from '@/components/SidebarLogo'
import LogPanel from '@/components/LogPanel'
import ResultOverlay from '@/components/ResultOverlay'

export default function GamePage() {
  const router = useRouter()

  // Drive the game loop
  useAutoRoll()

  const phase = useGameStore((s) => s.phase)
  const players = useGameStore((s) => s.players)
  const target = useGameStore((s) => s.target)
  const currentRollWinnerId = useGameStore((s) => s.currentRollWinnerId)
  const winnerId = useGameStore((s) => s.winnerId)
  const history = useGameStore((s) => s.history)
  const delayMs = useGameStore((s) => s.delayMs)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const resolveRoll = useGameStore((s) => s.resolveRoll)
  const resetGame = useGameStore((s) => s.resetGame)
  const rollCount = useGameStore((s) => s.rollCount)

  // Guard: if no players (direct navigation), redirect to setup
  useEffect(() => {
    if (phase === 'IDLE' && players.length === 0) {
      router.push('/')
    }
  }, [phase, players.length, router])

  function handleReset() {
    resetGame()
    router.push('/')
  }

  const currentWinner = players.find((p) => p.id === currentRollWinnerId)

  return (
    <main className="min-h-screen bg-[#0a0814] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
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
            ${phase === 'RESULT' ? 'bg-green-500/20 text-green-300' : ''}
            ${phase === 'DELAY' ? 'bg-blue-500/20 text-blue-300' : ''}
            ${phase === 'FINISHED' ? 'bg-yellow-500/20 text-yellow-300' : ''}
          `}>
            {phase}
          </span>
        </div>
        <div className="text-xs text-white/30">
          목표 <span className="text-white/60 font-mono">{target}칸</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Track + Log */}
        <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
          {/* Track board */}
          <div className="flex-1 overflow-auto">
            <TrackBoard
              players={players}
              target={target}
              currentRollWinnerId={currentRollWinnerId}
              winnerId={winnerId}
            />
          </div>

          {/* Log panel */}
          <LogPanel history={history} />
        </div>

        {/* Right sidebar: Dice + Logo */}
        <div className="w-44 flex flex-col border-l border-white/5 bg-black/20">
          {/* Logo at top */}
          <div className="flex items-center justify-center py-4 border-b border-white/5">
            <SidebarLogo />
          </div>

          {/* Dice 3D */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3">
            <Dice3D
              players={players}
              phase={phase}
              currentRollWinnerId={currentRollWinnerId}
              soundEnabled={soundEnabled}
              onAnimationComplete={resolveRoll}
            />

            {/* Current roll result */}
            {currentWinner && (phase === 'RESULT' || phase === 'DELAY' || phase === 'FINISHED') && (
              <div className="text-center">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-1">당첨</div>
                <div className="text-sm font-bold text-yellow-300 break-words text-center">
                  {currentWinner.name}
                </div>
              </div>
            )}
          </div>

          {/* Progress bar at bottom of sidebar */}
          <div className="p-3 border-t border-white/5">
            <ProgressBar phase={phase} delayMs={delayMs} />
          </div>
        </div>
      </div>

      {/* Winner overlay */}
      <ResultOverlay />
    </main>
  )
}
