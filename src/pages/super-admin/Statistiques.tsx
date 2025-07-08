import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaChartLine, 
  FaChartPie, 
  FaUsers, 
  FaBuilding, 
  FaGraduationCap,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaDownload,
  FaFilter
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { collection, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Statistique {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface StageData {
  mois: string;
  stages: number;
  conventions: number;
  evaluations: number;
}

const Statistiques: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [periode, setPeriode] = useState('2024');
  const [typeGraphique, setTypeGraphique] = useState('barres');

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // Utilisateurs par rôle
        const usersSnap = await getDocs(collection(db, 'utilisateurs'));
        const statsUtilisateurs: Record<string, number> = {};
        usersSnap.docs.forEach(doc => {
          const r = doc.data().role;
          statsUtilisateurs[r] = (statsUtilisateurs[r] || 0) + 1;
        });
        // Stages par statut
        const stagesSnap = await getDocs(collection(db, 'stages'));
        const statsStages: Record<string, number> = {};
        stagesSnap.docs.forEach(doc => {
          const statut = doc.data().statut;
          statsStages[statut] = (statsStages[statut] || 0) + 1;
        });
        // Entreprises actives
        const entreprisesSnap = await getDocs(collection(db, 'entreprises'));
        const entreprisesActives = entreprisesSnap.docs.length;
        setStats({
          statsUtilisateurs,
          statsStages,
          entreprisesActives
        });
        setError(null);
      } catch (e) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (role !== 'super_admin') return <div>Accès refusé</div>;
  if (loadingStats) return <div>Chargement des statistiques...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>Aucune statistique à afficher.</div>;

  // Exemples d'affichage dynamique
  const totalUtilisateurs = Object.values(stats.statsUtilisateurs).reduce((a, b) => a + b, 0);
  const totalStages = Object.values(stats.statsStages).reduce((a, b) => a + b, 0);

  // Données simulées pour les statistiques
  const statsUtilisateurs: Statistique[] = [
    { label: 'Étudiants', value: 1250, percentage: 45, color: '#4e73df' },
    { label: 'Enseignants', value: 85, percentage: 15, color: '#1cc88a' },
    { label: 'Responsables', value: 25, percentage: 5, color: '#36b9cc' },
    { label: 'Tuteurs', value: 180, percentage: 25, color: '#f6c23e' },
    { label: 'Entreprises', value: 120, percentage: 10, color: '#e74a3b' }
  ];

  const statsStages: Statistique[] = [
    { label: 'Stages en cours', value: 320, percentage: 40, color: '#1cc88a' },
    { label: 'Stages terminés', value: 280, percentage: 35, color: '#4e73df' },
    { label: 'Stages en attente', value: 120, percentage: 15, color: '#f6c23e' },
    { label: 'Stages annulés', value: 80, percentage: 10, color: '#e74a3b' }
  ];

  const statsSecteurs: Statistique[] = [
    { label: 'Informatique', value: 45, percentage: 30, color: '#4e73df' },
    { label: 'Finance', value: 25, percentage: 17, color: '#1cc88a' },
    { label: 'Marketing', value: 20, percentage: 13, color: '#36b9cc' },
    { label: 'Agriculture', value: 15, percentage: 10, color: '#f6c23e' },
    { label: 'BTP', value: 12, percentage: 8, color: '#e74a3b' },
    { label: 'Autres', value: 33, percentage: 22, color: '#858796' }
  ];

  const donneesMensuelles: StageData[] = [
    { mois: 'Jan', stages: 45, conventions: 42, evaluations: 38 },
    { mois: 'Fév', stages: 52, conventions: 48, evaluations: 45 },
    { mois: 'Mar', stages: 38, conventions: 35, evaluations: 32 },
    { mois: 'Avr', stages: 65, conventions: 62, evaluations: 58 },
    { mois: 'Mai', stages: 72, conventions: 68, evaluations: 65 },
    { mois: 'Juin', stages: 85, conventions: 82, evaluations: 78 },
    { mois: 'Juil', stages: 95, conventions: 92, evaluations: 88 },
    { mois: 'Août', stages: 78, conventions: 75, evaluations: 72 },
    { mois: 'Sep', stages: 88, conventions: 85, evaluations: 82 },
    { mois: 'Oct', stages: 92, conventions: 89, evaluations: 86 },
    { mois: 'Nov', stages: 76, conventions: 73, evaluations: 70 },
    { mois: 'Déc', stages: 68, conventions: 65, evaluations: 62 }
  ];

  const tauxReussite = ((statsStages['terminé'] / totalStages) * 100).toFixed(1);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaChartBar className="me-2 text-primary" />
            Tableau de Bord Statistiques
          </h1>
          <p className="text-muted">Vue d'ensemble des performances du système de stages</p>
        </div>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Utilisateurs
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{totalUtilisateurs}</div>
                </div>
                <div className="col-auto">
                  <FaUsers className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Stages
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{totalStages}</div>
                </div>
                <div className="col-auto">
                  <FaGraduationCap className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Taux de Réussite
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{tauxReussite}%</div>
                </div>
                <div className="col-auto">
                  <FaCheckCircle className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Entreprises Actives
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.entreprisesActives}</div>
                </div>
                <div className="col-auto">
                  <FaBuilding className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row mb-4">
        {/* Répartition des Utilisateurs */}
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaChartPie className="me-2" />
                Répartition des Utilisateurs
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-pie mb-4">
                <div className="d-flex justify-content-center">
                  <div className="position-relative" style={{ width: '200px', height: '200px' }}>
                    <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                      <div className="text-center">
                        <div className="h4 mb-0">{totalUtilisateurs}</div>
                        <div className="text-xs text-muted">Total</div>
                      </div>
                    </div>
                    {/* Simulated pie chart */}
                    <div className="position-relative w-100 h-100">
                      {statsUtilisateurs.map((stat, index) => (
                        <div
                          key={stat.label}
                          className="position-absolute"
                          style={{
                            width: '100%',
                            height: '100%',
                            transform: `rotate(${(index * 72)}deg)`,
                            clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)'
                          }}
                        >
                          <div
                            className="w-100 h-100"
                            style={{
                              backgroundColor: stat.color,
                              opacity: 0.8
                            }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center small">
                {statsUtilisateurs.map((stat, index) => (
                  <span key={stat.label} className="me-3">
                    <i className="fas fa-circle" style={{ color: stat.color }}></i>
                    {stat.label} ({stat.value})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statut des Stages */}
        <div className="col-xl-6 col-lg-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaChartBar className="me-2" />
                Statut des Stages
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-bar">
                {statsStages.map((stat, index) => (
                  <div key={stat.label} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-xs font-weight-bold text-uppercase">
                        {stat.label}
                      </span>
                      <span className="text-xs font-weight-bold">
                        {stat.value} ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '20px' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Mensuelle */}
      <div className="row mb-4">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">
                  <FaChartLine className="me-2" />
                  Évolution Mensuelle des Stages
                </h6>
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${typeGraphique === 'barres' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTypeGraphique('barres')}
                  >
                    <FaChartBar />
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${typeGraphique === 'ligne' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTypeGraphique('ligne')}
                  >
                    <FaChartLine />
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-between mb-3">
                      <div>
                        <span className="badge bg-primary me-2">Stages</span>
                        <span className="badge bg-success me-2">Conventions</span>
                        <span className="badge bg-info">Évaluations</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chart-container" style={{ height: '300px' }}>
                  <div className="d-flex align-items-end justify-content-between h-100">
                    {donneesMensuelles.map((data, index) => (
                      <div key={data.mois} className="d-flex flex-column align-items-center">
                        <div className="d-flex align-items-end gap-1 mb-2">
                          <div
                            className="bg-primary"
                            style={{
                              width: '20px',
                              height: `${(data.stages / 100) * 200}px`,
                              borderRadius: '2px'
                            }}
                          ></div>
                          <div
                            className="bg-success"
                            style={{
                              width: '20px',
                              height: `${(data.conventions / 100) * 200}px`,
                              borderRadius: '2px'
                            }}
                          ></div>
                          <div
                            className="bg-info"
                            style={{
                              width: '20px',
                              height: `${(data.evaluations / 100) * 200}px`,
                              borderRadius: '2px'
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">{data.mois}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secteurs d'activité */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaBuilding className="me-2" />
                Stages par Secteur
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-pie">
                {statsSecteurs.map((stat, index) => (
                  <div key={stat.label} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-xs font-weight-bold">
                        {stat.label}
                      </span>
                      <span className="text-xs font-weight-bold">
                        {stat.value} ({stat.percentage}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '15px' }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${stat.percentage}%`,
                          backgroundColor: stat.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaCalendarAlt className="me-2" />
                Statistiques Détaillées par Mois
              </h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Mois</th>
                      <th>Nouveaux Stages</th>
                      <th>Conventions Signées</th>
                      <th>Évaluations Réalisées</th>
                      <th>Taux de Réussite</th>
                      <th>Nouveaux Étudiants</th>
                      <th>Nouvelles Entreprises</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donneesMensuelles.map((data, index) => (
                      <tr key={data.mois}>
                        <td><strong>{data.mois}</strong></td>
                        <td>
                          <span className="badge bg-primary">{data.stages}</span>
                        </td>
                        <td>
                          <span className="badge bg-success">{data.conventions}</span>
                        </td>
                        <td>
                          <span className="badge bg-info">{data.evaluations}</span>
                        </td>
                        <td>
                          <span className="text-success">
                            {((data.evaluations / data.stages) * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {Math.floor(Math.random() * 20) + 10}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-warning">
                            {Math.floor(Math.random() * 5) + 2}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques; 