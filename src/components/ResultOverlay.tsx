'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useGameStore } from '@/store/useGameStore'
import { playWin } from '@/lib/soundManager'

export default function ResultOverlay() {
  const phase = useGameStore((s) => s.phase)
  const winnerId = useGameStore((s) => s.winnerId)
  const players = useGameStore((s) => s.players)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const resetGame = useGameStore((s) => s.resetGame)

  const winner = players.find((p) => p.id === winnerId)

  useEffect(() => {
    if (phase !== 'FINISHED' || !winner) return

    if (soundEnabled) playWin()

    confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: ['#7C3AED', '#F5A623', '#EC4899', '#fff'] })
    confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: ['#7C3AED', '#F5A623', '#EC4899', '#fff'] })
  }, [phase, winner, soundEnabled])

  return (
    <AnimatePresence>
      {phase === 'FINISHED' && winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-gradient-to-br from-[#1a0a40] to-[#0d0820] border-2 border-yellow-400/60 rounded-3xl p-10 text-center shadow-[0_0_60px_rgba(245,166,35,0.4)] max-w-sm w-full mx-4"
          >
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-white/60 text-sm uppercase tracking-widest mb-2">Winner</p>
            <h1 className="text-4xl font-black text-yellow-300 mb-2 break-words">{winner.name}</h1>
            <p className="text-white/40 text-sm mb-8">결승선 도달!</p>
            <button
              onClick={resetGame}
              className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold px-8 py-3 rounded-xl transition-all duration-150 text-base"
            >
              다시 하기
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
