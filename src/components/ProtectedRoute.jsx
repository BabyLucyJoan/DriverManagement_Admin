// ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedPermissions = [],
}) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  if (allowedPermissions.length > 0) {
    const hasPermission =
      user.role === "admin" ||
      allowedPermissions.some((p) => user.permissions.includes(p));
    if (!hasPermission) return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
