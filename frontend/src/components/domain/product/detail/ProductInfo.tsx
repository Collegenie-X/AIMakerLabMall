import { Box, Typography, Divider, Chip } from '@mui/material';

interface ProductInfoProps {
  name: string;
  price: number;
  category: string;
  duration: string;
  tags: string[];
}

export default function ProductInfo({
  name,
  price,
  category,
  duration,
  tags,
}: ProductInfoProps) {
  return (
    <Box sx={{ p: 2 }}>
      {/* 카테고리 */}
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {category}
      </Typography>
      
      {/* 상품명 */}
      <Typography variant="h5" component="h1" gutterBottom>
        {name}
      </Typography>

      {/* 태그 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
        {tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" />
        ))}
      </Box>

      {/* 가격 정보 */}
      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            {price.toLocaleString()}원
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 상품 정보 */}
      <Box sx={{ '& > div': { mb: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography color="text.secondary" sx={{ width: 100 }}>
            교육 기간
          </Typography>
          <Typography>
            {duration}시간
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography color="text.secondary" sx={{ width: 100 }}>
            카테고리
          </Typography>
          <Typography>{category}</Typography>
        </Box>
      </Box>
    </Box>
  );
} 