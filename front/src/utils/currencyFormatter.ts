// 통화 포맷 유틸리티 함수
// 가격 표시 형식 포맷팅 함수 모음

/**
 * 숫자를 한국 원화 형식으로 포맷팅 (예: 1000 -> 1,000원)
 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * 숫자에 천 단위 쉼표 추가 (예: 1000 -> 1,000)
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat('ko-KR').format(number);
}

/**
 * 할인율 계산 함수
 */
export function calculateDiscountRate(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) {
    return 0;
  }
  
  const discountRate = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discountRate);
}

/**
 * 할인율 포맷팅 함수 (예: 10 -> 10%)
 */
export function formatDiscountRate(discountRate: number): string {
  return `${discountRate}%`;
} 