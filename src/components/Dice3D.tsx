'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { type Player, type GamePhase } from '@/lib/gameLogic'
import { playTick, playRoll } from '@/lib/soundManager'

type Props = {
  players: Player[]
  phase: GamePhase
  currentRollWinnerId: string | null
  soundEnabled: boolean
  onAnimationComplete: () => void
}

const FACE_ROTATIONS = [
  { rotateX: 0, rotateY: 0 },      // front
  { rotateX: 0, rotateY: 180 },    // back
  { rotateX: 0, rotateY: -90 },    // left
  { rotateX: 0, rotateY: 90 },     // right
  { rotateX: -90, rotateY: 0 },    // top
  { rotateX: 90, rotateY: 0 },     // bottom
]

function getFaceNames(players: Player[]): string[] {
  if (players.length === 0) return ['?', '?', '?', '?', '?', '?']
  return Array.from({ length: 6 }, (_, i) => players[i % players.length].name)
}

function getWinnerFaceRotation(): { rotateX: number; rotateY: number } {
  // Top face shows winner: rotateX(90) puts top face forward-ish
  // We rotate so face index 4 (top, rotateX: -90) becomes visible
  return { rotateX: 90, rotateY: 0 }
}

export default function Dice3D({ players, phase, currentRollWinnerId, soundEnabled, onAnimationComplete }: Props) {
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 })
  const [faceNames, setFaceNames] = useState<string[]>(getFaceNames(players))
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const calledRef = useRef(false)

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  useEffect(() => {
    setFaceNames(getFaceNames(players))
  }, [players])

  useEffect(() => {
    if (phase !== 'ROLLING') {
      clearTimers()
      calledRef.current = false
      return
    }

    calledRef.current = false
    if (soundEnabled) playRoll()

    let interval = 80
    let step = 0
    const totalSteps = 22

    function tick() {
      setFaceNames(getFaceNames(players))
      setRotation({
        rotateX: Math.floor(Math.random() * 4) * 90 + step * 15,
        rotateY: Math.floor(Math.random() * 4) * 90 + step * 20,
      })
      if (soundEnabled && step % 2 === 0) playTick()
      step++
      interval = Math.round(interval * 1.18)

      if (step < totalSteps) {
        const t = setTimeout(tick, interval)
        timersRef.current.push(t)
      } else {
        if (!calledRef.current) {
          calledRef.current = true
          // Settle the dice before resolving
          setRotation(getWinnerFaceRotation())
          const t = setTimeout(() => {
            onAnimationComplete()
          }, 400)
          timersRef.current.push(t)
        }
      }
    }

    const t = setTimeout(tick, interval)
    timersRef.current.push(t)

    return clearTimers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // After resolving, update top face to show winner name
  useEffect(() => {
    if (phase === 'RESULT' || phase === 'FINISHED') {
      if (currentRollWinnerId !== null) {
        const winner = players.find((p) => p.id === currentRollWinnerId)
        if (winner) {
          setFaceNames((prev) => {
            const next = [...prev]
            // face index 4 = top face (shown when rotateX=90)
            next[4] = winner.name
            return next
          })
          setRotation(getWinnerFaceRotation())
        }
      }
    }
  }, [phase, currentRollWinnerId, players])

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 120, height: 120, perspective: 600 }}>
        <motion.div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateX: rotation.rotateX,
            rotateY: rotation.rotateY,
          }}
          transition={
            phase === 'ROLLING'
              ? { duration: 0.12, ease: 'linear' }
              : { duration: 0.5, ease: 'easeOut' }
          }
        >
          {FACE_ROTATIONS.map((rot, i) => (
            <div
              key={i}
              className={`
                absolute inset-0 flex items-center justify-center rounded-xl border-2
                text-sm font-bold text-center px-2 leading-tight
                ${i === 4
                  ? 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400 text-white shadow-[0_0_20px_rgba(124,58,237,0.8)]'
                  : 'bg-gradient-to-br from-[#1e1040] to-[#0d0820] border-white/20 text-white/80'
                }
              `}
              style={{
                backfaceVisibility: 'hidden',
                transform: `rotateX(${rot.rotateX}deg) rotateY(${rot.rotateY}deg) translateZ(60px)`,
              }}
            >
              {faceNames[i]}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Winner label */}
      {(phase === 'RESULT' || phase === 'FINISHED') && currentRollWinnerId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <span className="text-yellow-400 font-bold text-lg">
            {players.find((p) => p.id === currentRollWinnerId)?.name}
          </span>
        </motion.div>
      )}
    </div>
  )
}
