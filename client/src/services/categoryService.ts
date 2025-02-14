import instance from "@/utils/axiosInstance";

// Fetch all categories
export const fetchCategories = async () => {
  try {
    const response = await instance.get("/categories");
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch a category by ID
export const fetchCategoryById = async (id: string) => {
  try {
    const response = await instance.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

// Create a new category
export const createCategory = async (categoryData: { name: string }) => {
  try {
    const response = await instance.post("/admin/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Update a category by ID
export const updateCategory = async (
  id: string,
  categoryData: { name: string }
) => {
  try {
    const response = await instance.put(
      `/admin/categories/${id}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category by ID
export const deleteCategory = async (id: string) => {
  try {
    const response = await instance.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
