// Interface for a product
export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  public: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// Interface for a product variant
export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for creating a new product
export interface CreateProductInput {
  name: string;
  description: string;
  imageUrl: string;
}

// Interface for updating an existing product
export interface UpdateProductInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  public?: boolean;
}

// Interface for creating a new product variant
export interface CreateProductVariantInput {
  name: string;
  price: number;
  stock: number;
}

// Interface for updating an existing product variant
export interface UpdateProductVariantInput {
  name?: string;
  price?: number;
  stock?: number;
}
