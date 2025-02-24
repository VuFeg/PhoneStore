import instance from "@/utils/axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Interface for login input
interface LoginInput {
  email: string;
  password: string;
}

// Interface for registration input
interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

// Function to handle user login
export const login = async (loginData: LoginInput) => {
  try {
    const response = await instance.post(`${API_URL}/auth/login`, loginData);
    // Save the token to local storage or cookies
    localStorage.setItem("accessToken", response.data.access_token);
    localStorage.setItem("refreshToken", response.data.refresh_token);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Function to handle user registration
export const register = async (registerData: RegisterInput) => {
  try {
    const response = await instance.post(
      `${API_URL}/auth/register`,
      registerData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering:", error);
    throw error;
  }
};

// Function to handle user logout
export const logout = async () => {
  try {
    const access_token = localStorage.getItem("accessToken");
    const refresh_token = localStorage.getItem("refreshToken");

    await instance.post(`${API_URL}/auth/logout`, {
      refresh_token,
      access_token,
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const checkMe = async () => {
  try {
    const response = await instance.get(`/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking user:", error);
    throw error;
  }
};
