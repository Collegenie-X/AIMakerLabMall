# 교육 키트 구매 견적 문의 API

교육 키트 구매 견적 문의를 관리하는 API 서비스입니다.

## 기능 개요

- 견적 문의 생성, 조회, 수정, 삭제 기능
- 페이지네이션 및 검색 기능
- 관리자 권한 관리

## API 엔드포인트

| 기능       | HTTP 메서드  | URL                       | 설명                       | 권한     |
| ---------- | ----------- | ------------------------- | ------------------------- | -------- |
| 문의 목록 조회 | GET       | `/api/v1/inquiries/`      | 모든 견적 문의 목록을 조회       | 모두     |
| 문의 상세 조회 | GET       | `/api/v1/inquiries/{id}/` | 특정 견적 문의의 세부 내용을 조회 | 모두     |
| 문의 생성    | POST      | `/api/v1/inquiries/create/` | 새로운 견적 문의를 생성       | 모두     |
| 문의 수정    | PUT/PATCH | `/api/v1/inquiries/{id}/update/` | 기존 견적 문의의 내용을 수정 | 관리자만 |
| 문의 삭제    | DELETE    | `/api/v1/inquiries/{id}/delete/` | 특정 견적 문의를 삭제      | 관리자만 |

## 데이터 모델

`Inquiry` 모델은 다음과 같은 필드를 포함합니다:

- `id`: 문의 고유 ID (자동 생성)
- `title`: 문의 제목
- `description`: 문의 내용
- `inquiry_type`: 문의 종류 (교구문의, 가격문의, 배송문의, 기타문의)
- `created_at`: 생성 일시 (자동 생성)
- `updated_at`: 수정 일시 (자동 갱신)
- `requester_name`: 요청자 이름

## 요청 및 응답 예시

### 견적 문의 생성 요청

```json
POST /api/v1/inquiries/create/
{
  "title": "교육 키트 구매 견적 문의",
  "description": "견적 문의 드립니다.",
  "inquiry_type": "product",
  "requester_name": "김규리"
}
```

### 응답

```json
{
  "id": 1,
  "title": "교육 키트 구매 견적 문의",
  "description": "견적 문의 드립니다.",
  "inquiry_type": "product",
  "created_at": "2025-04-25T12:00:00",
  "updated_at": "2025-04-25T12:00:00",
  "requester_name": "김규리"
}
```

## 검색 기능

문의 목록 조회 API에서는 다음과 같이 검색 쿼리 파라미터를 사용할 수 있습니다:

```
GET /api/v1/inquiries/?search=키워드
```

이 파라미터는 문의 제목과 요청자 이름에서 검색합니다.

## 페이지네이션

문의 목록 조회 API는 페이지네이션을 지원합니다:

```
GET /api/v1/inquiries/?page=1&page_size=10
```

기본 페이지 크기는 10이며, 최대 100개까지 설정할 수 있습니다. 