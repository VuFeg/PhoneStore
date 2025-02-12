export interface Variant {
  id: string;
  productId: string;
  color: string;
  capacity: string;
  price: number;
  stock: number;
  default: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVariantInput {
  color: string;
  capacity: string;
  price: number;
  stock: number;
  default: boolean;
  active: boolean;
}

export interface UpdateVariantInput {
  color?: string;
  capacity?: string;
  price?: number;
  stock?: number;
  default?: boolean;
  active?: boolean;
}
