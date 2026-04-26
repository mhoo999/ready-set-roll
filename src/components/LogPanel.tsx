'use client'

import { useEffect, useRef } from 'react'

type Props = {
  history: string[]
}

export default function LogPanel({ history }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div className="flex flex-col h-full border-l border-white/10 bg-white/5 overflow-hidden">
      <div className="flex-none px-3 py-2 border-b border-white/10 text-xs font-semibold text-white/50 uppercase tracking-wider">
        기록 ({history.length})
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
        {history.length === 0 && (
          <p className="text-white/20 text-xs text-center py-4">기록 없음</p>
        )}
        {history.map((entry, i) => {
          const isCombo = entry.includes('연속')
          return (
            <div
              key={i}
              className={`
                text-xs font-mono px-2 py-1 rounded
                ${isCombo ? 'text-yellow-300 bg-yellow-400/10' : 'text-white/60 bg-white/5'}
              `}
            >
              {entry}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
