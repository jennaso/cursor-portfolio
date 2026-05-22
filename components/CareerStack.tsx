"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import { MagicCard } from "@/components/ui/magic-card"

// ─── 인터랙션 튜닝 값 (여기서 수정하세요) ──────────────────────────────────────
const PEEK = 52       // 스택 상태에서 뒤 카드가 보이는 높이 (px)
const GAP = 16        // 펼침 상태에서 카드 간격 (px)
const SPRING = { type: "spring", stiffness: 300, damping: 32 } as const
// 스택 상태 회전값 — index 순서대로 (deg)
const STACK_ROTATIONS = [0, 2.5, -1.8, 1.2]
// ───────────────────────────────────────────────────────────────────────────

type CareerItem = {
  period: string
  role: string
  company: string
  description?: string
}

type Props = {
  items: CareerItem[]
  gradientFrom: string
  gradientTo: string
  gradientColor: string
  textMuted: string
}

export function CareerStack({ items, gradientFrom, gradientTo, gradientColor, textMuted }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [cardHeights, setCardHeights] = useState<number[]>([])

  // 각 카드 높이를 측정 — ResizeObserver로 반응형 대응
  useEffect(() => {
    const measure = () => {
      const heights = cardRefs.current.map(ref => ref?.offsetHeight ?? 0)
      if (heights.some(h => h > 0)) setCardHeights(heights)
    }

    measure()

    const observers = cardRefs.current.map(ref => {
      if (!ref) return null
      const ro = new ResizeObserver(measure)
      ro.observe(ref)
      return ro
    })

    return () => observers.forEach(ro => ro?.disconnect())
  }, [])

  // 각 상태별 y 위치 계산
  const { yPositions, containerHeight } = useMemo(() => {
    const measured = cardHeights.length === items.length && cardHeights.every(h => h > 0)
    const fallbackH = 120

    if (!measured) {
      return {
        yPositions: items.map((_, i) => i * PEEK),
        containerHeight: fallbackH + (items.length - 1) * PEEK,
      }
    }

    if (!isExpanded) {
      return {
        yPositions: items.map((_, i) => i * PEEK),
        containerHeight: cardHeights[0]! + (items.length - 1) * PEEK,
      }
    }

    // 펼침: 각 카드를 이전 카드 높이 합산 + gap 만큼 아래로
    let y = 0
    const positions: number[] = []
    for (let i = 0; i < items.length; i++) {
      positions.push(y)
      y += (cardHeights[i] ?? fallbackH) + GAP
    }
    return {
      yPositions: positions,
      containerHeight: y - GAP,
    }
  }, [isExpanded, cardHeights, items])

  return (
    <div
      className="w-full max-w-2xl cursor-pointer select-none"
      onClick={() => setIsExpanded(prev => !prev)}
    >
      <motion.div
        className="relative"
        animate={{ height: containerHeight }}
        transition={SPRING}
      >
        {items.map((item, index) => {
          const isTop = index === 0
          const stackOpacity = 1
          const stackScale = 1 - index * 0.028

          return (
            <motion.div
              key={item.role}
              className="absolute w-full"
              style={{ zIndex: items.length - index, transformOrigin: "center bottom" }}
              animate={{
                y: yPositions[index] ?? index * PEEK,
                scale: isExpanded ? 1 : stackScale,
                opacity: isExpanded ? 1 : stackOpacity,
                rotate: isExpanded ? 0 : (STACK_ROTATIONS[index] ?? 0),
              }}
              transition={{
                ...SPRING,
                delay: isExpanded
                  ? index * 0.04
                  : (items.length - 1 - index) * 0.04,
              }}
            >
              {/* pointer-events: 스택 상태에서 뒤 카드의 MagicCard 이벤트 차단 */}
              <div
                ref={el => { cardRefs.current[index] = el }}
                className="rounded-2xl"
                style={{ pointerEvents: !isExpanded && !isTop ? "none" : "auto" }}
              >
                <MagicCard
                  className="px-7 py-6"
                  gradientFrom={gradientFrom}
                  gradientTo={gradientTo}
                  gradientColor={gradientColor}
                  gradientOpacity={0.6}
                  gradientSize={180}
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-base font-semibold">{item.role}</p>
                      <p className={`${textMuted} mt-0.5 text-sm`}>{item.company}</p>
                      {item.description && (
                        <p className={`${textMuted} mt-2 text-xs leading-relaxed`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className={`${textMuted} font-mono text-xs uppercase tracking-widest sm:shrink-0 sm:pl-6`}>
                      {item.period}
                    </span>
                  </div>
                </MagicCard>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* 상태 힌트 */}
      <motion.p
        className={`${textMuted} mt-4 text-center text-[10px] uppercase tracking-[0.2em]`}
        animate={{ opacity: 0.5 }}
      >
        {isExpanded ? "Click to collapse" : "Click to expand"}
      </motion.p>
    </div>
  )
}
