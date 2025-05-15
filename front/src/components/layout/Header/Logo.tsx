import { Box, Typography, styled } from '@mui/material';
import Link from 'next/link';

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
}));

export const Logo = () => (
  <StyledLink href="/">
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h6" component="span" sx={{ color: '#E53E3E', fontWeight: 'bold' }}>
        AI Maker
      </Typography>
      <Typography variant="h6" component="span" sx={{ ml: 1 }}>
        Lab
      </Typography>
    </Box>
  </StyledLink>
);

export default Logo; 