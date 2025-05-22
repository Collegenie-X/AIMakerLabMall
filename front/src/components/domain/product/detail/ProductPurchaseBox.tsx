'use client'
import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ProductPurchaseBoxProps {
  productId: number;
  price: number;
  status: string;
}

export default function ProductPurchaseBox({
  productId,
  price,
  status,
}: ProductPurchaseBoxProps) {
  const [quantity, setQuantity] = useState(1);

  // 수량 증가
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // 수량 감소
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // 총 금액 계산
  const totalPrice = price * quantity;
  
  // 상품 상태에 따른 구매 버튼 비활성화 여부
  const isAvailable = status === 'available';

  // 장바구니 추가 핸들러
  const handleAddToCart = () => {
    console.log(`장바구니에 상품 추가: ${productId}, 수량: ${quantity}`);
    // TODO: 장바구니 추가 API 호출
    alert('장바구니에 추가되었습니다.');
  };

  // 구매하기 핸들러
  const handlePurchase = () => {
    console.log(`상품 구매: ${productId}, 수량: ${quantity}`);
    // TODO: 구매 페이지로 이동 또는 구매 API 호출
    alert('구매 페이지로 이동합니다.');
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      {/* 수량 선택 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ flex: 1 }}>수량</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={handleDecrease}
            disabled={quantity === 1 || !isAvailable}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton 
            size="small" 
            onClick={handleIncrease}
            disabled={!isAvailable}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 가격 정보 */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>상품금액</Typography>
          <Typography>{price.toLocaleString()}원</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>수량</Typography>
          <Typography>{quantity}개</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 총 결제금액 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography fontWeight="bold">총 결제금액</Typography>
        <Typography variant="h6" fontWeight="bold" color="primary">
          {totalPrice.toLocaleString()}원
        </Typography>
      </Box>

      {/* 구매 버튼 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={!isAvailable ? "현재 구매할 수 없는 상품입니다" : ""}>
          <span style={{ flex: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              disabled={!isAvailable}
              onClick={handleAddToCart}
            >
              장바구니
            </Button>
          </span>
        </Tooltip>
        <Tooltip title={!isAvailable ? "현재 구매할 수 없는 상품입니다" : ""}>
          <span style={{ flex: 2 }}>
            <Button
              variant="contained"
              fullWidth
              disabled={!isAvailable}
              onClick={handlePurchase}
            >
              구매하기
            </Button>
          </span>
        </Tooltip>
      </Box>
      
      {!isAvailable && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          현재 구매할 수 없는 상품입니다.
        </Typography>
      )}
    </Paper>
  );
} 