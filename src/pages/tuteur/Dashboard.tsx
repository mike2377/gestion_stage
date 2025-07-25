import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaClipboardList, FaChartBar, FaTasks, FaUser, FaCogs } from 'react-icons/fa';
import DashboardPage from './Dashboard';
import Evaluations from './Evaluations';
import Rapports from './Rapports';
import SuiviTuteur from './SuiviTuteur';
import TachesStagiaires from './TachesStagiaires';
import Profil from './Profil';
import Parametres from './Parametres';

const tabs = [
  { key: 'dashboard', label: 'Tableau de bord', icon: <FaBriefcase /> },
  { key: 'evaluations', label: 'Évaluations', icon: <FaChartBar /> },
  { key: 'rapports', label: 'Rapports', icon: <FaClipboardList /> },
  { key: 'suivi', label: 'Suivi tuteur', icon: <FaTasks /> },
  { key: 'taches', label: 'Tâches stagiaires', icon: <FaTasks /> },
  { key: 'profil', label: 'Profil', icon: <FaUser /> },
  { key: 'parametres', label: 'Paramètres', icon: <FaCogs /> },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalStages: 0, totalEvaluations: 0, totalTaches: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      let totalStages = 0, totalEvaluations = 0, totalTaches = 0;
      const stagesSnap = await getDocs(query(collection(db, 'stages'), where('tuteurId', '==', user.id)));
      totalStages = stagesSnap.docs.length;
      const evalsSnap = await getDocs(query(collection(db, 'evaluations'), where('tuteurId', '==', user.id)));
      totalEvaluations = evalsSnap.docs.length;
      const tachesSnap = await getDocs(query(collection(db, 'taches'), where('tuteurId', '==', user.id)));
      totalTaches = tachesSnap.docs.length;
      setStats({ totalStages, totalEvaluations, totalTaches });
    };
    fetchStats();
  }, [user]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Tableau de bord - Tuteur</h1>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalStages}</h4>
              <p>Stages suivis</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalEvaluations}</h4>
              <p>Évaluations réalisées</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalTaches}</h4>
              <p>Tâches attribuées</p>
            </div>
          </div>
        </div>
      </div>
      <ul className="nav nav-tabs mb-4">
        {tabs.map(tab => (
          <li className="nav-item" key={tab.key}>
            <button
              className={`nav-link${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon} <span className="ms-2">{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div>
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'evaluations' && <Evaluations />}
        {activeTab === 'rapports' && <Rapports />}
        {activeTab === 'suivi' && <SuiviTuteur />}
        {activeTab === 'taches' && <TachesStagiaires />}
        {activeTab === 'profil' && <Profil />}
        {activeTab === 'parametres' && <Parametres />}
      </div>
    </div>
  );
};

export default Dashboard; 