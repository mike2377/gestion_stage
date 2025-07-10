import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaFileContract, FaStar, FaChartBar, FaClipboardCheck, FaTasks } from 'react-icons/fa';
import GestionStages from './GestionStages';
import Conventions from './Conventions';
import Evaluations from './Evaluations';
import Rapports from './Rapports';
import SuiviPedagogique from './SuiviPedagogique';
import TachesStagiaires from './TachesStagiaires';
import Profil from './Profil';

const tabs = [
  { key: 'stages', label: 'Gestion stages', icon: <FaBriefcase /> },
  { key: 'conventions', label: 'Conventions', icon: <FaFileContract /> },
  { key: 'evaluations', label: 'Évaluations', icon: <FaStar /> },
  { key: 'rapports', label: 'Rapports', icon: <FaChartBar /> },
  { key: 'suivi', label: 'Suivi pédagogique', icon: <FaClipboardCheck /> },
  { key: 'taches', label: 'Tâches stagiaires', icon: <FaTasks /> },
  { key: 'profil', label: 'Profil', icon: <FaStar /> },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stages');
  const [stats, setStats] = useState({ totalStages: 0, activeStages: 0, completedStages: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      let totalStages = 0, activeStages = 0, completedStages = 0;
      const stagesSnap = await getDocs(query(collection(db, 'stages'), where('enseignantId', '==', user.id)));
      totalStages = stagesSnap.docs.length;
      stagesSnap.docs.forEach(doc => {
        const s = doc.data();
        if (s.status === 'active' || s.status === 'en cours') activeStages++;
        if (s.status === 'completed' || s.status === 'terminé') completedStages++;
      });
      setStats({ totalStages, activeStages, completedStages });
    };
    fetchStats();
  }, [user]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Tableau de bord - Enseignant</h1>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalStages}</h4>
              <p>Total stages</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h4>{stats.activeStages}</h4>
              <p>Stages actifs</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white mb-3">
            <div className="card-body">
              <h4>{stats.completedStages}</h4>
              <p>Stages terminés</p>
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
        {activeTab === 'stages' && <GestionStages />}
        {activeTab === 'conventions' && <Conventions />}
        {activeTab === 'evaluations' && <Evaluations />}
        {activeTab === 'rapports' && <Rapports />}
        {activeTab === 'suivi' && <SuiviPedagogique />}
        {activeTab === 'taches' && <TachesStagiaires />}
        {activeTab === 'profil' && <Profil />}
      </div>
    </div>
  );
};

export default Dashboard; 