import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import ProductManagement from "./ProductManagement";

export default function Page() {
  return (
    <AdminProtectedRoute>
      <ProductManagement />
    </AdminProtectedRoute>
  );
}
