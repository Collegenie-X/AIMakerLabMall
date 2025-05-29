import { Suspense } from 'react';
import InquiriesPageContent from '@/components/layout/InquiriesPageContent';

/**
 * 교육 키트 문의 페이지 컴포넌트
 * 
 * @returns 교육 키트 문의 페이지
 */
export default function InquiriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InquiriesPageContent />
    </Suspense>
  );
} 