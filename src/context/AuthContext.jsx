// AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // ← FIXED: named import
import api from "../services/api";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const decoded = jwtDecode(token); // ← jwtDecode, not jwt_decode
  //         setUser({
  //           id: decoded.id,
  //           role: decoded.role,
  //           permissions: decoded.permissions || [],
  //           name: decoded.name || decoded.email,
  //         });
  //       } catch (err) {
  //         localStorage.removeItem("token");
  //       }
  //     }
  //     setLoading(false);
  //   }, []);
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Call a protected route to validate token
        await api.get("/auth/validate"); // We'll create this
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          role: decoded.role,
          permissions: decoded.permissions || [],
          name: decoded.name || decoded.email,
        });
      } catch (err) {
        localStorage.removeItem("token");
        console.log("Invalid token - logged out");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);
  const login = async (email, password, role) => {
    const endpoint =
      role === "admin" ? "/api/auth/admin/login" : "/api/auth/staff/login";

    try {
      const res = await api.post(endpoint, { email, password });
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token); // ← jwtDecode
      setUser({
        id: decoded.id,
        role: decoded.role,
        permissions: decoded.permissions || [],
        name: res.data.user.name,
      });
      toast.success("Login successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // ... rest of file

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
