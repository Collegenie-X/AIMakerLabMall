import { Box, Container, Typography } from "@mui/material";
import HeroBanner from "@/components/domain/HeroBanner";
import MegaMenu from "@/components/domain/MegaMenu";
import ProductGrid from "@/components/domain/ProductGrid";

// 임시 데이터
const slides = [
  {
    imageUrl: "/images/hero1.jpg",
    title: "AI Maker Lab",
    subtitle: "중·고등학생, 고입을 준비하는 학생들을 위한 AI 자율주행봇"
  }
];

const menuSections = [
  {
    title: "교육 커리큘럼",
    items: [
      { name: "초등학교", link: "/education/elementary" },
      { name: "중학교", link: "/education/middle" },
      { name: "고등학교", link: "/education/high" }
    ]
  },
  {
    title: "수업 정보",
    items: [
      { name: "수업 진도", link: "/education/progress" },
      { name: "교육 자료", link: "/education/materials" }
    ]
  }
];

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

export default function Home() {
  return (
    <Box>
      <HeroBanner slides={slides} />
      
      <Container maxWidth="lg" className="py-8">
        <Box className="mb-12">
          <MegaMenu sections={menuSections} />
        </Box>

        <Box className="mb-12">
          <Typography variant="h4" className="mb-6">
            추천 교육 키트
          </Typography>
          <ProductGrid products={products} />
        </Box>
      </Container>
    </Box>
  );
}
