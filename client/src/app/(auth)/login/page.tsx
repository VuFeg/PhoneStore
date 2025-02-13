import ProtectedRoute from "@/components/common/ProtectedRoute";
import LoginPage from "./LoginPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <LoginPage />
    </ProtectedRoute>
  );
}
