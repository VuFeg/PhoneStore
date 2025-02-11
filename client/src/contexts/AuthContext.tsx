"use client";

import {
  checkMe,
  register,
  login,
  logout as apiLogout,
} from "@/services/authService";
import React, { createContext, useContext, useEffect, useState } from "react";

// Định nghĩa các interface cho dữ liệu user, nếu server trả về dữ liệu như sau
interface User {
  id: string;
  username?: string;
  email: string;
  // Thêm các trường khác nếu cần
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

// Định nghĩa kiểu cho Auth Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (loginData: LoginInput) => Promise<void>;
  registerUser: (registerData: RegisterInput) => Promise<void>;
  logoutUser: () => void;
  checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Khi component mount, kiểm tra xem đã có user đăng nhập hay chưa
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await checkMe();
        setUser(data);
      } catch (error) {
        console.error("No authenticated user", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Hàm đăng nhập
  const loginUser = async (loginData: LoginInput) => {
    try {
      await login(loginData);
      // Sau khi đăng nhập thành công, gọi API /me để cập nhật thông tin user
      const data = await checkMe();
      setUser(data);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Hàm đăng ký (thông thường không tự động đăng nhập)
  const registerUser = async (registerData: RegisterInput) => {
    try {
      await register(registerData);
      // Sau khi đăng ký thành công, bạn có thể chuyển hướng sang trang đăng nhập
      // hoặc tự động đăng nhập nếu server hỗ trợ
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  // Hàm đăng xuất
  const logoutUser = () => {
    apiLogout(); // Gọi API nếu cần để hủy token trên server
    setUser(null);
  };

  // Hàm kiểm tra lại thông tin người dùng (có thể dùng sau khi làm mới token)
  const checkUser = async () => {
    try {
      const data = await checkMe();
      setUser(data);
    } catch (error) {
      console.error("Check user error:", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logoutUser,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
