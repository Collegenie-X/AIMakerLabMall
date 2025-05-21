'use client'
import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ProductPurchaseBoxProps {
  price: number;
  shipping: number;
}

export default function ProductPurchaseBox({
  price,
  shipping,
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
  const totalPrice = price * quantity + shipping;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      {/* 수량 선택 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography sx={{ flex: 1 }}>수량</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={handleDecrease}
            disabled={quantity === 1}
          >
            <RemoveIcon />
          </IconButton>
          <Typography sx={{ minWidth: 40, textAlign: 'center' }}>
            {quantity}
          </Typography>
          <IconButton size="small" onClick={handleIncrease}>
            <AddIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 가격 정보 */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>상품금액</Typography>
          <Typography>{(price * quantity).toLocaleString()}원</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>배송비</Typography>
          <Typography>{shipping.toLocaleString()}원</Typography>
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
        <Button
          variant="outlined"
          fullWidth
          sx={{ flex: 1 }}
        >
          장바구니
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ flex: 2 }}
        >
          구매하기
        </Button>
      </Box>
    </Paper>
  );
} 