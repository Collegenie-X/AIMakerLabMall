'use client';

import { Box, Typography, styled, Divider } from '@mui/material';
import Link from 'next/link';

const CategoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
}));

const CategoryTitle = styled(Box)(({ theme }) => ({
  maxWidth: 160,

  borderLeft: `4px solid ${theme.palette.common.black}`,
  paddingLeft: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Link)(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(1.5, 2),
  textDecoration: 'none',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  border: `2px solid ${theme.palette.grey[300]}`,
  borderRadius: "20px",
  fontSize: '0.9rem',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  }
}));

interface ProductCategoryProps {
  title: string;
  links: {
    label: string;
    url: string;
  }[];
}

export default function ProductCategory({ title, links }: ProductCategoryProps) {
  return (
    <CategoryContainer>
      <CategoryTitle>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </CategoryTitle>
      
      <ButtonGroup>
        {links.map((link, index) => (
          <StyledButton key={index} href={link.url}>
            {link.label}
          </StyledButton>
        ))}
      </ButtonGroup>
    </CategoryContainer>
  );
} 