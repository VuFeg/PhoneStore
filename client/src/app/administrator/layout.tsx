"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Content */}
        <main className="flex-1 p-4">{children}</main>

        {/* Footer */}
      </div>
    </div>
  );
};

export default AdminLayout;
