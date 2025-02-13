import ProtectedRoute from "@/components/common/ProtectedRoute";
import RegisterPage from "./RegisterPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <RegisterPage />
    </ProtectedRoute>
  );
}
