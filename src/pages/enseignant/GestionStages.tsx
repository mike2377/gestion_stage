import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Stage {
  id: number;
  title: string;
  description: string;
  enterpriseId: number;
  enterpriseName: string;
  enterpriseLogo?: string;
  studentId?: string;
  studentName?: string;
  studentPhoto?: string;
  startDate: string;
  endDate: string;
  status: 'available' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  salary?: number;
  requirements: string[];
  skills: string[];
  supervisor: string;
  tutor: string;
  program: string;
  year: number;
  applications: number;
  evaluation?: number;
  progress?: number;
  documents: Document[];
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
}

const GestionStages: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [filteredStages, setFilteredStages] = useState<Stage[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    year: '',
    enterprise: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockStages: Stage[] = [
      {
        id: 1,
        title: 'Développeur Web Full-Stack',
        description: 'Développement d\'applications web modernes avec React, Node.js et MongoDB. Participation à l\'ensemble du cycle de développement.',
        enterpriseId: 1,
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        status: 'in_progress',
        location: 'Paris',
        salary: 800,
        requirements: ['Master Informatique', 'Connaissances React/Node.js', 'Anglais courant'],
        skills: ['React', 'Node.js', 'MongoDB', 'Git', 'Docker'],
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        program: 'Master Informatique',
        year: 2,
        applications: 15,
        evaluation: 4.5,
        progress: 75,
        documents: [
          {
            id: 1,
            name: 'Convention_stage_Jean_Dupont.pdf',
            type: 'Convention',
            uploadDate: '28/02/2024',
            status: 'Approuvé'
          },
          {
            id: 2,
            name: 'Rapport_mensuel_Jean_Dupont.pdf',
            type: 'Rapport',
            uploadDate: '01/04/2024',
            status: 'En attente'
          }
        ]
      },
      {
        id: 2,
        title: 'Assistant Marketing Digital',
        description: 'Gestion des réseaux sociaux, création de contenu, analyse des performances marketing et optimisation des campagnes.',
        enterpriseId: 2,
        enterpriseName: 'MarketingPro',
        enterpriseLogo: '/api/logos/marketingpro-logo.png',
        studentId: '2024002',
        studentName: 'Marie Martin',
        studentPhoto: '/api/photos/student-2.jpg',
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        status: 'in_progress',
        location: 'Lyon',
        salary: 700,
        requirements: ['Master Marketing', 'Expérience réseaux sociaux', 'Créativité'],
        skills: ['Marketing Digital', 'SEO', 'Réseaux sociaux', 'Analytics'],
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        program: 'Master Marketing',
        year: 2,
        applications: 8,
        evaluation: 4.2,
        progress: 60,
        documents: [
          {
            id: 3,
            name: 'Convention_stage_Marie_Martin.pdf',
            type: 'Convention',
            uploadDate: '25/03/2024',
            status: 'Approuvé'
          }
        ]
      },
      {
        id: 3,
        title: 'Data Analyst',
        description: 'Analyse de données, création de rapports, développement de dashboards et support aux décisions métier.',
        enterpriseId: 3,
        enterpriseName: 'DataCorp',
        enterpriseLogo: '/api/logos/datacorp-logo.png',
        startDate: '01/06/2024',
        endDate: '31/12/2024',
        status: 'available',
        location: 'Marseille',
        salary: 750,
        requirements: ['Master Statistiques/Informatique', 'Python/R', 'SQL'],
        skills: ['Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
        supervisor: 'M. Bernard',
        tutor: 'Dr. Petit',
        program: 'Master Data Science',
        year: 2,
        applications: 12,
        documents: []
      },
      {
        id: 4,
        title: 'UX/UI Designer',
        description: 'Conception d\'interfaces utilisateur, tests utilisateurs, prototypage et amélioration de l\'expérience utilisateur.',
        enterpriseId: 4,
        enterpriseName: 'DesignStudio',
        enterpriseLogo: '/api/logos/designstudio-logo.png',
        startDate: '01/09/2024',
        endDate: '28/02/2025',
        status: 'available',
        location: 'Toulouse',
        salary: 650,
        requirements: ['Master Design/Arts', 'Portfolio', 'Outils design'],
        skills: ['Figma', 'Adobe Creative Suite', 'Prototypage', 'User Research'],
        supervisor: 'Mme. Laurent',
        tutor: 'Dr. Roux',
        program: 'Master Design',
        year: 2,
        applications: 6,
        documents: []
      },
      {
        id: 5,
        title: 'Développeur Mobile',
        description: 'Développement d\'applications mobiles iOS et Android avec React Native et Swift.',
        enterpriseId: 5,
        enterpriseName: 'MobileTech',
        enterpriseLogo: '/api/logos/mobiletech-logo.png',
        startDate: '01/05/2024',
        endDate: '31/10/2024',
        status: 'assigned',
        location: 'Bordeaux',
        salary: 800,
        requirements: ['Master Informatique', 'React Native', 'Swift'],
        skills: ['React Native', 'Swift', 'iOS', 'Android', 'Git'],
        supervisor: 'M. Durand',
        tutor: 'Dr. Simon',
        program: 'Master Informatique',
        year: 2,
        applications: 10,
        documents: []
      }
    ];
    setStages(mockStages);
    setFilteredStages(mockStages);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = stages;

    if (newFilters.status) {
      filtered = filtered.filter(stage => stage.status === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(stage => stage.program === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(stage => stage.year.toString() === newFilters.year);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(stage => stage.enterpriseId.toString() === newFilters.enterprise);
    }

    setFilteredStages(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { class: 'bg-success', text: 'Disponible', icon: 'fas fa-check-circle' },
      assigned: { class: 'bg-info', text: 'Assigné', icon: 'fas fa-user-check' },
      in_progress: { class: 'bg-warning', text: 'En cours', icon: 'fas fa-play-circle' },
      completed: { class: 'bg-primary', text: 'Terminé', icon: 'fas fa-flag-checkered' },
      cancelled: { class: 'bg-danger', text: 'Annulé', icon: 'fas fa-times-circle' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getStatusCount = (status: string) => {
    return stages.filter(stage => stage.status === status).length;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
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
                  <i className="fas fa-briefcase me-2 text-primary"></i>
                  Gestion des Stages
                </h1>
                <p className="text-muted mb-0">
                  Suivez et gérez les stages de vos étudiants
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
                        <h4 className="mb-0">{stages.length}</h4>
                        <p className="mb-0">Total stages</p>
                      </div>
                      <i className="fas fa-briefcase fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('available')}</h4>
                        <p className="mb-0">Disponibles</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
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
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('completed')}</h4>
                        <p className="mb-0">Terminés</p>
                      </div>
                      <i className="fas fa-flag-checkered fa-2x opacity-50"></i>
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
                      <option value="available">Disponible</option>
                      <option value="assigned">Assigné</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
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
                    <label className="form-label">Année</label>
                    <select 
                      className="form-select"
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                    >
                      <option value="">Toutes les années</option>
                      <option value="1">1ère année</option>
                      <option value="2">2ème année</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', program: '', year: '', enterprise: '' });
                        setFilteredStages(stages);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des stages */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Stages ({filteredStages.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredStages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun stage trouvé</h5>
                    <p className="text-muted">Aucun stage ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Étudiant</th>
                          <th>Période</th>
                          <th>Statut</th>
                          <th>Progression</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStages.map((stage) => (
                          <tr key={stage.id}>
                            <td>
                              <div>
                                <strong>{stage.title}</strong><br />
                                <small className="text-muted">{stage.location}</small><br />
                                <small className="text-muted">
                                  <i className="fas fa-users me-1"></i>{stage.applications} candidatures
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={stage.enterpriseLogo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{stage.enterpriseName}</strong><br />
                                  <small className="text-muted">{stage.supervisor}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              {stage.studentName ? (
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={stage.studentPhoto || '/default-avatar.png'} 
                                    alt="Photo"
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <strong>{stage.studentName}</strong><br />
                                    <small className="text-muted">{stage.program} - {stage.year}</small>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">Non assigné</span>
                              )}
                            </td>
                            <td>
                              {stage.startDate} - {stage.endDate}
                            </td>
                            <td>{getStatusBadge(stage.status)}</td>
                            <td>
                              {stage.progress !== undefined ? (
                                <div className="mb-1">
                                  <div className="d-flex justify-content-between">
                                    <small>{stage.progress}%</small>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar bg-${getProgressColor(stage.progress)}`}
                                      style={{ width: `${stage.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedStage(stage);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                {stage.status === 'available' && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    title="Assigner un étudiant"
                                    onClick={() => {
                                      setSelectedStage(stage);
                                      setShowAssignmentModal(true);
                                    }}
                                  >
                                    <i className="fas fa-user-plus"></i>
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

      {/* Modal Détails Stage */}
      {showDetailsModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-briefcase me-2"></i>
                  Détails du stage - {selectedStage.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs" id="stageTabs">
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
                      className={`nav-link ${activeTab === 'student' ? 'active' : ''}`}
                      onClick={() => setActiveTab('student')}
                    >
                      <i className="fas fa-user me-2"></i>Étudiant
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
                        <h5>Description du stage</h5>
                        <p>{selectedStage.description}</p>

                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations générales</h6>
                            <p><strong>Entreprise:</strong> {selectedStage.enterpriseName}</p>
                            <p><strong>Localisation:</strong> {selectedStage.location}</p>
                            <p><strong>Période:</strong> {selectedStage.startDate} - {selectedStage.endDate}</p>
                            <p><strong>Superviseur:</strong> {selectedStage.supervisor}</p>
                            <p><strong>Tuteur:</strong> {selectedStage.tutor}</p>
                            {selectedStage.salary && (
                              <p><strong>Salaire:</strong> {selectedStage.salary}€/mois</p>
                            )}
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Compétences requises</h6>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {selectedStage.skills.map((skill, index) => (
                                <span key={index} className="badge bg-primary">{skill}</span>
                              ))}
                            </div>

                            <h6 className="text-primary mb-3">Prérequis</h6>
                            <ul className="list-unstyled">
                              {selectedStage.requirements.map((req, index) => (
                                <li key={index}><i className="fas fa-check text-success me-2"></i>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {selectedStage.progress !== undefined && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Progression</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <span>Progression globale</span>
                                    <span>{selectedStage.progress}%</span>
                                  </div>
                                  <div className="progress">
                                    <div 
                                      className={`progress-bar bg-${getProgressColor(selectedStage.progress)}`}
                                      style={{ width: `${selectedStage.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                {selectedStage.evaluation && (
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">Évaluation: {selectedStage.evaluation}/5</span>
                                    <div className="d-flex">
                                      {[...Array(5)].map((_, i) => (
                                        <i 
                                          key={i} 
                                          className={`fas fa-star ${i < Math.floor(selectedStage.evaluation!) ? 'text-warning' : 'text-muted'}`}
                                        ></i>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>Statistiques</h6>
                            <div className="mb-3">
                              <strong>Candidatures:</strong> {selectedStage.applications}
                            </div>
                            <div className="mb-3">
                              <strong>Programme:</strong> {selectedStage.program}
                            </div>
                            <div className="mb-3">
                              <strong>Année:</strong> {selectedStage.year}
                            </div>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedStage.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Étudiant */}
                  {activeTab === 'student' && (
                    <div>
                      {selectedStage.studentName ? (
                        <div className="row">
                          <div className="col-md-4 text-center">
                            <img 
                              src={selectedStage.studentPhoto || '/default-avatar.png'} 
                              alt="Photo"
                              className="rounded-circle mb-3"
                              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            <h5>{selectedStage.studentName}</h5>
                            <p className="text-muted">{selectedStage.program} - {selectedStage.year}</p>
                          </div>
                          <div className="col-md-8">
                            <h6 className="text-primary mb-3">Informations académiques</h6>
                            <p><strong>ID Étudiant:</strong> {selectedStage.studentId}</p>
                            <p><strong>Programme:</strong> {selectedStage.program}</p>
                            <p><strong>Année:</strong> {selectedStage.year}</p>
                            <p><strong>Tuteur:</strong> {selectedStage.tutor}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <i className="fas fa-user-plus fa-4x text-muted mb-3"></i>
                          <h5 className="text-muted">Aucun étudiant assigné</h5>
                          <p className="text-muted">Ce stage n'a pas encore d'étudiant assigné.</p>
                          <button 
                            className="btn btn-primary"
                            onClick={() => {
                              setShowDetailsModal(false);
                              setShowAssignmentModal(true);
                            }}
                          >
                            <i className="fas fa-user-plus me-2"></i>Assigner un étudiant
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div>
                      <h6 className="text-primary mb-3">Documents du stage</h6>
                      {selectedStage.documents.length === 0 ? (
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
                              {selectedStage.documents.map((doc) => (
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
                                      doc.status === 'Approuvé' ? 'bg-success' : 
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Assignation Étudiant */}
      {showAssignmentModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-plus me-2"></i>
                  Assigner un étudiant - {selectedStage.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAssignmentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Interface d'assignation d'étudiant pour le stage "{selectedStage.title}"</p>
                {/* Ici on ajouterait l'interface d'assignation */}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAssignmentModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Assigner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionStages; 