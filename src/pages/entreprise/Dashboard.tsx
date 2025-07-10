import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaUserTie, FaClipboardList, FaBuilding, FaTasks, FaUser } from 'react-icons/fa';
import DashboardPage from './Dashboard';
import MesOffres from './MesOffres';
import MesStagiaires from './MesStagiaires';
import TachesStagiaires from './TachesStagiaires';
import MonProfil from './MonProfil';
import Contact from './Contact';
import Parametres from './Parametres';

const tabs = [
  { key: 'dashboard', label: 'Tableau de bord', icon: <FaBriefcase /> },
  { key: 'offres', label: 'Mes offres', icon: <FaClipboardList /> },
  { key: 'stagiaires', label: 'Mes stagiaires', icon: <FaUserTie /> },
  { key: 'taches', label: 'Tâches stagiaires', icon: <FaTasks /> },
  { key: 'profil', label: 'Mon profil', icon: <FaUser /> },
  { key: 'contact', label: 'Contact', icon: <FaBuilding /> },
  { key: 'parametres', label: 'Paramètres', icon: <FaBuilding /> },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalOffres: 0, totalStagiaires: 0, totalTaches: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      let totalOffres = 0, totalStagiaires = 0, totalTaches = 0;
      const offresSnap = await getDocs(query(collection(db, 'offres'), where('entrepriseId', '==', user.id)));
      totalOffres = offresSnap.docs.length;
      const stagiairesSnap = await getDocs(query(collection(db, 'stages'), where('entrepriseId', '==', user.id)));
      totalStagiaires = stagiairesSnap.docs.length;
      const tachesSnap = await getDocs(query(collection(db, 'taches'), where('entrepriseId', '==', user.id)));
      totalTaches = tachesSnap.docs.length;
      setStats({ totalOffres, totalStagiaires, totalTaches });
    };
    fetchStats();
  }, [user]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Tableau de bord - Entreprise</h1>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalOffres}</h4>
              <p>Offres publiées</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalStagiaires}</h4>
              <p>Stagiaires accueillis</p>
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
        {activeTab === 'offres' && <MesOffres />}
        {activeTab === 'stagiaires' && <MesStagiaires />}
        {activeTab === 'taches' && <TachesStagiaires />}
        {activeTab === 'profil' && <MonProfil />}
        {activeTab === 'contact' && <Contact />}
        {activeTab === 'parametres' && <Parametres />}
      </div>
    </div>
  );
};

export default Dashboard; 