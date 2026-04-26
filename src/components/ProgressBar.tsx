'use client'

import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { type GamePhase } from '@/lib/gameLogic'

type Props = {
  phase: GamePhase
  delayMs: number
}

export default function ProgressBar({ phase, delayMs }: Props) {
  const controls = useAnimation()
  const prevPhaseRef = useRef<GamePhase>('IDLE')

  useEffect(() => {
    if (phase === 'DELAY') {
      controls.set({ scaleX: 0 })
      controls.start({ scaleX: 1, transition: { duration: delayMs / 1000, ease: 'linear' } })
    } else if (phase === 'ROLLING') {
      controls.set({ scaleX: 1 })
    } else {
      controls.stop()
    }
    prevPhaseRef.current = phase
  }, [phase, delayMs, controls])

  const isActive = phase === 'DELAY' || phase === 'RESULT'

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1 text-xs text-white/40 font-mono">
        <span>NEXT ROLL</span>
        <span>{phase === 'DELAY' ? `${(delayMs / 1000).toFixed(1)}s` : '—'}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full origin-left ${isActive ? 'bg-purple-500' : 'bg-white/20'}`}
          animate={controls}
          initial={{ scaleX: 0 }}
        />
      </div>
    </div>
  )
}
