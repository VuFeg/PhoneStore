import instance from "@/utils/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Function to handle image upload
export const uploadImage = async (file: FormData) => {
  try {
    const response = await instance.post(`${API_URL}/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
