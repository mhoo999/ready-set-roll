'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { type Player, type GamePhase } from '@/lib/gameLogic'
import { playTick, playRoll } from '@/lib/soundManager'

type Props = {
  players: Player[]
  phase: GamePhase
  currentRollWinnerId: string | null
  soundEnabled: boolean
  onAnimationComplete: () => void
}

type SlotItem = { name: string; id: number; duration: number }

export default function Dice3D({ players, phase, currentRollWinnerId, soundEnabled, onAnimationComplete }: Props) {
  const [current, setCurrent] = useState<SlotItem>({ name: '?', id: 0, duration: 200 })
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const calledRef = useRef(false)
  const idRef = useRef(0)

  function clearTimers() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    if (phase !== 'ROLLING') {
      clearTimers()
      calledRef.current = false
      return
    }
    if (players.length === 0) return

    calledRef.current = false
    if (soundEnabled) playRoll()

    const TOTAL_STEPS = 8
    const MULTIPLIER = 1.45
    let interval = 60
    let step = 0

    function tick() {
      const name = players[Math.floor(Math.random() * players.length)].name
      idRef.current += 1
      const dur = interval
      setCurrent({ name, id: idRef.current, duration: dur })
      if (soundEnabled) playTick()

      step++
      interval = Math.round(interval * MULTIPLIER)

      if (step < TOTAL_STEPS) {
        const t = setTimeout(tick, dur)
        timersRef.current.push(t)
      } else {
        if (!calledRef.current) {
          calledRef.current = true
          // Wait for last name to visually land, then resolve
          const t = setTimeout(onAnimationComplete, dur + 120)
          timersRef.current.push(t)
        }
      }
    }

    tick()
    return clearTimers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Show winner when resolved
  useEffect(() => {
    if ((phase === 'RESULT' || phase === 'FINISHED') && currentRollWinnerId) {
      const winner = players.find((p) => p.id === currentRollWinnerId)
      if (winner) {
        idRef.current += 1
        setCurrent({ name: winner.name, id: idRef.current, duration: 350 })
      }
    }
  }, [phase, currentRollWinnerId, players])

  const isResult = phase === 'RESULT' || phase === 'FINISHED'
  const isRolling = phase === 'ROLLING'

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Slot reel window */}
      <div
        className={`
          relative w-32 h-20 overflow-hidden rounded-xl border-2 transition-colors duration-300
          bg-[#0d0820]
          ${isResult
            ? 'border-yellow-400/70 shadow-[0_0_20px_rgba(245,166,35,0.4)]'
            : isRolling
            ? 'border-purple-400/60 shadow-[0_0_10px_rgba(124,58,237,0.3)]'
            : 'border-white/10'
          }
        `}
      >
        {/* Top fade — hides partially visible name above */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-[#0d0820] to-transparent z-10 pointer-events-none" />
        {/* Bottom fade — hides partially visible name below */}
        <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-[#0d0820] to-transparent z-10 pointer-events-none" />

        <AnimatePresence initial={false}>
          <motion.div
            key={current.id}
            initial={{ y: '-100%', opacity: 0.5 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0.5 }}
            transition={{ duration: current.duration / 1000, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center px-2"
          >
            <span
              className={`
                font-black text-sm text-center break-words leading-tight select-none
                ${isResult ? 'text-yellow-300' : 'text-white'}
              `}
            >
              {current.name}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {isResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] text-yellow-400/80 uppercase tracking-widest font-semibold"
        >
          당첨!
        </motion.div>
      )}
    </div>
  )
}
