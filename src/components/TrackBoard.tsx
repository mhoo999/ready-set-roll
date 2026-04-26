'use client'

import { motion } from 'framer-motion'
import HorseToken from './HorseToken'
import { type Player } from '@/lib/gameLogic'

type Props = {
  players: Player[]
  target: number
  currentRollWinnerId: string | null
  winnerId: string | null
}

export default function TrackBoard({ players, target, currentRollWinnerId, winnerId }: Props) {
  return (
    <div
      className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-b from-[#1a1040] to-[#0d0820] p-4"
      style={{ perspective: '800px' }}
    >
      <div style={{ transform: 'rotateX(6deg)', transformStyle: 'preserve-3d' }}>
        {/* Column headers */}
        <div className="flex mb-2 pl-28">
          {Array.from({ length: target + 1 }, (_, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-12 text-center text-xs font-mono
                ${i === target ? 'text-yellow-400 font-bold' : 'text-white/30'}
              `}
            >
              {i === target ? '🏁' : i}
            </div>
          ))}
        </div>

        {/* Player lanes */}
        <div className="flex flex-col gap-1.5">
          {players.map((player, laneIdx) => {
            const isActive = player.id === currentRollWinnerId
            const isWinner = player.id === winnerId

            return (
              <div
                key={player.id}
                className={`
                  flex items-center rounded-lg h-14 px-2
                  ${isWinner ? 'bg-yellow-400/10 border border-yellow-400/40' : isActive ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-white/5 border border-white/5'}
                  transition-colors duration-300
                `}
              >
                {/* Player name label */}
                <div className="w-24 flex-shrink-0 pr-2">
                  <span
                    className={`
                      text-sm font-semibold truncate block
                      ${isWinner ? 'text-yellow-300' : isActive ? 'text-purple-300' : 'text-white/60'}
                    `}
                  >
                    {laneIdx + 1}. {player.name}
                  </span>
                </div>

                {/* Track cells */}
                <div className="flex flex-1 relative">
                  {Array.from({ length: target + 1 }, (_, i) => (
                    <div
                      key={i}
                      className={`
                        flex-shrink-0 w-12 h-10 flex items-center justify-center
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
                            isActive={isActive}
                            isWinner={isWinner}
                          />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
