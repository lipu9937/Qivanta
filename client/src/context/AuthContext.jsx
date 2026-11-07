import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const read = () => { try { return localStorage.getItem("token"); } catch { return null; } };

export function AuthProvider({ children }) {
  const [token, setToken] = useState(read);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    try { localStorage.setItem("token", data.token); } catch { /* ignore */ }
    setToken(data.token);
  };
  const logout = () => {
    try { localStorage.removeItem("token"); } catch { /* ignore */ }
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
