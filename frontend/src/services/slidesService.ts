// REST API를 통해 슬라이드 이미지를 가져오는 서비스

export interface Slide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  link?: string;
}

// 실제 환경에서는 API 호출로 대체됩니다
export async function getSlides(): Promise<Slide[]> {
  // API 호출 예시:
  // const response = await fetch('/api/slides');
  // return response.json();
  
  // 임시 데이터
  return [
    {
      id: '1',
      imageUrl: '/images/hero1.jpg',
      title: 'AI Maker Lab',
      subtitle: '중·고등학생, 고입을 준비하는 학생들을 위한 AI 자율주행봇'
    },
    {
      id: '2',
      imageUrl: '/images/hero2.jpg',
      title: '메이커 / AI 제품',
      subtitle: '프로젝트 기반 메이커 교육 및 AI 학습용 제품',
      link: '/products/maker-ai'
    },
    {
      id: '3',
      imageUrl: '/images/hero3.jpg',
      title: 'AI 코딩 교육',
      subtitle: '미래를 준비하는 AI 교육 프로그램',
      link: '/curriculum/ai'
    }
  ];
} 