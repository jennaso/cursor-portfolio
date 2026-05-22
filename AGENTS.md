# AGENTS.md

## Operational Commands

패키지 매니저는 **bun 고정** — npm/yarn/pnpm 절대 사용 금지.

```bash
bun dev          # 개발 서버 (localhost:3000)
bun run build    # 프로덕션 빌드
bun run lint     # ESLint 검사
bunx shadcn add <component>   # shadcn 컴포넌트 추가
```

Next.js 버전: **16.2.6** (훈련 데이터와 API/컨벤션이 다를 수 있음)
코드 작성 전 `node_modules/next/dist/docs/` 의 관련 가이드를 먼저 확인하라.

## Project Context

비주얼 디자인 전공자의 개인 포트폴리오 사이트. 시각적 완성도와 인터랙션 품질이 핵심 목표다.

Tech Stack: Next.js 16 (App Router) · TypeScript · Tailwind v4 · shadcn/ui (base-nova) · Magic UI · GSAP · Bun · React 19

## Golden Rules

### Immutable

- API 키·시크릿은 `.env.local`에만 저장, 코드에 하드코딩 금지.
- `.env.local`은 절대 커밋하지 않는다.
- `use client` 디렉티브는 반드시 필요한 컴포넌트에만 붙인다 — 기본은 Server Component.

### UI 레이어 우선순위 (반드시 이 순서 준수)

1. **Tailwind** — 모든 스타일의 기본. 가능하면 Tailwind로 해결한다.
2. **shadcn/ui** — 폼, 다이얼로그, 드롭다운 등 복잡한 인터랙티브 UI에만 사용.
3. **Magic UI** — 진입(mount) 애니메이션 전용.
4. **GSAP** — 마우스 인터랙션, 스크롤 기반 고급 애니메이션 전용.

### Do's

- 답변·주석은 **한국어**로 작성한다.
- 변수명·함수명은 역할과 시각적 의미가 바로 드러나는 **직관적인 영문**으로 짓는다 (축약어 지양).
- 사용자가 쉽게 바꿀 시각적 값(색상, 크기, 텍스트 등)은 파일 **최상단에 변수로 모아 선언**한다.
- 핵심 로직 영역에는 `/* ⚠️ 이 부분은 로직 영역이므로 건드리지 마세요 */` 주석을 붙인다.
- 파일 수를 최소화하고, 가독성 높고 단순한 코드를 우선한다.

### Don'ts

- shadcn 컴포넌트를 필요 이상으로 설치하지 않는다 — Tailwind로 해결 가능한 것은 Tailwind로.
- 컴포넌트를 불필요하게 잘게 분리하지 않는다.
- 현란한 축약 코드를 쓰지 않는다.

## Standards & References

### shadcn/ui 설정

- style: `base-nova`, baseColor: `neutral`, cssVariables: `true`
- alias: `@/components/ui`, utils: `@/lib/utils`, hooks: `@/hooks`
- 아이콘: `lucide-react`

### 커밋 메시지

```
<type>: <한국어 요약>

type: feat | fix | style | refactor | chore | docs
예시: feat: 메인 히어로 섹션 GSAP 스크롤 애니메이션 추가
```

### Maintenance Policy

규칙과 실제 코드 사이에 괴리가 발생하면 이 파일의 업데이트를 제안하라.
