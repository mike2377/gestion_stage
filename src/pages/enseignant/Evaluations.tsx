import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Evaluation {
  id: number;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  enterpriseId: number;
  enterpriseName: string;
  enterpriseLogo?: string;
  stageTitle: string;
  evaluationType: 'midterm' | 'final';
  evaluationDate: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  supervisor: string;
  tutor: string;
  program: string;
  year: number;
  grades: Grade[];
  overallGrade: number;
  comments: string;
  recommendations: string;
  documents: Document[];
}

interface Grade {
  id: number;
  criterion: string;
  weight: number;
  grade: number;
  maxGrade: number;
  comments?: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
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
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        enterpriseId: 1,
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        stageTitle: 'Développeur Web Full-Stack',
        evaluationType: 'midterm',
        evaluationDate: '01/04/2024',
        dueDate: '15/04/2024',
        status: 'completed',
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        program: 'Master Informatique',
        year: 2,
        overallGrade: 4.5,
        comments: 'Excellent travail, très autonome et créatif. Développe bien ses compétences techniques.',
        recommendations: 'Continuer dans cette voie, excellent potentiel pour un poste de développeur senior.',
        grades: [
          {
            id: 1,
            criterion: 'Compétences techniques',
            weight: 30,
            grade: 4.5,
            maxGrade: 5,
            comments: 'Maîtrise excellente des technologies web'
          },
          {
            id: 2,
            criterion: 'Autonomie',
            weight: 25,
            grade: 4.0,
            maxGrade: 5,
            comments: 'Très autonome dans son travail'
          },
          {
            id: 3,
            criterion: 'Communication',
            weight: 20,
            grade: 4.5,
            maxGrade: 5,
            comments: 'Communication claire et efficace'
          },
          {
            id: 4,
            criterion: 'Qualité du travail',
            weight: 25,
            grade: 4.5,
            maxGrade: 5,
            comments: 'Code de qualité, bien documenté'
          }
        ],
        documents: [
          {
            id: 1,
            name: 'Evaluation_mi_parcours_Jean_Dupont.pdf',
            type: 'Évaluation',
            uploadDate: '01/04/2024',
            status: 'Validé'
          }
        ]
      },
      {
        id: 2,
        studentId: '2024002',
        studentName: 'Marie Martin',
        studentPhoto: '/api/photos/student-2.jpg',
        enterpriseId: 2,
        enterpriseName: 'MarketingPro',
        enterpriseLogo: '/api/logos/marketingpro-logo.png',
        stageTitle: 'Assistant Marketing Digital',
        evaluationType: 'midterm',
        evaluationDate: '15/04/2024',
        dueDate: '30/04/2024',
        status: 'in_progress',
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        program: 'Master Marketing',
        year: 2,
        overallGrade: 0,
        comments: '',
        recommendations: '',
        grades: [
          {
            id: 5,
            criterion: 'Créativité',
            weight: 30,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 6,
            criterion: 'Gestion des réseaux sociaux',
            weight: 35,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 7,
            criterion: 'Analyse des performances',
            weight: 20,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 8,
            criterion: 'Adaptabilité',
            weight: 15,
            grade: 0,
            maxGrade: 5
          }
        ],
        documents: []
      },
      {
        id: 3,
        studentId: '2024003',
        studentName: 'Sophie Bernard',
        studentPhoto: '/api/photos/student-4.jpg',
        enterpriseId: 3,
        enterpriseName: 'DataCorp',
        enterpriseLogo: '/api/logos/datacorp-logo.png',
        stageTitle: 'Data Analyst',
        evaluationType: 'final',
        evaluationDate: '15/12/2023',
        dueDate: '31/12/2023',
        status: 'completed',
        supervisor: 'M. Bernard',
        tutor: 'Dr. Petit',
        program: 'Master Data Science',
        year: 2,
        overallGrade: 4.8,
        comments: 'Excellente stagiaire, travail de qualité exceptionnelle. A contribué significativement aux projets de l\'entreprise.',
        recommendations: 'Recommandation forte pour un poste de data analyst senior.',
        grades: [
          {
            id: 9,
            criterion: 'Analyse de données',
            weight: 35,
            grade: 5.0,
            maxGrade: 5,
            comments: 'Excellente maîtrise des outils d\'analyse'
          },
          {
            id: 10,
            criterion: 'Présentation des résultats',
            weight: 25,
            grade: 4.5,
            maxGrade: 5,
            comments: 'Présentations claires et professionnelles'
          },
          {
            id: 11,
            criterion: 'Outils techniques',
            weight: 25,
            grade: 5.0,
            maxGrade: 5,
            comments: 'Maîtrise parfaite de Python, R et SQL'
          },
          {
            id: 12,
            criterion: 'Travail en équipe',
            weight: 15,
            grade: 4.5,
            maxGrade: 5,
            comments: 'Intégration parfaite dans l\'équipe'
          }
        ],
        documents: [
          {
            id: 2,
            name: 'Evaluation_finale_Sophie_Bernard.pdf',
            type: 'Évaluation',
            uploadDate: '15/12/2023',
            status: 'Validé'
          }
        ]
      },
      {
        id: 4,
        studentId: '2024004',
        studentName: 'Pierre Durand',
        studentPhoto: '/api/photos/student-3.jpg',
        enterpriseId: 4,
        enterpriseName: 'DesignStudio',
        enterpriseLogo: '/api/logos/designstudio-logo.png',
        stageTitle: 'UX/UI Designer',
        evaluationType: 'midterm',
        evaluationDate: '01/05/2024',
        dueDate: '15/05/2024',
        status: 'pending',
        supervisor: 'Mme. Laurent',
        tutor: 'Dr. Roux',
        program: 'Master Design',
        year: 2,
        overallGrade: 0,
        comments: '',
        recommendations: '',
        grades: [
          {
            id: 13,
            criterion: 'Design UI',
            weight: 30,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 14,
            criterion: 'Design UX',
            weight: 30,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 15,
            criterion: 'Outils de design',
            weight: 20,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 16,
            criterion: 'Créativité',
            weight: 20,
            grade: 0,
            maxGrade: 5
          }
        ],
        documents: []
      },
      {
        id: 5,
        studentId: '2024005',
        studentName: 'Lucas Moreau',
        studentPhoto: '/api/photos/student-5.jpg',
        enterpriseId: 5,
        enterpriseName: 'MobileTech',
        enterpriseLogo: '/api/logos/mobiletech-logo.png',
        stageTitle: 'Développeur Mobile',
        evaluationType: 'final',
        evaluationDate: '01/11/2024',
        dueDate: '15/11/2024',
        status: 'overdue',
        supervisor: 'M. Durand',
        tutor: 'Dr. Simon',
        program: 'Master Informatique',
        year: 2,
        overallGrade: 0,
        comments: '',
        recommendations: '',
        grades: [
          {
            id: 17,
            criterion: 'Développement mobile',
            weight: 40,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 18,
            criterion: 'Gestion de projet',
            weight: 25,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 19,
            criterion: 'Tests et qualité',
            weight: 20,
            grade: 0,
            maxGrade: 5
          },
          {
            id: 20,
            criterion: 'Documentation',
            weight: 15,
            grade: 0,
            maxGrade: 5
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
      filtered = filtered.filter(evaluation => evaluation.status === newFilters.status);
    }
    if (newFilters.type) {
      filtered = filtered.filter(evaluation => evaluation.evaluationType === newFilters.type);
    }
    if (newFilters.program) {
      filtered = filtered.filter(evaluation => evaluation.program === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(evaluation => evaluation.year.toString() === newFilters.year);
    }

    setFilteredEvaluations(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente', icon: 'fas fa-clock' },
      in_progress: { class: 'bg-info', text: 'En cours', icon: 'fas fa-play' },
      completed: { class: 'bg-success', text: 'Terminée', icon: 'fas fa-check' },
      overdue: { class: 'bg-danger', text: 'En retard', icon: 'fas fa-exclamation-triangle' }
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
      midterm: { class: 'bg-warning', text: 'Mi-parcours' },
      final: { class: 'bg-primary', text: 'Finale' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return evaluations.filter(evaluation => evaluation.status === status).length;
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
                        <h4 className="mb-0">{getStatusCount('pending')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('in_progress')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('completed')}</h4>
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
                      <option value="pending">En attente</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminée</option>
                      <option value="overdue">En retard</option>
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
                      <option value="midterm">Mi-parcours</option>
                      <option value="final">Finale</option>
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
                                  src={evaluation.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{evaluation.studentName}</strong><br />
                                  <small className="text-muted">{evaluation.program} - {evaluation.year}</small><br />
                                  <small className="text-muted">ID: {evaluation.studentId}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{evaluation.stageTitle}</strong><br />
                              <small className="text-muted">{evaluation.supervisor}</small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={evaluation.enterpriseLogo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{evaluation.enterpriseName}</strong>
                                </div>
                              </div>
                            </td>
                            <td>{getTypeBadge(evaluation.evaluationType)}</td>
                            <td>
                              {evaluation.dueDate}<br />
                              {evaluation.evaluationDate && (
                                <small className="text-muted">Réalisée: {evaluation.evaluationDate}</small>
                              )}
                            </td>
                            <td>
                              {evaluation.overallGrade > 0 ? (
                                <div className="d-flex align-items-center">
                                  <span className={`me-2 text-${getGradeColor(evaluation.overallGrade)}`}>
                                    {evaluation.overallGrade}/5
                                  </span>
                                  <div className="d-flex">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(evaluation.overallGrade) ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{getStatusBadge(evaluation.status)}</td>
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
                                {evaluation.status !== 'completed' && (
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
                  Détails de l'évaluation - {selectedEvaluation.studentName}
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
                            <p><strong>Nom:</strong> {selectedEvaluation.studentName}</p>
                            <p><strong>ID Étudiant:</strong> {selectedEvaluation.studentId}</p>
                            <p><strong>Programme:</strong> {selectedEvaluation.program}</p>
                            <p><strong>Année:</strong> {selectedEvaluation.year}</p>
                            <p><strong>Tuteur:</strong> {selectedEvaluation.tutor}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations stage</h6>
                            <p><strong>Stage:</strong> {selectedEvaluation.stageTitle}</p>
                            <p><strong>Entreprise:</strong> {selectedEvaluation.enterpriseName}</p>
                            <p><strong>Superviseur:</strong> {selectedEvaluation.supervisor}</p>
                            <p><strong>Type d'évaluation:</strong> {getTypeBadge(selectedEvaluation.evaluationType)}</p>
                            <p><strong>Date limite:</strong> {selectedEvaluation.dueDate}</p>
                          </div>
                        </div>

                        {selectedEvaluation.overallGrade > 0 && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Note globale</h6>
                            <div className="d-flex align-items-center">
                              <span className={`h4 me-3 text-${getGradeColor(selectedEvaluation.overallGrade)}`}>
                                {selectedEvaluation.overallGrade}/5
                              </span>
                              <div className="d-flex">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(selectedEvaluation.overallGrade) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedEvaluation.comments && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Commentaires</h6>
                            <p>{selectedEvaluation.comments}</p>
                          </div>
                        )}

                        {selectedEvaluation.recommendations && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Recommandations</h6>
                            <p>{selectedEvaluation.recommendations}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>Statut et dates</h6>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedEvaluation.status)}
                            </div>
                            <div className="mb-3">
                              <strong>Date limite:</strong> {selectedEvaluation.dueDate}
                            </div>
                            {selectedEvaluation.evaluationDate && (
                              <div className="mb-3">
                                <strong>Réalisée le:</strong> {selectedEvaluation.evaluationDate}
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
                      {selectedEvaluation.grades.length === 0 ? (
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
                              {selectedEvaluation.grades.map((grade) => (
                                <tr key={grade.id}>
                                  <td>
                                    <strong>{grade.criterion}</strong>
                                  </td>
                                  <td>
                                    <span className="badge bg-info">{grade.weight}%</span>
                                  </td>
                                  <td>
                                    {grade.grade > 0 ? (
                                      <div className="d-flex align-items-center">
                                        <span className={`me-2 text-${getGradeColor(grade.grade)}`}>
                                          {grade.grade}/{grade.maxGrade}
                                        </span>
                                        <div className="d-flex">
                                          {[...Array(grade.maxGrade)].map((_, i) => (
                                            <i 
                                              key={i} 
                                              className={`fas fa-star ${i < Math.floor(grade.grade) ? 'text-warning' : 'text-muted'}`}
                                            ></i>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-muted">-</span>
                                    )}
                                  </td>
                                  <td>
                                    {grade.comments || <span className="text-muted">-</span>}
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
                                    {doc.name}
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark">{doc.type}</span>
                                  </td>
                                  <td>{doc.uploadDate}</td>
                                  <td>
                                    <span className={`badge ${
                                      doc.status === 'Validé' ? 'bg-success' : 
                                      doc.status === 'En attente' ? 'bg-warning' : 'bg-danger'
                                    }`}>
                                      {doc.status}
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
                {selectedEvaluation.status !== 'completed' && (
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
                  Évaluer - {selectedEvaluation.studentName}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEvaluationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Formulaire d'évaluation pour {selectedEvaluation.studentName} - {selectedEvaluation.stageTitle}</p>
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