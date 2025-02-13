"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/"); // Redirect to home if user is not an admin
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return null; // Show nothing while loading or if user is not an admin
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
