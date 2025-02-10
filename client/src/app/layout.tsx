"use client";

import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        <title>PhoneStore</title>
      </head>
      <body>
        {!isAdminPage && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
