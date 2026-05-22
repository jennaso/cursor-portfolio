"use client"

import { useCallback, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"

// ─── 글로우 튜닝 값 (여기서 수정하세요) ────────────────────────────────────────
const GLOW_FROM = "#FF9A35"    // 마우스 중심 색상 — vivid orange
const GLOW_TO = "#FFCB8E"      // 바깥쪽 색상 — light peach orange
const GLOW_SIZE = 220          // 그라디언트 반지름 (px)
const SPRING_STIFFNESS = 300   // 따라오는 빠르기 (높을수록 빠름)
const SPRING_DAMPING = 40      // 진동 감쇠 (높을수록 덜 튕김)
// ───────────────────────────────────────────────────────────────────────────────

interface GlowTextProps {
  children: React.ReactNode
  // 마우스가 없을 때 텍스트 기본 색상 (CSS color 값)
  baseColor: string
  // h1 또는 h2 의 className을 그대로 넘겨주세요
  className?: string
  as: "h1" | "h2"
}

export function GlowText({ children, baseColor, className, as: Tag }: GlowTextProps) {
  // ⚠️ 이 부분은 로직 영역이므로 건드리지 마세요
  const containerRef = useRef<HTMLHeadingElement>(null)

  const mouseX = useMotionValue(-GLOW_SIZE)
  const mouseY = useMotionValue(-GLOW_SIZE)

  const springX = useSpring(mouseX, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING })
  const springY = useSpring(mouseY, { stiffness: SPRING_STIFFNESS, damping: SPRING_DAMPING })

  // 마우스 중심에서 번지는 radial-gradient — 마지막 색이 baseColor라 자연스럽게 복귀
  const gradientImage = useMotionTemplate`radial-gradient(${GLOW_SIZE}px circle at ${springX}px ${springY}px, ${GLOW_FROM}, ${GLOW_TO} 35%, ${baseColor} 60%)`

  // 호버 진입/이탈 애니메이션 (0 = 비활성, 1 = 활성)
  const hoverProgress = useSpring(0, { stiffness: 200, damping: 28 })
  const strokeColor = useTransform(
    hoverProgress,
    [0, 1],
    ["rgba(255,154,53,0)", "rgba(255,154,53,0.55)"],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLHeadingElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
      hoverProgress.set(1)
    },
    [mouseX, mouseY, hoverProgress],
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(-GLOW_SIZE)
    mouseY.set(-GLOW_SIZE)
    hoverProgress.set(0)
  }, [mouseX, mouseY, hoverProgress])

  return (
    // h1/h2 태그는 시맨틱 유지 — 인터랙션만 여기서 감지
    <Tag ref={containerRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <span style={{ position: "relative", display: "block" }}>
        {/* 하단: stroke 전용 레이어 — fill이 투명하므로 letter 외곽 테두리만 노출됨 */}
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: strokeColor,
            WebkitTextFillColor: "transparent",
          }}
        >
          {children}
        </motion.span>

        {/* 상단: 기존 그라디언트 fill — letter 내부를 덮어 stroke 안쪽을 가림 */}
        <motion.span
          style={{
            backgroundImage: gradientImage,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            display: "block",
            position: "relative",
          }}
        >
          {children}
        </motion.span>
      </span>
    </Tag>
  )
}
