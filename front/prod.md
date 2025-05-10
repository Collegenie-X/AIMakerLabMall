# AI메이커랩 쇼핑몰 Frontend 구조 및 요구사항

## 📂 폴더 구조

```plaintext
front
├── src
│   ├── app
│   │   ├── (routes)
│   │   │   ├── auth
│   │   │   │   ├── login
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── signup
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── mypage
│   │   │   │   │   └── page.tsx
│   │   │   │   └── logout
│   │   │   │       └── page.tsx
│   │   │   ├── main
│   │   │   │   └── page.tsx
│   │   │   ├── products
│   │   │   │   └── page.tsx
│   │   │   ├── education
│   │   │   │   └── page.tsx
│   │   │   ├── company
│   │   │   │   └── page.tsx
│   │   │   └── policy
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components
│   │   ├── ui
│   │   │   ├── Button
│   │   │   │   └── index.tsx
│   │   │   ├── Card
│   │   │   │   └── index.tsx
│   │   │   └── Modal
│   │   │       └── index.tsx
│   │   └── domain
│   │       ├── ProductCard
│   │       │   └── index.tsx
│   │       ├── InquiryBoard
│   │       │   └── index.tsx
│   │       └── FAQ
│   │           └── index.tsx
│   │
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useEducation.ts
│   │   └── usePolicy.ts
│   │
│   ├── services
│   │   ├── axiosInstance.ts
│   │   ├── authService.ts
│   │   └── productService.ts
│   │
│   ├── queries
│   │   ├── authQueries.ts
│   │   ├── productQueries.ts
│   │   └── educationQueries.ts
│   │
│   ├── types
│   │   ├── auth.d.ts
│   │   ├── products.d.ts
│   │   └── education.d.ts
│   │
│   ├── utils
│   │   ├── formatDate.ts
│   │   └── currencyFormatter.ts
│   │
│   └── styles
│       ├── globals.css
│       └── theme.ts
│
├── public
│   ├── next.svg
│   ├── vercel.svg
│   ├── file.svg
│   ├── globe.svg
│   └── window.svg
│
├── .eslintrc.json
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json

```

## 📌 주요 구성 요소 설명

### 1. src/app 디렉토리
- Next.js 13+ App Router 구조 적용
- 라우트 그룹화를 위한 (routes) 디렉토리 사용
- 각 라우트별 page.tsx 파일로 페이지 구성
- layout.tsx로 공통 레이아웃 관리

### 2. src/components 디렉토리
- **ui**: 재사용 가능한 순수 UI 컴포넌트
  - Button: 공통 버튼 컴포넌트 (variant, size 등 커스터마이징 가능)
  - Card: 카드 형태의 컨테이너 컴포넌트
  - Modal: 모달 다이얼로그 컴포넌트
- **domain**: 비즈니스 도메인별 특화 컴포넌트
  - ProductCard: 상품 정보 표시 카드
  - InquiryBoard: 문의 게시판 관련 컴포넌트
  - FAQ: 자주 묻는 질문 컴포넌트

### 3. src/services 디렉토리
- **axiosInstance.ts**: 
  - API 통신을 위한 axios 인스턴스 설정
  - 인터셉터를 통한 토큰 관리
  - 에러 핸들링 공통 처리
- **authService.ts**: 인증 관련 API 호출
- **productService.ts**: 상품 관련 API 호출

### 4. src/types 디렉토리
- **auth.d.ts**: 
  - User 인터페이스
  - 로그인/회원가입 요청/응답 타입
  - 인증 상태 관리 타입
- **products.d.ts**: 상품 관련 타입 정의
- **education.d.ts**: 교육 키트 관련 타입 정의

### 5. src/styles 디렉토리
- **globals.css**: 
  - 전역 스타일 정의
  - Tailwind CSS 유틸리티 클래스
  - 공통 컴포넌트 스타일
- **theme.ts**: 디자인 시스템 테마 설정

## ✅ 개발 규칙

1. **컴포넌트 개발**
   - UI 컴포넌트는 순수 함수형으로 개발
   - Props 타입 명시적 정의
   - Tailwind CSS 사용

2. **상태 관리**
   - 서버 상태: React-Query 사용
   - 클라이언트 상태: React Context 또는 Zustand 사용
   - 캐시 전략 명확히 설정

3. **타입 안정성**
   - TypeScript strict 모드 사용
   - 모든 컴포넌트와 함수의 타입 명시
   - any 타입 사용 금지

4. **코드 품질**
   - ESLint 규칙 준수
   - 주석 작성 필수
   - 컴포넌트 단위 테스트 작성

5. **성능 최적화**
   - Next.js Image 컴포넌트 사용
   - 코드 스플리팅
   - 레이지 로딩 적용

6. **접근성**
   - ARIA 레이블 사용
   - 키보드 네비게이션 지원
   - 시맨틱 HTML 사용

## 🔧 기술 스택

- Next.js 13+
- TypeScript
- React-Query
- Axios
- Tailwind CSS
- ESLint
- Jest (테스트)
