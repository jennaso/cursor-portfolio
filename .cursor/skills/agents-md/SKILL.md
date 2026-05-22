---
name: agents-md
description: AGENTS.md 거버넌스 시스템을 분석하고 생성하는 마스터 프롬프트. 현재 프로젝트를 분석하여 루트 AGENTS.md와 하위 AGENTS.md를 즉시 생성하고, CLAUDE.md에 @AGENTS.md 링크를 추가한다. "AGENTS.md 만들어줘", "에이전트 규칙 만들어줘", "/agents-md" 호출 시 반드시 실행하라.
disable-model-invocation: true
---

# agents-md

AGENTS.md 거버넌스 시스템을 설계하고 실제 파일로 구현하는 역할을 수행한다.

## Core Philosophy

1. **500-Line Limit**: 모든 `AGENTS.md`는 500라인 미만으로 유지한다.
2. **No Fluff, No Emojis**: 이모지와 불필요한 서술을 절대 사용하지 않는다. 명확하고 간결한 텍스트만 사용한다.
3. **Central Control & Delegation**: 루트 파일은 관제탑 역할을 하며, 상세 구현은 하위 파일로 위임한다.
4. **Machine-Readable Clarity**: 실행 불가능한 조언 대신 Golden Rules(Do's & Don'ts)과 Operational Commands 같은 구체적 지침을 제공한다.
5. **No Duplication**: README, docs/, 기존 문서에 이미 있는 내용은 반복하지 않는다. AGENTS.md는 에이전트 전용 지침만 포함한다.

## Execution Protocol

### Step 0: Pre-Analysis

파일 생성 전 반드시 확인:
- `README.md`, `docs/`, `CONTRIBUTING.md` 등 기존 문서를 먼저 스캔한다.
- 기존 문서에 이미 있는 내용(프로젝트 소개, 설치 방법, 디렉토리 구조 등)은 AGENTS.md에 작성하지 않는다.
- AGENTS.md에는 기존 문서에 없는 것만 작성한다: **에이전트 행동 규칙, 빌드/테스트 명령어, Golden Rules, 프로젝트 특화 도구**.

### Step 1: Root `./AGENTS.md` 작성

필수 섹션:

**Operational Commands (최우선)**
- 프로젝트 빌드, 실행, 테스트를 위한 구체적 명령어 명시 (예: `bun run dev`, `bun test`).
- 프로젝트 특화 도구 명시 (예: `bun` 고정 — npm/yarn/pnpm 사용 금지).
- 에이전트 성능에 가장 직접적 영향을 미치므로 반드시 포함한다.

**Golden Rules**
- Immutable: 절대 타협할 수 없는 보안/아키텍처 제약.
- Do's & Don'ts: 명확한 행동 수칙.

**Project Context (간결하게)**
- 비즈니스 목표 1~2문장.
- Tech Stack은 나열만 (장황한 설명 금지).
- 코드베이스 개요(Architecture Overview) 금지 — 에이전트는 자체적으로 코드를 탐색한다.

**Standards & References**
- 코딩 컨벤션 핵심만 (기존 문서 링크 권장, 전체 복사 금지).
- Git 전략 및 커밋 메시지 포맷.
- Maintenance Policy: "규칙과 코드의 괴리가 발생하면 업데이트를 제안하라"는 자가 치유 조항.

**Context Map (선택)**
- 하위 `AGENTS.md`가 2개 이상 존재할 때만 작성한다.
- 표(Table) 형식 절대 금지. 이모지 사용 금지.
- Format: `- **[트리거/작업 영역 명시](상대 경로)** — 한 줄 설명`

### Step 2: Nested AGENTS.md 작성

단순 폴더 매핑이 아닌, 고유한 컨텍스트(High-Context Zone)가 발생하는 지점을 식별하여 생성한다.

**생성 기준 (Detection Logic)**

다음 신호가 감지될 때 별도의 `AGENTS.md`를 생성한다:
- **Dependency Boundary**: `package.json`, `requirements.txt`, `Cargo.toml` 등이 별도로 존재하는 경우.
- **Framework Boundary**: 기술 스택이 전환되는 지점 (예: `Next.js` 내부, `FastAPI` 서버, `Terraform` 폴더).
- **Logical Boundary**: 비즈니스 로직 밀도가 높은 핵심 모듈 (예: `features/billing`, `core/engine`).

**하위 파일 필수 섹션**

- **Module Context**: 해당 모듈의 역할과 의존성 관계 (1~2문장).
- **Tech Stack & Constraints**: 해당 폴더에서만 사용되는 라이브러리/버전 명시.
- **Implementation Patterns**: 자주 사용되는 코드 패턴, 보일러플레이트 경로, 파일 네이밍 규칙.
- **Testing Strategy**: 해당 모듈 전용 테스트 명령어 및 테스트 작성 패턴.
- **Local Golden Rules**: 해당 영역에서 범하기 쉬운 실수에 대한 Do's & Don'ts.

**하위 파일 금지 사항**

- 루트 `AGENTS.md`의 내용을 반복하지 않는다.
- 해당 디렉토리의 파일 목록을 나열하지 않는다.
- 일반적인 베스트 프랙티스를 작성하지 않는다 — 이 프로젝트에서만 유효한 규칙만 포함한다.

### Step 3: CLAUDE.md Linking

Claude Code는 `AGENTS.md`를 직접 인식하지 않는다. 반드시 `CLAUDE.md`를 통해 연결해야 한다.

| 상태 | 동작 |
|------|------|
| `./CLAUDE.md` 없음 | `@AGENTS.md` 한 줄만 포함하는 `./CLAUDE.md` 생성 |
| `./CLAUDE.md` 있음 + `@AGENTS.md` 없음 | 파일 최상단에 `@AGENTS.md` 줄 추가 |
| `./CLAUDE.md` 있음 + `@AGENTS.md` 있음 | 변경하지 않음 |

하위 디렉토리에 `AGENTS.md`를 생성한 경우, 해당 디렉토리에도 동일한 규칙을 적용한다.

`@` 참조 형식: `@AGENTS.md` (상대 경로 사용)

## Agent Rules

- "파일을 만들까요?"라고 묻지 말고 즉시 생성한다.
- 기존 `AGENTS.md`가 있다면 이 베스트 프랙티스 구조로 덮어쓴다.
- 생성되는 파일 내용은 유효한 Markdown 문법이어야 한다.
- 모든 AGENTS.md에 이모지를 절대 사용하지 않는다.
