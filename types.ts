export enum UserRole {
  USER = 'USER',
  RIDER = 'RIDER'
}

export enum OrderStatus {
  PENDING = '待接单',
  ACCEPTED = '已接单',
  PICKED_UP = '配送中', // Rider has item
  DELIVERED = '已送达', // Rider at destination
  COMPLETED = '已完成' // User verified
}

export enum ServiceType {
  DINING = 'DINING',
  MARKET = 'MARKET',
  ERRAND = 'ERRAND'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Store {
  id: string;
  name: string;
  type: ServiceType.DINING | ServiceType.MARKET;
  rating: number;
  distance: string;
  image: string;
  products: Product[];
}

export interface Order {
  id: string;
  userId: string;
  riderId?: string;
  storeId?: string; // If dining/market
  storeName?: string;
  items?: { product: Product; quantity: number }[]; // If dining/market
  
  // Errand specific
  errandDescription?: string;
  errandItemImage?: string; // User upload at creation
  
  originAddress: string;
  destAddress: string;
  
  status: OrderStatus;
  totalPrice: number;
  createdAt: number;
  
  // Verification
  riderPickupPhoto?: string; // Rider takes this when status -> PICKED_UP
  userReceiptPhoto?: string; // User takes this when status -> COMPLETED
  
  deliveryFee: number;
  tip?: number;
}

export interface UserState {
  id: string;
  name: string;
  balance: number;
  isLocked: boolean; // True if pending verification prevents new orders
}