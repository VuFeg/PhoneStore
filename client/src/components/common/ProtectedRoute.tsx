"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/"); // Redirect to home if user is authenticated
    }
  }, [user, loading, router]);

  if (loading || user) {
    return null; // Show nothing while loading or if user is authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;
