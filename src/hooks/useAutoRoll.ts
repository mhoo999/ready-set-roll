'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/useGameStore'

export function useAutoRoll() {
  const phase = useGameStore((s) => s.phase)
  const delayMs = useGameStore((s) => s.delayMs)
  const autoStart = useGameStore((s) => s.autoStart)
  const beginRoll = useGameStore((s) => s.beginRoll)
  const finishResult = useGameStore((s) => s.finishResult)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (phase === 'START') {
      timerRef.current = setTimeout(beginRoll, 0)
    } else if (phase === 'DELAY') {
      timerRef.current = setTimeout(beginRoll, delayMs)
    } else if (phase === 'RESULT' && autoStart) {
      timerRef.current = setTimeout(finishResult, 800)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, delayMs, autoStart, beginRoll, finishResult])
}
