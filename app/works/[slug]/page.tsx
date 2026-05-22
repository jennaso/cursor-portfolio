import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BlurFade } from "@/components/ui/blur-fade"
import { WORKS_LIST } from "@/lib/works"

// ─── 시각적 값 (여기서 수정하세요) ─────────────────────────────────────────────
const PAGE_BG = "bg-page-background"
const TEXT_PRIMARY = "text-foreground"
const TEXT_MUTED = "text-muted-foreground"
const BACK_LABEL = "← 모든 작업물 보기"
// ───────────────────────────────────────────────────────────────────────────────

// ⚠️ 이 부분은 로직 영역이므로 건드리지 마세요
export async function generateStaticParams() {
  return WORKS_LIST.map((work) => ({ slug: work.slug }))
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const work = WORKS_LIST.find((w) => w.slug === slug)

  if (!work) {
    notFound()
  }

  return (
    <main className={`${PAGE_BG} ${TEXT_PRIMARY} min-h-screen`}>
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-24">

        {/* 뒤로가기 버튼 */}
        <BlurFade delay={0} direction="up" duration={0.5}>
          <Link
            href="/#works"
            className={`${TEXT_MUTED} inline-flex items-center text-[11px] font-bold uppercase tracking-[0.2em] transition-colors hover:text-foreground`}
          >
            {BACK_LABEL}
          </Link>
        </BlurFade>

        {/* 작업물 제목 */}
        <BlurFade delay={0.1} direction="up" duration={0.6} className="mt-10">
          <h1 className="font-display text-[10vw] font-black uppercase leading-[0.85] tracking-tight sm:text-[7vw] lg:text-[4.5rem]">
            {work.title}
          </h1>
        </BlurFade>

        {/* 썸네일 이미지 */}
        <BlurFade delay={0.2} direction="up" duration={0.6} className="mt-10">
          <div className="w-full overflow-hidden rounded-2xl bg-muted">
            <Image
              src={work.thumbnail}
              alt={work.title}
              width={0}
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 48rem"
              className="w-full h-auto"
              priority
            />
          </div>
        </BlurFade>

        {/* 긴 설명 */}
        <BlurFade delay={0.3} direction="up" duration={0.6} className="mt-10">
          <p className="text-base leading-relaxed text-foreground/80 sm:text-lg">
            {work.longDescription}
          </p>
        </BlurFade>

        {/* 외부 링크 버튼들 */}
        {work.links.length > 0 && (
          <BlurFade delay={0.4} direction="up" duration={0.5} className="mt-10">
            <div className="flex flex-wrap gap-3">
              {work.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-foreground px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] text-page-background transition-colors hover:opacity-80"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </BlurFade>
        )}

      </div>
    </main>
  )
}
