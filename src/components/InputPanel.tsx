'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/useGameStore'
import { computeTarget } from '@/lib/gameLogic'

export default function InputPanel() {
  const playerNames = useGameStore((s) => s.playerNames)
  const target = useGameStore((s) => s.target)
  const setPlayerNames = useGameStore((s) => s.setPlayerNames)
  const [raw, setRaw] = useState(playerNames.join(', '))

  const count = playerNames.length
  const effective = computeTarget(count, target)
  const autoBalanced = effective < target

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
        {autoBalanced && (
          <span className="text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
            ⚡ 자동조정 → {effective}칸
          </span>
        )}
        {count < 2 && (
          <span className="text-red-400">최소 2명 필요</span>
        )}
      </div>
    </div>
  )
}
