'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HorseToken from './HorseToken'
import { type Player, type GameEvent } from '@/lib/gameLogic'

type Props = {
  players: Player[]
  target: number
  currentRollWinnerId: string | null
  winnerId: string | null
  currentEvent: GameEvent | null
}

type BannerInfo = { text: string; bg: string; shadow: string }

function getBannerInfo(event: GameEvent, playerName: string): BannerInfo | null {
  if (event === 'BACKWARD') return {
    text: `🌀 역주행!! ${playerName}`,
    bg: 'bg-red-600/90 border border-red-400/60',
    shadow: 'shadow-[0_0_40px_rgba(239,68,68,0.7)]',
  }
  if (event === 'TRIPLE') return {
    text: `⚡ 트리플 부스트!! ${playerName}`,
    bg: 'bg-gradient-to-r from-yellow-500/90 to-orange-500/90 border border-yellow-300/60',
    shadow: 'shadow-[0_0_50px_rgba(245,166,35,0.8)]',
  }
  if (event === 'COMBO') return {
    text: `🔥 연속 콤보!! ${playerName}`,
    bg: 'bg-purple-600/90 border border-purple-400/60',
    shadow: 'shadow-[0_0_40px_rgba(147,51,234,0.7)]',
  }
  return null
}

export default function TrackBoard({ players, target, currentRollWinnerId, winnerId, currentEvent }: Props) {
  const positions = players.map(p => p.position)
  const leaderPosition = positions.length ? Math.max(...positions) : 0
  const nonLeaderPositions = positions.filter(p => p !== leaderPosition)
  const runnerUpPosition = nonLeaderPositions.length ? Math.max(...nonLeaderPositions) : leaderPosition
  const leader = players.find(p => p.position === leaderPosition)

  const [banner, setBanner] = useState<BannerInfo | null>(null)
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!currentRollWinnerId || !currentEvent || currentEvent === 'NORMAL') {
      return
    }
    const player = players.find(p => p.id === currentRollWinnerId)
    const info = getBannerInfo(currentEvent, player?.name ?? '')
    if (!info) return
    setBanner(info)
    clearTimeout(bannerTimerRef.current)
    bannerTimerRef.current = setTimeout(() => setBanner(null), 2000)
  }, [currentRollWinnerId, currentEvent]) // eslint-disable-line react-hooks/exhaustive-deps

  const someoneIsActive = currentRollWinnerId !== null && !winnerId

  return (
    <div
      className="w-full h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1040] to-[#0d0820] p-4 flex flex-col justify-center relative overflow-hidden"
      style={{ perspective: '700px' }}
    >
      {/* Event banner overlay */}
      <AnimatePresence>
        {banner && (
          <motion.div
            key={banner.text}
            initial={{ opacity: 0, y: -20, scale: 0.75 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className={`text-white text-lg font-black px-6 py-2 rounded-2xl whitespace-nowrap tracking-wide ${banner.bg} ${banner.shadow}`}>
              {banner.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-[90%] mx-auto h-[90%] flex flex-col" style={{ transform: 'rotateX(9deg)', transformStyle: 'preserve-3d' }}>
        {/* Column headers */}
        <div className="flex-none flex mb-2 pl-28">
          {Array.from({ length: target + 1 }, (_, i) => (
            <div
              key={i}
              className={`flex-1 min-w-0 text-center text-xs font-mono
                ${i === target ? 'text-yellow-400 font-bold' : 'text-white/30'}
              `}
            >
              {i === target ? '🏁' : i}
            </div>
          ))}
        </div>

        {/* Player lanes */}
        <div className="flex-1 flex flex-col gap-0.5">
          {players.map((player) => {
            const isActive = player.id === currentRollWinnerId
            const isWinner = player.id === winnerId
            const isMoveBack = isActive && currentEvent === 'BACKWARD'
            const isTriple  = isActive && currentEvent === 'TRIPLE'
            const isCombo   = isActive && currentEvent === 'COMBO'
            const tiedCount = players.filter(o => o.id !== player.id && o.position === player.position).length

            // Lane background + border per event
            let laneBg: string
            if (isWinner) {
              laneBg = 'bg-yellow-400/10 border border-yellow-400/40'
            } else if (isActive && isMoveBack) {
              laneBg = 'bg-red-500/15 border border-red-500/50'
            } else if (isActive && isTriple) {
              laneBg = 'bg-yellow-500/15 border border-yellow-400/50'
            } else if (isActive) {
              laneBg = 'bg-purple-500/10 border border-purple-500/30'
            } else {
              laneBg = 'bg-white/5 border border-white/5'
            }

            // Spotlight: dim non-active lanes while rolling
            const dimmed = someoneIsActive && !isActive && !isWinner

            return (
              <motion.div
                key={player.id}
                animate={isActive ? { scaleY: 1.06, zIndex: 10 } : { scaleY: 1, zIndex: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                style={{ originY: 0.5, opacity: dimmed ? 0.45 : 1 }}
                className={`flex items-center rounded-lg flex-1 min-h-0 px-2 transition-colors duration-300 ${laneBg}`}
              >
                {/* Player name label */}
                <div className="w-24 flex-shrink-0 pr-2">
                  <span
                    className={`
                      text-sm font-semibold truncate block
                      ${isWinner ? 'text-yellow-300'
                        : isActive && isMoveBack ? 'text-red-400'
                        : isActive && isTriple  ? 'text-yellow-300'
                        : isActive ? 'text-purple-300'
                        : 'text-white/60'}
                    `}
                  >
                    {players.indexOf(player) + 1}. {player.name}
                  </span>
                </div>

                {/* Track cells */}
                <div className="flex flex-1 h-full relative">
                  {Array.from({ length: target + 1 }, (_, i) => (
                    <div
                      key={i}
                      className={`
                        flex-1 min-w-0 h-full flex items-center justify-center
                        border-l border-white/5 relative
                        ${i === target ? 'bg-yellow-400/5' : ''}
                      `}
                    >
                      {player.position === i && (
                        <motion.div
                          layoutId={`horse-${player.id}`}
                          layout
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                          <HorseToken
                            name={player.name}
                            playerId={player.id}
                            isActive={isActive}
                            isWinner={isWinner}
                            isCombo={isCombo}
                            isMoveBack={isMoveBack}
                            isTriple={isTriple}
                            leaderName={leader?.name ?? ''}
                            position={player.position}
                            target={target}
                            leaderPosition={leaderPosition}
                            runnerUpPosition={runnerUpPosition}
                            tiedCount={tiedCount}
                          />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
