import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import ProductCreation from "./ProductCreation";

export default function Page() {
  return (
    <AdminProtectedRoute>
      <ProductCreation />
    </AdminProtectedRoute>
  );
}
