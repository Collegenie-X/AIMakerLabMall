// 상품 상세 정보 임시 데이터
export const productDetailConfig = {
  id: 1,
  name: '스마트팜 만들기 키트(아두이노 UNO호환보드, 센서, 메뉴얼 포함)',
  price: 57200,
  originalPrice: 60000,
  shipping: 3000,
  origin: '국내',
  shippingMethod: '택배',
  images: [
    '/images/products/smartfarm-1.jpg',
    '/images/products/smartfarm-2.jpg',
    '/images/products/smartfarm-3.jpg',
    '/images/products/smartfarm-4.jpg',
  ],
  description: {
    features: [
      '아두이노 기반의 스마트팜 교육용 키트',
      '온도, 습도, 조도 센서 포함',
      '14세 이상 사용 가능',
      '상세 메뉴얼 포함'
    ],
    specifications: {
      manufacturer: 'AI Maker Lab',
      components: [
        'Arduino UNO 호환보드 1개',
        'DHT11 온습도센서 1개',
        'CDS 조도센서 1개',
        '미니 브레드보드 1개',
        '점퍼 와이어 세트'
      ],
      size: '220 x 150 x 45mm',
      weight: '350g'
    }
  }
}; 