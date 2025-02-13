import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import ProductUpdate from "./ProductUpdate";

export default function Page() {
  return (
    <AdminProtectedRoute>
      <ProductUpdate />
    </AdminProtectedRoute>
  );
}
