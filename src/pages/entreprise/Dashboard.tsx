import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaUserTie, FaTasks, FaChartLine, FaCheckCircle } from 'react-icons/fa';

const DashboardEntreprise: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOffres: 0, totalStagiaires: 0, totalTaches: 0 });
  const [loading, setLoading] = useState(true);
  const [lastOffers, setLastOffers] = useState<any[]>([]);
  const [lastStagiaires, setLastStagiaires] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.uid) return;
    setLoading(true);
    setError(null);
    const fetchStats = async () => {
      try {
        // Offres
        const offresSnap = await getDocs(query(collection(db, 'offres'), where('entrepriseId', '==', user.uid)));
        // Dernières offres (5 plus récentes)
        let lastOffersSnap = [];
        try {
          lastOffersSnap = (await getDocs(query(collection(db, 'offres'), where('entrepriseId', '==', user.uid), orderBy('creeLe', 'desc'), limit(5)))).docs;
        } catch (e) {
          lastOffersSnap = offresSnap.docs.slice(0, 5); // fallback sans orderBy
        }
        // Stagiaires
        const stagiairesSnap = await getDocs(query(collection(db, 'stages'), where('entrepriseId', '==', user.uid)));
        // Derniers stagiaires (5 plus récents)
        let lastStagiairesSnap = [];
        try {
          lastStagiairesSnap = (await getDocs(query(collection(db, 'stages'), where('entrepriseId', '==', user.uid), orderBy('dateDebut', 'desc'), limit(5)))).docs;
        } catch (e) {
          lastStagiairesSnap = stagiairesSnap.docs.slice(0, 5); // fallback sans orderBy
        }
        // Tâches
        const tachesSnap = await getDocs(query(collection(db, 'taches'), where('entrepriseId', '==', user.uid)));
        setStats({
          totalOffres: offresSnap.docs.length,
          totalStagiaires: stagiairesSnap.docs.length,
          totalTaches: tachesSnap.docs.length,
        });
        setLastOffers(lastOffersSnap.map(doc => ({ id: doc.id, ...doc.data() })));
        setLastStagiaires(lastStagiairesSnap.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e: any) {
        setError('Erreur lors du chargement des données.');
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  if (!user) return <div>Veuillez vous connecter.</div>;
  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container-fluid">
      {error && <div className="alert alert-danger mb-3">{error}</div>}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0"><FaBriefcase className="me-2 text-primary" />Tableau de bord - Entreprise</h1>
      </div>
      <div className="row mb-4 g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white mb-3">
            <div className="card-body d-flex align-items-center">
              <FaBriefcase className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.totalOffres}</h4>
                <p className="mb-0">Offres publiées</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success text-white mb-3">
            <div className="card-body d-flex align-items-center">
              <FaUserTie className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.totalStagiaires}</h4>
                <p className="mb-0">Stagiaires accueillis</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-info text-white mb-3">
            <div className="card-body d-flex align-items-center">
              <FaTasks className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.totalTaches}</h4>
                <p className="mb-0">Tâches attribuées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0"><FaCheckCircle className="me-2 text-success" />Dernières offres publiées</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {lastOffers.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-muted">Aucune offre récente</td></tr>
                  ) : lastOffers.map(offer => (
                    <tr key={offer.id}>
                      <td>{offer.titre || offer.title || '-'}</td>
                      <td>{offer.creeLe ? (offer.creeLe.split('T')[0]) : '-'}</td>
                      <td><span className="badge bg-primary">{offer.statut || 'active'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0"><FaUserTie className="me-2 text-success" />Derniers stagiaires</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Offre</th>
                    <th>Date début</th>
                  </tr>
                </thead>
                <tbody>
                  {lastStagiaires.length === 0 ? (
                    <tr><td colSpan={3} className="text-center text-muted">Aucun stagiaire récent</td></tr>
                  ) : lastStagiaires.map(stagiaire => (
                    <tr key={stagiaire.id}>
                      <td>{stagiaire.nomEtudiant || stagiaire.studentName || '-'}</td>
                      <td>{stagiaire.titreStage || stagiaire.stageTitle || '-'}</td>
                      <td>{stagiaire.dateDebut ? (stagiaire.dateDebut.split('T')[0]) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Structure pour un graphique d'évolution (à intégrer avec Recharts/Chart.js) */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0"><FaChartLine className="me-2 text-info" />Évolution des candidatures (à venir)</h5>
            </div>
            <div className="card-body text-center text-muted">
              <span>Graphique d'évolution à intégrer ici (Recharts/Chart.js)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEntreprise; 