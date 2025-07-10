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
  FaFilter,
  FaHourglassHalf
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

// Fonction utilitaire pour générer un camembert SVG
function PieChart({ data, size = 180, strokeWidth = 32 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const value = d.value;
        const angle = (value / total) * 360;
        const startAngle = cumulative;
        const endAngle = cumulative + angle;
        cumulative += angle;
        // Calcul des coordonnées
        const largeArc = angle > 180 ? 1 : 0;
        const start = polarToCartesian(center, center, radius, startAngle);
        const end = polarToCartesian(center, center, radius, endAngle);
        const pathData = [
          `M ${start.x} ${start.y}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
        ].join(' ');
        return (
          <path
            key={i}
            d={pathData}
            fill="none"
            stroke={d.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
        );
      })}
    </svg>
  );
}
function polarToCartesian(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
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

  // Calcul dynamique des stats utilisateurs par rôle
  const roles = ['etudiant', 'enseignant', 'responsable', 'tuteur', 'entreprise', 'admin', 'super_admin'];
  const statsUtilisateursDyn = roles.map(role => ({
    label: role.charAt(0).toUpperCase() + role.slice(1) + (role === 'etudiant' ? 's' : ''),
    value: stats.statsUtilisateurs[role] || 0,
    percentage: totalUtilisateurs ? Math.round((stats.statsUtilisateurs[role] || 0) * 100 / totalUtilisateurs) : 0,
    color: role === 'etudiant' ? '#4e73df' : role === 'enseignant' ? '#1cc88a' : role === 'responsable' ? '#36b9cc' : role === 'tuteur' ? '#f6c23e' : role === 'entreprise' ? '#e74a3b' : '#858796'
  }));

  // Calcul dynamique des stats stages par statut (accepté, refusé, en cours, terminé)
  const nbStagesAcceptes = stats.statsStages['accepté'] || stats.statsStages['accepte'] || 0;
  const nbStagesRefuses = stats.statsStages['refusé'] || stats.statsStages['refuse'] || 0;
  const nbStagesEnCours = stats.statsStages['en cours'] || stats.statsStages['encours'] || 0;
  const nbStagesTermines = stats.statsStages['terminé'] || stats.statsStages['termine'] || 0;

  // Calcul dynamique des stats stages par statut
  const statuts = Object.keys(stats.statsStages);
  const statsStagesDyn = statuts.map(statut => ({
    label: 'Stages ' + statut,
    value: stats.statsStages[statut],
    percentage: totalStages ? Math.round(stats.statsStages[statut] * 100 / totalStages) : 0,
    color: statut === 'en cours' ? '#1cc88a' : statut === 'terminé' ? '#4e73df' : statut === 'en attente' ? '#f6c23e' : statut === 'annulé' ? '#e74a3b' : '#858796'
  }));

  // Calcul dynamique des stats entreprises par secteur (si le champ secteur existe)
  const entreprisesParSecteur: Record<string, number> = {};
  if (stats.entreprises && Array.isArray(stats.entreprises)) {
    stats.entreprises.forEach((e: any) => {
      const secteur = e.secteur || 'Autres';
      entreprisesParSecteur[secteur] = (entreprisesParSecteur[secteur] || 0) + 1;
    });
  }
  const totalEntreprises = Object.values(entreprisesParSecteur).reduce((a, b) => a + b, 0);
  const statsSecteursDyn = Object.entries(entreprisesParSecteur).map(([secteur, value]) => ({
    label: secteur,
    value,
    percentage: totalEntreprises ? Math.round(value * 100 / totalEntreprises) : 0,
    color: '#4e73df'
  }));

  // Calcul dynamique des stats mensuelles (si la date de création des stages est disponible)
  const moisLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const statsMensuelles: Record<string, { stages: number }> = {};
  if (stats.stages && Array.isArray(stats.stages)) {
    stats.stages.forEach((s: any) => {
      if (s.date_creation) {
        const date = new Date(s.date_creation.seconds ? s.date_creation.seconds * 1000 : s.date_creation);
        const mois = moisLabels[date.getMonth()];
        statsMensuelles[mois] = statsMensuelles[mois] || { stages: 0 };
        statsMensuelles[mois].stages++;
      }
    });
  }
  const donneesMensuellesDyn = moisLabels.map(mois => ({
    mois,
    stages: statsMensuelles[mois]?.stages || 0
  }));

  const tauxReussite = ((statsStagesDyn.find(stat => stat.label.includes('terminé'))?.value || 0) / totalStages) * 100;

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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{tauxReussite.toFixed(1)}%</div>
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
            <div className="card-body d-flex flex-column align-items-center">
              <PieChart data={statsUtilisateursDyn.filter(d => d.value > 0)} size={180} strokeWidth={32} />
              <div className="mt-4 text-center small">
                {statsUtilisateursDyn.filter(d => d.value > 0).map((stat, index) => (
                  <span key={stat.label} className="me-3">
                    <i className="fas fa-circle" style={{ color: stat.color }}></i> {stat.label} ({stat.value})
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
                {statsStagesDyn.map((stat, index) => (
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

      {/* New Stats Cards for Accepted, Rejected, In Progress, Completed Stages */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Stages Acceptés
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{nbStagesAcceptes}</div>
                </div>
                <div className="col-auto">
                  <FaCheckCircle className="fa-2x text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Stages Refusés
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{nbStagesRefuses}</div>
                </div>
                <div className="col-auto">
                  <FaTimesCircle className="fa-2x text-danger" />
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
                    Stages en cours
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{nbStagesEnCours}</div>
                </div>
                <div className="col-auto">
                  <FaHourglassHalf className="fa-2x text-warning" />
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
                    Stages Terminés
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{nbStagesTermines}</div>
                </div>
                <div className="col-auto">
                  <FaCheckCircle className="fa-2x text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques; 