"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type { CardRow as CardRowType } from "./CardRow"

// SSR 비활성화로 hydration 시점에 잘못된 분기(데스크탑 fan)가 잠깐 보이는 현상 방지.
// 클라이언트 마운트 후 한 번에 올바른 분기로 렌더됨.
const CardRow = dynamic(
  () => import("./CardRow").then((m) => m.CardRow),
  {
    ssr: false,
    // 카드 영역이 늦게 로드되어도 layout shift 최소화를 위한 placeholder
    loading: () => (
      <div aria-hidden className="mt-4 w-full" style={{ minHeight: "56vw" }} />
    ),
  },
)

type Props = ComponentProps<typeof CardRowType>

export function CardRowClient(props: Props) {
  return <CardRow {...props} />
}
