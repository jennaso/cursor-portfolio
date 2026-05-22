import Image from "next/image"
import Link from "next/link"
import { CardRow } from "@/components/CardRow"
import { CareerStack } from "@/components/CareerStack"
import { BlurFade } from "@/components/ui/blur-fade"
import { MagicCard } from "@/components/ui/magic-card"
import { ContactForm } from "@/components/ContactForm"
import { GlowText } from "@/components/GlowText"
import { LiveClock } from "@/components/LiveClock"
import { WORKS_LIST } from "@/lib/works"

// ─── 콘텐츠 상수 (시각적 값은 여기서 수정하세요) ──────────────────────────────
const NAME = "Soyeong Jeon"
const TAGLINE_LINE_1 = "UX Designer"
const TAGLINE_LINE_2 = "& Visual Designer"
const EMAIL = "nattasoy@gmail.com"
const CTA_LABEL = "Get in Touch"

const CURRENTLY_LABEL = "Currently at"
const CURRENTLY_COMPANY = "Samsung Electronics, Seoul"

const CAREER_LIST = [
  {
    period: "2021.08 — Present",
    role: "Visual Interaction Designer",
    company: "Samsung Electronics",
    description: "MX사업부 UX팀 소속으로 One UI Watch SysUI 및 컴포넌트 디자인 시스템, 웨어러블 매니저 앱 비주얼 디자인 업무를 경험했고, 현재 One UI 선행 비주얼 디자인을 담당하고 있습니다.",
  },
  {
    period: "2021.03 — 2021.08",
    role: "Design Assistant",
    company: "toss (Viva Republica)",
    description: "플랫폼디자인팀 디자인 어시스턴트로 프레이머 기반의 디자인 시스템 및 Lottie 애니메이션 파일의 수정 개선 업무를 담당했습니다.",
  },
  {
    period: "2020.06 — 2021.06",
    role: "Visual Designer",
    company: "Korea Design Membership Plus",
    description: "한국디자인진흥원 지원사업인 KDM+ 1기 장학생으로 LG전자 UX연구소, BMW Designworks 산학 프로젝트를 진행했습니다.",
  },
  {
    period: "2016.03 — 2020.02",
    role: "Visual Communication Design, BFA",
    company: "Hongik University",
    description: "홍익대학교 디자인학부 시각디자인 전공",
  },
]

// 배경 / 텍스트 컬러 토큰
const PAGE_BG = "bg-[#fef9f5]"
const TEXT_PRIMARY = "text-zinc-900"
const TEXT_MUTED = "text-zinc-500"
const TEXT_GHOST = "text-zinc-300"

// 카드 플레이스홀더: 5개 슬롯 (가운데는 아바타 자리)
// rotation 단위: deg / index 0~4 (좌→우)
// imageSrc: 왼쪽부터 works-01 ~ 04 순서 (중앙 아바타 제외)
const CARD_SLOTS = [
  { rotation: -10, label: "Card 1", imageSrc: WORKS_LIST[0].thumbnail },
  { rotation: -5,  label: "Card 2", imageSrc: WORKS_LIST[1].thumbnail },
  { rotation: 0,   label: "Avatar" },
  { rotation: 5,   label: "Card 3", imageSrc: WORKS_LIST[2].thumbnail },
  { rotation: 10,  label: "Card 4", imageSrc: WORKS_LIST[3].thumbnail },
]

// 이미지 캐시버스터: 이미지를 새로 생성할 때마다 값을 올려서 브라우저 캐시 무효화
const ASSET_VERSION = "5"

const AVATAR_STYLES = [
  `/avatar-pixel.png?v=${ASSET_VERSION}`,
  `/avatar-lego.png?v=${ASSET_VERSION}`,
  `/avatar-doodle.png?v=${ASSET_VERSION}`,
  `/avatar 1.png?v=${ASSET_VERSION}`,
  `/avatar-realistic.png?v=${ASSET_VERSION}`,
]

