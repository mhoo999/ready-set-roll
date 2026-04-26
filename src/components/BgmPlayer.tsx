'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/useGameStore'

export default function BgmPlayer() {
  const bgmEnabled = useGameStore((s) => s.bgmEnabled)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/bgm/8bit-racing.wav')
      audioRef.current.loop = true
      audioRef.current.volume = 0.5
    }

    if (bgmEnabled) {
      audioRef.current.play().catch((err) => {
        console.warn('BGM play failed, usually due to browser policy:', err)
      })
    } else {
      audioRef.current.pause()
    }

    return () => {
      // Don't stop on unmount if we want continuous playback across pages,
      // but since BgmPlayer is in root layout, it won't unmount on page navigation.
    }
  }, [bgmEnabled])

  return null
}
