import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { isLoggedIn } from "../utils/auth";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!isLoggedIn()) {
      setUser(null);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const clearUser = () => setUser(null);

  useEffect(() => {
    if (isLoggedIn()) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
