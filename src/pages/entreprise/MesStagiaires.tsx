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

interface Stagiaire {
  id: number;
  matricule: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  photo?: string;
  titreStage: string;
  idStage: number;
  dateDebut: string;
  dateFin: string;
  statut: 'actif' | 'termine' | 'termine_anticipé';
  encadrant: string;
  tuteur: string;
  universite: string;
  programme: string;
  annee: number;
  noteEvaluation: number;
  progression: number;
  taches: Tache[];
  documents: Document[];
  evaluations: Evaluation[];
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

  // Données simulées
  useEffect(() => {
    if (!user || !user.entrepriseId) return;
    const mockStagiaires: Stagiaire[] = [
      {
        id: 1,
        matricule: '2024001',
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@email.com',
        telephone: '06 12 34 56 78',
        photo: '/api/photos/student-1.jpg',
        titreStage: 'Développeur Web Full-Stack',
        idStage: 1,
        dateDebut: '01/03/2024',
        dateFin: '31/08/2024',
        statut: 'actif',
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        universite: 'Université de Paris',
        programme: 'Master Informatique',
        annee: 2,
        noteEvaluation: 4.5,
        progression: 75,
        taches: [
          {
            id: 1,
            titre: 'Développement du frontend',
            description: 'Créer les interfaces utilisateur avec React',
            dateEcheance: '15/04/2024',
            statut: 'terminee',
            priorite: 'haute',
            dateAttribution: '01/03/2024',
            dateTerminaison: '10/04/2024'
          },
          {
            id: 2,
            titre: 'Intégration API',
            description: 'Connecter le frontend aux APIs backend',
            dateEcheance: '30/04/2024',
            statut: 'en_cours',
            priorite: 'haute',
            dateAttribution: '15/03/2024'
          },
          {
            id: 3,
            titre: 'Tests unitaires',
            description: 'Écrire les tests pour les composants',
            dateEcheance: '15/05/2024',
            statut: 'en_attente',
            priorite: 'moyenne',
            dateAttribution: '01/04/2024'
          }
        ],
        documents: [
          {
            id: 1,
            nom: 'Convention_stage_Jean_Dupont.pdf',
            type: 'Convention',
            dateDepot: '28/02/2024',
            statut: 'Approuvé'
          },
          {
            id: 2,
            nom: 'Rapport_mensuel_Jean_Dupont.pdf',
            type: 'Rapport',
            dateDepot: '01/04/2024',
            statut: 'En attente'
          }
        ],
        evaluations: [
          {
            id: 1,
            date: '01/04/2024',
            type: 'mi_parcours',
            note: 4.5,
            commentaires: 'Excellent travail, très autonome et créatif',
            evaluateur: 'M. Martin'
          }
        ]
      },
      {
        id: 2,
        matricule: '2024002',
        prenom: 'Marie',
        nom: 'Martin',
        email: 'marie.martin@email.com',
        telephone: '06 98 76 54 32',
        photo: '/api/photos/student-2.jpg',
        titreStage: 'Assistant Marketing Digital',
        idStage: 2,
        dateDebut: '01/04/2024',
        dateFin: '31/07/2024',
        statut: 'actif',
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        universite: 'Université de Lyon',
        programme: 'Master Marketing',
        annee: 2,
        noteEvaluation: 4.2,
        progression: 60,
        taches: [
          {
            id: 4,
            titre: 'Gestion réseaux sociaux',
            description: 'Créer et publier du contenu sur les réseaux',
            dateEcheance: '15/04/2024',
            statut: 'terminee',
            priorite: 'haute',
            dateAttribution: '01/04/2024',
            dateTerminaison: '12/04/2024'
          },
          {
            id: 5,
            titre: 'Analyse des performances',
            description: 'Analyser les métriques des campagnes',
            dateEcheance: '30/04/2024',
            statut: 'en_cours',
            priorite: 'moyenne',
            dateAttribution: '10/04/2024'
          }
        ],
        documents: [
          {
            id: 3,
            nom: 'Convention_stage_Marie_Martin.pdf',
            type: 'Convention',
            dateDepot: '25/03/2024',
            statut: 'Approuvé'
          }
        ],
        evaluations: []
      },
      {
        id: 3,
        matricule: '2024003',
        prenom: 'Sophie',
        nom: 'Bernard',
        email: 'sophie.bernard@email.com',
        telephone: '06 55 66 77 88',
        photo: '/api/photos/student-4.jpg',
        titreStage: 'Développeur Web Full-Stack',
        idStage: 1,
        dateDebut: '01/06/2023',
        dateFin: '31/12/2023',
        statut: 'termine',
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        universite: 'Université de Toulouse',
        programme: 'Master Informatique',
        annee: 2,
        noteEvaluation: 4.8,
        progression: 100,
        taches: [],
        documents: [
          {
            id: 4,
            nom: 'Rapport_final_Sophie_Bernard.pdf',
            type: 'Rapport final',
            dateDepot: '15/12/2023',
            statut: 'Approuvé'
          }
        ],
        evaluations: [
          {
            id: 2,
            date: '15/12/2023',
            type: 'finale',
            note: 4.8,
            commentaires: 'Excellente stagiaire, travail de qualité exceptionnelle',
            evaluateur: 'M. Martin'
          }
        ]
      }
    ];
    setStagiaires(mockStagiaires);
    setFilteredStagiaires(mockStagiaires);
  }, [user]);

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

  const user = {
    role: 'enterprise',
    firstName: 'TechCorp',
    lastName: 'Admin',
    entrepriseId: 'your_enterprise_id_here' // Placeholder for actual user data
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
                    <th>Formation</th>
                    <th>Statut</th>
                    <th>Progression</th>
                    <th>Note</th>
                    <th>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleSort('dateDebut')}
                      >
                        Date Début {getSortIcon('dateDebut')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStagiaires.map((stagiaire) => (
                    <tr key={stagiaire.id}>
                      <td>
                        <div>
                          <strong>{stagiaire.prenom} {stagiaire.nom}</strong>
                          <br />
                          <small className="text-muted">
                            <FaEnvelope className="me-1" />
                            {stagiaire.email}
                          </small>
                          <br />
                          <small className="text-muted">
                            <FaPhone className="me-1" />
                            {stagiaire.telephone}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaGraduationCap className="me-1 text-muted" />
                          {stagiaire.titreStage}
                          <br />
                          <small className="text-muted">
                            <FaBuilding className="me-1" />
                            {stagiaire.universite}
                          </small>
                        </div>
                      </td>
                      <td>{getStatusBadge(stagiaire.statut)}</td>
                      <td>
                        <div className="progress" style={{ height: '20px' }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${stagiaire.progression}%` }}
                          >
                            {stagiaire.progression}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`${getProgressColor(stagiaire.noteEvaluation)}`}>
                          {stagiaire.noteEvaluation.toFixed(1)}
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaCalendarAlt className="me-1 text-muted" />
                          {stagiaire.dateDebut}
                          <br />
                          <small className="text-muted">
                            Fin: {stagiaire.dateFin}
                          </small>
                        </div>
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
                  ))}
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