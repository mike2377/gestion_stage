import React, { useState, useEffect } from 'react';
import { UserRole } from '../../types/models/User';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState({
    totalStages: 0,
    activeStages: 0,
    pendingApplications: 0,
    completedStages: 0
  });

  useEffect(() => {
    // Simulation de données
    setStats({
      totalStages: 25,
      activeStages: 12,
      pendingApplications: 8,
      completedStages: 13
    });
  }, []);

  const getDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case UserRole.STUDENT:
        return <StudentDashboard user={user} stats={stats} />;
      case UserRole.ENTERPRISE:
        return <EnterpriseDashboard user={user} stats={stats} />;
      case UserRole.TEACHER:
        return <TeacherDashboard user={user} stats={stats} />;
      case UserRole.RESPONSIBLE:
        return <ResponsibleDashboard user={user} stats={stats} />;
      case UserRole.TUTOR:
        return <TutorDashboard user={user} stats={stats} />;
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return <AdminDashboard user={user} stats={stats} />;
      default:
        return <DefaultDashboard user={user} stats={stats} />;
    }
  };

  return getDashboardContent();
};

// Composants de tableau de bord spécifiques
const StudentDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="h3 mb-0">Tableau de bord - Étudiant</h1>
      <div className="d-flex gap-2">
        <button className="btn btn-primary">
          <i className="fas fa-search me-2"></i>Rechercher un stage
        </button>
        <button className="btn btn-outline-primary">
          <i className="fas fa-file-alt me-2"></i>Nouvelle candidature
        </button>
      </div>
    </div>

    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.totalStages}</h4>
                <p className="mb-0">Stages consultés</p>
              </div>
              <i className="fas fa-briefcase fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.pendingApplications}</h4>
                <p className="mb-0">Candidatures en cours</p>
              </div>
              <i className="fas fa-file-alt fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.activeStages}</h4>
                <p className="mb-0">Stages actifs</p>
              </div>
              <i className="fas fa-play fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.completedStages}</h4>
                <p className="mb-0">Stages terminés</p>
              </div>
              <i className="fas fa-check-circle fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-4">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-clock me-2"></i>Activités récentes
            </h5>
          </div>
          <div className="card-body">
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker bg-success"></div>
                <div className="timeline-content">
                  <h6>Candidature acceptée</h6>
                  <p className="text-muted">Votre candidature pour "Développeur Full-Stack" a été acceptée</p>
                  <small className="text-muted">Il y a 2 heures</small>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker bg-info"></div>
                <div className="timeline-content">
                  <h6>Nouveau rapport à soumettre</h6>
                  <p className="text-muted">Rapport hebdomadaire pour la semaine 3</p>
                  <small className="text-muted">Il y a 1 jour</small>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker bg-warning"></div>
                <div className="timeline-content">
                  <h6>Évaluation reçue</h6>
                  <p className="text-muted">Nouvelle évaluation de votre tuteur</p>
                  <small className="text-muted">Il y a 3 jours</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-tasks me-2"></i>Tâches à faire
            </h5>
          </div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Soumettre rapport hebdomadaire
                <span className="badge bg-warning">Urgent</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Mettre à jour CV
                <span className="badge bg-info">Cette semaine</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Préparer présentation finale
                <span className="badge bg-secondary">Prochaine semaine</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EnterpriseDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="h3 mb-0">Tableau de bord - Entreprise</h1>
      <div className="d-flex gap-2">
        <button className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Publier un stage
        </button>
        <button className="btn btn-outline-primary">
          <i className="fas fa-users me-2"></i>Gérer les candidatures
        </button>
      </div>
    </div>

    <div className="row g-4 mb-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.totalStages}</h4>
                <p className="mb-0">Stages publiés</p>
              </div>
              <i className="fas fa-briefcase fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.pendingApplications}</h4>
                <p className="mb-0">Candidatures reçues</p>
              </div>
              <i className="fas fa-inbox fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.activeStages}</h4>
                <p className="mb-0">Stagiaires actifs</p>
              </div>
              <i className="fas fa-users fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div>
                <h4 className="mb-0">{stats.completedStages}</h4>
                <p className="mb-0">Stages terminés</p>
              </div>
              <i className="fas fa-check-circle fa-2x opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-4">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-chart-line me-2"></i>Statistiques des candidatures
            </h5>
          </div>
          <div className="card-body">
            <div className="text-center py-4">
              <i className="fas fa-chart-bar fa-4x text-muted mb-3"></i>
              <p className="text-muted">Graphique des candidatures par mois</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-bell me-2"></i>Notifications
            </h5>
          </div>
          <div className="card-body">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Nouvelle candidature reçue pour "Développeur Frontend"
            </div>
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Stage "Data Analyst" se termine dans 2 semaines
            </div>
            <div className="alert alert-success">
              <i className="fas fa-check-circle me-2"></i>
              Évaluation du stagiaire Jean Dupont soumise
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TeacherDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <h1 className="h3 mb-4">Tableau de bord - Enseignant</h1>
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h4>{stats.totalStages}</h4>
            <p>Étudiants supervisés</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h4>{stats.activeStages}</h4>
            <p>Stages en cours</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <h4>{stats.pendingApplications}</h4>
            <p>Évaluations en attente</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <h4>{stats.completedStages}</h4>
            <p>Stages terminés</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ResponsibleDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <h1 className="h3 mb-4">Tableau de bord - Responsable</h1>
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h4>{stats.totalStages}</h4>
            <p>Total stages</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h4>{stats.activeStages}</h4>
            <p>Stages actifs</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <h4>{stats.pendingApplications}</h4>
            <p>Conventions en attente</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <h4>{stats.completedStages}</h4>
            <p>Stages terminés</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TutorDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <h1 className="h3 mb-4">Tableau de bord - Tuteur</h1>
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h4>{stats.totalStages}</h4>
            <p>Étudiants tutorés</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h4>{stats.activeStages}</h4>
            <p>Suivis actifs</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <h4>{stats.pendingApplications}</h4>
            <p>Évaluations à faire</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <h4>{stats.completedStages}</h4>
            <p>Suivis terminés</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <h1 className="h3 mb-4">Tableau de bord - Administrateur</h1>
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body">
            <h4>{stats.totalStages}</h4>
            <p>Total utilisateurs</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body">
            <h4>{stats.activeStages}</h4>
            <p>Stages actifs</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-info text-white">
          <div className="card-body">
            <h4>{stats.pendingApplications}</h4>
            <p>Demandes en attente</p>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body">
            <h4>{stats.completedStages}</h4>
            <p>Stages terminés</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DefaultDashboard: React.FC<{ user: any; stats: any }> = ({ user, stats }) => (
  <div>
    <h1 className="h3 mb-4">Tableau de bord</h1>
    <div className="alert alert-info">
      <i className="fas fa-info-circle me-2"></i>
      Bienvenue sur votre tableau de bord. Sélectionnez une option dans le menu de gauche.
    </div>
  </div>
);

export default Dashboard; 