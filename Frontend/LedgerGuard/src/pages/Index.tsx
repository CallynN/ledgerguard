import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary-light/30 border-t-primary-light animate-spin" />
      </div>
    );
  }
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}
