import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/models/User';

interface SidebarProps {
  user: any;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isCollapsed = false, onToggle }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case UserRole.STUDENT:
        return [
          { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
          { path: '/etudiant/rechercher', icon: 'fas fa-search', label: 'Rechercher des stages' },
          { path: '/etudiant/stages', icon: 'fas fa-briefcase', label: 'Mes stages' },
          { path: '/etudiant/documents', icon: 'fas fa-folder', label: 'Mes documents' },
          { path: '/etudiant/taches', icon: 'fas fa-tasks', label: 'Tâches hebdomadaires' },
          { path: '/etudiant/profil', icon: 'fas fa-user', label: 'Mon profil' },
        ];

      case UserRole.ENTERPRISE:
        return [
          { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
          { path: '/entreprise/offres', icon: 'fas fa-briefcase', label: 'Mes offres' },
          { path: '/entreprise/candidatures', icon: 'fas fa-inbox', label: 'Candidatures reçues' },
          { path: '/entreprise/stagiaires', icon: 'fas fa-users', label: 'Mes stagiaires' },
          { path: '/entreprise/taches', icon: 'fas fa-tasks', label: 'Tâches stagiaires' },
          { path: '/entreprise/profil', icon: 'fas fa-building', label: 'Profil entreprise' },
          { path: '/entreprise/parametres', icon: 'fas fa-cog', label: 'Paramètres' },
        ];

      case UserRole.TEACHER:
        return [
          { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
          { path: '/enseignant/stages', icon: 'fas fa-briefcase', label: 'Gestion stages' },
          { path: '/enseignant/conventions', icon: 'fas fa-file-contract', label: 'Conventions' },
          { path: '/enseignant/evaluations', icon: 'fas fa-star', label: 'Évaluations' },
          { path: '/enseignant/rapports', icon: 'fas fa-chart-bar', label: 'Rapports' },
          { path: '/enseignant/suivi', icon: 'fas fa-clipboard-check', label: 'Suivi pédagogique' },
          { path: '/enseignant/taches', icon: 'fas fa-tasks', label: 'Tâches stagiaires' },
        ];

      case UserRole.RESPONSIBLE:
        return [
          { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
          { path: '/responsable/stages', icon: 'fas fa-briefcase', label: 'Gestion stages' },
          { path: '/responsable/conventions', icon: 'fas fa-file-contract', label: 'Conventions' },
          { path: '/responsable/evaluations', icon: 'fas fa-star', label: 'Évaluations' },
          { path: '/responsable/utilisateurs-gestion', icon: 'fas fa-users', label: 'Gestion utilisateurs' },
          { path: '/responsable/entreprises-gestion', icon: 'fas fa-building', label: 'Gestion entreprises' },
          { path: '/responsable/parametres', icon: 'fas fa-cog', label: 'Paramètres' },
        ];

      case UserRole.TUTOR:
        return [
          { path: '/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
          { path: '/tuteur/suivi', icon: 'fas fa-clipboard-check', label: 'Suivi pédagogique' },
          { path: '/tuteur/evaluations', icon: 'fas fa-star', label: 'Évaluations' },
          { path: '/tuteur/rapports', icon: 'fas fa-chart-bar', label: 'Rapports' },
          { path: '/tuteur/taches', icon: 'fas fa-tasks', label: 'Tâches stagiaires' },
          { path: '/tuteur/parametres', icon: 'fas fa-cog', label: 'Paramètres' },
        ];

      case UserRole.ADMIN:
        return [
          { path: '/admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
          { path: '/admin/users', icon: 'fas fa-users', label: 'Gestion utilisateurs' },
          { path: '/admin/stages', icon: 'fas fa-briefcase', label: 'Gestion stages' },
          { path: '/admin/enterprises', icon: 'fas fa-building', label: 'Gestion entreprises' },
          { path: '/admin/conventions', icon: 'fas fa-file-contract', label: 'Conventions' },
          { path: '/admin/statistics', icon: 'fas fa-chart-pie', label: 'Statistiques' },
          { path: '/admin/settings', icon: 'fas fa-cog', label: 'Paramètres système' },
        ];

      case UserRole.SUPER_ADMIN:
        return [
                  { path: '/super-admin/dashboard', icon: 'fas fa-tachometer-alt', label: 'Tableau de bord' },
        { path: '/super-admin/gestion-utilisateurs', icon: 'fas fa-users', label: 'Gestion utilisateurs' },
        { path: '/super-admin/gestion-stages', icon: 'fas fa-briefcase', label: 'Gestion stages' },
        { path: '/super-admin/gestion-entreprises', icon: 'fas fa-building', label: 'Gestion entreprises' },
        { path: '/super-admin/universites', icon: 'fas fa-university', label: 'Gestion universités' },
        { path: '/super-admin/statistiques', icon: 'fas fa-chart-pie', label: 'Statistiques' },
        { path: '/super-admin/parametres', icon: 'fas fa-cog', label: 'Paramètres système' },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header p-3 border-bottom">
        <div className="d-flex align-items-center">
          <i className="fas fa-graduation-cap fa-2x text-primary me-3"></i>
          {!isCollapsed && (
            <div>
              <h6 className="mb-0 fw-bold">CampusConnect</h6>
              <small className="text-muted">{user?.firstName} {user?.lastName}</small>
            </div>
          )}
        </div>
        {onToggle && (
          <button 
            className="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 m-2"
            onClick={onToggle}
          >
            <i className={`fas fa-${isCollapsed ? 'expand' : 'compress'}`}></i>
          </button>
        )}
      </div>

      <nav className="sidebar-nav p-3">
        <ul className="nav flex-column">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                to={item.path}
              >
                <i className={item.icon}></i>
                {!isCollapsed && <span className="ms-2">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <hr className="my-3" />

        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link" to="/help">
              <i className="fas fa-question-circle"></i>
              {!isCollapsed && <span className="ms-2">Aide</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact">
              <i className="fas fa-envelope"></i>
              {!isCollapsed && <span className="ms-2">Contact</span>}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 