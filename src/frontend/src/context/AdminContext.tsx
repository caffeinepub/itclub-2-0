import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AdminContextValue {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_USERNAME = "itbvbkdlr";
const ADMIN_PASSWORD = "Itbvb@02";
const SESSION_KEY = "itclub_admin_session";

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, isAdmin ? "true" : "false");
    } catch {
      // ignore storage errors
    }
  }, [isAdmin]);

  const login = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return ctx;
}
