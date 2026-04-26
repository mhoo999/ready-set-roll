'use client'

import { useGameStore } from '@/store/useGameStore'

export default function ControlPanel() {
  const target = useGameStore((s) => s.target)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const bgmEnabled = useGameStore((s) => s.bgmEnabled)
  const setTarget = useGameStore((s) => s.setTarget)
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled)
  const setBgmEnabled = useGameStore((s) => s.setBgmEnabled)

  return (
    <div className="flex flex-col gap-4">
      {/* Target squares */}
      <div>
        <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
          목표 칸 <span className="text-purple-300 ml-1">{target}칸</span>
        </label>
        <input
          type="number"
          min={2}
          value={target}
          onChange={(e) => {
            const v = Math.max(2, Number(e.target.value))
            if (!isNaN(v)) setTarget(v)
          }}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-all"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-3">
        <Toggle label="사운드 효과" value={soundEnabled} onChange={setSoundEnabled} />
        <Toggle label="배경음악" value={bgmEnabled} onChange={setBgmEnabled} />
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
