'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { type Player, type GamePhase } from '@/lib/gameLogic'
import { playRoll } from '@/lib/soundManager'

type Props = {
  players: Player[]
  phase: GamePhase
  pendingWinnerIdx: number | null
  currentRollWinnerId: string | null
  soundEnabled: boolean
  onAnimationComplete: () => void
}

const ITEM_H = 80   // px — must match h-20
const FRAMES = 10   // names to scroll past before landing

// Calculate reel start so that position FRAMES lands exactly on winnerIdx
function buildReel(players: Player[], winnerIdx: number): string[] {
  const n = players.length
  // (start + FRAMES) % n === winnerIdx  →  start = (winnerIdx - FRAMES % n + n) % n
  const start = ((winnerIdx - (FRAMES % n)) % n + n) % n
  return Array.from({ length: FRAMES + 1 }, (_, i) =>
    players[(start + i) % n].name
  )
}

export default function Dice3D({
  players,
  phase,
  pendingWinnerIdx,
  currentRollWinnerId,
  soundEnabled,
  onAnimationComplete,
}: Props) {
  const [reel, setReel] = useState<{ key: number; names: string[] }>({ key: 0, names: ['?'] })
  const [winnerName, setWinnerName] = useState<string | null>(null)
  const calledRef = useRef(false)

  useEffect(() => {
    if (phase !== 'ROLLING') {
      calledRef.current = false
      return
    }
    if (players.length === 0 || pendingWinnerIdx === null) return

    calledRef.current = false
    setWinnerName(null)
    if (soundEnabled) playRoll()

    // Build reel with winner guaranteed at the final position
    const names = buildReel(players, pendingWinnerIdx)
    setReel((prev) => ({ key: prev.key + 1, names }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  useEffect(() => {
    if ((phase === 'RESULT' || phase === 'FINISHED') && currentRollWinnerId) {
      const winner = players.find((p) => p.id === currentRollWinnerId)
      if (winner) setWinnerName(winner.name)
    }
  }, [phase, currentRollWinnerId, players])

  const isResult = phase === 'RESULT' || phase === 'FINISHED'
  const isRolling = phase === 'ROLLING'

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          relative w-32 h-20 overflow-hidden rounded-xl border-2 transition-colors duration-300 bg-[#0d0820]
          ${isResult
            ? 'border-yellow-400/70 shadow-[0_0_20px_rgba(245,166,35,0.4)]'
            : isRolling
            ? 'border-purple-400/60 shadow-[0_0_10px_rgba(124,58,237,0.3)]'
            : 'border-white/10'
          }
        `}
      >
        {/* Top gradient — masks names entering from above */}
        <div className="absolute top-0 inset-x-0 h-7 bg-gradient-to-b from-[#0d0820] to-transparent z-10 pointer-events-none" />
        {/* Bottom gradient — masks names exiting below */}
        <div className="absolute bottom-0 inset-x-0 h-7 bg-gradient-to-t from-[#0d0820] to-transparent z-10 pointer-events-none" />

        {/* Tape: remounts each roll via key, ends on winner */}
        <motion.div
          key={reel.key}
          className="flex flex-col"
          style={{ willChange: 'transform' }}
          initial={{ y: 0 }}
          animate={{ y: -(FRAMES * ITEM_H) }}
          transition={{
            duration: 2.2,
            ease: [0.05, 0.85, 0.25, 1.0],
          }}
          onAnimationComplete={() => {
            if (!calledRef.current) {
              calledRef.current = true
              onAnimationComplete()
            }
          }}
        >
          {reel.names.map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-center px-2 flex-shrink-0"
              style={{ height: ITEM_H }}
            >
              <span className="font-black text-sm text-center break-words leading-tight text-white select-none">
                {name}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Winner overlay — slides in from top after resolve */}
        <AnimatePresence>
          {winnerName && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-[#0d0820]/95 z-20 px-2"
              initial={{ y: '-100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
            >
              <span className="font-black text-sm text-center break-words leading-tight text-yellow-300 select-none">
                {winnerName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isResult && winnerName && (
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
