'use client'

import { useEffect, useRef } from 'react'
import { useGameStore } from '@/store/useGameStore'

export default function BgmPlayer() {
  const bgmEnabled = useGameStore((s) => s.bgmEnabled)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.5

    if (bgmEnabled) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('BGM play failed:', err)
        })
      }
    } else {
      audio.pause()
    }
  }, [bgmEnabled])

  return <audio ref={audioRef} src="/bgm/8bit-racing.wav" loop preload="auto" />
}
