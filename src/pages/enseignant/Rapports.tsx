import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Rapport {
  id: number;
  idEtudiant: string;
  nomEtudiant: string;
  photoEtudiant?: string;
  idEntreprise: number;
  nomEntreprise: string;
  logoEntreprise?: string;
  titreStage: string;
  typeRapport: 'mensuel' | 'final' | 'intermediaire';
  titre: string;
  dateSoumission: string;
  dateLimite: string;
  statut: 'brouillon' | 'soumis' | 'revise' | 'approuve' | 'rejete';
  note?: number;
  encadrant: string;
  tuteur: string;
  programme: string;
  annee: number;
  contenu: string;
  resume: string;
  motsCles: string[];
  fichiers: Document[];
  commentaires?: string;
  feedback?: string;
}

interface Document {
  id: number;
  nom: string;
  type: string;
  dateDepot: string;
  statut: string;
  url: string;
}

const Rapports: React.FC = () => {
  const [reports, setReports] = useState<Rapport[]>([]);
  const [filteredReports, setFilteredReports] = useState<Rapport[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    program: '',
    year: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Rapport | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockReports: Rapport[] = [
      {
        id: 1,
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        idEntreprise: 1,
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        titreStage: 'Développeur Web Full-Stack',
        typeRapport: 'mensuel',
        titre: 'Rapport mensuel - Mars 2024',
        dateSoumission: '01/04/2024',
        dateLimite: '05/04/2024',
        statut: 'approuve',
        note: 4.5,
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        contenu: 'Ce rapport présente les activités réalisées lors du premier mois de stage. J\'ai principalement travaillé sur le développement du frontend de l\'application web en utilisant React et TypeScript. Les principales réalisations incluent la création des composants de base, l\'implémentation de l\'authentification et la mise en place de l\'architecture du projet.',
        resume: 'Développement frontend avec React, implémentation authentification, architecture projet',
        motsCles: ['React', 'TypeScript', 'Frontend', 'Authentification', 'Architecture'],
        commentaires: 'Excellent rapport, bien structuré et détaillé',
        feedback: 'Continuer dans cette voie, excellent travail technique',
        fichiers: [
          {
            id: 1,
            nom: 'Rapport_mensuel_Mars_Jean_Dupont.pdf',
            type: 'Rapport',
            dateDepot: '01/04/2024',
            statut: 'Approuvé',
            url: '/api/documents/rapport-1.pdf'
          },
          {
            id: 2,
            nom: 'Screenshots_application.pdf',
            type: 'Annexe',
            dateDepot: '01/04/2024',
            statut: 'Approuvé',
            url: '/api/documents/screenshots-1.pdf'
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
        typeRapport: 'mensuel',
        titre: 'Rapport mensuel - Avril 2024',
        dateSoumission: '01/05/2024',
        dateLimite: '05/05/2024',
        statut: 'soumis',
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        programme: 'Master Marketing',
        annee: 2,
        contenu: 'Ce rapport détaille les activités marketing digital réalisées au cours du mois d\'avril. J\'ai géré les réseaux sociaux de l\'entreprise, créé du contenu engageant et analysé les performances des campagnes. Les résultats montrent une augmentation de 15% de l\'engagement sur les réseaux sociaux.',
        resume: 'Gestion réseaux sociaux, création contenu, analyse performances',
        motsCles: ['Marketing Digital', 'Réseaux sociaux', 'Contenu', 'Analytics'],
        fichiers: [
          {
            id: 3,
            nom: 'Rapport_mensuel_Avril_Marie_Martin.pdf',
            type: 'Rapport',
            dateDepot: '01/05/2024',
            statut: 'En attente',
            url: '/api/documents/rapport-2.pdf'
          }
        ]
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
        typeRapport: 'final',
        titre: 'Rapport final de stage',
        dateSoumission: '15/12/2023',
        dateLimite: '31/12/2023',
        statut: 'approuve',
        note: 4.8,
        encadrant: 'M. Bernard',
        tuteur: 'Dr. Petit',
        programme: 'Master Data Science',
        annee: 2,
        contenu: 'Ce rapport final présente l\'ensemble du travail réalisé lors de mon stage de 6 mois chez DataCorp. J\'ai contribué à plusieurs projets d\'analyse de données, développé des modèles prédictifs et créé des dashboards interactifs. Les résultats ont permis d\'améliorer les processus décisionnels de l\'entreprise.',
        resume: 'Analyse données, modèles prédictifs, dashboards, amélioration processus',
        motsCles: ['Data Science', 'Machine Learning', 'Analytics', 'Dashboard', 'Prédiction'],
        commentaires: 'Rapport exceptionnel, travail de très haute qualité',
        feedback: 'Excellente contribution à l\'entreprise, recommandation forte',
        fichiers: [
          {
            id: 4,
            nom: 'Rapport_final_Sophie_Bernard.pdf',
            type: 'Rapport final',
            dateDepot: '15/12/2023',
            statut: 'Approuvé',
            url: '/api/documents/rapport-final-3.pdf'
          },
          {
            id: 5,
            nom: 'Annexes_techniques.pdf',
            type: 'Annexe',
            dateDepot: '15/12/2023',
            statut: 'Approuvé',
            url: '/api/documents/annexes-3.pdf'
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
        typeRapport: 'intermediaire',
        titre: 'Rapport intermédiaire',
        dateSoumission: '15/05/2024',
        dateLimite: '20/05/2024',
        statut: 'brouillon',
        encadrant: 'Mme. Laurent',
        tuteur: 'Dr. Roux',
        programme: 'Master Design',
        annee: 2,
        contenu: 'Rapport intermédiaire présentant les premières réalisations en design UX/UI. J\'ai travaillé sur la refonte de l\'interface utilisateur d\'une application mobile, en créant des wireframes et des prototypes interactifs.',
        resume: 'Refonte interface mobile, wireframes, prototypes',
        motsCles: ['UX/UI', 'Design', 'Mobile', 'Wireframes', 'Prototypes'],
        fichiers: [
          {
            id: 6,
            nom: 'Rapport_intermediaire_Pierre_Durand.pdf',
            type: 'Rapport',
            dateDepot: '15/05/2024',
            statut: 'Brouillon',
            url: '/api/documents/rapport-4.pdf'
          }
        ]
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
        typeRapport: 'mensuel',
        titre: 'Rapport mensuel - Mai 2024',
        dateSoumission: '01/06/2024',
        dateLimite: '05/06/2024',
        statut: 'revise',
        note: 3.8,
        encadrant: 'M. Durand',
        tuteur: 'Dr. Simon',
        programme: 'Master Informatique',
        annee: 2,
        contenu: 'Rapport mensuel sur le développement mobile. J\'ai travaillé sur l\'application iOS en Swift, implémentant de nouvelles fonctionnalités et corrigeant des bugs. Le développement progresse bien malgré quelques difficultés techniques.',
        resume: 'Développement iOS, Swift, nouvelles fonctionnalités, corrections bugs',
        motsCles: ['iOS', 'Swift', 'Développement mobile', 'Fonctionnalités'],
        commentaires: 'Bon travail, quelques améliorations possibles',
        feedback: 'Continuer les efforts, attention à la qualité du code',
        fichiers: [
          {
            id: 7,
            nom: 'Rapport_mensuel_Mai_Lucas_Moreau.pdf',
            type: 'Rapport',
            dateDepot: '01/06/2024',
            statut: 'Révisé',
            url: '/api/documents/rapport-5.pdf'
          }
        ]
      }
    ];
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = reports;

    if (newFilters.status) {
      filtered = filtered.filter(report => report.statut === newFilters.status);
    }
    if (newFilters.type) {
      filtered = filtered.filter(report => report.typeRapport === newFilters.type);
    }
    if (newFilters.program) {
      filtered = filtered.filter(report => report.programme === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(report => report.annee.toString() === newFilters.year);
    }

    setFilteredReports(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      brouillon: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      soumis: { class: 'bg-warning', text: 'Soumis', icon: 'fas fa-paper-plane' },
      revise: { class: 'bg-info', text: 'Révisé', icon: 'fas fa-eye' },
      approuve: { class: 'bg-success', text: 'Approuvé', icon: 'fas fa-check' },
      rejete: { class: 'bg-danger', text: 'Rejeté', icon: 'fas fa-times' }
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
      mensuel: { class: 'bg-primary', text: 'Mensuel' },
      final: { class: 'bg-success', text: 'Final' },
      intermediaire: { class: 'bg-warning', text: 'Intermédiaire' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.statut === status).length;
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
                  <i className="fas fa-file-alt me-2 text-primary"></i>
                  Rapports de Stage
                </h1>
                <p className="text-muted mb-0">
                  Consultez et évaluez les rapports de vos étudiants
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-chart-bar me-2"></i>Statistiques
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
                        <h4 className="mb-0">{reports.length}</h4>
                        <p className="mb-0">Total rapports</p>
                      </div>
                      <i className="fas fa-file-alt fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('soumis')}</h4>
                        <p className="mb-0">Soumis</p>
                      </div>
                      <i className="fas fa-paper-plane fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('revise')}</h4>
                        <p className="mb-0">Révisés</p>
                      </div>
                      <i className="fas fa-eye fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('approuve')}</h4>
                        <p className="mb-0">Approuvés</p>
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
                      <option value="brouillon">Brouillon</option>
                      <option value="soumis">Soumis</option>
                      <option value="revise">Révisé</option>
                      <option value="approuve">Approuvé</option>
                      <option value="rejete">Rejeté</option>
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
                      <option value="mensuel">Mensuel</option>
                      <option value="final">Final</option>
                      <option value="intermediaire">Intermédiaire</option>
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
                        setFilteredReports(reports);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des rapports */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Rapports ({filteredReports.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun rapport trouvé</h5>
                    <p className="text-muted">Aucun rapport ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Titre</th>
                          <th>Type</th>
                          <th>Entreprise</th>
                          <th>Date soumission</th>
                          <th>Note</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map((report) => (
                          <tr key={report.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={report.photoEtudiant || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{report.nomEtudiant}</strong><br />
                                  <small className="text-muted">{report.programme} - {report.annee}</small><br />
                                  <small className="text-muted">ID: {report.idEtudiant}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{report.titre}</strong><br />
                              <small className="text-muted">{report.titreStage}</small>
                            </td>
                            <td>{getTypeBadge(report.typeRapport)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={report.logoEntreprise || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{report.nomEntreprise}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              {report.dateSoumission}<br />
                              <small className="text-muted">Échéance: {report.dateLimite}</small>
                            </td>
                            <td>
                              {report.note ? (
                                <div className="d-flex align-items-center">
                                  <span className={`me-2 text-${getGradeColor(report.note)}`}>
                                    {report.note}/5
                                  </span>
                                  <div className="d-flex">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(report.note!) ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{getStatusBadge(report.statut)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                {report.statut === 'soumis' && (
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    title="Approuver"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setShowReviewModal(true);
                                    }}
                                  >
                                    <i className="fas fa-check"></i>
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

      {/* Modal Détails Rapport */}
      {showDetailsModal && selectedReport && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-alt me-2"></i>
                  Détails du rapport - {selectedReport.nomEtudiant}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs" id="reportTabs">
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
                      className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                      onClick={() => setActiveTab('content')}
                    >
                      <i className="fas fa-file-text me-2"></i>Contenu
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                      onClick={() => setActiveTab('documents')}
                    >
                      <i className="fas fa-paperclip me-2"></i>Documents
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
                            <p><strong>Nom:</strong> {selectedReport.nomEtudiant}</p>
                            <p><strong>ID Étudiant:</strong> {selectedReport.idEtudiant}</p>
                            <p><strong>Programme:</strong> {selectedReport.programme}</p>
                            <p><strong>Année:</strong> {selectedReport.annee}</p>
                            <p><strong>Tuteur:</strong> {selectedReport.tuteur}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations rapport</h6>
                            <p><strong>Titre:</strong> {selectedReport.titre}</p>
                            <p><strong>Type:</strong> {getTypeBadge(selectedReport.typeRapport)}</p>
                            <p><strong>Stage:</strong> {selectedReport.titreStage}</p>
                            <p><strong>Entreprise:</strong> {selectedReport.nomEntreprise}</p>
                            <p><strong>Encadrant:</strong> {selectedReport.encadrant}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-primary mb-3">Résumé</h6>
                          <p>{selectedReport.resume}</p>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-primary mb-3">Mots-clés</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedReport.motsCles.map((keyword, index) => (
                              <span key={index} className="badge bg-light text-dark">{keyword}</span>
                            ))}
                          </div>
                        </div>

                        {selectedReport.note && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Note</h6>
                            <div className="d-flex align-items-center">
                              <span className={`h4 me-3 text-${getGradeColor(selectedReport.note)}`}>
                                {selectedReport.note}/5
                              </span>
                              <div className="d-flex">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(selectedReport.note!) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedReport.commentaires && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Commentaires</h6>
                            <p>{selectedReport.commentaires}</p>
                          </div>
                        )}

                        {selectedReport.feedback && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Retour</h6>
                            <p>{selectedReport.feedback}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>Statut et dates</h6>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedReport.statut)}
                            </div>
                            <div className="mb-3">
                              <strong>Date de soumission:</strong> {selectedReport.dateSoumission}
                            </div>
                            <div className="mb-3">
                              <strong>Date limite:</strong> {selectedReport.dateLimite}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Contenu */}
                  {activeTab === 'content' && (
                    <div>
                      <h6 className="text-primary mb-3">Contenu du rapport</h6>
                      <div className="card">
                        <div className="card-body">
                          <p>{selectedReport.contenu}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div>
                      <h6 className="text-primary mb-3">Documents joints</h6>
                      {selectedReport.fichiers.length === 0 ? (
                        <p className="text-muted">Aucun document joint.</p>
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
                              {selectedReport.fichiers.map((doc) => (
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
                                      doc.statut === 'Approuvé' || doc.statut === 'Validé' ? 'bg-success' : 
                                      doc.statut === 'En attente' ? 'bg-warning' : 
                                      doc.statut === 'Rejeté' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                      {doc.statut}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <a href={doc.url} className="btn btn-sm btn-outline-primary" target="_blank">
                                        <i className="fas fa-eye"></i>
                                      </a>
                                      <a href={doc.url} className="btn btn-sm btn-outline-success" download>
                                        <i className="fas fa-download"></i>
                                      </a>
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
                {selectedReport.statut === 'soumis' && (
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowReviewModal(true);
                    }}
                  >
                    <i className="fas fa-check me-2"></i>Approuver
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Révision Rapport */}
      {showReviewModal && selectedReport && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-check me-2"></i>Approuver le rapport
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowReviewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Rapport de {selectedReport.nomEtudiant} - {selectedReport.titre}</p>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Note *</label>
                    <select className="form-select" required>
                      <option value="">Sélectionner une note</option>
                      <option value="5">5/5 - Excellent</option>
                      <option value="4.5">4.5/5 - Très bien</option>
                      <option value="4">4/5 - Bien</option>
                      <option value="3.5">3.5/5 - Assez bien</option>
                      <option value="3">3/5 - Passable</option>
                      <option value="2.5">2.5/5 - Insuffisant</option>
                      <option value="2">2/5 - Très insuffisant</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Commentaires</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Commentaires sur le rapport..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Retour à l'étudiant</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Feedback pour l'étudiant..."
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowReviewModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-success">
                  <i className="fas fa-check me-2"></i>Approuver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rapports; 