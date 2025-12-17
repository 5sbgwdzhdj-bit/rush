import { ServiceType, Store } from './types';

export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    name: '肯德基 (科技园店)',
    type: ServiceType.DINING,
    rating: 4.8,
    distance: '1.2km',
    image: 'https://picsum.photos/200/200?random=1',
    products: [
      { id: 'p1', name: '香辣鸡腿堡', price: 19.5, image: 'https://picsum.photos/100/100?random=11' },
      { id: 'p2', name: '原味吮指鸡', price: 12.0, image: 'https://picsum.photos/100/100?random=12' },
      { id: 'p3', name: '大薯条', price: 11.0, image: 'https://picsum.photos/100/100?random=13' },
    ]
  },
  {
    id: 's2',
    name: '必胜客 (万象城店)',
    type: ServiceType.DINING,
    rating: 4.6,
    distance: '3.5km',
    image: 'https://picsum.photos/200/200?random=2',
    products: [
      { id: 'p4', name: '超级至尊披萨', price: 69.0, image: 'https://picsum.photos/100/100?random=14' },
      { id: 'p5', name: '意大利肉酱面', price: 29.0, image: 'https://picsum.photos/100/100?random=15' },
    ]
  },
  {
    id: 's3',
    name: '沃尔玛超市',
    type: ServiceType.MARKET,
    rating: 4.7,
    distance: '2.0km',
    image: 'https://picsum.photos/200/200?random=3',
    products: [
      { id: 'p6', name: '可口可乐 6罐', price: 18.0, image: 'https://picsum.photos/100/100?random=16' },
      { id: 'p7', name: '乐事薯片', price: 8.5, image: 'https://picsum.photos/100/100?random=17' },
      { id: 'p8', name: '佳沛奇异果', price: 25.0, image: 'https://picsum.photos/100/100?random=18' },
    ]
  }
];

export const INITIAL_USER_BALANCE = 500.00;