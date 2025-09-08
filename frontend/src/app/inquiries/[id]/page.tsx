import { Suspense } from 'react';
import InquiryDetailContent from '@/components/layout/InquiryDetailContent';

/**
 * 교육 키트 문의 상세 페이지 컴포넌트
 * 
 * @param params - 라우트 파라미터 (문의 ID 포함)
 * @returns 교육 키트 문의 상세 페이지
 */
export default function InquiryDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InquiryDetailContent inquiryId={Number(params.id)} />
    </Suspense>
  );
} 