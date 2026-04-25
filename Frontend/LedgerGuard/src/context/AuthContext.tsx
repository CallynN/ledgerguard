import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, TOKEN_KEY, USER_KEY, AuthUser, AuthResponse } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const persist = (data: AuthResponse): AuthUser => {
    const u: AuthUser = { id: data.id, email: data.email, role: data.role };
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(data.token);
    setUser(u);
    return u;
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return persist(data);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
    return persist(data);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}