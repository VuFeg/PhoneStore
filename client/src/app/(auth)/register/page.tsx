"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Dùng useRouter từ next/navigation với App Router
import { FiEye, FiEyeOff, FiMail, FiUser, FiLock } from "react-icons/fi";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import { z } from "zod";
import { toast } from "react-toastify";
import { registerSchema } from "@/schemas/authSchema";
import { register } from "@/services/authService"; // Import the register function

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field riêng lẻ bằng Zod
    try {
      // Sử dụng schema để validate field tương ứng
      (registerSchema._def.schema as z.ZodObject<any>).shape[name].parse(value);
      // Nếu validate thành công, xoá lỗi của field đó
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate toàn bộ form bằng Zod
      registerSchema.parse(formData);
      setLoading(true);

      // Call the register API
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      console.log("Registration successful:", response);

      setLoading(false);
      toast.success("Registration successful! Redirecting to login...", {
        position: "top-right",
        autoClose: 3000,
      });
      // Sau 3 giây chuyển hướng sang trang Login
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setLoading(false);
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        toast.error("Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return "";
    if (password.length < 8) return "weak";
    if (password.length < 12) return "medium";
    return "strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create new account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiUser className="text-accent" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-input placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiMail className="text-accent" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-input placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiLock className="text-accent" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 pr-10 border border-input placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="text-accent" />
                ) : (
                  <FiEye className="text-accent" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-destructive">{errors.password}</p>
            )}
            {formData.password && (
              <div className="mt-2">
                <div className="text-sm text-accent">
                  Password strength: {getPasswordStrength(formData.password)}
                </div>
                <div className="h-2 rounded-full bg-muted mt-1">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getPasswordStrength(formData.password) === "weak"
                        ? "w-1/3 bg-destructive"
                        : getPasswordStrength(formData.password) === "medium"
                        ? "w-2/3 bg-chart-4"
                        : "w-full bg-chart-2"
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiLock className="text-accent" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="appearance-none rounded-md relative block w-full px-3 py-2 pl-10 border border-input placeholder-accent focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Register"
              )}
            </button>
          </div>

          {/* Social login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-input"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-accent">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted"
              >
                <FaGoogle className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted"
              >
                <FaFacebook className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-foreground hover:bg-muted"
              >
                <FaGithub className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>

        {/* Chuyển sang trang Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
