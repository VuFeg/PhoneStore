import {
  Variant,
  CreateVariantInput,
  UpdateVariantInput,
} from "@/types/variants.type";
import instance from "@/utils/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Fetch all variants for a product
export const fetchVariantsForProduct = async (
  productId: string
): Promise<Variant[]> => {
  const response = await instance.get(
    `${API_URL}/products/${productId}/variants`
  );
  return response.data;
};

// Fetch a variant by ID
export const fetchVariantById = async (variantId: string): Promise<Variant> => {
  const response = await instance.get(`${API_URL}/variants/${variantId}`);
  return response.data;
};

// Create a new variant for a product
export const createVariantForProduct = async (
  productId: string,
  variantData: CreateVariantInput
): Promise<Variant> => {
  const response = await instance.post(
    `${API_URL}/admin/products/${productId}/variants`,
    variantData
  );
  return response.data;
};

// Update a variant by ID
export const updateVariant = async (
  variantId: string,
  variantData: UpdateVariantInput
): Promise<Variant> => {
  const response = await instance.put(
    `${API_URL}/admin/variants/${variantId}`,
    variantData
  );
  return response.data;
};

// Delete a variant by ID
export const deleteVariant = async (variantId: string): Promise<void> => {
  await instance.delete(`${API_URL}/admin/variants/${variantId}`);
};
