import React from "react";
import { useAuth } from "../../context/AuthContext";

import SuperAdminDashboard from "../super-admin/Dashboard";
import EnterpriseDashboard from "../entreprise/Dashboard";
import TutorDashboard from "../tuteur/Dashboard";
import Dashboard from "./Dashboard"; // Dashboard générique pour student, teacher, responsible, admin

const RoleBasedDashboard: React.FC = () => {
  const { role, user, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  if (!user) return <div>Non connecté</div>;

  switch (role) {
    case "super_admin":
      return <SuperAdminDashboard />;
    case "enterprise":
      return <EnterpriseDashboard />;
    case "tutor":
      return <TutorDashboard />;
    case "student":
    case "teacher":
    case "responsible":
    case "admin":
      return <Dashboard user={{ ...user, role }} />;
    default:
      return <div>Rôle inconnu ou non autorisé</div>;
  }
};

export default RoleBasedDashboard; 