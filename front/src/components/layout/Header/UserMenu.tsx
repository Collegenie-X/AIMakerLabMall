import { useState } from 'react';
import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  userName: string;
  onLogout: () => Promise<void>;
}

export const UserMenu = ({ userName, onLogout }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await onLogout();
    handleClose();
  };

  const handleProfile = () => {
    router.push('/profile');
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        sx={{ fontWeight: 'bold' }}
      >
        {userName}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleProfile}>
          <Typography>프로필</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography>로그아웃</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu; 