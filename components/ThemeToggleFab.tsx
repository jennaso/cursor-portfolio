"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

/**
 * 우상단 고정 플로팅 테마 토글 버튼.
 * AnimatedThemeToggler는 View Transitions API + classList.toggle("dark")를 자체적으로 수행하며,
 * 여기서는 next-themes의 내부 상태와 sync를 위해 MutationObserver로 className 변경을 감지해
 * setTheme을 호출합니다.
 */
export function ThemeToggleFab() {
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      const isDark = root.classList.contains("dark")
      const next = isDark ? "dark" : "light"
      if (next !== resolvedTheme) {
        setTheme(next)
      }
    })
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [setTheme, resolvedTheme])

  return (
    <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
      <AnimatedThemeToggler
        variant="circle"
        duration={500}
        aria-label="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-card-surface/80 text-foreground shadow-md ring-1 ring-foreground/10 backdrop-blur-md transition-colors hover:bg-card-surface [&>svg]:h-4 [&>svg]:w-4"
      />
    </div>
  )
}
