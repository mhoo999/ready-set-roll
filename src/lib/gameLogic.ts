export type Player = {
  id: string
  name: string
  position: number
}

export type GamePhase = 'IDLE' | 'START' | 'ROLLING' | 'RESULT' | 'DELAY' | 'FINISHED'

export type GameEvent = 'NORMAL' | 'COMBO' | 'BACKWARD' | 'TRIPLE'

export function parsePlayers(names: string[]): Player[] {
  return names.map((name, i) => ({ id: String(i), name, position: 0 }))
}

export function computeTarget(playerCount: number, userTarget: number): number {
  if (playerCount >= 20) return Math.min(userTarget, 6)
  if (playerCount >= 10) return Math.min(userTarget, 8)
  return userTarget
}

export function pickWinnerIndex(playerCount: number): number {
  return Math.floor(Math.random() * playerCount)
}
