// 메뉴 바로가기 설정
import { 
  School, 
  Description, 
  Code, 
  QuestionAnswer
} from '@mui/icons-material';

export interface MenuShortcut {
  id: string;
  title: string;
  icon: any;
  url: string;
}

export const menuShortcuts: MenuShortcut[] = [
  {
    id: 'curriculum',
    title: '교육키트 바로 가기',
    icon: School,
    url: '/curriculum'
  },
  {
    id: 'resources',
    title: '수업 지도계획서 다운로드',
    icon: Description,
    url: '/resources'
  },
  {
    id: 'source-code',
    title: '소스코드 다운로드',
    icon: Code,
    url: '/downloads'
  },
  {
    id: 'support',
    title: '자주 묻는 질문',
    icon: QuestionAnswer,
    url: '/faq'
  }
];

export default menuShortcuts; 