export interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  originCountry: string;
  originFlag: string;
  isTop: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  features?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  location: string;
  verifiedPurchase: boolean;
  productTitle?: string;
}

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  logoIcon: string;
  logoCustomUrl?: string;
  whatsappNumber: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingThreshold: number;
  announcementText: string;
  adminUsername: string;
  adminPassword: string;
  adminPin?: string;
}

export interface CustomerOrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  notes: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}
