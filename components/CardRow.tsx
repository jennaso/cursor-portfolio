"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import Image from "next/image"
import gsap from "gsap"

// ─── 타입 ──────────────────────────────────────────────────────────────────
type CardSlot = { rotation: number; label: string; imageSrc?: string }

type Props = {
  slots: CardSlot[]
  avatarSrcs: string[]
}

// ─── 인터랙션 튜닝 값 (여기서 수정하세요) ──────────────────────────────────────
const TILT_STRENGTH = 18       // 호버 시 최대 기울기 각도 (deg)
const LIFT_Y = -12             // 호버 시 위로 이동 거리 (px)
const HOVER_SCALE = 1.06       // 호버 시 크기 배율
const FOLLOW_DURATION = 0.25   // 마우스 따라가는 속도 (초, 작을수록 빠름)
const RETURN_DURATION = 0.8    // 손 떼고 원위치 돌아오는 시간 (초)
const RETURN_EASE = "elastic.out(1, 0.35)"  // 탄성 느낌 (1=강도, 0.35=진동)

// 아바타가 카드 위쪽으로 튀어나오는 비율 (예: 1.5 = 카드 높이보다 50% 더 높게)
const AVATAR_OVERHANG = 1.5
const DEFAULT_AVATAR_INDEX = 3
// ───────────────────────────────────────────────────────────────────────────

export function CardRow({ slots, avatarSrcs }: Props) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(() =>
    Math.min(DEFAULT_AVATAR_INDEX, Math.max(avatarSrcs.length - 1, 0)),
  )
  const currentAvatarSrc = avatarSrcs[currentAvatarIndex] ?? avatarSrcs[0] ?? ""

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

  const handleMouseEnter = useCallback(
    (index: number) => {
      const isAvatar = slots[index]?.label === "Avatar"
      if (!isAvatar || avatarSrcs.length <= 1) return

      setCurrentAvatarIndex((previousIndex) => {
        const normalizedPreviousIndex =
          previousIndex < avatarSrcs.length ? previousIndex : 0
        let nextIndex = normalizedPreviousIndex

        while (nextIndex === normalizedPreviousIndex) {
          nextIndex = Math.floor(Math.random() * avatarSrcs.length)
        }

        return nextIndex
      })
    },
    [avatarSrcs.length, slots],
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
      className="mt-6 flex items-center overflow-visible sm:mt-8 lg:mt-6"
      style={{ perspective: "1000px" }}
    >
      {slots.map((slot, index) => {
        const isAvatar = slot.label === "Avatar"
        return (
          <div
            key={slot.label}
            ref={(el) => { cardRefs.current[index] = el }}
            aria-label={slot.label}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{
              zIndex: isAvatar ? 10 : 5 - Math.abs(index - 2),
              willChange: "transform",
            }}
            // ⚠️ 이 부분은 로직 영역이므로 건드리지 마세요
            // 아바타 카드는 배경·그림자 없이 투명, 일반 카드는 bg + overflow-hidden
            className={`relative -mx-2 aspect-[3/4] w-[22vw] max-w-[13rem] cursor-pointer rounded-2xl sm:-mx-3 sm:w-36 lg:-mx-4 lg:w-48 ${isAvatar ? "" : "overflow-hidden bg-zinc-200 shadow-[0_10px_28px_rgba(0,0,0,0.10)] ring-1 ring-zinc-900/5"}`}
          >
            {/* ⚠️ 이 부분은 로직 영역이므로 건드리지 마세요 */}
            {isAvatar ? (
              // 아바타: 카드보다 AVATAR_OVERHANG 배 높은 컨테이너를 하단에 고정
              // → PNG 투명 배경 덕분에 캐릭터만 카드 위로 돌출되어 보임
              <div
                className="absolute inset-x-[-10%] bottom-[-5%]"
                style={{ height: `${AVATAR_OVERHANG * 100}%` }}
              >
                <Image
                  src={currentAvatarSrc}
                  alt="Jenna Jeon 아바타"
                  fill
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 11rem, 14rem"
                  className="object-contain object-bottom drop-shadow-2xl"
                />
              </div>
            ) : slot.imageSrc ? (
              <Image
                src={slot.imageSrc}
                alt={slot.label}
                fill
                sizes="(max-width: 640px) 22vw, (max-width: 1024px) 9rem, 12rem"
                className="object-cover"
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