// Works 섹션 타이틀
const WORKS_SECTION_TITLE = "Works"

// Contact 섹션 타이틀 (폼 내부 텍스트는 components/ContactForm.tsx에서 수정하세요)
const CONTACT_SECTION_TITLE = "Contact"
// ──────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className={`${PAGE_BG} ${TEXT_PRIMARY} flex flex-col`}>
      {/* ════════════════════════ Hero ════════════════════════ */}
      {/* 모바일은 콘텐츠 길이상 min-h-screen, 데스크탑(lg)부터 한 화면(h-screen) 강제 */}
      <section
        id="hero"
        className="relative flex min-h-screen flex-col items-center overflow-x-hidden px-6 py-6 sm:px-10 sm:py-8 lg:h-screen lg:min-h-0 lg:py-10"
      >
        {/* 배경 mesh 이미지 (텍스트 뒤에 배치) */}
        <Image
          src={`/hero-mesh-bg.png?v=${ASSET_VERSION}`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* 가독성 보강용 옅은 화이트 오버레이 */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[#fef9f5]/40" />

        {/* 상단: 위치 및 현재 시각 */}
        <BlurFade delay={0} direction="up" duration={0.5}>
          <div className={`${TEXT_MUTED} flex flex-col items-center gap-0.5 text-[11px] uppercase tracking-[0.2em]`}>
            <span>Based on Seoul, South Korea</span>
            <span>
              UTC +9, <LiveClock />
            </span>
          </div>
        </BlurFade>

        {/* 이름 — 거대 타이포 */}
        <BlurFade delay={0.1} direction="up" duration={0.6} className="mt-10 sm:mt-14 lg:mt-12">
          <GlowText
            as="h1"
            baseColor="#18181b"
            className="font-display text-center text-[8.4vw] font-black uppercase leading-[0.85] tracking-tight sm:text-[6.72vw] lg:text-[5.04rem]"
          >
            {NAME}
          </GlowText>
        </BlurFade>

        {/* 5개 카드 — GSAP 호버 인터랙션은 CardRow(client) 컴포넌트에서 담당 */}
        <BlurFade delay={0.22} direction="up" duration={0.6} className="flex w-full justify-center overflow-visible">
          <CardRow
            slots={CARD_SLOTS}
            avatarSrcs={AVATAR_STYLES}
          />
        </BlurFade>

        {/* 태그라인 — 거대 라이트 그레이 */}
        <BlurFade delay={0.34} direction="up" duration={0.6} className="mt-6 sm:mt-8 lg:mt-6">
          <GlowText
            as="h2"
            baseColor="#d4d4d8"
            className="font-display text-center text-[8.4vw] font-black uppercase leading-[0.9] tracking-tight sm:text-[6.72vw] lg:text-[5.04rem]"
          >
            {TAGLINE_LINE_1},
            <br />
            {TAGLINE_LINE_2}
          </GlowText>
        </BlurFade>

        {/* 하단: CTA — mt-auto로 푸터를 섹션 하단에 고정 */}
        <BlurFade delay={0.46} direction="up" duration={0.5} className="mt-auto w-full pt-8 lg:pt-6">
          <div className="flex flex-col items-center">
            <a
              href="#contact"
              className="rounded-full bg-zinc-900 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-stone-50 transition-all hover:scale-105 hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)]"
            >
              {CTA_LABEL}
            </a>
          </div>
        </BlurFade>
      </section>

      {/* ════════════════════════ Experience ════════════════════════ */}
      <section
        id="Experience"
        className="flex flex-col items-center px-6 py-32 sm:px-10 sm:py-40"
      >
        {/* 거대 experience 타이틀 */}
        <BlurFade delay={0} direction="up" duration={0.6} inView inViewMargin="-80px">
          <h2 className="font-display text-center text-[7.2vw] font-black uppercase leading-[0.85] tracking-tight sm:text-[5.6vw] lg:text-[4.8rem]">
            About
          </h2>
        </BlurFade>

        {/* 경력 — 스택 카드 (클릭으로 펼침/접기) */}
        <BlurFade delay={0.24} direction="up" duration={0.6} inView inViewMargin="-60px" className="mt-16 w-full flex justify-center">
          <CareerStack
            items={CAREER_LIST}
            gradientFrom="#FF9A35"
            gradientTo="#FFCB8E"
            gradientColor="#FFF3E8"
            textMuted={TEXT_MUTED}
          />
        </BlurFade>
      </section>

      {/* ════════════════════════ Works ════════════════════════ */}
      <section
        id="works"
        className="flex flex-col items-center px-6 py-32 sm:px-10 sm:py-40"
      >
        {/* 거대 WORKS 타이틀 */}
        <BlurFade delay={0} direction="up" duration={0.6} inView inViewMargin="-80px">
          <h2 className="font-display text-center text-[7.2vw] font-black uppercase leading-[0.85] tracking-tight sm:text-[5.6vw] lg:text-[4.8rem]">
            {WORKS_SECTION_TITLE}
          </h2>
        </BlurFade>

        {/* 반응형 카드 그리드: 모바일 1열 → sm 2열 → lg 3열 → xl 4열 */}
        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {WORKS_LIST.map((work, index) => (
            <BlurFade
              key={work.slug}
              delay={0.1 + index * 0.1}
              direction="up"
              duration={0.6}
              inView
              inViewMargin="-60px"
              className="h-full"
            >
              <Link href={`/works/${work.slug}`} className="block h-full rounded-2xl">
                <MagicCard
                  className="flex h-full cursor-pointer flex-col overflow-hidden p-0"
                  gradientFrom="#FF9A35"
                  gradientTo="#FFCB8E"
                  gradientColor="#FFF3E8"
                  gradientOpacity={0.6}
                  gradientSize={180}
                >
                  {/* 썸네일 이미지 영역 */}
                  <div className="w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={work.thumbnail}
                      alt={work.title}
                      width={0}
                      height={0}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-auto transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  {/* 카드 텍스트 */}
                  <div className="flex flex-1 flex-col px-5 py-4">
                    <p className="text-base font-semibold">{work.title}</p>
                    <p className={`${TEXT_MUTED} mt-1 text-sm`}>
                      {work.shortDescription}
                    </p>
                  </div>
                </MagicCard>
              </Link>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ════════════════════════ Contact ════════════════════════ */}
      <section
        id="contact"
        className="flex flex-col items-center px-6 py-32 sm:px-10 sm:py-40"
      >
        {/* 섹션 타이틀 */}
        <BlurFade delay={0} direction="up" duration={0.6} inView inViewMargin="-80px">
          <h2 className="font-display text-center text-[7.2vw] font-black uppercase leading-[0.85] tracking-tight sm:text-[5.6vw] lg:text-[4.8rem]">
            {CONTACT_SECTION_TITLE}
          </h2>
        </BlurFade>

        {/* 안내 문구 */}
        <BlurFade delay={0.1} direction="up" duration={0.6} inView inViewMargin="-80px" className="mt-5">
          <p className={`${TEXT_MUTED} text-center text-sm uppercase tracking-[0.2em]`}>
          </p>
        </BlurFade>

        {/* 폼 */}
        <BlurFade delay={0.2} direction="up" duration={0.6} inView inViewMargin="-60px" className="mt-16 w-full max-w-xl">
          <MagicCard
            className="cursor-default rounded-2xl p-8 sm:p-10"
            gradientFrom="#FF9A35"
            gradientTo="#FFCB8E"
            gradientColor="#FFF3E8"
            gradientOpacity={0.6}
            gradientSize={220}
          >
            <ContactForm />
          </MagicCard>
        </BlurFade>
      </section>
    </main>
  )
}
