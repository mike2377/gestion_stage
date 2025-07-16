import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Stage {
  id: number;
  titre: string;
  description: string;
  idEntreprise: number;
  nomEntreprise: string;
  logoEntreprise?: string;
  idEtudiant?: string;
  nomEtudiant?: string;
  photoEtudiant?: string;
  dateDebut: string;
  dateFin: string;
  statut: 'disponible' | 'attribue' | 'en_cours' | 'termine' | 'annule';
  lieu: string;
  remuneration?: number;
  exigences: string[];
  competences: string[];
  encadrant: string;
  tuteur: string;
  programme: string;
  annee: number;
  nbCandidatures: number;
  noteEvaluation?: number;
  progression?: number;
  documents: Document[];
}

interface Document {
  id: number;
  nom: string;
  type: string;
  dateDepot: string;
  statut: string;
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
        titre: 'Développeur Web Full-Stack',
        description: 'Développement d\'applications web modernes avec React, Node.js et MongoDB. Participation à l\'ensemble du cycle de développement.',
        idEntreprise: 1,
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        dateDebut: '01/03/2024',
        dateFin: '31/08/2024',
        statut: 'en_cours',
        lieu: 'Paris',
        remuneration: 800,
        exigences: ['Master Informatique', 'Connaissances React/Node.js', 'Anglais courant'],
        competences: ['React', 'Node.js', 'MongoDB', 'Git', 'Docker'],
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        nbCandidatures: 15,
        noteEvaluation: 4.5,
        progression: 75,
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
        ]
      },
      {
        id: 2,
        titre: 'Assistant Marketing Digital',
        description: 'Gestion des réseaux sociaux, création de contenu, analyse des performances marketing et optimisation des campagnes.',
        idEntreprise: 2,
        nomEntreprise: 'MarketingPro',
        logoEntreprise: '/api/logos/marketingpro-logo.png',
        idEtudiant: '2024002',
        nomEtudiant: 'Marie Martin',
        photoEtudiant: '/api/photos/student-2.jpg',
        dateDebut: '01/04/2024',
        dateFin: '31/07/2024',
        statut: 'en_cours',
        lieu: 'Lyon',
        remuneration: 700,
        exigences: ['Master Marketing', 'Expérience réseaux sociaux', 'Créativité'],
        competences: ['Marketing Digital', 'SEO', 'Réseaux sociaux', 'Analytics'],
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        programme: 'Master Marketing',
        annee: 2,
        nbCandidatures: 8,
        noteEvaluation: 4.2,
        progression: 60,
        documents: [
          {
            id: 3,
            nom: 'Convention_stage_Marie_Martin.pdf',
            type: 'Convention',
            dateDepot: '25/03/2024',
            statut: 'Approuvé'
          }
        ]
      },
      {
        id: 3,
        titre: 'Data Analyst',
        description: 'Analyse de données, création de rapports, développement de dashboards et support aux décisions métier.',
        idEntreprise: 3,
        nomEntreprise: 'DataCorp',
        logoEntreprise: '/api/logos/datacorp-logo.png',
        dateDebut: '01/06/2024',
        dateFin: '31/12/2024',
        statut: 'disponible',
        lieu: 'Marseille',
        remuneration: 750,
        exigences: ['Master Statistiques/Informatique', 'Python/R', 'SQL'],
        competences: ['Python', 'R', 'SQL', 'Tableau', 'Machine Learning'],
        encadrant: 'M. Bernard',
        tuteur: 'Dr. Petit',
        programme: 'Master Data Science',
        annee: 2,
        nbCandidatures: 12,
        documents: []
      },
      {
        id: 4,
        titre: 'UX/UI Designer',
        description: 'Conception d\'interfaces utilisateur, tests utilisateurs, prototypage et amélioration de l\'expérience utilisateur.',
        idEntreprise: 4,
        nomEntreprise: 'DesignStudio',
        logoEntreprise: '/api/logos/designstudio-logo.png',
        dateDebut: '01/09/2024',
        dateFin: '28/02/2025',
        statut: 'disponible',
        lieu: 'Toulouse',
        remuneration: 650,
        exigences: ['Master Design/Arts', 'Portfolio', 'Outils design'],
        competences: ['Figma', 'Adobe Creative Suite', 'Prototypage', 'User Research'],
        encadrant: 'Mme. Laurent',
        tuteur: 'Dr. Roux',
        programme: 'Master Design',
        annee: 2,
        nbCandidatures: 6,
        documents: []
      },
      {
        id: 5,
        titre: 'Développeur Mobile',
        description: 'Développement d\'applications mobiles iOS et Android avec React Native et Swift.',
        idEntreprise: 5,
        nomEntreprise: 'MobileTech',
        logoEntreprise: '/api/logos/mobiletech-logo.png',
        dateDebut: '01/05/2024',
        dateFin: '31/10/2024',
        statut: 'attribue',
        lieu: 'Bordeaux',
        remuneration: 800,
        exigences: ['Master Informatique', 'React Native', 'Swift'],
        competences: ['React Native', 'Swift', 'iOS', 'Android', 'Git'],
        encadrant: 'M. Durand',
        tuteur: 'Dr. Simon',
        programme: 'Master Informatique',
        annee: 2,
        nbCandidatures: 10,
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
      filtered = filtered.filter(stage => stage.statut === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(stage => stage.programme === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(stage => stage.annee.toString() === newFilters.year);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(stage => stage.idEntreprise.toString() === newFilters.enterprise);
    }

    setFilteredStages(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      disponible: { class: 'bg-success', text: 'Disponible', icon: 'fas fa-check-circle' },
      attribue: { class: 'bg-info', text: 'Assigné', icon: 'fas fa-user-check' },
      en_cours: { class: 'bg-warning', text: 'En cours', icon: 'fas fa-play-circle' },
      termine: { class: 'bg-primary', text: 'Terminé', icon: 'fas fa-flag-checkered' },
      annule: { class: 'bg-danger', text: 'Annulé', icon: 'fas fa-times-circle' }
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
    return stages.filter(stage => stage.statut === status).length;
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
                        <h4 className="mb-0">{getStatusCount('disponible')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('en_cours')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('termine')}</h4>
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
                      <option value="disponible">Disponible</option>
                      <option value="attribue">Assigné</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Terminé</option>
                      <option value="annule">Annulé</option>
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
                                <strong>{stage.titre}</strong><br />
                                <small className="text-muted">{stage.lieu}</small><br />
                                <small className="text-muted">
                                  <i className="fas fa-users me-1"></i>{stage.nbCandidatures} candidatures
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={stage.logoEntreprise || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{stage.nomEntreprise}</strong><br />
                                  <small className="text-muted">{stage.encadrant}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              {stage.nomEtudiant ? (
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={stage.photoEtudiant || '/default-avatar.png'} 
                                    alt="Photo"
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <strong>{stage.nomEtudiant}</strong><br />
                                    <small className="text-muted">{stage.programme} - {stage.annee}</small>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">Non assigné</span>
                              )}
                            </td>
                            <td>
                              {stage.dateDebut} - {stage.dateFin}
                            </td>
                            <td>{getStatusBadge(stage.statut)}</td>
                            <td>
                              {stage.progression !== undefined ? (
                                <div className="mb-1">
                                  <div className="d-flex justify-content-between">
                                    <small>{stage.progression}%</small>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar bg-${getProgressColor(stage.progression)}`}
                                      style={{ width: `${stage.progression}%` }}
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
                                {stage.statut === 'disponible' && (
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
                  Détails du stage - {selectedStage.titre}
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
                            <p><strong>Entreprise:</strong> {selectedStage.nomEntreprise}</p>
                            <p><strong>Localisation:</strong> {selectedStage.lieu}</p>
                            <p><strong>Période:</strong> {selectedStage.dateDebut} - {selectedStage.dateFin}</p>
                            <p><strong>Encadrant:</strong> {selectedStage.encadrant}</p>
                            <p><strong>Tuteur:</strong> {selectedStage.tuteur}</p>
                            {selectedStage.remuneration && (
                              <p><strong>Rémunération:</strong> {selectedStage.remuneration}€/mois</p>
                            )}
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Compétences requises</h6>
                            <div className="d-flex flex-wrap gap-2 mb-3">
                              {selectedStage.competences.map((skill, index) => (
                                <span key={index} className="badge bg-primary">{skill}</span>
                              ))}
                            </div>

                            <h6 className="text-primary mb-3">Prérequis</h6>
                            <ul className="list-unstyled">
                              {selectedStage.exigences.map((exigence, index) => (
                                <li key={index}><i className="fas fa-check text-success me-2"></i>{exigence}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {selectedStage.progression !== undefined && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Progression</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="mb-3">
                                  <div className="d-flex justify-content-between">
                                    <span>Progression globale</span>
                                    <span>{selectedStage.progression}%</span>
                                  </div>
                                  <div className="progress">
                                    <div 
                                      className={`progress-bar bg-${getProgressColor(selectedStage.progression)}`}
                                      style={{ width: `${selectedStage.progression}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                {selectedStage.noteEvaluation && (
                                  <div className="d-flex align-items-center">
                                    <span className="me-2">Note d'évaluation: {selectedStage.noteEvaluation}/5</span>
                                    <div className="d-flex">
                                      {[...Array(5)].map((_, i) => (
                                        <i 
                                          key={i} 
                                          className={`fas fa-star ${i < Math.floor(selectedStage.noteEvaluation!) ? 'text-warning' : 'text-muted'}`}
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
                              <strong>Candidatures:</strong> {selectedStage.nbCandidatures}
                            </div>
                            <div className="mb-3">
                              <strong>Programme:</strong> {selectedStage.programme}
                            </div>
                            <div className="mb-3">
                              <strong>Année:</strong> {selectedStage.annee}
                            </div>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedStage.statut)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Étudiant */}
                  {activeTab === 'student' && (
                    <div>
                      {selectedStage.nomEtudiant ? (
                        <div className="row">
                          <div className="col-md-4 text-center">
                            <img 
                              src={selectedStage.photoEtudiant || '/default-avatar.png'} 
                              alt="Photo"
                              className="rounded-circle mb-3"
                              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            <h5>{selectedStage.nomEtudiant}</h5>
                            <p className="text-muted">{selectedStage.programme} - {selectedStage.annee}</p>
                          </div>
                          <div className="col-md-8">
                            <h6 className="text-primary mb-3">Informations académiques</h6>
                            <p><strong>ID Étudiant:</strong> {selectedStage.idEtudiant}</p>
                            <p><strong>Programme:</strong> {selectedStage.programme}</p>
                            <p><strong>Année:</strong> {selectedStage.annee}</p>
                            <p><strong>Tuteur:</strong> {selectedStage.tuteur}</p>
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
                                    {doc.nom}
                                  </td>
                                  <td>
                                    <span className="badge bg-light text-dark">{doc.type}</span>
                                  </td>
                                  <td>{doc.dateDepot}</td>
                                  <td>
                                    <span className={`badge ${
                                      doc.statut === 'Approuvé' ? 'bg-success' : 
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
                  Assigner un étudiant - {selectedStage.titre}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAssignmentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Interface d'assignation d'étudiant pour le stage "{selectedStage.titre}"</p>
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