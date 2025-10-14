import React, { useState } from 'react';
import Link from 'next/link';
import {
  SwipeableDrawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface DrawerMenuItem {
  name: string;
  link: string;
}

interface DrawerMenuGroup {
  title: string;
  items: DrawerMenuItem[];
}

interface MobileNavDrawerProps {
  anchor: 'left' | 'right';
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  menuItems: DrawerMenuGroup[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * MobileNavDrawer
 * - 모바일 전용 스와이프 서랍 컴포넌트
 * - 좌/우 앵커 지원, 가장자리 스와이프 열기 가능
 * - 메인 메뉴(Accordion)와 서브 메뉴로 구분
 */
export default function MobileNavDrawer({
  anchor,
  open,
  onOpen,
  onClose,
  menuItems,
  header,
  footer
}: MobileNavDrawerProps) {
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleItemClick = () => {
    onClose();
  };

  const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      disableBackdropTransition={!isIOS}
      disableDiscovery={false}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width: 280 } }}
      SwipeAreaProps={{ width: 24 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} role="presentation">
        {/* 헤더 영역 */}
        {header && (
          <Box sx={{ px: 2, py: 2, borderBottom: '1px solid #eee' }}>
            {header}
          </Box>
        )}

        {/* 메뉴 그룹 - Accordion으로 메인/서브 구분 */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {menuItems.map((group, idx) => (
            <Accordion
              key={group.title + idx}
              expanded={expanded === `panel${idx}`}
              onChange={handleAccordionChange(`panel${idx}`)}
              disableGutters
              elevation={0}
              sx={{
                '&:before': { display: 'none' },
                borderBottom: '1px solid #eee'
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  px: 2,
                  py: 1,
                  minHeight: 48,
                  '&.Mui-expanded': {
                    minHeight: 48,
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                  {group.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense disablePadding>
                  {group.items.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      onClick={handleItemClick}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ListItemButton sx={{ pl: 4, py: 1 }}>
                        <ListItemText 
                          primary={item.name} 
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                        />
                      </ListItemButton>
                    </Link>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* 푸터 영역 */}
        {footer && (
          <Box sx={{ px: 2, py: 2, borderTop: '1px solid #ddd' }}>
            {footer}
          </Box>
        )}
      </Box>
    </SwipeableDrawer>
  );
}


