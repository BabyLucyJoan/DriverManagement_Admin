// MCMove/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StaffManagement from "./pages/StaffManagement";
import DriverApproval from "./pages/DriverApproval";
import Layout from "./components/Layout"; // ← ADD
import Penalties from "./pages/Penalties";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

      {/* Protected — ALL WRAPPED IN LAYOUT */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]}>
            <Layout title="Dashboard">
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout title="Staff Management">
              <StaffManagement />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/drivers"
        element={
          <ProtectedRoute allowedPermissions={["approve_drivers"]}>
            <Layout title="Driver Approval">
              <DriverApproval />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/penalties"
        element={
          <ProtectedRoute allowedPermissions={["add_penalties"]}>
            <Layout title="Penalties">
              <Penalties />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<div>Unauthorized</div>} />
    </Routes>
  );
}

export default App;
