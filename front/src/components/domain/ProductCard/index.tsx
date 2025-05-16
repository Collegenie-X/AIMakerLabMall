// 상품 카드 컴포넌트
// 상품 정보를 카드 형태로 표시

import { Product } from '../../../types/products';
import Image from 'next/image';

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
        <Image 
          src={product.imageUrl} 
          alt={product.name}
          width={300}
          height={300}
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* 상품 정보 */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{product.price}원</p>
      </div>
    </div>
  );
} 