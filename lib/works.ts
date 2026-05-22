// ─── 작업물 데이터 (제목·설명·링크를 여기서 수정하세요) ──────────────────────────

export type WorkLink = {
  label: string
  href: string
}

export type Work = {
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  thumbnail: string
  links: WorkLink[]
}

export const WORKS_LIST: Work[] = [
  {
    slug: "work-01",
    title: "Space",
    shortDescription: "폴더블 디바이스를 위한 가상의 멀티 OS 프레임워크",
    longDescription:
      "스페이스는 폴더블 디바이스를 위한 가상의 멀티 OS 프레임워크 컨셉의 UI입니다. 업무, 휴식, 교류 등 다양한 일상에서 테마를 자유롭게 넘나들며 나만의 초개인화 공간을 느낄 수 있습니다.",
    thumbnail: "/works-01.png?v=5",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
  {
    slug: "work-02",
    title: "Polytic",
    shortDescription: "육면체 큐브가 쌓이며 기록되는 뉴스 아카이빙 서비스",
    longDescription:
      "폴리틱은 육면체 큐브 비주얼의 뉴스 아카이빙 서비스입니다. 유저가 뉴스를 읽은 흔적을 색상으로 기록하는 큐브와, 뉴스 선호타입 분류를 통해 유저의 읽기 습관을 시각적으로 보여줍니다. 이를 통해 더 현명한 방식으로 뉴스를 읽고 저장할 수 있도록 돕습니다.",
    thumbnail: "/works-02.png?v=5",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
  {
    slug: "work-03",
    title: "One UI Watch 8 Tile",
    shortDescription: "워치 멀티 인포 타일 디자인 시스템",
    longDescription:
      "One UI Watch 8에 적용된 신규 기능인 멀티 인포 타일의 비주얼 컨셉 및 디자인 시스템을 제작했습니다.",
    thumbnail: "/works-03.png?v=5",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
  {
    slug: "work-04",
    title: "Ppoba",
    shortDescription: "내가 직접 만드는 나만의 카드 게임",
    longDescription:
      "사이드 프로젝트 동아리 매쉬업에서 제작한 웹 프로젝트로, 직접 밸런스 게임 등 카드 게임을 제작하고, 2가지의 카드 게임 인터랙션을 적용해 즐길 수 있습니다.",
    thumbnail: "/works-04.png?v=5",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
]
