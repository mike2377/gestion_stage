import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getResponsableDashboardStats } from '../../services/api/responsableDashboard';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    stagesEnCours: 0,
    conventionsAValider: 0,
    etudiantsEnStage: 0,
    entreprises: 0,
    enseignants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [stageStatusData, setStageStatusData] = useState<any[]>([]);
  const [topEntreprises, setTopEntreprises] = useState<any[]>([]);

  useEffect(() => {
    if (!user || !user.universiteId) return;
    setLoading(true);
    getResponsableDashboardStats(user.universiteId).then((data) => {
      setStats(data);
      setLoading(false);
    });
    // Récupérer la répartition des stages par statut
    const fetchStageStatus = async () => {
      const q = query(collection(db, 'stages'), where('universiteId', '==', user.universiteId));
      const snapshot = await getDocs(q);
      const statusCount: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const status = doc.data().status || 'inconnu';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });
      const data = [
        { name: 'En cours', value: statusCount['in_progress'] || 0 },
        { name: 'Terminé', value: statusCount['completed'] || 0 },
        { name: 'En attente', value: statusCount['pending'] || 0 },
        { name: 'Brouillon', value: statusCount['draft'] || 0 },
        { name: 'Annulé', value: statusCount['cancelled'] || 0 },
      ].filter(d => d.value > 0);
      setStageStatusData(data);
    };
    // Récupérer le top entreprises partenaires
    const fetchTopEntreprises = async () => {
      const q = query(collection(db, 'stages'), where('universiteId', '==', user.universiteId));
      const snapshot = await getDocs(q);
      const entrepriseCount: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const entreprise = doc.data().enterprise?.companyName || doc.data().enterprise?.nom || 'Inconnu';
        if (entreprise) {
          entrepriseCount[entreprise] = (entrepriseCount[entreprise] || 0) + 1;
        }
      });
      const sorted = Object.entries(entrepriseCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 3);
      setTopEntreprises(sorted);
    };
    fetchStageStatus();
    fetchTopEntreprises();
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
      <div className="dashboard-content p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3 mb-0">Tableau de bord - Responsable</h1>
        </div>
        <div className="row mb-4">
        <div className="col-12 col-md-3">
            <div className="card bg-primary text-white mb-3">
              <div className="card-body">
              <h4>{stats.stagesEnCours}</h4>
              <p>Stages en cours</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
            <div className="card bg-success text-white mb-3">
              <div className="card-body">
              <h4>{stats.conventionsAValider}</h4>
              <p>Conventions à valider</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
            <div className="card bg-info text-white mb-3">
              <div className="card-body">
              <h4>{stats.etudiantsEnStage}</h4>
              <p>Étudiants de l'université</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card bg-secondary text-white mb-3">
            <div className="card-body">
              <h4>{stats.entreprises}</h4>
              <p>Entreprises partenaires</p>
            </div>
          </div>
        </div>
              </div>
      {/* Répartition des stages par statut */}
      <div className="row mb-4">
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Répartition des stages par statut</h5>
              {stageStatusData.length === 0 ? (
                <div className="text-muted">Aucune donnée</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={stageStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {stageStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
        {/* Top entreprises partenaires */}
        <div className="col-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="mb-3">Top entreprises partenaires</h5>
              {topEntreprises.length === 0 ? (
                <div className="text-muted">Aucune donnée</div>
              ) : (
                <ol className="mb-0">
                  {topEntreprises.map((e, i) => (
                    <li key={e.name} className="mb-2">
                      <strong>{e.name}</strong> <span className="badge bg-primary ms-2">{e.value} stage{e.value > 1 ? 's' : ''}</span>
            </li>
          ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Ajoute ici d'autres widgets ou résumés si besoin, mais plus d'onglets ! */}
    </div>
  );
};

export default Dashboard; 