import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to manage your disputes">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="float-label-input" />
          <label htmlFor="email" className="float-label">Email</label>
        </div>
        <div className="relative">
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="float-label-input" />
          <label htmlFor="password" className="float-label">Password</label>
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
            {error}
          </motion.p>
        )}
        <button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium shadow-glow hover:opacity-90 disabled:opacity-60 transition-smooth flex items-center justify-center gap-2">
          {loading ? <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" /> : "Sign in"}
        </button>
        <p className="text-center text-sm text-muted-foreground pt-2">
          New here? <Link to="/register" className="text-primary-light hover:underline">Create account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
