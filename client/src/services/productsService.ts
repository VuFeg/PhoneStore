import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../types/products";
import instance from "@/utils/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await instance.get(`${API_URL}/products`);
    // Kiểm tra cấu trúc trả về:
    console.log("API response:", response.data);

    // Nếu API trả về { data: Product[] }
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    // Nếu API trả về trực tiếp một mảng
    if (Array.isArray(response.data)) {
      return response.data;
    }

    // Nếu không khớp, trả về mảng rỗng (hoặc throw error)
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch a single product by ID
export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await instance.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  try {
    const response = await instance.post(
      `${API_URL}/admin/products`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<Product> => {
  try {
    const response = await instance.put(
      `${API_URL}/products/${id}`,
      productData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await instance.delete(`${API_URL}/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
