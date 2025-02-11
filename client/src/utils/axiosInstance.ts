import { logout } from "@/services/authService";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";
// Giả sử bạn có các hàm logout, refresh token ở đây

// Khởi tạo Axios instance với base URL
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
});

// Request Interceptor: tự động thêm header Authorization nếu có accessToken trong localStorage
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Response Interceptor: xử lý lỗi và tự động refresh token nếu cần
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu có lỗi 401 (Unauthorized) và request gốc chưa được retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
            }/auth/refresh`,
            { refresh_token: refreshToken }
          );
          // Cập nhật access token mới vào localStorage
          localStorage.setItem("accessToken", data.access_token);

          // Cập nhật header Authorization cho instance và request gốc
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.access_token}`;

          // Kiểm tra và khởi tạo originalRequest.headers nếu chưa có
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.access_token}`;

          // Thử lại request gốc với access token mới
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh token thất bại, logout user và thông báo lỗi
        await logout();
        toast.error("Session expired, please log in again");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
