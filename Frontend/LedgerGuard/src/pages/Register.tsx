import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      toast.success("Account created");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start managing disputes in seconds">
      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8 gap-3">
          <CheckCircle2 className="h-14 w-14 text-success" />
          <p className="text-foreground font-medium">Account created!</p>
          <p className="text-sm text-muted-foreground">Redirecting…</p>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="float-label-input" />
            <label htmlFor="name" className="float-label">Full Name</label>
          </div>
          <div className="relative">
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="float-label-input" />
            <label htmlFor="email" className="float-label">Email</label>
          </div>
          <div className="relative">
            <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="float-label-input" />
            <label htmlFor="password" className="float-label">Password (min 6 chars)</label>
          </div>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-danger bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
              {error}
            </motion.p>
          )}
          <button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground rounded-xl py-3 font-medium shadow-glow hover:opacity-90 disabled:opacity-60 transition-smooth flex items-center justify-center gap-2">
            {loading ? <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" /> : "Create account"}
          </button>
          <p className="text-center text-sm text-muted-foreground pt-2">
            Already have an account? <Link to="/login" className="text-primary-light hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
