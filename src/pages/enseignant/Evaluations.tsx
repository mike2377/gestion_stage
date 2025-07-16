import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Evaluation {
  id: number;
  idEtudiant: string;
  nomEtudiant: string;
  photoEtudiant?: string;
  idEntreprise: number;
  nomEntreprise: string;
  logoEntreprise?: string;
  titreStage: string;
  typeEvaluation: 'mi_parcours' | 'finale';
  dateEvaluation: string;
  dateLimite: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'retard';
  encadrant: string;
  tuteur: string;
  programme: string;
  annee: number;
  notes: Note[];
  noteGlobale: number;
  commentaires: string;
  recommandations: string;
  documents: Document[];
}

interface Note {
  id: number;
  critere: string;
  poids: number;
  note: number;
  noteMax: number;
  commentaires?: string;
}

interface Document {
  id: number;
  nom: string;
  type: string;
  dateDepot: string;
  statut: string;
}

const Evaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    program: '',
    year: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockEvaluations: Evaluation[] = [
      {
        id: 1,
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        idEntreprise: 1,
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        titreStage: 'Développeur Web Full-Stack',
        typeEvaluation: 'mi_parcours',
        dateEvaluation: '01/04/2024',
        dateLimite: '15/04/2024',
        statut: 'terminee',
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        noteGlobale: 4.5,
        commentaires: 'Excellent travail, très autonome et créatif. Développe bien ses compétences techniques.',
        recommandations: 'Continuer dans cette voie, excellent potentiel pour un poste de développeur senior.',
        notes: [
          {
            id: 1,
            critere: 'Compétences techniques',
            poids: 30,
            note: 4.5,
            noteMax: 5,
            commentaires: 'Maîtrise excellente des technologies web'
          },
          {
            id: 2,
            critere: 'Autonomie',
            poids: 25,
            note: 4.0,
            noteMax: 5,
            commentaires: 'Très autonome dans son travail'
          },
          {
            id: 3,
            critere: 'Communication',
            poids: 20,
            note: 4.5,
            noteMax: 5,
            commentaires: 'Communication claire et efficace'
          },
          {
            id: 4,
            critere: 'Qualité du travail',
            poids: 25,
            note: 4.5,
            noteMax: 5,
            commentaires: 'Code de qualité, bien documenté'
          }
        ],
        documents: [
          {
            id: 1,
            nom: 'Evaluation_mi_parcours_Jean_Dupont.pdf',
            type: 'Évaluation',
            dateDepot: '01/04/2024',
            statut: 'Validé'
          }
        ]
      },
      {
        id: 2,
        idEtudiant: '2024002',
        nomEtudiant: 'Marie Martin',
        photoEtudiant: '/api/photos/student-2.jpg',
        idEntreprise: 2,
        nomEntreprise: 'MarketingPro',
        logoEntreprise: '/api/logos/marketingpro-logo.png',
        titreStage: 'Assistant Marketing Digital',
        typeEvaluation: 'mi_parcours',
        dateEvaluation: '15/04/2024',
        dateLimite: '30/04/2024',
        statut: 'en_cours',
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        programme: 'Master Marketing',
        annee: 2,
        noteGlobale: 0,
        commentaires: '',
        recommandations: '',
        notes: [
          {
            id: 5,
            critere: 'Créativité',
            poids: 30,
            note: 0,
            noteMax: 5
          },
          {
            id: 6,
            critere: 'Gestion des réseaux sociaux',
            poids: 35,
            note: 0,
            noteMax: 5
          },
          {
            id: 7,
            critere: 'Analyse des performances',
            poids: 20,
            note: 0,
            noteMax: 5
          },
          {
            id: 8,
            critere: 'Adaptabilité',
            poids: 15,
            note: 0,
            noteMax: 5
          }
        ],
        documents: []
      },
      {
        id: 3,
        idEtudiant: '2024003',
        nomEtudiant: 'Sophie Bernard',
        photoEtudiant: '/api/photos/student-4.jpg',
        idEntreprise: 3,
        nomEntreprise: 'DataCorp',
        logoEntreprise: '/api/logos/datacorp-logo.png',
        titreStage: 'Data Analyst',
        typeEvaluation: 'finale',
        dateEvaluation: '15/12/2023',
        dateLimite: '31/12/2023',
        statut: 'terminee',
        encadrant: 'M. Bernard',
        tuteur: 'Dr. Petit',
        programme: 'Master Data Science',
        annee: 2,
        noteGlobale: 4.8,
        commentaires: 'Excellente stagiaire, travail de qualité exceptionnelle. A contribué significativement aux projets de l\'entreprise.',
        recommandations: 'Recommandation forte pour un poste de data analyst senior.',
        notes: [
          {
            id: 9,
            critere: 'Analyse de données',
            poids: 35,
            note: 5.0,
            noteMax: 5,
            commentaires: 'Excellente maîtrise des outils d\'analyse'
          },
          {
            id: 10,
            critere: 'Présentation des résultats',
            poids: 25,
            note: 4.5,
            noteMax: 5,
            commentaires: 'Présentations claires et professionnelles'
          },
          {
            id: 11,
            critere: 'Outils techniques',
            poids: 25,
            note: 5.0,
            noteMax: 5,
            commentaires: 'Maîtrise parfaite de Python, R et SQL'
          },
          {
            id: 12,
            critere: 'Travail en équipe',
            poids: 15,
            note: 4.5,
            noteMax: 5,
            commentaires: 'Intégration parfaite dans l\'équipe'
          }
        ],
        documents: [
          {
            id: 2,
            nom: 'Evaluation_finale_Sophie_Bernard.pdf',
            type: 'Évaluation',
            dateDepot: '15/12/2023',
            statut: 'Validé'
          }
        ]
      },
      {
        id: 4,
        idEtudiant: '2024004',
        nomEtudiant: 'Pierre Durand',
        photoEtudiant: '/api/photos/student-3.jpg',
        idEntreprise: 4,
        nomEntreprise: 'DesignStudio',
        logoEntreprise: '/api/logos/designstudio-logo.png',
        titreStage: 'UX/UI Designer',
        typeEvaluation: 'mi_parcours',
        dateEvaluation: '01/05/2024',
        dateLimite: '15/05/2024',
        statut: 'en_attente',
        encadrant: 'Mme. Laurent',
        tuteur: 'Dr. Roux',
        programme: 'Master Design',
        annee: 2,
        noteGlobale: 0,
        commentaires: '',
        recommandations: '',
        notes: [
          {
            id: 13,
            critere: 'Design UI',
            poids: 30,
            note: 0,
            noteMax: 5
          },
          {
            id: 14,
            critere: 'Design UX',
            poids: 30,
            note: 0,
            noteMax: 5
          },
          {
            id: 15,
            critere: 'Outils de design',
            poids: 20,
            note: 0,
            noteMax: 5
          },
          {
            id: 16,
            critere: 'Créativité',
            poids: 20,
            note: 0,
            noteMax: 5
          }
        ],
        documents: []
      },
      {
        id: 5,
        idEtudiant: '2024005',
        nomEtudiant: 'Lucas Moreau',
        photoEtudiant: '/api/photos/student-5.jpg',
        idEntreprise: 5,
        nomEntreprise: 'MobileTech',
        logoEntreprise: '/api/logos/mobiletech-logo.png',
        titreStage: 'Développeur Mobile',
        typeEvaluation: 'finale',
        dateEvaluation: '01/11/2024',
        dateLimite: '15/11/2024',
        statut: 'retard',
        encadrant: 'M. Durand',
        tuteur: 'Dr. Simon',
        programme: 'Master Informatique',
        annee: 2,
        noteGlobale: 0,
        commentaires: '',
        recommandations: '',
        notes: [
          {
            id: 17,
            critere: 'Développement mobile',
            poids: 40,
            note: 0,
            noteMax: 5
          },
          {
            id: 18,
            critere: 'Gestion de projet',
            poids: 25,
            note: 0,
            noteMax: 5
          },
          {
            id: 19,
            critere: 'Tests et qualité',
            poids: 20,
            note: 0,
            noteMax: 5
          },
          {
            id: 20,
            critere: 'Documentation',
            poids: 15,
            note: 0,
            noteMax: 5
          }
        ],
        documents: []
      }
    ];
    setEvaluations(mockEvaluations);
    setFilteredEvaluations(mockEvaluations);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = evaluations;

    if (newFilters.status) {
      filtered = filtered.filter(evaluation => evaluation.statut === newFilters.status);
    }
    if (newFilters.type) {
      filtered = filtered.filter(evaluation => evaluation.typeEvaluation === newFilters.type);
    }
    if (newFilters.program) {
      filtered = filtered.filter(evaluation => evaluation.programme === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(evaluation => evaluation.annee.toString() === newFilters.year);
    }

    setFilteredEvaluations(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { class: 'bg-secondary', text: 'En attente', icon: 'fas fa-clock' },
      en_cours: { class: 'bg-info', text: 'En cours', icon: 'fas fa-play' },
      terminee: { class: 'bg-success', text: 'Terminée', icon: 'fas fa-check' },
      retard: { class: 'bg-danger', text: 'En retard', icon: 'fas fa-exclamation-triangle' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      mi_parcours: { class: 'bg-warning', text: 'Mi-parcours' },
      finale: { class: 'bg-primary', text: 'Finale' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return evaluations.filter(evaluation => evaluation.statut === status).length;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.5) return 'success';
    if (grade >= 4.0) return 'info';
    if (grade >= 3.5) return 'warning';
    return 'danger';
  };

  const user = {
    role: 'enseignant',
    firstName: 'Dr. Dupont',
    lastName: 'Enseignant'
  };

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        <div className={`col-auto ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar 
            user={user} 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
        <div className="col">
          <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-star me-2 text-primary"></i>
                  Évaluations
                </h1>
                <p className="text-muted mb-0">
                  Gérez les évaluations de vos étudiants en stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-chart-bar me-2"></i>Rapports
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{evaluations.length}</h4>
                        <p className="mb-0">Total évaluations</p>
                      </div>
                      <i className="fas fa-star fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('en_attente')}</h4>
                        <p className="mb-0">En attente</p>
                      </div>
                      <i className="fas fa-clock fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('en_cours')}</h4>
                        <p className="mb-0">En cours</p>
                      </div>
                      <i className="fas fa-play-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('terminee')}</h4>
                        <p className="mb-0">Terminées</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fas fa-filter me-2"></i>Filtres
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Statut</label>
                    <select 
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="terminee">Terminée</option>
                      <option value="retard">En retard</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Type</label>
                    <select 
                      className="form-select"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="">Tous les types</option>
                      <option value="mi_parcours">Mi-parcours</option>
                      <option value="finale">Finale</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Programme</label>
                    <select 
                      className="form-select"
                      value={filters.program}
                      onChange={(e) => handleFilterChange('program', e.target.value)}
                    >
                      <option value="">Tous les programmes</option>
                      <option value="Master Informatique">Master Informatique</option>
                      <option value="Master Marketing">Master Marketing</option>
                      <option value="Master Data Science">Master Data Science</option>
                      <option value="Master Design">Master Design</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', type: '', program: '', year: '' });
                        setFilteredEvaluations(evaluations);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des évaluations */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Évaluations ({filteredEvaluations.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredEvaluations.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune évaluation trouvée</h5>
                    <p className="text-muted">Aucune évaluation ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Type</th>
                          <th>Date limite</th>
                          <th>Note</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvaluations.map((evaluation) => (
                          <tr key={evaluation.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={evaluation.photoEtudiant || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{evaluation.nomEtudiant}</strong><br />
                                  <small className="text-muted">{evaluation.programme} - {evaluation.annee}</small><br />
                                  <small className="text-muted">ID: {evaluation.idEtudiant}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{evaluation.titreStage}</strong><br />
                              <small className="text-muted">{evaluation.encadrant}</small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={evaluation.logoEntreprise || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{evaluation.nomEntreprise}</strong>
                                </div>
                              </div>
                            </td>
                            <td>{getTypeBadge(evaluation.typeEvaluation)}</td>
                            <td>
                              {evaluation.dateLimite}<br />
                              {evaluation.dateEvaluation && (
                                <small className="text-muted">Réalisée: {evaluation.dateEvaluation}</small>
                              )}
                            </td>
                            <td>
                              {evaluation.noteGlobale > 0 ? (
                                <div className="d-flex align-items-center">
                                  <span className={`me-2 text-${getGradeColor(evaluation.noteGlobale)}`}>
                                    {evaluation.noteGlobale}/5
                                  </span>
                                  <div className="d-flex">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(evaluation.noteGlobale) ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{getStatusBadge(evaluation.statut)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedEvaluation(evaluation);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                {evaluation.statut !== 'terminee' && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    title="Évaluer"
                                    onClick={() => {
                                      setSelectedEvaluation(evaluation);
                                      setShowEvaluationModal(true);
                                    }}
                                  >
                                    <i className="fas fa-star"></i>
                                  </button>
                                )}
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-info"
                                  title="Documents"
                                >
                                  <i className="fas fa-file-alt"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Détails Évaluation */}
      {showDetailsModal && selectedEvaluation && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-star me-2"></i>
                  Détails de l'évaluation - {selectedEvaluation.nomEtudiant}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs" id="evaluationTabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <i className="fas fa-info-circle me-2"></i>Aperçu
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'grades' ? 'active' : ''}`}
                      onClick={() => setActiveTab('grades')}
                    >
                      <i className="fas fa-chart-bar me-2"></i>Notes détaillées
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                      onClick={() => setActiveTab('documents')}
                    >
                      <i className="fas fa-file-alt me-2"></i>Documents
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {/* Onglet Aperçu */}
                  {activeTab === 'overview' && (
                    <div className="row">
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations étudiant</h6>
                            <p><strong>Nom:</strong> {selectedEvaluation.nomEtudiant}</p>
                            <p><strong>ID Étudiant:</strong> {selectedEvaluation.idEtudiant}</p>
                            <p><strong>Programme:</strong> {selectedEvaluation.programme}</p>
                            <p><strong>Année:</strong> {selectedEvaluation.annee}</p>
                            <p><strong>Tuteur:</strong> {selectedEvaluation.tuteur}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations stage</h6>
                            <p><strong>Stage:</strong> {selectedEvaluation.titreStage}</p>
                            <p><strong>Entreprise:</strong> {selectedEvaluation.nomEntreprise}</p>
                            <p><strong>Encadrant:</strong> {selectedEvaluation.encadrant}</p>
                            <p><strong>Type d'évaluation:</strong> {getTypeBadge(selectedEvaluation.typeEvaluation)}</p>
                            <p><strong>Date limite:</strong> {selectedEvaluation.dateLimite}</p>
                          </div>
                        </div>

                        {selectedEvaluation.noteGlobale > 0 && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Note globale</h6>
                            <div className="d-flex align-items-center">
                              <span className={`h4 me-3 text-${getGradeColor(selectedEvaluation.noteGlobale)}`}>
                                {selectedEvaluation.noteGlobale}/5
                              </span>
                              <div className="d-flex">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(selectedEvaluation.noteGlobale) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedEvaluation.commentaires && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Commentaires</h6>
                            <p>{selectedEvaluation.commentaires}</p>
                          </div>
                        )}

                        {selectedEvaluation.recommandations && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Recommandations</h6>
                            <p>{selectedEvaluation.recommandations}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>Statut et dates</h6>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedEvaluation.statut)}
                            </div>
                            <div className="mb-3">
                              <strong>Date limite:</strong> {selectedEvaluation.dateLimite}
                            </div>
                            {selectedEvaluation.dateEvaluation && (
                              <div className="mb-3">
                                <strong>Réalisée le:</strong> {selectedEvaluation.dateEvaluation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Notes détaillées */}
                  {activeTab === 'grades' && (
                    <div>
                      <h6 className="text-primary mb-3">Notes détaillées</h6>
                      {selectedEvaluation.notes.length === 0 ? (
                        <p className="text-muted">Aucune note disponible.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Critère</th>
                                <th>Pondération</th>
                                <th>Note</th>
                                <th>Commentaires</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedEvaluation.notes.map((note) => (
                                <tr key={note.id}>
                                  <td>
                                    <strong>{note.critere}</strong>
                                  </td>
                                  <td>
                                    <span className="badge bg-info">{note.poids}%</span>
                                  </td>
                                  <td>
                                    {note.note > 0 ? (
                                      <div className="d-flex align-items-center">
                                        <span className={`me-2 text-${getGradeColor(note.note)}`}>
                                          {note.note}/{note.noteMax}
                                        </span>
                                        <div className="d-flex">
                                          {[...Array(note.noteMax)].map((_, i) => (
                                            <i 
                                              key={i} 
                                              className={`fas fa-star ${i < Math.floor(note.note) ? 'text-warning' : 'text-muted'}`}
                                            ></i>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-muted">-</span>
                                    )}
                                  </td>
                                  <td>
                                    {note.commentaires || <span className="text-muted">-</span>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div>
                      <h6 className="text-primary mb-3">Documents de l'évaluation</h6>
                      {selectedEvaluation.documents.length === 0 ? (
                        <p className="text-muted">Aucun document disponible.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Document</th>
                                <th>Type</th>
                                <th>Date d'upload</th>
                                <th>Statut</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedEvaluation.documents.map((doc) => (
                                <tr key={doc.id}>
                                  <td>
                                    <i className="fas fa-file-pdf text-danger me-2"></i>
                                    {doc.nom}
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark">{doc.type}</span>
                                  </td>
                                  <td>{doc.dateDepot}</td>
                                  <td>
                                    <span className={`badge ${
                                      doc.statut === 'Validé' ? 'bg-success' : 
                                      doc.statut === 'En attente' ? 'bg-warning' : 'bg-danger'
                                    }`}>
                                      {doc.statut}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <button className="btn btn-sm btn-outline-primary">
                                        <i className="fas fa-eye"></i>
                                      </button>
                                      <button className="btn btn-sm btn-outline-success">
                                        <i className="fas fa-download"></i>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
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
                {selectedEvaluation.statut !== 'terminee' && (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowEvaluationModal(true);
                    }}
                  >
                    <i className="fas fa-star me-2"></i>Évaluer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Évaluation */}
      {showEvaluationModal && selectedEvaluation && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-star me-2"></i>
                  Évaluer - {selectedEvaluation.nomEtudiant}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEvaluationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Formulaire d'évaluation pour {selectedEvaluation.nomEtudiant} - {selectedEvaluation.titreStage}</p>
                {/* Ici on ajouterait le formulaire d'évaluation détaillé */}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluations; 