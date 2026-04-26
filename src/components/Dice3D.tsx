'use client'

import { useEffect, useRef, useState } from 'react'
import { type Player, type GamePhase } from '@/lib/gameLogic'
import { playTick, playRoll } from '@/lib/soundManager'

type Props = {
  players: Player[]
  phase: GamePhase
  currentRollWinnerId: string | null
  soundEnabled: boolean
  onAnimationComplete: () => void
}

export default function Dice3D({ players, phase, currentRollWinnerId, soundEnabled, onAnimationComplete }: Props) {
  const [displayName, setDisplayName] = useState('?')
  const [flash, setFlash] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const calledRef = useRef(false)

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    if (phase !== 'ROLLING') {
      clearTimers()
      calledRef.current = false
      return
    }

    calledRef.current = false
    if (soundEnabled) playRoll()

    let interval = 60
    let step = 0
    const totalSteps = 14

    function tick() {
      const name = players[Math.floor(Math.random() * players.length)].name
      setDisplayName(name)
      setFlash((f) => !f)
      if (soundEnabled && step % 2 === 0) playTick()

      step++
      interval = Math.round(interval * 1.22)

      if (step < totalSteps) {
        const t = setTimeout(tick, interval)
        timersRef.current.push(t)
      } else {
        if (!calledRef.current) {
          calledRef.current = true
          const t = setTimeout(() => {
            onAnimationComplete()
          }, 200)
          timersRef.current.push(t)
        }
      }
    }

    const t = setTimeout(tick, interval)
    timersRef.current.push(t)

    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if ((phase === 'RESULT' || phase === 'FINISHED') && currentRollWinnerId) {
      const winner = players.find((p) => p.id === currentRollWinnerId)
      if (winner) setDisplayName(winner.name)
    }
  }, [phase, currentRollWinnerId, players])

  const isResult = phase === 'RESULT' || phase === 'FINISHED'
  const isRolling = phase === 'ROLLING'

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          w-28 h-28 rounded-2xl border-2 flex items-center justify-center
          text-center px-2 font-black text-sm leading-tight transition-colors duration-150
          ${isResult
            ? 'bg-gradient-to-br from-purple-600/40 to-pink-600/40 border-yellow-400/80 text-yellow-300 shadow-[0_0_24px_rgba(245,166,35,0.5)]'
            : isRolling
            ? 'bg-gradient-to-br from-purple-900/60 to-[#0d0820] border-purple-400/60 text-white'
            : 'bg-white/5 border-white/10 text-white/40'
          }
        `}
      >
        <span
          key={flash ? 'a' : 'b'}
          className={`
            block break-words w-full text-center
            ${isRolling ? 'animate-pulse' : ''}
            ${isResult ? 'text-base' : ''}
          `}
        >
          {displayName}
        </span>
      </div>

      {isResult && (
        <div className="text-[10px] text-yellow-400/70 uppercase tracking-widest font-semibold">
          당첨!
        </div>
      )}
    </div>
  )
}
