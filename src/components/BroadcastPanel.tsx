'use client'

import { useEffect, useState, useRef } from 'react'
import { useGameStore } from '@/store/useGameStore'

type BroadcastMessage = {
  id: string
  text: string
  type: 'system' | 'hype' | 'result' | 'backward' | 'finish'
}

const EARLY_HYPE = [
  "초반 레이스! 아직은 서로의 눈치를 살피는 탐색전입니다.",
  "이제 막 출발선을 벗어났습니다! 과연 초반 기세를 잡을 선수는?!",
  "경주 초반, 아직은 순위 변동의 여지가 충분합니다!",
  "모두가 팽팽한 긴장감 속에서 질주를 시작합니다!",
]

const LATE_SINGLE_LEADER_HYPE = [
  (name: string) => `결승선이 코앞입니다! 선두 ${name} 선수가 이대로 우승을 거머쥘까요?!`,
  (name: string) => `${name} 선수의 단독 선두! 과연 이변 없이 결승선을 통과할 수 있을지!`,
  (name: string) => `막판 스퍼트! ${name} 선수가 1위를 굳힐 수 있을 것인가!`,
]

const LATE_MULTI_LEADER_HYPE = [
  "결승선이 눈앞인데 공동 선두입니다! 손에 땀을 쥐게 하는 명승부!",
  "마지막 순간까지 알 수 없는 승부! 우승컵의 향방은 과연 어디로?!",
  "엄청난 접전! 마지막 한 걸음이 승패를 가릅니다!",
]

const MID_SINGLE_LEADER_HYPE = [
  (name: string) => `단독 1위 ${name} 선수를 잡기 위해 후발 주자들이 거세게 추격합니다!`,
  (name: string) => `${name} 선수의 무서운 독주! 뒤따르는 선수들도 페이스를 끌어올려야 합니다!`,
  (name: string) => `선두는 ${name}! 하지만 아직 안심하긴 이릅니다!`,
]

const MID_MULTI_LEADER_HYPE = [
  (names: string) => `${names}의 치열한 선두 다툼! 팽팽한 균형을 깰 선수는 누구일까요!`,
  (names: string) => `선두 그룹 ${names}의 엎치락뒤치락 접전! 눈을 뗄 수 없습니다!`,
  (names: string) => `누가 먼저 치고 나갈지 모르는 상황! ${names}의 각축전이 벌어집니다!`,
]

const FALLBACK_HYPE = [
  "자, 박진감 넘치는 경주! 힘차게 주사위가 구릅니다!",
  "뜨거운 열기 속에서, 다음 승부처를 향해 달립니다!",
  "긴장의 끈을 놓을 수 없는 상황! 맹렬한 기세가 이어집니다!",
]

const RESULT_COMBO_ONLY_FIRST = [
  (name: string) => `🚀 단독 선두 등극!! [${name}], 엄청난 가속으로 1위로 치고 나갑니다!!`,
  (name: string) => `🔥 기어코 1위를 탈환합니다! [${name}]의 놀라운 연속 스퍼트!`,
  (name: string) => `👑 무서운 집념입니다! [${name}], 연속 질주로 기어이 선두 자리를 꿰찹니다!`,
]

const RESULT_COMBO_NORMAL = [
  (name: string) => `🚀 [${name}], 무서운 뒷심으로 2연속 전진!! 단숨에 격차를 좁힙니다!`,
  (name: string) => `🌪️ 대박 콤보! [${name}], 멈추지 않는 가속도로 다른 선수들을 위협합니다!`,
  (name: string) => `💥 거침없는 돌파! [${name}], 2연속 질주로 순위를 바짝 끌어올립니다!`,
]

const RESULT_NORMAL_ONLY_FIRST = [
  (name: string) => `👑 [${name}], 선두로 나섭니다! 다른 선수들이 맹추격해야 할 상황!`,
  (name: string) => `✨ 깔끔한 질주로 1위를 차지하는 [${name}]! 이제 방어전이 시작됩니다!`,
  (name: string) => `🏃‍♂️ [${name}], 여유롭게 앞서가며 레이스를 주도합니다!`,
]

