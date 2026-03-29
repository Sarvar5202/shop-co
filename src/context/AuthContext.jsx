import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const user = { username, role: "admin" };
      setAdmin(user);
      localStorage.setItem("admin", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
