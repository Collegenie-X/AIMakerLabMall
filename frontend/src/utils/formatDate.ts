// 날짜 포맷 유틸리티 함수
// 다양한 날짜 포맷팅 함수 모음

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷팅
 */
export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}

/**
 * 날짜를 YYYY년 MM월 DD일 형식으로 포맷팅
 */
export function formatDateKorean(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜를 상대적 시간으로 포맷팅 (예: '3일 전', '1시간 전', '방금 전')
 */
export function formatRelativeTime(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return '방금 전';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays}일 전`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths}개월 전`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
} 