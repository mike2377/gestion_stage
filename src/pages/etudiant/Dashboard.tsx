import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaFileAlt, FaTasks, FaUser, FaSearch, FaClipboardList } from 'react-icons/fa';
import MesStages from './MesStages';
import MesDocuments from './MesDocuments';
import TachesHebdomadaires from './TachesHebdomadaires';
import MonProfil from './MonProfil';
import RechercherStages from './RechercherStages';

const tabs = [
  { key: 'stages', label: 'Mes stages', icon: <FaBriefcase /> },
  { key: 'documents', label: 'Mes documents', icon: <FaFileAlt /> },
  { key: 'taches', label: 'Tâches hebdomadaires', icon: <FaTasks /> },
  { key: 'profil', label: 'Mon profil', icon: <FaUser /> },
  { key: 'recherche', label: 'Rechercher stages', icon: <FaSearch /> },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('stages');
  const [stats, setStats] = useState({ totalStages: 0, completedStages: 0, totalTaches: 0 });

  useEffect(() => {
    if (!user) return;
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

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Tableau de bord - Étudiant</h1>
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
              <h4>{stats.completedStages}</h4>
              <p>Stages terminés</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white mb-3">
            <div className="card-body">
              <h4>{stats.totalTaches}</h4>
              <p>Tâches réalisées</p>
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
        {activeTab === 'stages' && <MesStages />}
        {activeTab === 'documents' && <MesDocuments />}
        {activeTab === 'taches' && <TachesHebdomadaires />}
        {activeTab === 'profil' && <MonProfil />}
        {activeTab === 'recherche' && <RechercherStages />}
      </div>
    </div>
  );
};

export default Dashboard; 