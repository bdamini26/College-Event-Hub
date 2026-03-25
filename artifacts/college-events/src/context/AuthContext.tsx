import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  rollNumber?: string | null;
  branch?: string | null;
  year?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  rollNumber?: string;
  branch?: string;
  year?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("pscmr_token");
    if (stored) {
      setToken(stored);
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.id) setUser(data);
          else { localStorage.removeItem("pscmr_token"); setToken(null); }
        })
        .catch(() => { localStorage.removeItem("pscmr_token"); setToken(null); })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    localStorage.setItem("pscmr_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (formData: RegisterData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    localStorage.setItem("pscmr_token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("pscmr_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
