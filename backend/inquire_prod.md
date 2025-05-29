# 교육 키트 구매 견적 문의 시스템 요구사항 분석

## 개요

교육 키트 구매 견적 문의를 관리하는 시스템으로 Django와 Django REST Framework(DRF)를 사용하여 CRUD 기능을 구현합니다.

## 주요 요구사항

### 기능 목록

| 기능       | HTTP 메서드  | URL                       | 설명                      |
| -------- | --------- | ------------------------- | ----------------------- |
| 문의 목록 조회 | GET       | `/api/v1/inquiries/`      | 모든 견적 문의 목록을 조회합니다.     |
| 문의 상세 조회 | GET       | `/api/v1/inquiries/{id}/` | 특정 견적 문의의 세부 내용을 조회합니다. |
| 문의 생성    | POST      | `/api/v1/inquiries/`      | 새로운 견적 문의를 생성합니다.       |
| 문의 수정    | PUT/PATCH | `/api/v1/inquiries/{id}/` | 기존 견적 문의의 내용을 수정합니다.    |
| 문의 삭제    | DELETE    | `/api/v1/inquiries/{id}/` | 특정 견적 문의를 삭제합니다.        |

### 데이터 필드

| 필드명             | 타입       | 필수    | 설명                      |
| --------------- | -------- | ----- | ----------------------- |
| id              | integer  | 자동 생성 | 문의 고유 ID                |
| title           | string   | O     | 문의 제목                   |
| description     | text     | O     | 문의 내용                   |
| inquiry\_type   | string   | O     | 문의 종류 (예: 교구문의, 가격문의 등) |
| created\_at     | datetime | 자동 생성 | 생성 일시                   |
| updated\_at     | datetime | 자동 갱신 | 수정 일시                   |
| requester\_name | string   | O     | 요청자 이름                  |

### 추가 고려 사항

* Pagination 구현 (목록 조회 시)
* 검색 기능 (문의 제목 또는 요청자 이름으로 검색 가능)
* 권한 관리 (관리자만 생성, 수정, 삭제 가능)

## 예시 데이터(JSON)

```json
{
  "id": 1,
  "title": "교육 키트 구매 견적 문의",
  "description": "견적 문의 드립니다.",
  "inquiry_type": "교구문의",
  "created_at": "2025-04-25T12:00:00",
  "updated_at": "2025-04-25T12:00:00",
  "requester_name": "김규리"
}
```