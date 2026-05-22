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

// ─── 모바일 수직 스택 튜닝 값 ──────────────────────────────────────────────
// 카드 너비 (vw), 카드 높이 = width * (4/3)
const MOBILE_CARD_WIDTH_VW = 42
// 각 카드가 위 카드 아래로 보이는 높이 (vw) — 값이 클수록 스택이 펼쳐짐
const MOBILE_CARD_PEEK_VW = 26
// 카드 index당 좌우 오프셋 (vw) — center(index 2) 기준으로 좌우로 이동
const MOBILE_TILT_X_VW = 8
// 회전 배율 — slot.rotation 값에 곱해짐 (1 = 원본, 2 = 두 배 기울임)
const MOBILE_ROTATION_MULTIPLIER = 2.2
// ───────────────────────────────────────────────────────────────────────────

export function CardRow({ slots, avatarSrcs }: Props) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(() =>
    Math.min(DEFAULT_AVATAR_INDEX, Math.max(avatarSrcs.length - 1, 0)),
  )
  const currentAvatarSrc = avatarSrcs[currentAvatarIndex] ?? avatarSrcs[0] ?? ""

  // ─── 모바일 감지 (< 640px) ─────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)")
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // 마운트 시 GSAP가 각 카드의 초기 회전(fan 배치)을 소유하도록 설정
  // 모바일에서는 CSS/inline style로 처리하므로 skip
  useEffect(() => {
    if (isMobile) return
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
  }, [slots, isMobile])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, index: number) => {
      const card = cardRefs.current[index]
      if (!card) return

      const rect = card.getBoundingClientRect()
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

  // ─── 모바일 터치 핸들러 ────────────────────────────────────────────────
  // 정적 tilt(outer div)와 분리된 inner div ref를 대상으로 GSAP 적용
  const innerCardRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleTouchStart = useCallback(
    (index: number) => {
      // 아바타 탭 시 다음 아바타 스타일로 변경
      const isAvatar = slots[index]?.label === "Avatar"
      if (isAvatar && avatarSrcs.length > 1) {
        setCurrentAvatarIndex((prev) => {
          const normalized = prev < avatarSrcs.length ? prev : 0
          let next = normalized
          while (next === normalized) {
            next = Math.floor(Math.random() * avatarSrcs.length)
          }
          return next
        })
      }

      const card = innerCardRefs.current[index]
      if (!card) return
      gsap.to(card, {
        scale: HOVER_SCALE,
        y: LIFT_Y,
        duration: FOLLOW_DURATION,
        ease: "power2.out",
        overwrite: "auto",
      })
    },
    [slots, avatarSrcs.length],
  )

  const handleTouchEnd = useCallback((index: number) => {
    const card = innerCardRefs.current[index]
    if (!card) return
    gsap.to(card, {
      scale: 1,
      y: 0,
      duration: RETURN_DURATION,
      ease: RETURN_EASE,
      overwrite: "auto",
    })
  }, [])

  // ─── 모바일 수직 스택 레이아웃 ─────────────────────────────────────────
  if (isMobile) {
    // 카드 높이 = width * (4/3)
    const cardHeightVw = MOBILE_CARD_WIDTH_VW * (4 / 3)
    // 첫 번째 카드 이후 각 카드의 negative top margin
    // = -(카드 높이 - 노출할 peek 높이)
    const negativeMarginVw = cardHeightVw - MOBILE_CARD_PEEK_VW

    return (
      <div
        aria-label="포트폴리오 카드 영역"
        className="mt-4 flex flex-col items-center w-full overflow-visible"
      >
        {slots.map((slot, index) => {
          const isAvatar = slot.label === "Avatar"
          const zIndex = isAvatar ? 10 : 5 - Math.abs(index - 2)

          return (
            // Outer: 정적 위치/틸트 전용 (GSAP 미사용)
            <div
              key={slot.label}
              aria-label={slot.label}
              style={{
                width: `${MOBILE_CARD_WIDTH_VW}vw`,
                marginTop: index === 0 ? 0 : `-${negativeMarginVw}vw`,
                transform: `translateX(${(index - 2) * MOBILE_TILT_X_VW}vw) rotate(${slot.rotation * MOBILE_ROTATION_MULTIPLIER}deg)`,
                transformOrigin: "center center",
                zIndex,
              }}
            >
              {/* Inner: GSAP 터치 애니메이션 타깃 */}
              <div
                ref={(el) => { innerCardRefs.current[index] = el }}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={() => handleTouchEnd(index)}
                style={{ willChange: "transform" }}
                className={`relative aspect-[3/4] w-full cursor-pointer rounded-2xl ${
                  isAvatar
                    ? "overflow-visible"
                    : "overflow-hidden bg-zinc-200 shadow-[0_10px_28px_rgba(0,0,0,0.10)] ring-1 ring-zinc-900/5"
                }`}
              >
                {isAvatar ? (
                  <div
                    className="absolute inset-x-[-10%] bottom-[-5%]"
                    style={{ height: `${AVATAR_OVERHANG * 100}%` }}
                  >
                    <Image
                      src={currentAvatarSrc}
                      alt="Jenna Jeon 아바타"
                      fill
                      sizes={`${MOBILE_CARD_WIDTH_VW * 1.2}vw`}
                      className="object-contain object-bottom drop-shadow-2xl"
                    />
                  </div>
                ) : slot.imageSrc ? (
                  <Image
                    src={slot.imageSrc}
                    alt={slot.label}
                    fill
                    sizes={`${MOBILE_CARD_WIDTH_VW}vw`}
                    className="object-cover"
                  />
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ─── sm+ 데스크탑 fan 레이아웃 (기존 유지) ────────────────────────────
  return (
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
            className={`relative -mx-2 aspect-[3/4] w-[22vw] max-w-[13rem] cursor-pointer rounded-2xl sm:-mx-3 sm:w-36 lg:-mx-4 lg:w-48 ${isAvatar ? "" : "overflow-hidden bg-zinc-200 shadow-[0_10px_28px_rgba(0,0,0,0.10)] ring-1 ring-zinc-900/5"}`}
          >
            {isAvatar ? (
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
