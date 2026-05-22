"use client"

import { useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import gsap from "gsap"

// ─── 타입 ──────────────────────────────────────────────────────────────────
type CardSlot = { rotation: number; label: string }

type Props = {
  slots: CardSlot[]
  avatarSrc: string
}

// ─── 인터랙션 튜닝 값 (여기서 수정하세요) ──────────────────────────────────────
const TILT_STRENGTH = 18       // 호버 시 최대 기울기 각도 (deg)
const LIFT_Y = -12             // 호버 시 위로 이동 거리 (px)
const HOVER_SCALE = 1.06       // 호버 시 크기 배율
const FOLLOW_DURATION = 0.25   // 마우스 따라가는 속도 (초, 작을수록 빠름)
const RETURN_DURATION = 0.8    // 손 떼고 원위치 돌아오는 시간 (초)
const RETURN_EASE = "elastic.out(1, 0.35)"  // 탄성 느낌 (1=강도, 0.35=진동)
// ───────────────────────────────────────────────────────────────────────────

export function CardRow({ slots, avatarSrc }: Props) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // 마운트 시 GSAP가 각 카드의 초기 회전(fan 배치)을 소유하도록 설정
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.set(card, {
          rotation: slots[i].rotation,
          transformPerspective: 800,
          transformOrigin: "center bottom",
        })
      })
    })
    return () => ctx.revert()
  }, [slots])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const card = cardRefs.current[index]
      if (!card) return

      const rect = card.getBoundingClientRect()
      // 카드 중심 기준 -1 ~ 1 정규화
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

      gsap.to(card, {
        rotateY: dx * TILT_STRENGTH,
        rotateX: -dy * TILT_STRENGTH,
        y: LIFT_Y,
        scale: HOVER_SCALE,
        duration: FOLLOW_DURATION,
        ease: "power2.out",
        overwrite: "auto",
      })
    },
    [],
  )

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardRefs.current[index]
    if (!card) return

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      y: 0,
      scale: 1,
      duration: RETURN_DURATION,
      ease: RETURN_EASE,
      overwrite: "auto",
    })
  }, [])

  return (
    // perspective는 부모에 설정해야 여러 카드에 동시에 3D 공간이 적용됨
    <div
      aria-label="포트폴리오 카드 영역"
      className="mt-6 flex items-center sm:mt-8 lg:mt-6"
      style={{ perspective: "1000px" }}
    >
      {slots.map((slot, index) => {
        const isAvatar = slot.label === "Avatar"
        return (
          <div
            key={slot.label}
            ref={(el) => { cardRefs.current[index] = el }}
            aria-label={slot.label}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{
              zIndex: isAvatar ? 10 : 5 - Math.abs(index - 2),
              willChange: "transform",
            }}
            className="relative -mx-2 aspect-[3/4] w-[22vw] max-w-[13rem] cursor-pointer overflow-hidden rounded-2xl bg-zinc-200 shadow-xl ring-1 ring-zinc-900/5 sm:-mx-3 sm:w-36 lg:-mx-4 lg:w-48"
          >
            {isAvatar && (
              <Image
                src={avatarSrc}
                alt="Jenna Jeon 아바타"
                fill
                sizes="(max-width: 640px) 22vw, (max-width: 1024px) 9rem, 12rem"
                className="object-cover"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
