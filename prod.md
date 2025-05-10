# 쇼핑몰 Frontend 폴더 구조 및 요구사항 (prod.md)


## 📂 폴더 구조

```plaintext
frontend
├── app
│   ├── (routes)
│   │   ├── auth (회원 가입 및 인증)
│   │   │   ├── login
│   │   │   ├── signup
│   │   │   ├── forgot-password
│   │   │   ├── mypage
│   │   │   └── logout
│   │   ├── main (메인 페이지)
│   │   ├── products (상품 페이지)
│   │   ├── education (교육 키트 및 수업 문의 게시판)
│   │   ├── company (회사 소개)
│   │   └── policy (개인 정보 및 약관)
│   ├── layout.tsx
│   └── page.tsx
│
├── components (공통 UI 컴포넌트)
│   ├── ui
│   │   ├── Button
│   │   ├── Card
│   │   └── Modal
│   └── domain
│       ├── ProductCard
│       ├── InquiryBoard
│       └── FAQ
│
├── hooks (비즈니스 로직 전용 훅 관리)
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useEducation.ts
│   └── usePolicy.ts
│
├── services (API 호출 관리)
│   ├── axiosInstance.ts
│   ├── authService.ts
│   └── productService.ts
│
├── queries (React-Query 관리)
│   ├── authQueries.ts
│   ├── productQueries.ts
│   └── educationQueries.ts
│
├── types (TypeScript 공통 타입 관리)
│   ├── auth.d.ts
│   ├── products.d.ts
│   └── education.d.ts
│
├── utils (공통 유틸리티)
│   ├── formatDate.ts
│   └── currencyFormatter.ts
│
└── styles (글로벌 스타일 및 테마 관리)
    ├── globals.css
    └── theme.ts
```

---

## 📌 주요 요구사항

### 1. Next.js & App Router

* 최신 Next.js App Router 방식 사용
* SSR 및 Static Generation을 적절히 활용

### 2. TypeScript

* 명확한 타입 정의
* 타입은 공통 관리 (`types` 폴더 내 관리)

### 3. React-Query (캐싱 및 상태 관리)

* 서버 상태 관리
* 데이터 캐싱 및 무효화 전략 (`queries` 폴더 관리)

### 4. UI 로직과 비즈니스 로직 명확히 분리

* UI 로직: 시각적 요소만 처리 (`components/ui`, `components/domain`)
* 비즈니스 로직: 데이터 가공 및 API 연동 (`hooks`, `services`)

### 5. axios 인스턴스

* axios 하나의 instance로 관리하여 중복 코드 제거 및 통일성 유지
* API 주소 및 공통 설정 별도 관리 (`services/axiosInstance.ts`)

### 6. 유지보수 용이성

* 중복 코드 최소화
* 폴더별, 기능별 명확한 역할 및 책임 분리
* hooks 중심으로 로직 구성하여 재사용성 극대화

---

## ✅ 개발 규칙

* 각 기능별로 폴더와 컴포넌트, Hook 명칭 통일 (예: use로 시작하는 Hook)
* 모든 비동기 처리는 React-Query로 관리하고, 캐싱 전략 명시
* API 호출 및 데이터 가공은 services와 hooks에서만 수행
* UI 컴포넌트는 비즈니스 로직을 포함하지 않으며, 오직 props로만 데이터 주입
* TypeScript를 통해 타입 안정성 철저히 유지

---

본 요구사항과 제공된 사이트 맵을 기반으로 개발을 진행하며, Cursor 및 ChatGPT를 활용하여 효율적으로 관리하고 장기적으로 유지보수 효율성을 확보합니다.
