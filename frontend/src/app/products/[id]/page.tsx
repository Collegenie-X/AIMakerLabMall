import ProductDetailContainer from '@/components/domain/product/detail/ProductDetailContainer';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailContainer />;
} 