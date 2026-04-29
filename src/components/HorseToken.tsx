'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  name: string
  isActive: boolean
  isWinner: boolean
  isCombo: boolean
  leaderName: string
  position: number
  target: number
  leaderPosition: number
  runnerUpPosition: number
  tiedCount: number
}

const WINNER_SAYINGS = [
  '내가 해냈어!!!',
  '역시 나야~',
  '우승 트로피는 내 것!',
  '질 생각이 없었어',
  '뒤에서 봐라~',
  '챔피언이다!',
  '오늘은 내 날이었어!',
]

const JUST_CAUGHT_UP: Array<string | ((n: string) => string)> = [
  (n: string) => `${n}, 잡았다!`,
  (n: string) => `${n}, 옆에 왔어!`,
  '드디어 따라잡았어!',
  '이제 나란히야!',
]

const COMBO_LEADER_BIG_GAP = [
  '따라잡을 수 있으면 와봐~',
  '쉬엄쉬엄 갈게~',
  '여유롭다 여유로워',
]

const COMBO_LEADER_CLOSE = [
  '한 발짝 더!',
  '좁히려고? 어림없지!',
  '내가 더 빨라!',
]

const COMBO_CHASER_CLOSING: Array<string | ((n: string) => string)> = [
  (n: string) => `${n}, 기다려!`,
  (n: string) => `${n}, 각오해!`,
  (n: string) => `${n}, 내가 간다!`,
  '거리 좁힌다!',
  '곧 따라잡는다!',
]

const ACTIVE_SAYINGS = [
  '이랴!',
  '달려라!',
  '가보자!',
  '한 칸 더!',
  '이 맛에 달리지~',
  '봤어? 봤지?',
  '무야호~',
]

// 같은 칸에서 앞서 나갈 때 — 상대 이름 포함
const JUST_LEFT_TIE_WITH_NAME: Array<(n: string) => string> = [
  (n) => `${n} 잘 있어^^`,
  (n) => `${n} 안녕~`,
  (n) => `${n}, 먼저 갈게!`,
  (n) => `${n}보다 빠르지~`,
]

// 같은 칸에서 앞서 나갈 때 — 이름 없는 버전
const JUST_LEFT_TIE_GENERIC = [
  '먼저 갈게~',
  '나중에 봐!',
  '앞에서 기다릴게~',
  '한 발 앞서간다!',
  '따라올 수 있으면 와봐!',
]

// 뒤에서 단숨에 단독 1위로 역전할 때
const JUST_OVERTOOK: Array<string | ((n: string) => string)> = [
  (n: string) => `${n} 넘어섰다!`,
  (n: string) => `${n}, 이제 내가 앞이야!`,
  '한 방에 제쳤어!',
  '단숨에 앞질렀다!',
  '이게 바로 역전이야!',
]

// 자기 이름 포함 대사
const SELF_NAME_SAYINGS: Array<(n: string) => string> = [
  (n) => `나, ${n}이야!`,
  (n) => `${n} 간다!`,
  (n) => `내 이름 기억해, ${n}!`,
  (n) => `${n}의 시간이 왔다!`,
  (n) => `이게 바로 ${n}이야!`,
  (n) => `${n} 파이팅!`,
]

const NEARFINISH_SAYINGS = [
  '거의 다 왔어!',
  '막판 스퍼트!',
  '여기서 지면 안 되지!',
  '결승선이 보여!',
  '끝까지 달려!',
]

const IDLE_LEADER_BIG = [
  '커피 한 잔 하고 와도 돼~',
  '천천히 따라와~',
  '산책 나온 줄~',
  '쉬엄쉬엄 갈까?',
  '여유롭다 여유로워',
  '이 정도면 안전권!',
  '이사님, 저를 부르지 마세요...',
  '칼퇴하자~',
]

const IDLE_LEADER_CLOSE = [
  '뒤가 너무 가깝다...',
  '방심하면 안 돼',
  '쫓아오는 소리가 들려',
  '심장 쫄깃하네',
  '한숨 쉴 틈도 없어',
]

const IDLE_TIED = [
  '어? 같이 왔네?',
  '이거 박빙인데?',
  '한 발 차이도 안 돼!',
  '서로 노려보자',
  '진검승부!',
  '옆 좀 보지 마!',
]

