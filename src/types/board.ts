/**
 * 게시판 아이템 인터페이스
 */
export interface BoardItem {
  id: number;
  title: string;
  requester_name: string;
  author_name?: string;  // 작성자명 (로그인 사용자인 경우)
  course_type?: string;
  student_count?: number;
  status: string;
  created_at: string;
  is_owner?: boolean;    // 현재 사용자가 작성자인지 여부
  can_edit?: boolean;    // 현재 사용자가 수정 가능한지 여부
}

/**
 * 게시판 목록 컴포넌트 Props
 */
export interface BoardListProps {
  title: string;
  items: BoardItem[];
  baseUrl: string;
  onItemClick?: (item: BoardItem) => void;
  maxHeight?: string;
  showViewAll?: boolean;
  iconMap?: { [key: string]: React.ComponentType<any> };
  inquiryTypeMap?: { [key: string]: string };
} 