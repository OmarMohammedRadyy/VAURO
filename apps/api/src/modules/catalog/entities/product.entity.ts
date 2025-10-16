export interface ProductEntity {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  categoryId: string;
  options?: string[];
}