const IDLE_CHASER_CLOSE = [
  '코앞이야 코앞!',
  '한 칸만 더!',
  '내 차례야 이번엔',
  '바로 뒤에 있다',
]

const IDLE_LAST = [
  '쉽지 않네...',
  '왜 안 나가지...?',
  '주사위가 미워요',
  '다음엔 꼭 이긴다',
  '오늘은 내 날이 아닌가...',
  '한 번만 도와주세요!',
  '이거 몰카야?',
  '이건 아니지~',
  '이게 실화냐?',
  '억울하면 이겨!',
  '나는 돌아온다!',
  '오늘 이 결과는 인정 못 해!',
  '저 멀리 보이긴 한다...',
  '아직 안 늦었어!',
  '역전 가자!',
  '포기는 없다',
  '두고 봐라',
  '끝날 때까진 끝난 게 아니야!',
  '포기는 배추 셀 때나 쓰는 단어!',
  '불굴의 의지!',
  '지금부터가 진짜야!',
]


const IDLE_GENERAL = [
  '이번엔 잘하자!',
  '긴장되는데...',
  '오늘 컨디션 최고야',
  '다음엔 내가 이긴다!',
  '잠깐 쉬자',
  '물 한 모금...',
  '이기면 뭐 줘?',
  '내 말 들어!',
  '달리자!',
  '이 맛에 경주하지',
  '오늘 날씨 좋다',
  '집중하자 집중!',
  '잠깐, 이게 아닌데?',       // 상황 개그
  '이건... 운명이야',
]

function pick<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]
}

function resolve(s: string | ((n: string) => string), name: string): string {
  return typeof s === 'function' ? s(name) : s
}

