import { Box, Container, Typography } from "@mui/material";
import HeroBanner from "@/components/domain/HeroBanner";
import MenuShortcuts from "@/components/domain/MenuShortcuts";
import { getSlides } from "@/services/slidesService";
import ProductGrid from "@/components/domain/ProductGrid";

// 임시 제품 데이터
const products = [
  {
    id: "1",
    name: "인공지능 DIY 컨트롤 만들기",
    description: "스마트팜 작동 실습용 키트",
    imageUrl: "/images/product1.jpg",
    price: 299000
  },
  {
    id: "2",
    name: "인공지능 DIY 컨트롤 만들기",
    description: "스마트팜 작동 실습용 키트",
    imageUrl: "/images/product2.jpg",
    price: 299000
  },
  {
    id: "3",
    name: "인공지능 DIY 컨트롤 만들기",
    description: "스마트팜 작동 실습용 키트",
    imageUrl: "/images/product3.jpg",
    price: 299000
  }
];

export default async function Home() {
  // 실제 API에서 슬라이드 데이터 가져오기
  const slides = await getSlides();
  
  return (
    <Box>
      {/* 슬라이드 이미지 배너 */}
      <HeroBanner slides={slides} />
      
      {/* 메뉴 바로가기 */}
      <MenuShortcuts />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 12 }}>
          <Typography variant="h4" sx={{ mb: 6 }}>
            추천 교육 키트
          </Typography>
          <ProductGrid products={products} />
        </Box>
      </Container>
    </Box>
  );
}
