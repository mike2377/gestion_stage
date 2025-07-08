import React, { useState, useEffect } from 'react';
import { collection, getCountFromServer, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsers, 
  FaBuilding, 
  FaGraduationCap, 
  FaFileAlt, 
  FaUniversity,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaDownload,
  FaCog,
  FaBell
} from 'react-icons/fa';

interface SystemStats {
  totalUsers: number;
  totalEnterprises: number;
  totalStages: number;
  totalCandidatures: number;
  activeStages: number;
  completedStages: number;
  pendingCandidatures: number;
  totalUniversites: number;
  recentActivities: Activity[];
  topEnterprises: { name: string; stages: number; }[];
  userGrowth: { month: string; users: number; }[];
}

interface Activity {
  id: string;
  type: 'user_registration' | 'stage_created' | 'candidature_submitted' | 'system_update';
  description: string;
  timestamp: string;
  user?: string;
}

const Dashboard: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (role !== 'super_admin') return;
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // Compteurs principaux
        const [usersCount, enterprisesCount, stagesCount, candidaturesCount, universitesCount] = await Promise.all([
          getCountFromServer(collection(db, "utilisateurs")).then(snap => snap.data().count).catch(() => 0),
          getCountFromServer(collection(db, "entreprises")).then(snap => snap.data().count).catch(() => 0),
          getCountFromServer(collection(db, "stages")).then(snap => snap.data().count).catch(() => 0),
          getCountFromServer(collection(db, "candidatures")).then(snap => snap.data().count).catch(() => 0),
          getCountFromServer(collection(db, "universites")).then(snap => snap.data().count).catch(() => 0)
        ]);

        // Stages par statut
        const [activeStagesCount, completedStagesCount] = await Promise.all([
          getCountFromServer(query(collection(db, "stages"), where("statut", "==", "en_cours"))).then(snap => snap.data().count).catch(() => 0),
          getCountFromServer(query(collection(db, "stages"), where("statut", "==", "termine"))).then(snap => snap.data().count).catch(() => 0)
        ]);

        // Candidatures en attente
        const pendingCandidaturesCount = await getCountFromServer(query(collection(db, "candidatures"), where("statut", "==", "en_attente")))
          .then(snap => snap.data().count).catch(() => 0);

        // Activités récentes (5 derniers utilisateurs inscrits)
        const recentUsersSnap = await getDocs(query(collection(db, "utilisateurs"), orderBy("date_creation", "desc"), limit(5)));
        const recentActivities: Activity[] = recentUsersSnap.docs.map(doc => ({
          id: doc.id,
          type: "user_registration",
          description: "Nouvel utilisateur inscrit",
          timestamp: doc.data().date_creation?.toDate?.() ? doc.data().date_creation.toDate().toLocaleString() : "",
          user: `${doc.data().prenom} ${doc.data().nom}`
        }));

        // Top entreprises (par nombre de stages)
        const stagesDocs = await getDocs(collection(db, "stages"));
        const entrepriseCount: Record<string, number> = {};
        stagesDocs.docs.forEach(doc => {
          const idEntreprise = doc.data().id_entreprise;
          if (idEntreprise) {
            entrepriseCount[idEntreprise] = (entrepriseCount[idEntreprise] || 0) + 1;
          }
        });

        const entreprisesDocs = await getDocs(collection(db, "entreprises"));
        const entreprisesMap: Record<string, string> = {};
        entreprisesDocs.docs.forEach(doc => {
          entreprisesMap[doc.id] = doc.data().nom;
        });

        const topEnterprises = Object.entries(entrepriseCount)
          .map(([id, count]) => ({ name: entreprisesMap[id] || id, stages: count }))
          .sort((a, b) => b.stages - a.stages)
          .slice(0, 5);

        // Croissance utilisateurs
        const usersSnap = await getDocs(collection(db, "utilisateurs"));
        const growthMap: Record<string, number> = {};
        usersSnap.docs.forEach(doc => {
          const date = doc.data().date_creation?.toDate?.() ? doc.data().date_creation.toDate() : null;
          if (date) {
            const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            growthMap[month] = (growthMap[month] || 0) + 1;
          }
        });
        const userGrowth = Object.entries(growthMap)
          .map(([month, users]) => ({ month, users }))
          .sort((a, b) => a.month.localeCompare(b.month));

        setStats({
          totalUsers: usersCount,
          totalEnterprises: enterprisesCount,
          totalStages: stagesCount,
          totalCandidatures: candidaturesCount,
          activeStages: activeStagesCount,
          completedStages: completedStagesCount,
          pendingCandidatures: pendingCandidaturesCount,
          totalUniversites: universitesCount,
          recentActivities,
          topEnterprises,
          userGrowth
        });
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [role]);

  const getActivityIcon = (type: string) => {
    const iconConfig: Record<string, any> = {
      user_registration: FaUsers,
      stage_created: FaGraduationCap,
      candidature_submitted: FaFileAlt,
      system_update: FaCog
    };
    const IconComponent = iconConfig[type] || FaBell;
    return <IconComponent className="me-2" />;
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add_user':
        window.location.href = '/super-admin/gestion-utilisateurs';
        break;
      case 'add_enterprise':
        window.location.href = '/super-admin/gestion-entreprises';
        break;
      case 'add_stage':
        window.location.href = '/super-admin/gestion-stages';
        break;
      case 'add_university':
        window.location.href = '/super-admin/universites';
        break;
      case 'view_reports':
        window.location.href = '/super-admin/statistiques';
        break;
      case 'system_settings':
        window.location.href = '/super-admin/parametres';
        break;
      default:
        break;
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Chargement...</span>
    </div>
  </div>;

  if (role !== 'super_admin') return <div className="container mt-4">
    <div className="alert alert-danger">
      <h4>Accès refusé</h4>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  </div>;

  if (loadingStats) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Chargement des statistiques...</span>
    </div>
  </div>;

  if (error) return <div className="container mt-4">
    <div className="alert alert-danger">
      <h4>Erreur</h4>
      <p>{error}</p>
    </div>
  </div>;

  if (!stats) return <div className="container mt-4">
    <div className="alert alert-info">
      <h4>Aucune donnée</h4>
      <p>Aucune statistique à afficher pour le moment.</p>
    </div>
  </div>;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaChartLine className="me-2 text-primary" />
            Tableau de Bord Super Admin
          </h1>
          <p className="text-muted mb-0">
            Vue d'ensemble du système de gestion des stages
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary">
            <FaBell className="me-2" />
            Notifications
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="row g-4 mb-4">
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalUsers}</h4>
                  <p className="mb-0">Utilisateurs</p>
                </div>
                <div className="align-self-center">
                  <FaUsers className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalEnterprises}</h4>
                  <p className="mb-0">Entreprises</p>
                </div>
                <div className="align-self-center">
                  <FaBuilding className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalStages}</h4>
                  <p className="mb-0">Stages</p>
                </div>
                <div className="align-self-center">
                  <FaGraduationCap className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalCandidatures}</h4>
                  <p className="mb-0">Candidatures</p>
                </div>
                <div className="align-self-center">
                  <FaFileAlt className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.totalUniversites}</h4>
                  <p className="mb-0">Universités</p>
                </div>
                <div className="align-self-center">
                  <FaUniversity className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-md-4 col-sm-6">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{stats.activeStages}</h4>
                  <p className="mb-0">Stages Actifs</p>
                </div>
                <div className="align-self-center">
                  <FaCheckCircle className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <FaPlus className="me-2" />
            Actions Rapides
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <button 
                className="btn btn-outline-primary w-100"
                onClick={() => handleQuickAction('add_user')}
              >
                <FaUsers className="me-2" />
                Ajouter Utilisateur
              </button>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-success w-100"
                onClick={() => handleQuickAction('add_enterprise')}
              >
                <FaBuilding className="me-2" />
                Ajouter Entreprise
              </button>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-info w-100"
                onClick={() => handleQuickAction('add_stage')}
              >
                <FaGraduationCap className="me-2" />
                Ajouter Stage
              </button>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => handleQuickAction('add_university')}
              >
                <FaUniversity className="me-2" />
                Ajouter Université
              </button>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-warning w-100"
                onClick={() => handleQuickAction('view_reports')}
              >
                <FaFileAlt className="me-2" />
                Voir Rapports
              </button>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-dark w-100"
                onClick={() => handleQuickAction('system_settings')}
              >
                <FaCog className="me-2" />
                Paramètres
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Activités récentes */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaClock className="me-2" />
                Activités Récentes
              </h5>
            </div>
            <div className="card-body">
              {stats.recentActivities.length === 0 ? (
                <p className="text-muted">Aucune activité récente</p>
              ) : (
                <div className="list-group list-group-flush">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="list-group-item d-flex align-items-center">
                      <div className="text-primary me-3">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{activity.description}</div>
                        <small className="text-muted">
                          {activity.user && `${activity.user} - `}
                          {activity.timestamp}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top entreprises */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaBuilding className="me-2" />
                Top Entreprises
              </h5>
            </div>
            <div className="card-body">
              {stats.topEnterprises.length === 0 ? (
                <p className="text-muted">Aucune entreprise avec des stages</p>
              ) : (
                <div className="list-group list-group-flush">
                  {stats.topEnterprises.map((entreprise, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{entreprise.name}</div>
                        <small className="text-muted">{entreprise.stages} stages</small>
                      </div>
                      <span className="badge bg-primary rounded-pill">{index + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaGraduationCap className="me-2" />
                Stages
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <h4 className="text-primary">{stats.activeStages}</h4>
                  <small>En cours</small>
                </div>
                <div className="col-4">
                  <h4 className="text-success">{stats.completedStages}</h4>
                  <small>Terminés</small>
                </div>
                <div className="col-4">
                  <h4 className="text-warning">{stats.pendingCandidatures}</h4>
                  <small>En attente</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Croissance Utilisateurs
              </h5>
            </div>
            <div className="card-body">
              {stats.userGrowth.length === 0 ? (
                <p className="text-muted">Aucune donnée de croissance disponible</p>
              ) : (
                <div className="d-flex align-items-end" style={{ height: '100px' }}>
                  {stats.userGrowth.map((growth, index) => (
                    <div key={index} className="flex-grow-1 text-center me-2">
                      <div 
                        className="bg-primary rounded" 
                        style={{ 
                          height: `${Math.max(10, (growth.users / Math.max(...stats.userGrowth.map(g => g.users))) * 80)}px` 
                        }}
                      ></div>
                      <small className="d-block mt-1">{growth.month}</small>
                      <small className="text-muted">{growth.users}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 