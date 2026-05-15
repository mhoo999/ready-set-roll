import { create } from 'zustand'
import { type Player, type GamePhase, type GameEvent, parsePlayers, pickWinnerIndex } from '@/lib/gameLogic'
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
  currentEvent: GameEvent | null
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
  currentEvent: null,
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
      currentEvent: null,
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
      currentEvent: null,
      pendingWinnerIdx: null,
    })
  },

  // Pick winner here so Dice3D can align the reel before animation starts
  beginRoll: () => {
    const { players } = get()
    const pendingWinnerIdx = pickWinnerIndex(players.length)
    set({ phase: 'ROLLING', currentRollWinnerId: null, currentEvent: null, pendingWinnerIdx })
  },

  // Use the pre-picked winner — no second random draw
  resolveRoll: () => {
    const { players, lastWinnerId, target, history, rollCount, pendingWinnerIdx } = get()
    const idx = pendingWinnerIdx ?? pickWinnerIndex(players.length)
    const selected = players[idx]

    // Determine event: BACKWARD 5% (position > 1), TRIPLE 3%, then COMBO or NORMAL
    const rand = Math.random()
    let gameEvent: GameEvent
    if (rand < 0.05 && selected.position > 1) {
      gameEvent = 'BACKWARD'
    } else if (rand < 0.08) {
      gameEvent = 'TRIPLE'
    } else if (selected.id === lastWinnerId) {
      gameEvent = 'COMBO'
    } else {
      gameEvent = 'NORMAL'
    }

    const move =
      gameEvent === 'BACKWARD' ? -1 :
      gameEvent === 'TRIPLE'   ?  3 :
      gameEvent === 'COMBO'    ?  2 : 1

    const newPosition = selected.position + move
    const won = newPosition >= target

    const updatedPlayers = players.map((p) =>
      p.id === selected.id ? { ...p, position: newPosition } : p
    )

    let logEntry: string
    if (gameEvent === 'BACKWARD') {
      logEntry = `[${rollCount + 1}] ${selected.name} -1 → ${newPosition}칸 ⬇️`
    } else if (gameEvent === 'TRIPLE') {
      logEntry = `[${rollCount + 1}] ${selected.name} +3 (트리플) → ${newPosition}칸 ⚡`
    } else if (gameEvent === 'COMBO') {
      logEntry = `[${rollCount + 1}] ${selected.name} +2 (연속) → ${newPosition}칸`
    } else {
      logEntry = `[${rollCount + 1}] ${selected.name} +1 → ${newPosition}칸`
    }

    set({
      players: updatedPlayers,
      currentRollWinnerId: selected.id,
      lastWinnerId: selected.id,
      currentEvent: gameEvent,
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
      currentEvent: null,
      pendingWinnerIdx: null,
      history: [],
      rollCount: 0,
    })
  },
}))
