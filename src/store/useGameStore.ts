import { create } from 'zustand'
import { type Player, type GamePhase, parsePlayers, pickWinnerIndex } from '@/lib/gameLogic'
import { resetSpeechBubbleState } from '@/components/HorseToken'

type GameState = {
  playerNames: string[]
  delayMs: number
  target: number
  soundEnabled: boolean
  bgmEnabled: boolean
  autoStart: boolean
  players: Player[]
  phase: GamePhase
  lastWinnerId: string | null
  winnerId: string | null
  currentRollWinnerId: string | null
  pendingWinnerIdx: number | null
  history: string[]
  rollCount: number
}

type GameActions = {
  setPlayerNames: (raw: string) => void
  setTarget: (n: number) => void
  setSoundEnabled: (v: boolean) => void
  setBgmEnabled: (v: boolean) => void
  setAutoStart: (v: boolean) => void
  startGame: () => void
  restartGame: () => void
  resetGame: () => void
  beginRoll: () => void
  resolveRoll: () => void
  finishResult: () => void
}

export const useGameStore = create<GameState & GameActions>()((set, get) => ({
  playerNames: [],
  delayMs: 500,
  target: 12,
  soundEnabled: true,
  bgmEnabled: false,
  autoStart: true,
  players: [],
  phase: 'IDLE',
  lastWinnerId: null,
  winnerId: null,
  currentRollWinnerId: null,
  pendingWinnerIdx: null,
  history: [],
  rollCount: 0,

  setPlayerNames: (raw) => {
    const names = raw.split(',').map((s) => s.trim()).filter(Boolean)
    set({ playerNames: names })
  },
  setTarget: (n) => set({ target: n }),
  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setBgmEnabled: (v) => set({ bgmEnabled: v }),
  setAutoStart: (v) => set({ autoStart: v }),

  startGame: () => {
    const { playerNames } = get()
    const players = parsePlayers(playerNames)
    resetSpeechBubbleState()
    set({
      players,
      phase: 'START',
      history: [],
      rollCount: 0,
      lastWinnerId: null,
      winnerId: null,
      currentRollWinnerId: null,
      pendingWinnerIdx: null,
    })
  },

  restartGame: () => {
    const { playerNames } = get()
    const players = parsePlayers(playerNames)
    resetSpeechBubbleState()
    set({
      players,
      phase: 'START',
      history: [],
      rollCount: 0,
      lastWinnerId: null,
      winnerId: null,
      currentRollWinnerId: null,
      pendingWinnerIdx: null,
    })
  },

  // Pick winner here so Dice3D can align the reel before animation starts
  beginRoll: () => {
    const { players } = get()
    const pendingWinnerIdx = pickWinnerIndex(players.length)
    set({ phase: 'ROLLING', currentRollWinnerId: null, pendingWinnerIdx })
  },

  // Use the pre-picked winner — no second random draw
  resolveRoll: () => {
    const { players, lastWinnerId, target, history, rollCount, pendingWinnerIdx } = get()
    const idx = pendingWinnerIdx ?? pickWinnerIndex(players.length)
    const selected = players[idx]
    const isCombo = selected.id === lastWinnerId
    const move = isCombo ? 2 : 1
    const newPosition = selected.position + move
    const won = newPosition >= target

    const updatedPlayers = players.map((p) =>
      p.id === selected.id ? { ...p, position: newPosition } : p
    )
    const logEntry = isCombo
      ? `[${rollCount + 1}] ${selected.name} +2 (연속) → ${newPosition}칸`
      : `[${rollCount + 1}] ${selected.name} +1 → ${newPosition}칸`

    set({
      players: updatedPlayers,
      currentRollWinnerId: selected.id,
      lastWinnerId: selected.id,
      phase: won ? 'FINISHED' : 'RESULT',
      winnerId: won ? selected.id : null,
      history: [...history, logEntry],
      rollCount: rollCount + 1,
      pendingWinnerIdx: null,
    })
  },

  finishResult: () => {
    const { phase } = get()
    if (phase !== 'RESULT') return
    set({ phase: 'DELAY' })
  },

  resetGame: () => {
    resetSpeechBubbleState()
    set({
      players: [],
      phase: 'IDLE',
      lastWinnerId: null,
      winnerId: null,
      currentRollWinnerId: null,
      pendingWinnerIdx: null,
      history: [],
      rollCount: 0,
    })
  },
}))