export default function HorseToken({
  name,
  isActive,
  isWinner,
  isCombo,
  leaderName,
  position,
  target,
  leaderPosition,
  runnerUpPosition,
  tiedCount,
}: Props) {
  // 파생 상태
  const gapToLeader = leaderPosition - position
  const isSoleLeader = position === leaderPosition && position > runnerUpPosition
  const leadMargin = isSoleLeader ? position - runnerUpPosition : 0
  const isTiedAtTop = position === leaderPosition && tiedCount > 0   // 1등 자리 동률
  const isBehind = gapToLeader >= Math.max(3, Math.ceil(target * 0.3)) // 격차 큰 추격자→꼴등 처리

  const [bubble, setBubble] = useState<string | null>(null)
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // refs (idle 타이머 closure 회피용)
  const isActiveRef = useRef(isActive)
  const isWinnerRef = useRef(isWinner)
  const positionRef = useRef(position)
  const isSoleLeaderRef = useRef(isSoleLeader)
  const leadMarginRef = useRef(leadMargin)
  const isTiedAtTopRef = useRef(isTiedAtTop)
  const isBehindRef = useRef(isBehind)
  const gapToLeaderRef = useRef(gapToLeader)
  const leaderPositionRef = useRef(leaderPosition)
  const prevGapRef = useRef(gapToLeader)
  const prevTiedCountRef = useRef(tiedCount)
  const prevLeaderNameRef = useRef(leaderName)
  const nameRef = useRef(name)

  const show = (text: string, duration = 2500) => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current)
    setBubble(text)
    clearTimerRef.current = setTimeout(() => setBubble(null), duration)
  }

  // ===== 이동 시 — prevGap/prevTiedCount 갱신보다 먼저 선언해야 함 =====
  useEffect(() => {
    if (!isActive || isWinner) return
    const justCaughtUp = prevGapRef.current > 0 && gapToLeader === 0 && !isSoleLeader
    const justOvertook = prevGapRef.current > 0 && isSoleLeader
    const justLeftTie = prevTiedCountRef.current > 0
    const wasAtLeaderPos = prevGapRef.current === 0

    if (justCaughtUp) {
      show(resolve(pick(JUST_CAUGHT_UP), leaderName), 2200)
    } else if (justOvertook) {
      show(resolve(pick(JUST_OVERTOOK), prevLeaderNameRef.current), 2200)
    } else if (justLeftTie) {
      // 같은 칸에 있다가 앞서 나갈 때
      if (wasAtLeaderPos && prevLeaderNameRef.current !== name) {
        show(pick(JUST_LEFT_TIE_WITH_NAME)(prevLeaderNameRef.current), 2200)
      } else {
        show(pick(JUST_LEFT_TIE_GENERIC), 2200)
      }
    } else if (isCombo) {
      if (isSoleLeader) {
        const pool = leadMargin >= 4 ? COMBO_LEADER_BIG_GAP : COMBO_LEADER_CLOSE
        show(pick(pool), 2000)
      } else {
        show(resolve(pick(COMBO_CHASER_CLOSING), leaderName), 2000)
      }
    } else if (Math.random() < 0.4) {
      // 30% 확률로 자기 이름 대사
      if (Math.random() < 0.3) {
        show(pick(SELF_NAME_SAYINGS)(name), 2000)
      } else {
        show(pick(ACTIVE_SAYINGS), 2000)
      }
    }
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  // 우승 시 즉시
  useEffect(() => {
    if (isWinner) show(pick(WINNER_SAYINGS), 3000)
  }, [isWinner]) // eslint-disable-line react-hooks/exhaustive-deps

  // ===== ref 동기화 (위 핸들러보다 뒤) =====
  useEffect(() => { isActiveRef.current = isActive })
  useEffect(() => { isWinnerRef.current = isWinner })
  useEffect(() => { positionRef.current = position })
  useEffect(() => { isSoleLeaderRef.current = isSoleLeader })
  useEffect(() => { leadMarginRef.current = leadMargin })
  useEffect(() => { isTiedAtTopRef.current = isTiedAtTop })
  useEffect(() => { isBehindRef.current = isBehind })
  useEffect(() => { gapToLeaderRef.current = gapToLeader })
  useEffect(() => { leaderPositionRef.current = leaderPosition })
  useEffect(() => { prevGapRef.current = gapToLeader })
  useEffect(() => { prevTiedCountRef.current = tiedCount })
  useEffect(() => { prevLeaderNameRef.current = leaderName })

  // 유휴 타이머 (12~20초)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const schedule = () => {
      const delay = 12000 + Math.random() * 8000
      timeout = setTimeout(() => {
        if (!isActiveRef.current && !isWinnerRef.current) {
          // 10% 확률로 자기 이름 대사 (상황 무관)
          if (Math.random() < 0.1) {
            show(pick(SELF_NAME_SAYINGS)(nameRef.current), 2500)
            schedule()
            return
          }
          const isEarlyRace = leaderPositionRef.current < Math.max(3, Math.floor(target * 0.25))
          let pool: string[]
          if (positionRef.current >= target * 0.6 && !isBehindRef.current) {
            pool = NEARFINISH_SAYINGS
          } else if (!isEarlyRace && Math.random() < 0.6) {
            if (isTiedAtTopRef.current) {
              pool = IDLE_TIED
            } else if (isSoleLeaderRef.current) {
              pool = leadMarginRef.current >= 4 ? IDLE_LEADER_BIG : IDLE_LEADER_CLOSE
            } else if (isBehindRef.current) {
              if (Math.random() < 0.04) {
                show('개발자한테 커피라도 사야하나...', 3000)
                schedule()
                return
              }
              pool = IDLE_LAST
            } else if (gapToLeaderRef.current <= 2) {
              pool = IDLE_CHASER_CLOSE
            } else {
              pool = IDLE_GENERAL
            }
          } else {
            pool = IDLE_GENERAL
          }
          show(pick(pool), 2500)
        }
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: 6,
          zIndex: 50,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {bubble && (
            <motion.div
              key={bubble}
              initial={{ opacity: 0, scale: 0.7, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 4 }}
              transition={{ duration: 0.2 }}
              style={{ originX: 0.5, originY: 1 }}
            >
              <div className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-md relative">
                {bubble}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: '6px solid white',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        animate={
          isActive
            ? { y: [0, -6, 0], scale: [1, 1.15, 1] }
            : isWinner
            ? { scale: [1, 1.2, 1] }
            : {}
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div
          className={`
            text-xl select-none leading-none
            ${isWinner ? 'drop-shadow-[0_0_6px_rgba(245,166,35,0.9)]' : isActive ? 'drop-shadow-[0_0_6px_rgba(124,58,237,0.9)]' : ''}
          `}
          style={{
            animation: isActive || isWinner ? 'horseRun 0.35s steps(2) infinite' : 'horseRun 0.6s steps(2) infinite',
          }}
        >
          🏇
        </div>
      </motion.div>
    </div>
  )
}
