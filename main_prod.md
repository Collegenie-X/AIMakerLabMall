1. 기술 스택

Framework: Next.js (App Router)
언어: TypeScript
UI 라이브러리: MUI v5
상태 관리: React Query (또는 SWR)
스타일링: MUI sx / Styled API

2. 페이지 레이아웃

App
├── layout.tsx
├── page.tsx                    # 메인 페이지 진입점
└── components
    ├── layout
    │   ├── Header.tsx         # 로고, 글로벌 네비게이션
    │   └── Footer.tsx         # 푸터 영역
    ├── domain
    │   ├── HeroBanner.tsx     # 상단 배너 & 캐러셀
    │   ├── MegaMenu.tsx       # 교육 커리큘럼 드롭다운
    │   ├── QuickLinks.tsx     # 메뉴 바로가기
    │   ├── ProductGrid.tsx    # 추천 키트 카드 그리드
    │   ├── InquirySection.tsx # 문의 리스트(탭별)
    │   ├── StatsSection.tsx   # 통계 정보
    │   ├── VideoShowcase.tsx  # 동작 영상 섹션
    │   └── NoticeSection.tsx  # 공지사항
    └── ui
        ├── Button.tsx
        ├── Card.tsx
        ├── Modal.tsx
        └── Tabs.tsx

3. 컴포넌트 상세 요구사항


HeroBanner : 상단 슬라이더 배너. 이미지, 타이틀, 부제 제공slides: Slide[]
MegaMenu :교육 커리큘럼 메뉴 드롭다운 sections: MenuSection[]
QuickLinks: 아이콘 + 텍스트 형태의 바로가기 링크 모음links: QuickLink[]
ProductGrid : 카드 형태 추천 키트 그리드 (6개) products: Product[]
InquirySection :두 개의 탭(구매전적, 출강문의) 질문 리스트를 표시 tabs: TabDat[]

StatsSection:주요 통계(수업 횟수, 참여 인원 등) stats: StatItem[]
VideoShowcase: 스마트팜 작동 영상 섬네일 + 재생 버튼: videoSrc: string
NoticeSection:최근 공지 3개 리스트 notices: Notice[]