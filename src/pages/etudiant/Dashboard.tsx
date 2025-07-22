import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaCheckCircle, FaTasks, FaSearch, FaFileAlt, FaUser, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface WeeklyTask {
  id: string;
  titre: string;
  semaine: string;
  statut: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStages: 0, completedStages: 0, totalTaches: 0 });
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchStats = async () => {
      let totalStages = 0, completedStages = 0, totalTaches = 0;
      const stagesSnap = await getDocs(query(collection(db, 'stages'), where('etudiantId', '==', user.id)));
      totalStages = stagesSnap.docs.length;
      stagesSnap.docs.forEach(doc => {
        const s = doc.data();
        if (s.status === 'completed' || s.status === 'terminé') completedStages++;
      });
      const tachesSnap = await getDocs(query(collection(db, 'taches'), where('etudiantId', '==', user.id)));
      totalTaches = tachesSnap.docs.length;
      setStats({ totalStages, completedStages, totalTaches });
    };
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchWeeklyTasks = async () => {
      const snap = await getDocs(query(collection(db, 'taches'), where('etudiantId', '==', user.id)));
      const tasks = snap.docs.map(doc => ({
        id: doc.id,
        titre: doc.data().titre || doc.data().title || 'Tâche',
        semaine: doc.data().semaine || doc.data().week || '',
        statut: doc.data().statut || doc.data().status || ''
      }));
      setWeeklyTasks(tasks.filter(t => t.statut !== 'completed' && t.statut !== 'terminé'));
    };
    fetchWeeklyTasks();
  }, [user]);

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-2">
        <div className="d-flex align-items-center gap-3">
          <FaRocket className="text-primary" size={36} />
          <div>
            <h1 className="h3 mb-1">Bienvenue{user?.firstName ? `, ${user.firstName}` : ''} !</h1>
            <p className="text-muted mb-0">Voici un aperçu de votre progression et vos actions rapides.</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-primary text-white h-100">
            <div className="card-body text-center">
              <FaBriefcase size={32} className="mb-2" />
              <h2 className="mb-0">{stats.totalStages}</h2>
              <div>Stages suivis</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-success text-white h-100">
            <div className="card-body text-center">
              <FaCheckCircle size={32} className="mb-2" />
              <h2 className="mb-0">{stats.completedStages}</h2>
              <div>Stages terminés</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 bg-info text-white h-100">
            <div className="card-body text-center">
              <FaTasks size={32} className="mb-2" />
              <h2 className="mb-0">{stats.totalTaches}</h2>
              <div>Tâches réalisées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="row mb-4 g-3">
        <div className="col-6 col-md-3">
          <Link to="/etudiant/rechercher" className="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center shadow-sm">
            <FaSearch size={24} className="mb-1" />
            Rechercher un stage
          </Link>
        </div>
        <div className="col-6 col-md-3">
          <Link to="/etudiant/stages" className="btn btn-outline-success w-100 py-3 d-flex flex-column align-items-center shadow-sm">
            <FaBriefcase size={24} className="mb-1" />
            Mes stages
          </Link>
        </div>
        <div className="col-6 col-md-3">
          <Link to="/etudiant/documents" className="btn btn-outline-info w-100 py-3 d-flex flex-column align-items-center shadow-sm">
            <FaFileAlt size={24} className="mb-1" />
            Mes documents
          </Link>
        </div>
        <div className="col-6 col-md-3">
          <Link to="/etudiant/profil" className="btn btn-outline-secondary w-100 py-3 d-flex flex-column align-items-center shadow-sm">
            <FaUser size={24} className="mb-1" />
            Mon profil
          </Link>
        </div>
      </div>

      {/* À faire cette semaine */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white pb-2">
          <h5 className="mb-0">À faire cette semaine</h5>
        </div>
        <div className="card-body">
          {weeklyTasks.length === 0 ? (
            <div className="text-muted">Aucune tâche à venir.</div>
          ) : (
            <ul className="list-group list-group-flush">
              {weeklyTasks.slice(0, 5).map(task => (
                <li key={task.id} className="list-group-item d-flex align-items-center gap-2">
                  <FaTasks className="text-info" />
                  <span className="fw-bold">{task.titre}</span>
                  <span className="badge bg-light text-secondary ms-auto">Semaine {task.semaine}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 