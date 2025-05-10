// 상품 카드 컴포넌트
// 상품 정보를 카드 형태로 표시

import { Product } from '../../../types/products';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  // 상품 카드 구현
  return (
    <div className="product-card" onClick={onClick}>
      {/* 상품 이미지 */}
      <div className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      
      {/* 상품 정보 */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price}원</p>
      </div>
    </div>
  );
} 