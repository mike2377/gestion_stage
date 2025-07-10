import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaBuilding, FaUser, FaFileContract, FaChartBar, FaClipboardList, FaTasks, FaCogs } from 'react-icons/fa';
import GestionStages from './GestionStages';
import Conventions from './Conventions';
import Evaluations from './Evaluations';
import Rapports from './Rapports';
import Statistiques from './Statistiques';
import Entreprises from './Entreprises';
import Utilisateurs from './Utilisateurs';
import Parametres from './Parametres';
import Profil from './Profil';

const tabs = [
  { key: 'stages', label: 'Gestion stages', icon: <FaBriefcase /> },
  { key: 'conventions', label: 'Conventions', icon: <FaFileContract /> },
  { key: 'evaluations', label: 'Évaluations', icon: <FaChartBar /> },
  { key: 'rapports', label: 'Rapports', icon: <FaClipboardList /> },
  { key: 'statistiques', label: 'Statistiques', icon: <FaChartBar /> },
  { key: 'entreprises', label: 'Entreprises', icon: <FaBuilding /> },
  { key: 'utilisateurs', label: 'Utilisateurs', icon: <FaUser /> },
  { key: 'parametres', label: 'Paramètres', icon: <FaCogs /> },
  { key: 'profil', label: 'Profil', icon: <FaUser /> },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stages');
  const [stats, setStats] = useState({ totalStages: 0, totalConventions: 0, totalUtilisateurs: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      let totalStages = 0, totalConventions = 0, totalUtilisateurs = 0;
      const stagesSnap = await getDocs(query(collection(db, 'stages'), where('responsableId', '==', user.id)));
      totalStages = stagesSnap.docs.length;
      const conventionsSnap = await getDocs(query(collection(db, 'conventions'), where('responsableId', '==', user.id)));
      totalConventions = conventionsSnap.docs.length;
      const utilisateursSnap = await getDocs(query(collection(db, 'users'), where('role', 'in', ['etudiant', 'enseignant', 'tuteur'])));
      totalUtilisateurs = utilisateursSnap.docs.length;
      setStats({ totalStages, totalConventions, totalUtilisateurs });
    };
    fetchStats();
  }, [user]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Tableau de bord - Responsable</h1>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalStages}</h4>
              <p>Stages gérés</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalConventions}</h4>
              <p>Conventions suivies</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalUtilisateurs}</h4>
              <p>Utilisateurs supervisés</p>
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
        {activeTab === 'statistiques' && <Statistiques />}
        {activeTab === 'entreprises' && <Entreprises />}
        {activeTab === 'utilisateurs' && <Utilisateurs />}
        {activeTab === 'parametres' && <Parametres />}
        {activeTab === 'profil' && <Profil />}
      </div>
    </div>
  );
};

export default Dashboard; 