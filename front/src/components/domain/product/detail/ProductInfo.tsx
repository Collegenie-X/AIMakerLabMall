import { Box, Typography, Divider } from '@mui/material';

interface ProductInfoProps {
  name: string;
  price: number;
  originalPrice: number;
  shipping: number;
  origin: string;
  shippingMethod: string;
}

export default function ProductInfo({
  name,
  price,
  originalPrice,
  shipping,
  origin,
  shippingMethod,
}: ProductInfoProps) {
  // 할인율 계산
  const discountRate = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <Box sx={{ p: 2 }}>
      {/* 상품명 */}
      <Typography variant="h5" component="h1" gutterBottom>
        {name}
      </Typography>

      {/* 가격 정보 */}
      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          {discountRate > 0 && (
            <Typography variant="h6" color="error" fontWeight="bold">
              {discountRate}%
            </Typography>
          )}
          <Typography variant="h6" fontWeight="bold">
            {price.toLocaleString()}원
          </Typography>
        </Box>
        {originalPrice > price && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            {originalPrice.toLocaleString()}원
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 배송 정보 */}
      <Box sx={{ '& > div': { mb: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography color="text.secondary" sx={{ width: 100 }}>
            배송비
          </Typography>
          <Typography>
            {shipping === 0 ? '무료배송' : `${shipping.toLocaleString()}원`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography color="text.secondary" sx={{ width: 100 }}>
            원산지
          </Typography>
          <Typography>{origin}</Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography color="text.secondary" sx={{ width: 100 }}>
            배송방법
          </Typography>
          <Typography>{shippingMethod}</Typography>
        </Box>
      </Box>
    </Box>
  );
} 