import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaStar,
  FaGraduationCap,
  FaBuilding,
  FaFileAlt,
  FaDownload,
  FaPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaUserGraduate,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import type { User } from '../../types/models/User';
import { collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

interface Stagiaire {
  id: string;
  matricule?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  telephone?: string;
  photo?: string;
  titreStage?: string;
  idStage?: number;
  dateDebut?: string;
  dateFin?: string;
  statut?: 'actif' | 'termine' | 'termine_anticipé';
  encadrant?: string;
  tuteur?: string;
  tuteurId?: string;
  universite?: string;
  programme?: string;
  annee?: number;
  noteEvaluation?: number;
  progression?: number;
  taches?: Tache[];
  documents?: Document[];
  evaluations?: Evaluation[];
  enseignantId?: string; // Added for enseignant référent
  etudiantId?: string; // Added for etudiant référent
}

interface Tache {
  id: number;
  titre: string;
  description: string;
  dateEcheance: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'retard';
  priorite: 'basse' | 'moyenne' | 'haute';
  dateAttribution: string;
  dateTerminaison?: string;
}

interface Document {
  id: number;
    nom: string;
  type: string;
  dateDepot: string;
  statut: string;
}

interface Evaluation {
  id: number;
  date: string;
  type: 'mi_parcours' | 'finale';
  note: number;
  commentaires: string;
  evaluateur: string;
}

const MesStagiaires: React.FC = () => {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([]);
  const [filteredStagiaires, setFilteredStagiaires] = useState<Stagiaire[]>([]);
  const [filters, setFilters] = useState({
    statut: '',
    stage: '',
    encadrant: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tuteurs, setTuteurs] = useState<{ id: string; nom: string }[]>([]);

  const { user } = useAuth();

  // Récupérer dynamiquement les tuteurs de l'entreprise
  useEffect(() => {
    const fetchTuteurs = async () => {
      if (!user || !user.entrepriseId) return;
      try {
        const q = query(
          collection(db, 'utilisateurs'),
          where('entrepriseId', '==', user.entrepriseId),
          where('role', '==', 'tuteur')
        );
        const snap = await getDocs(q);
        const tuteursList: { id: string; nom: string }[] = snap.docs.map(doc => ({
          id: doc.id,
          nom: (doc.data().firstName || '') + ' ' + (doc.data().lastName || '')
        }));
        setTuteurs(tuteursList);
      } catch (error) {
        toast.error('Erreur lors du chargement des tuteurs');
      }
    };
    fetchTuteurs();
  }, [user]);

  // Charger dynamiquement les stagiaires de l'entreprise depuis Firestore
  useEffect(() => {
    // Modifiez la fonction fetchStagiaires comme ceci :
    const fetchStagiaires = async () => {
      if (!user || !user.entrepriseId) return;

      try {
        const q = query(
          collection(db, 'stages'),
          where('entrepriseId', '==', user.entrepriseId)
        );
        const querySnapshot = await getDocs(q);

        const stagiairesData = await Promise.all(
          querySnapshot.docs.map(async (stageDoc) => {
            const stageData = stageDoc.data();
            const studentInfo = {
              prenom: '',
              nom: '',
              email: '',
              telephone: ''
            };

            // Debug: Vérifiez l'ID de l'étudiant
            console.log(`Processing stage ${stageDoc.id} with etudiantId:`, stageData.etudiantId);

            if (stageData.etudiantId) {
              try {
                const userDoc = await getDoc(doc(db, 'utilisateurs', stageData.etudiantId));
                
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  console.log('User data found:', userData);
                  
                  // Mappez les champs selon votre structure exacte
                  return {
                    id: stageDoc.id,
                    ...stageData,
                    prenom: userData.firstName || userData.prenom || 'Non renseigné',
                    nom: userData.lastName || userData.nom || 'Non renseigné',
                    email: userData.email || 'Non renseigné',
                    telephone: userData.phone || userData.telephone || 'Non renseigné',
                    universite: userData.universiteId || 'Non renseignée'
                  };
                } else {
                  console.warn(`User document not found for id: ${stageData.etudiantId}`);
                }
              } catch (error) {
                console.error(`Error fetching user ${stageData.etudiantId}:`, error);
              }
            }

            return {
              id: stageDoc.id,
              ...stageData,
              ...studentInfo
            };
          })
        );

        console.log('Final stagiaires data:', stagiairesData);
        setStagiaires(stagiairesData);
        setFilteredStagiaires(stagiairesData);
      } catch (error) {
        console.error('Error loading stagiaires:', error);
        toast.error('Erreur de chargement des stagiaires');
      }
    };
    fetchStagiaires();
  }, [user]);

  // Affichage debug temporaire pour voir les données récupérées
  useEffect(() => {
    if (stagiaires.length === 0) {
      console.log('Aucun stage trouvé pour cette entreprise.');
    } else {
      console.log('Stages récupérés:', stagiaires);
    }
  }, [stagiaires]);

  // Fonctions de tri (mock pour éviter l'erreur)
  const handleSort = (field: string) => {
    // À implémenter : logique de tri si besoin
    // Pour l'instant, ne fait rien
  };
  const getSortIcon = (field: string) => {
    // À implémenter : retourne une icône de tri selon l'état
    return null;
  };

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = stagiaires;

    if (newFilters.statut) {
      filtered = filtered.filter(stagiaire => stagiaire.statut === newFilters.statut);
    }
    if (newFilters.stage) {
      filtered = filtered.filter(stagiaire => stagiaire.idStage.toString() === newFilters.stage);
    }
    if (newFilters.encadrant) {
      filtered = filtered.filter(stagiaire => stagiaire.encadrant === newFilters.encadrant);
    }

    setFilteredStagiaires(filtered);
  };

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      actif: { class: 'bg-success', text: 'En cours', icon: 'fas fa-play' },
      termine: { class: 'bg-primary', text: 'Terminé', icon: 'fas fa-check' },
      termine_anticipé: { class: 'bg-danger', text: 'Terminé', icon: 'fas fa-times' }
    };

    const config = statusConfig[statut as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getTaskStatusBadge = (statut: string) => {
    const statusConfig = {
      en_attente: { class: 'bg-secondary', text: 'En attente' },
      en_cours: { class: 'bg-info', text: 'En cours' },
      terminee: { class: 'bg-success', text: 'Terminé' },
      retard: { class: 'bg-danger', text: 'En retard' }
    };

    const config = statusConfig[statut as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (statut: string) => {
    return stagiaires.filter(stagiaire => stagiaire.statut === statut).length;
  };

  const getProgressColor = (progression: number) => {
    if (progression >= 80) return 'success';
    if (progression >= 60) return 'info';
    if (progression >= 40) return 'warning';
    return 'danger';
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaUsers className="me-2 text-primary" />
            Mes Stagiaires
          </h1>
          <p className="text-muted">Gérez et suivez vos stagiaires</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            Nouveau stagiaire
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Stagiaires
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stagiaires.length}</div>
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
                    Stages en Cours
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{getStatusCount('actif')}</div>
                </div>
                <div className="col-auto">
                  <FaClock className="fa-2x text-gray-300" />
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{getStatusCount('termine')}</div>
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
                    Note Moyenne
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stagiaires.length > 0 ? (stagiaires.reduce((sum, s) => sum + s.noteEvaluation, 0) / stagiaires.length).toFixed(1) : 'N/A'}</div>
                </div>
                <div className="col-auto">
                  <FaStar className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Filtres et Recherche</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4 mb-3">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Rechercher un stagiaire..."
                  value={filters.encadrant}
                  onChange={(e) => handleFilterChange('encadrant', e.target.value)}
            />
          </div>
        </div>
            <div className="col-md-3 mb-3">
          <select 
            className="form-select"
            value={filters.statut}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="actif">En cours</option>
            <option value="termine">Terminé</option>
                <option value="termine_anticipé">Terminé</option>
          </select>
        </div>
            <div className="col-md-3 mb-3">
          <select 
            className="form-select"
            value={filters.stage}
            onChange={(e) => handleFilterChange('stage', e.target.value)}
          >
            <option value="">Tous les stages</option>
                <option value="1">Développeur Web Full-Stack</option>
                <option value="2">Assistant Marketing Digital</option>
          </select>
        </div>
            <div className="col-md-2 mb-3">
          <button className="btn btn-outline-secondary w-100">
            <FaFilter className="me-1" />
            Filtrer
          </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'liste' ? 'active' : ''}`}
                onClick={() => setActiveTab('liste')}
              >
                <FaUsers className="me-2" />
                Liste des Stagiaires
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'statistiques' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistiques')}
              >
                {/* FaChartLine is not imported, so it's removed */}
                Statistiques
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'liste' && (
                <div className="table-responsive">
              <table className="table table-bordered" width="100%" cellSpacing="0">
                    <thead>
                      <tr>
                    <th>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleSort('nom')}
                      >
                        Stagiaire {getSortIcon('nom')}
                      </button>
                    </th>
                    <th>Titre du stage</th>
                    <th>Université</th>
                    <th>Période</th>
                    <th>Statut</th>
                    <th>Tuteur</th>
                    <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                  {filteredStagiaires.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center text-muted py-4">
                        Aucun stagiaire trouvé pour cette entreprise.<br />
                        <span style={{fontSize:12}}>Vérifiez que des stages existent bien dans la collection <b>stages</b> avec le bon <b>entrepriseId</b>.</span>
                      </td>
                    </tr>
                  ) : (
                    filteredStagiaires.map((stagiaire) => (
                      <tr key={stagiaire.id}>
                        <td>
                          <div>
                            <strong>{stagiaire.prenom || ''} {stagiaire.nom || ''}</strong>
                            <br />
                            <small className="text-muted">
                              {stagiaire.telephone && (
                                <span className="d-block">
                                  <FaPhone className="me-1" />
                                  {stagiaire.telephone}
                                </span>
                              )}
                              <span>
                                <FaEnvelope className="me-1" />
                                {stagiaire.email || ''}
                              </span>
                            </small>
                          </div>
                        </td>
                        <td>{stagiaire.titre || ''}</td>
                        <td>{stagiaire.universite || ''}</td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="text-primary">
                              <FaCalendarAlt className="me-1" />
                              {stagiaire.dateDebut || ''}
                            </span>
                            <span className="text-muted">
                              <FaCalendarAlt className="me-1" />
                              {stagiaire.dateFin || ''}
                            </span>
                          </div>
                        </td>
                        <td>{getStatusBadge(stagiaire.statut || '')}</td>
                        <td>
                          {stagiaire.tuteurId ? (
                            <span>{tuteurs.find(t => t.id === stagiaire.tuteurId)?.nom || 'Tuteur inconnu'}</span>
                          ) : (
                            <select
                              className="form-select form-select-sm"
                              defaultValue=""
                              onChange={async (e) => {
                                const tuteurId = e.target.value;
                                const tuteur = tuteurs.find(t => t.id === tuteurId);
                                if (!tuteur) return;
                                try {
                                  await updateDoc(doc(db, 'stages', String(stagiaire.id)), {
                                    tuteurId: tuteur.id
                                  });
                                  setStagiaires(prev => prev.map(s => s.id === stagiaire.id ? { ...s, tuteurId: tuteur.id } : s));
                                  setFilteredStagiaires(prev => prev.map(s => s.id === stagiaire.id ? { ...s, tuteurId: tuteur.id } : s));
                                  toast.success('Tuteur attribué avec succès');
                                } catch (err) {
                                  toast.error('Erreur lors de l\'attribution du tuteur');
                                }
                              }}
                            >
                              <option value="">Attribuer un tuteur</option>
                              {tuteurs.map(t => (
                                <option key={t.id} value={t.id}>{t.nom}</option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setSelectedStagiaire(stagiaire);
                                setShowDetailsModal(true);
                              }}
                              title="Voir détails"
                            >
                                <FaEye />
                              </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              title="Évaluer"
                            >
                              <FaStar />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-info"
                              title="Contacter"
                            >
                              <FaEnvelope />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              title="Modifier"
                            >
                              <FaEdit />
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                    </tbody>
                  </table>
            </div>
          )}

          {activeTab === 'statistiques' && (
            <div className="row">
              <div className="col-md-6">
                <h6>Répartition par statut</h6>
                <div className="chart-container mb-4">
                  {['actif', 'termine', 'termine_anticipé'].map(statut => {
                    const count = stagiaires.filter(s => s.statut === statut).length;
                    const percentage = stagiaires.length > 0 ? (count / stagiaires.length) * 100 : 0;
                    return (
                      <div key={statut} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-xs font-weight-bold">
                            {statut === 'actif' ? 'En cours' :
                             statut === 'termine' ? 'Terminé' : 'Terminé'}
                          </span>
                          <span className="text-xs font-weight-bold">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="progress" style={{ height: '15px' }}>
                          <div
                            className="progress-bar"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: statut === 'actif' ? '#007bff' :
                                              statut === 'termine' ? '#28a745' : '#dc3545'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-6">
                <h6>Notes moyennes par critère</h6>
                <div className="chart-container">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Évaluation</span>
                      <span>{(stagiaires.reduce((sum, s) => sum + s.noteEvaluation, 0) / stagiaires.length).toFixed(1)}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(stagiaires.reduce((sum, s) => sum + s.noteEvaluation, 0) / stagiaires.length) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Stagiaire */}
      {showDetailsModal && selectedStagiaire && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Détails du stagiaire - {selectedStagiaire.prenom} {selectedStagiaire.nom}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations personnelles</h6>
                    <p><strong>Email:</strong> {selectedStagiaire.email}</p>
                    <p><strong>Téléphone:</strong> {selectedStagiaire.telephone}</p>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedStagiaire.statut)}</p>
                    <p><strong>Université:</strong> {selectedStagiaire.universite}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informations du stage</h6>
                    <p><strong>Formation:</strong> {selectedStagiaire.titreStage}</p>
                    <p><strong>Tuteur:</strong> {selectedStagiaire.tuteur}</p>
                    <p><strong>Encadrant:</strong> {selectedStagiaire.encadrant}</p>
                    <p><strong>Période:</strong> {selectedStagiaire.dateDebut} - {selectedStagiaire.dateFin}</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Progression</h6>
                    <div className="progress mb-3" style={{ height: '25px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${selectedStagiaire.progression}%` }}
                      >
                        {selectedStagiaire.progression}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Évaluations</h6>
                    <p><strong>Note globale:</strong> 
                      <span className={`${getProgressColor(selectedStagiaire.noteEvaluation)} ms-2`}>
                        {selectedStagiaire.noteEvaluation.toFixed(1)}
                      </span>
                    </p>
                    <p><strong>Évaluation:</strong> {selectedStagiaire.noteEvaluation}/5</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Compétences</h6>
                    <div className="mb-3">
                      {/* Add skills display logic here */}
                    </div>
                    <h6>Tâches en cours</h6>
                    <ul className="list-unstyled">
                      {selectedStagiaire.taches.map((tache, index) => (
                        <li key={index} className="mb-1">
                          <FaFileAlt className="me-2 text-muted" />
                          {tache.titre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fermer
                </button>
                <button type="button" className="btn btn-primary">
                  <FaStar className="me-2" />
                  Évaluer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showDetailsModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default MesStagiaires;