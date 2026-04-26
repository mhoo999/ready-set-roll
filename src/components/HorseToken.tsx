'use client'

import { motion } from 'framer-motion'

type Props = {
  name: string
  isActive: boolean
  isWinner: boolean
}

export default function HorseToken({ name, isActive, isWinner }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center gap-0.5"
      animate={
        isActive
          ? { y: [0, -10, 0], scale: [1, 1.15, 1] }
          : isWinner
          ? { scale: [1, 1.2, 1] }
          : {}
      }
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        className={`
          text-2xl select-none transition-all duration-200
          ${isWinner ? 'animate-bounce' : isActive ? 'drop-shadow-[0_0_8px_rgba(245,166,35,0.9)]' : ''}
        `}
        style={{
          animation: isActive || isWinner ? 'horseRun 0.35s steps(2) infinite' : 'horseRun 0.6s steps(2) infinite',
        }}
      >
        🏇
      </div>
      <span
        className={`
          text-[9px] font-bold px-1 py-0.5 rounded max-w-[48px] truncate text-center leading-none
          ${isWinner ? 'bg-yellow-400 text-black' : isActive ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'}
        `}
      >
        {name}
      </span>
    </motion.div>
  )
}