const RESULT_NORMAL_TIED_FIRST = [
  (name: string) => `🔥 [${name}]도 1위 그룹에 합류! 숨막히는 선두 경쟁이 펼쳐집니다!`,
  (name: string) => `⚔️ 만만치 않네요! [${name}], 다시 선두를 나란히 하며 긴장감을 높입니다!`,
  (name: string) => `📈 [${name}]의 합류로 공동 1위! 정말 한 치 앞도 알 수 없군요!`,
]

const RESULT_NORMAL_LAST = [
  (name: string) => `💪 [${name}], 아직 포기하지 않았습니다! 뒤에서 묵묵히 거리를 좁혀옵니다!`,
  (name: string) => `🔥 역전의 발판을 마련하나요! [${name}], 영차영차 추격의 불씨를 살립니다!`,
  (name: string) => `🏃‍♂️ 끝날 때까지 끝난 게 아닙니다! [${name}], 끈기 있게 따라붙습니다!`,
]

const RESULT_NORMAL_MID = [
  (name: string) => `🏃‍♂️ [${name}], 훌륭한 페이스를 유지하며 순조롭게 전진합니다!`,
  (name: string) => `💨 발걸음이 가벼운 [${name}]! 안정적인 호흡으로 앞으로 나아갑니다!`,
  (name: string) => `✨ [${name}] 선수, 기회를 놓치지 않고 차분히 거리를 좁힙니다!`,
]

const FALLBACK_RESULT = [
  (name: string) => `🏃‍♂️ [${name}], 거침없이 치고 나갑니다!`,
  (name: string) => `⚡ [${name}], 멈추지 않는 질주!`,
]

const RESULT_BACKWARD = [
  (name: string) => `😱 어이없는 사고!! [${name}] 선수가 한 칸 뒤로 물러납니다!`,
  (name: string) => `⚡ 대역전의 변수!! [${name}] 선수, 갑자기 뒤로 밀려납니다!`,
  (name: string) => `💨 아뿔싸! [${name}] 선수가 미끄러지며 한 칸 후퇴합니다!`,
  (name: string) => `🌀 황당한 역주행! [${name}] 선수가 뒤로 한 칸 물러납니다!`,
  (name: string) => `😨 청천벽력!! [${name}] 선수에게 불운이 찾아왔습니다!`,
]

