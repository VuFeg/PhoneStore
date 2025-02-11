"use client";

import "../styles/globals.css";
import Navbar from "@/components/common/Navbar";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider từ context

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PhoneStore</title>
      </head>
      <body>
        {/* Bọc toàn bộ ứng dụng trong AuthProvider */}
        <AuthProvider>
          {!hideNavbar && <Navbar />}
          <ToastContainer />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
