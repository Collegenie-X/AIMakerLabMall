import { Suspense } from 'react';
import LessonsPageContent from '@/components/layout/LessonsPageContent';

/**
 * 수업 문의 페이지 컴포넌트
 * 
 * @returns 수업 문의 페이지
 */
export default function LessonsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonsPageContent />
    </Suspense>
  );
} 