import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Shield, User as UserIcon, LayoutDashboard, FileWarning, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const isAdmin = user.role === "Admin";

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login");
  };

  const initials = user.email?.[0]?.toUpperCase() ?? "U";

  const navItems = [
    { to: "/dashboard", label: "Transactions", icon: LayoutDashboard },
    { to: "/disputes", label: "My Disputes", icon: FileWarning },
    { to: "/create-dispute", label: "New Dispute", icon: PlusCircle },
    ...(isAdmin ? [{ to: "/admin/disputes", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 glass-strong border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow group-hover:scale-110 transition-smooth">
            <span className="font-bold text-primary-foreground">LG</span>
          </div>
          <span className="font-semibold text-lg hidden sm:block">
            Ledger<span className="text-gradient">Guard</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  active ? "text-foreground bg-white/5" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
                {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg ring-1 ring-primary-light/40" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            <div className="h-7 w-7 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {initials}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-foreground truncate max-w-[140px]">{user.email}</span>
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${isAdmin ? "text-warning" : "text-primary-light"}`}>
                {isAdmin ? "Admin" : "Customer"}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-danger hover:bg-danger/10 transition-smooth">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}

export function MobileAvatarFallback() {
  return <UserIcon />;
}
