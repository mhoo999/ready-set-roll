'use client'

import { motion } from 'framer-motion'

type Props = {
  name: string
  isActive: boolean
  isWinner: boolean
}

export default function HorseToken({ isActive, isWinner }: Props) {
  return (
    <motion.div
      animate={
        isActive
          ? { y: [0, -6, 0], scale: [1, 1.15, 1] }
          : isWinner
          ? { scale: [1, 1.2, 1] }
          : {}
      }
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div
        className={`
          text-xl select-none leading-none
          ${isWinner ? 'drop-shadow-[0_0_6px_rgba(245,166,35,0.9)]' : isActive ? 'drop-shadow-[0_0_6px_rgba(124,58,237,0.9)]' : ''}
        `}
        style={{
          animation: isActive || isWinner ? 'horseRun 0.35s steps(2) infinite' : 'horseRun 0.6s steps(2) infinite',
        }}
      >
        🏇
      </div>
    </motion.div>
  )
}
