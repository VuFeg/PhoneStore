// Interface for a product
export interface Product {
  id: string;
  name: string;
  description: string;
  image_urls: string[]; // Update to match the field name
  public: boolean;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

// Interface for a product variant
export interface ProductVariant {
  id: string;
  productId: string;
  color: string;
  capacity: string;
  price: number;
  stock: number;
  default: boolean;
  active: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Interface for creating a new product
export interface CreateProductInput {
  name: string;
  description: string;
  image_urls: string[]; // Ensure this matches the expected field name
}

// Interface for updating an existing product
export interface UpdateProductInput {
  name?: string;
  description?: string;
  image_urls?: string[]; // Ensure this matches the expected field name
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
