/**
 * ISO 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환합니다.
 * 
 * @param isoDateString ISO 형식의 날짜 문자열 (예: '2025-05-29T13:32:36.456901+09:00')
 * @returns 포맷팅된 날짜 문자열 (예: '2025.05.29')
 */
export const formatDate = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '날짜 형식 오류';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  } catch (error) {
    console.error('날짜 변환 오류:', error);
    return '날짜 오류';
  }
}; 