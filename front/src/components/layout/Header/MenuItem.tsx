import { Box, Button, Popper, Paper, ClickAwayListener, styled } from '@mui/material';
import Link from 'next/link';

const StyledLink = styled(Link)(() => ({
  textDecoration: 'none',
  color: 'inherit',
}));

const MenuItemBox = styled(Box)(() => ({
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: '13px',
  '&:hover': {
    backgroundColor: '#1891E0',
    color: '#fff',
  }
}));

interface MenuItemProps {
  menu: {
    title: string;
    items: { name: string; link: string }[];
  };
  index: number;
  openMenuIndex: number | null;
  anchorEl: HTMLElement | null;
  handleMenuClick: (event: React.MouseEvent<HTMLElement>, index: number) => void;
  handleMenuEnter: (event: React.MouseEvent<HTMLElement>, index: number) => void;
  handleClose: () => void;
}

/**
 * 메뉴 항목 컴포넌트
 * - 드롭다운 메뉴와 팝업 기능 제공
 * - 메뉴 클릭 시 자동 닫힌 기능 포함
 */
export const MenuItem = ({
  menu,
  index,
  openMenuIndex,
  anchorEl,
  handleMenuClick,
  handleMenuEnter,
  handleClose
}: MenuItemProps) => {
  
  /**
   * 메뉴 항목 클릭 핸들러
   * - 페이지 이동 전 팝업 메뉴 닫기
   */
  const handleItemClick = () => {
    handleClose();
  };

  return (
    <Box
      onMouseEnter={(e) => handleMenuEnter(e, index)}
      sx={{ position: 'relative' }}
    >
      <Button 
        color="inherit"
        sx={{ fontWeight: 'bold' }}
        onClick={(e) => handleMenuClick(e, index)}
      >
        {menu.title}
      </Button>
      <Popper
        open={openMenuIndex === index}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ 
          zIndex: 1200,
          minWidth: '140px' 
        }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Paper 
            elevation={3}
            sx={{ 
              mt: 2,
              borderRadius: '5px',
            }}
          >
            {menu.items.map((item, itemIndex) => (
              <StyledLink
                key={itemIndex}
                href={item.link}
                onClick={handleItemClick}
              >
                <MenuItemBox>
                  {item.name}
                </MenuItemBox>
              </StyledLink>
            ))}
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
};

export default MenuItem; 