const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export default function BroadcastPanel() {
  const phase = useGameStore(s => s.phase)
  const history = useGameStore(s => s.history)
  const players = useGameStore(s => s.players)
  const winnerId = useGameStore(s => s.winnerId)
  const rollCount = useGameStore(s => s.rollCount)
  const target = useGameStore(s => s.target)
  
  const [messages, setMessages] = useState<BroadcastMessage[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  
  // Track previous states to avoid duplicate messages
  const lastHypeCount = useRef<number>(0)
  const lastHistoryCount = useRef<number>(0)
  const lastPhase = useRef<string>('IDLE')

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // System & Hype logic based on Phase
  useEffect(() => {
    if (phase === 'START' && lastPhase.current !== 'START') {
      setMessages([{
        id: Date.now().toString(),
        text: "🎙️ 경기가 곧 시작됩니다! 선수들 출발선에 정렬했습니다!",
        type: 'system'
      }])
    } else if (phase === 'ROLLING' && rollCount === lastHypeCount.current) {
      lastHypeCount.current += 1
      
      let hypeText = ''
      if (players.length > 0) {
        const sorted = [...players].sort((a, b) => b.position - a.position)
        const maxPos = sorted[0].position
        const firstPlacePlayers = sorted.filter(p => p.position === maxPos)
        
        const isEarly = maxPos <= 2
        const isLate = maxPos >= target - 2
        
        if (isEarly) {
          hypeText = getRandom(EARLY_HYPE)
        } else if (isLate) {
          if (firstPlacePlayers.length === 1) {
            hypeText = getRandom(LATE_SINGLE_LEADER_HYPE)(firstPlacePlayers[0].name)
          } else {
            hypeText = getRandom(LATE_MULTI_LEADER_HYPE)
          }
        } else {
          if (firstPlacePlayers.length === 1) {
            hypeText = getRandom(MID_SINGLE_LEADER_HYPE)(firstPlacePlayers[0].name)
          } else if (firstPlacePlayers.length > 1) {
            const names = firstPlacePlayers.map(p => p.name).join(', ')
            hypeText = getRandom(MID_MULTI_LEADER_HYPE)(names)
          }
        }
      } else {
        hypeText = getRandom(FALLBACK_HYPE)
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'hype',
        text: `🎙️ ${hypeText}`,
        type: 'hype'
      }])
    } else if (phase === 'FINISHED' && winnerId && lastPhase.current !== 'FINISHED') {
      const winner = players.find(p => p.id === winnerId)
      if (winner) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'finish',
          text: `🏆 결승선 통과!!! 영광의 우승은 [${winner.name}] 입니다!!!`,
          type: 'finish'
        }])
      }
    }
    lastPhase.current = phase
  }, [phase, rollCount, winnerId, players, target])

  // Result logic based on History changes
  useEffect(() => {
    if (history.length > lastHistoryCount.current) {
      const newEntries = history.slice(lastHistoryCount.current)
      lastHistoryCount.current = history.length

      const newMessages: BroadcastMessage[] = []

      for (const entry of newEntries) {
        const isBackward = entry.includes('⬇️')
        const nameMatch = entry.match(/\]\s(.*?)\s[+-]/)
        const name = nameMatch ? nameMatch[1] : '누군가'

        let text = ''

        if (isBackward) {
          text = getRandom(RESULT_BACKWARD)(name)
        } else {
          const isCombo = entry.includes('연속')
          const currentPlayer = players.find(p => p.name === name)
          if (currentPlayer && players.length > 0) {
            const sorted = [...players].sort((a, b) => b.position - a.position)
            const maxPos = sorted[0].position
            const minPos = sorted[sorted.length - 1].position

            const isFirst = currentPlayer.position === maxPos
            const isLast = currentPlayer.position === minPos
            const firstPlaceCount = sorted.filter(p => p.position === maxPos).length
            const isTiedForFirst = isFirst && firstPlaceCount > 1
            const isOnlyFirst = isFirst && firstPlaceCount === 1

            if (isCombo) {
              text = isOnlyFirst ? getRandom(RESULT_COMBO_ONLY_FIRST)(name) : getRandom(RESULT_COMBO_NORMAL)(name)
            } else if (isOnlyFirst) {
              text = getRandom(RESULT_NORMAL_ONLY_FIRST)(name)
            } else if (isTiedForFirst) {
              text = getRandom(RESULT_NORMAL_TIED_FIRST)(name)
            } else if (isLast) {
              text = getRandom(RESULT_NORMAL_LAST)(name)
            } else {
              text = getRandom(RESULT_NORMAL_MID)(name)
            }
          } else {
            text = getRandom(FALLBACK_RESULT)(name)
          }
        }

        newMessages.push({
          id: Date.now().toString() + Math.random() + (isBackward ? 'back' : 'result'),
          text,
          type: isBackward ? 'backward' : 'result',
        })
      }

      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages])
      }
    } else if (history.length === 0) {
      // reset when history clears
      lastHistoryCount.current = 0
      lastHypeCount.current = 0
    }
  }, [history, players])

  return (
    <div className="flex flex-col h-full bg-[#0a0814]/80 border-x border-white/5 overflow-hidden relative">
      <div className="flex-none px-4 py-2 border-b border-white/5 bg-black/40 font-black text-xs tracking-widest text-green-400 uppercase flex items-center gap-2 shadow-md z-10">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        LIVE BROADCAST
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className="animate-slide-up text-[15px] font-semibold leading-relaxed"
          >
            {msg.type === 'hype' && <span className="text-white/60">{msg.text}</span>}
            {msg.type === 'result' && <span className="text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]">{msg.text}</span>}
            {msg.type === 'backward' && <span className="text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]">{msg.text}</span>}
            {msg.type === 'finish' && <span className="text-pink-400 text-lg drop-shadow-[0_0_12px_rgba(244,114,182,0.8)] animate-pulse">{msg.text}</span>}
            {msg.type === 'system' && <span className="text-cyan-400">{msg.text}</span>}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
