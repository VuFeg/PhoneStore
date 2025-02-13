"use client";

import Sidebar from "@/components/admin/Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      {/* Main content */}
      <main className="flex-1 ml-20">{children}</main>
    </div>
  );
};

export default AdminLayout;
