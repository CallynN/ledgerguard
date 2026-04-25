import { Routes, Route, Navigate, Outlet, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/Navbar";
import IndexPage from "@/pages/Index";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";
import DashboardPage from "@/pages/Dashboard";
import DisputesPage from "@/pages/Disputes";
import CreateDisputePage from "@/pages/CreateDispute";
import AdminDisputesPage from "@/pages/AdminDisputes";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90 transition-smooth"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-primary-light/30 border-t-primary-light animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/disputes" element={<DisputesPage />} />
          <Route path="/create-dispute" element={<CreateDisputePage />} />
          <Route path="/admin/disputes" element={<AdminDisputesPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
