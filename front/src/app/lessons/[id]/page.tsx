import { Suspense } from 'react';
import LessonInquiryDetailContent from '@/components/layout/LessonInquiryDetailContent';

/**
 * 수업 문의 상세 페이지 컴포넌트
 * 
 * @param params - 라우트 파라미터 (문의 ID 포함)
 * @returns 수업 문의 상세 페이지
 */
export default function LessonInquiryDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonInquiryDetailContent inquiryId={Number(params.id)} />
    </Suspense>
  );
} 