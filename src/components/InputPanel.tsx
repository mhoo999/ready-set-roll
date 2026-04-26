'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'

export default function InputPanel() {
  const playerNames = useGameStore((s) => s.playerNames)
  const setPlayerNames = useGameStore((s) => s.setPlayerNames)
  const [raw, setRaw] = useState(playerNames.join(', '))

  const count = playerNames.length

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          참가자 이름 <span className="text-white/30 normal-case">(쉼표로 구분)</span>
        </label>
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 resize-none focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
          rows={4}
          placeholder="Alice, Bob, Charlie, ..."
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value)
            setPlayerNames(e.target.value)
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40">
          참가자:{' '}
          <span className={count < 2 ? 'text-red-400' : 'text-purple-300 font-bold'}>
            {count}명
          </span>
        </span>
        <div className="flex items-center gap-2">
          {count < 2 && <span className="text-red-400">최소 2명 필요</span>}
          {count >= 2 && (
            <button
              onClick={() => {
                const shuffled = [...playerNames].sort(() => Math.random() - 0.5)
                const newRaw = shuffled.join(', ')
                setRaw(newRaw)
                setPlayerNames(newRaw)
              }}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 border border-white/10 transition-all"
            >
              🔀 섞기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
