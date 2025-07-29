export interface ProductVariant {
  id?: string;
  color?: string;
  size?: string;
  material?: string;
  stockQuantity: number;
  priceAdjustment: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  shopId: string;
  shopName: string;
  category: string;
  stock: number;
  description: string;
  variants?: ProductVariant[];
}