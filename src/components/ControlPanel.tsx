'use client'

import { useGameStore } from '@/store/useGameStore'
import { computeTarget } from '@/lib/gameLogic'

export default function ControlPanel() {
  const delayMs = useGameStore((s) => s.delayMs)
  const target = useGameStore((s) => s.target)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const autoStart = useGameStore((s) => s.autoStart)
  const playerNames = useGameStore((s) => s.playerNames)
  const setDelay = useGameStore((s) => s.setDelay)
  const setTarget = useGameStore((s) => s.setTarget)
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled)
  const setAutoStart = useGameStore((s) => s.setAutoStart)

  const count = playerNames.length
  const effective = computeTarget(count, target)

  return (
    <div className="flex flex-col gap-4">
      {/* Delay slider */}
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          롤 간격 <span className="text-purple-300 ml-1">{(delayMs / 1000).toFixed(1)}s</span>
        </label>
        <input
          type="range"
          min={1000}
          max={4000}
          step={100}
          value={delayMs}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
        <div className="flex justify-between text-[10px] text-white/20 mt-1">
          <span>빠름 1s</span>
          <span>느림 4s</span>
        </div>
      </div>

      {/* Target squares */}
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          목표 칸 <span className="text-purple-300 ml-1">{effective}칸</span>
          {effective < target && <span className="text-yellow-400 ml-1 text-[10px]">(자동조정)</span>}
        </label>
        <input
          type="number"
          min={6}
          max={30}
          value={target}
          onChange={(e) => {
            const v = Math.max(6, Math.min(30, Number(e.target.value)))
            setTarget(v)
          }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-all"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-3">
        <Toggle label="사운드" value={soundEnabled} onChange={setSoundEnabled} />
        <Toggle label="자동진행" value={autoStart} onChange={setAutoStart} />
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`
        flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all
        ${value
          ? 'bg-purple-600/30 border-purple-500/60 text-purple-300'
          : 'bg-white/5 border-white/10 text-white/30'
        }
      `}
    >
      <span className={`w-2 h-2 rounded-full ${value ? 'bg-purple-400' : 'bg-white/20'}`} />
      {label}
    </button>
  )
}
