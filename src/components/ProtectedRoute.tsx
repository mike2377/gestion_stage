import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  console.log('ProtectedRoute role:', role, 'allowedRoles:', allowedRoles, 'user:', user);

  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role || "")) return <Navigate to="/unauthorized" />;

  return <>{children}</>;
};

export default ProtectedRoute; 