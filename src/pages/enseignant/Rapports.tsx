import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Report {
  id: number;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  enterpriseId: number;
  enterpriseName: string;
  enterpriseLogo?: string;
  stageTitle: string;
  reportType: 'monthly' | 'final' | 'interim';
  title: string;
  submissionDate: string;
  dueDate: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected';
  grade?: number;
  supervisor: string;
  tutor: string;
  program: string;
  year: number;
  content: string;
  summary: string;
  keywords: string[];
  attachments: Document[];
  comments?: string;
  feedback?: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
  url: string;
}

const Rapports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    program: '',
    year: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: 1,
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        enterpriseId: 1,
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        stageTitle: 'Développeur Web Full-Stack',
        reportType: 'monthly',
        title: 'Rapport mensuel - Mars 2024',
        submissionDate: '01/04/2024',
        dueDate: '05/04/2024',
        status: 'approved',
        grade: 4.5,
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        program: 'Master Informatique',
        year: 2,
        content: 'Ce rapport présente les activités réalisées lors du premier mois de stage. J\'ai principalement travaillé sur le développement du frontend de l\'application web en utilisant React et TypeScript. Les principales réalisations incluent la création des composants de base, l\'implémentation de l\'authentification et la mise en place de l\'architecture du projet.',
        summary: 'Développement frontend avec React, implémentation authentification, architecture projet',
        keywords: ['React', 'TypeScript', 'Frontend', 'Authentification', 'Architecture'],
        comments: 'Excellent rapport, bien structuré et détaillé',
        feedback: 'Continuer dans cette voie, excellent travail technique',
        attachments: [
          {
            id: 1,
            name: 'Rapport_mensuel_Mars_Jean_Dupont.pdf',
            type: 'Rapport',
            uploadDate: '01/04/2024',
            status: 'Approuvé',
            url: '/api/documents/rapport-1.pdf'
          },
          {
            id: 2,
            name: 'Screenshots_application.pdf',
            type: 'Annexe',
            uploadDate: '01/04/2024',
            status: 'Approuvé',
            url: '/api/documents/screenshots-1.pdf'
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
        reportType: 'monthly',
        title: 'Rapport mensuel - Avril 2024',
        submissionDate: '01/05/2024',
        dueDate: '05/05/2024',
        status: 'submitted',
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        program: 'Master Marketing',
        year: 2,
        content: 'Ce rapport détaille les activités marketing digital réalisées au cours du mois d\'avril. J\'ai géré les réseaux sociaux de l\'entreprise, créé du contenu engageant et analysé les performances des campagnes. Les résultats montrent une augmentation de 15% de l\'engagement sur les réseaux sociaux.',
        summary: 'Gestion réseaux sociaux, création contenu, analyse performances',
        keywords: ['Marketing Digital', 'Réseaux sociaux', 'Contenu', 'Analytics'],
        attachments: [
          {
            id: 3,
            name: 'Rapport_mensuel_Avril_Marie_Martin.pdf',
            type: 'Rapport',
            uploadDate: '01/05/2024',
            status: 'En attente',
            url: '/api/documents/rapport-2.pdf'
          }
        ]
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
        reportType: 'final',
        title: 'Rapport final de stage',
        submissionDate: '15/12/2023',
        dueDate: '31/12/2023',
        status: 'approved',
        grade: 4.8,
        supervisor: 'M. Bernard',
        tutor: 'Dr. Petit',
        program: 'Master Data Science',
        year: 2,
        content: 'Ce rapport final présente l\'ensemble du travail réalisé lors de mon stage de 6 mois chez DataCorp. J\'ai contribué à plusieurs projets d\'analyse de données, développé des modèles prédictifs et créé des dashboards interactifs. Les résultats ont permis d\'améliorer les processus décisionnels de l\'entreprise.',
        summary: 'Analyse données, modèles prédictifs, dashboards, amélioration processus',
        keywords: ['Data Science', 'Machine Learning', 'Analytics', 'Dashboard', 'Prédiction'],
        comments: 'Rapport exceptionnel, travail de très haute qualité',
        feedback: 'Excellente contribution à l\'entreprise, recommandation forte',
        attachments: [
          {
            id: 4,
            name: 'Rapport_final_Sophie_Bernard.pdf',
            type: 'Rapport final',
            uploadDate: '15/12/2023',
            status: 'Approuvé',
            url: '/api/documents/rapport-final-3.pdf'
          },
          {
            id: 5,
            name: 'Annexes_techniques.pdf',
            type: 'Annexe',
            uploadDate: '15/12/2023',
            status: 'Approuvé',
            url: '/api/documents/annexes-3.pdf'
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
        reportType: 'interim',
        title: 'Rapport intermédiaire',
        submissionDate: '15/05/2024',
        dueDate: '20/05/2024',
        status: 'draft',
        supervisor: 'Mme. Laurent',
        tutor: 'Dr. Roux',
        program: 'Master Design',
        year: 2,
        content: 'Rapport intermédiaire présentant les premières réalisations en design UX/UI. J\'ai travaillé sur la refonte de l\'interface utilisateur d\'une application mobile, en créant des wireframes et des prototypes interactifs.',
        summary: 'Refonte interface mobile, wireframes, prototypes',
        keywords: ['UX/UI', 'Design', 'Mobile', 'Wireframes', 'Prototypes'],
        attachments: [
          {
            id: 6,
            name: 'Rapport_intermediaire_Pierre_Durand.pdf',
            type: 'Rapport',
            uploadDate: '15/05/2024',
            status: 'Brouillon',
            url: '/api/documents/rapport-4.pdf'
          }
        ]
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
        reportType: 'monthly',
        title: 'Rapport mensuel - Mai 2024',
        submissionDate: '01/06/2024',
        dueDate: '05/06/2024',
        status: 'reviewed',
        grade: 3.8,
        supervisor: 'M. Durand',
        tutor: 'Dr. Simon',
        program: 'Master Informatique',
        year: 2,
        content: 'Rapport mensuel sur le développement mobile. J\'ai travaillé sur l\'application iOS en Swift, implémentant de nouvelles fonctionnalités et corrigeant des bugs. Le développement progresse bien malgré quelques difficultés techniques.',
        summary: 'Développement iOS, Swift, nouvelles fonctionnalités, corrections bugs',
        keywords: ['iOS', 'Swift', 'Développement mobile', 'Fonctionnalités'],
        comments: 'Bon travail, quelques améliorations possibles',
        feedback: 'Continuer les efforts, attention à la qualité du code',
        attachments: [
          {
            id: 7,
            name: 'Rapport_mensuel_Mai_Lucas_Moreau.pdf',
            type: 'Rapport',
            uploadDate: '01/06/2024',
            status: 'Révisé',
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
      filtered = filtered.filter(report => report.status === newFilters.status);
    }
    if (newFilters.type) {
      filtered = filtered.filter(report => report.reportType === newFilters.type);
    }
    if (newFilters.program) {
      filtered = filtered.filter(report => report.program === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(report => report.year.toString() === newFilters.year);
    }

    setFilteredReports(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      submitted: { class: 'bg-warning', text: 'Soumis', icon: 'fas fa-paper-plane' },
      reviewed: { class: 'bg-info', text: 'Révisé', icon: 'fas fa-eye' },
      approved: { class: 'bg-success', text: 'Approuvé', icon: 'fas fa-check' },
      rejected: { class: 'bg-danger', text: 'Rejeté', icon: 'fas fa-times' }
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
      monthly: { class: 'bg-primary', text: 'Mensuel' },
      final: { class: 'bg-success', text: 'Final' },
      interim: { class: 'bg-warning', text: 'Intermédiaire' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.status === status).length;
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
                        <h4 className="mb-0">{getStatusCount('submitted')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('reviewed')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('approved')}</h4>
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
                      <option value="draft">Brouillon</option>
                      <option value="submitted">Soumis</option>
                      <option value="reviewed">Révisé</option>
                      <option value="approved">Approuvé</option>
                      <option value="rejected">Rejeté</option>
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
                      <option value="monthly">Mensuel</option>
                      <option value="final">Final</option>
                      <option value="interim">Intermédiaire</option>
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
                                  src={report.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{report.studentName}</strong><br />
                                  <small className="text-muted">{report.program} - {report.year}</small><br />
                                  <small className="text-muted">ID: {report.studentId}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{report.title}</strong><br />
                              <small className="text-muted">{report.stageTitle}</small>
                            </td>
                            <td>{getTypeBadge(report.reportType)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={report.enterpriseLogo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{report.enterpriseName}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              {report.submissionDate}<br />
                              <small className="text-muted">Échéance: {report.dueDate}</small>
                            </td>
                            <td>
                              {report.grade ? (
                                <div className="d-flex align-items-center">
                                  <span className={`me-2 text-${getGradeColor(report.grade)}`}>
                                    {report.grade}/5
                                  </span>
                                  <div className="d-flex">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(report.grade!) ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{getStatusBadge(report.status)}</td>
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
                                {report.status === 'submitted' && (
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
                  Détails du rapport - {selectedReport.studentName}
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
                            <p><strong>Nom:</strong> {selectedReport.studentName}</p>
                            <p><strong>ID Étudiant:</strong> {selectedReport.studentId}</p>
                            <p><strong>Programme:</strong> {selectedReport.program}</p>
                            <p><strong>Année:</strong> {selectedReport.year}</p>
                            <p><strong>Tuteur:</strong> {selectedReport.tutor}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations rapport</h6>
                            <p><strong>Titre:</strong> {selectedReport.title}</p>
                            <p><strong>Type:</strong> {getTypeBadge(selectedReport.reportType)}</p>
                            <p><strong>Stage:</strong> {selectedReport.stageTitle}</p>
                            <p><strong>Entreprise:</strong> {selectedReport.enterpriseName}</p>
                            <p><strong>Superviseur:</strong> {selectedReport.supervisor}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-primary mb-3">Résumé</h6>
                          <p>{selectedReport.summary}</p>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-primary mb-3">Mots-clés</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {selectedReport.keywords.map((keyword, index) => (
                              <span key={index} className="badge bg-light text-dark">{keyword}</span>
                            ))}
                          </div>
                        </div>

                        {selectedReport.grade && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Note</h6>
                            <div className="d-flex align-items-center">
                              <span className={`h4 me-3 text-${getGradeColor(selectedReport.grade)}`}>
                                {selectedReport.grade}/5
                              </span>
                              <div className="d-flex">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(selectedReport.grade!) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedReport.comments && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Commentaires</h6>
                            <p>{selectedReport.comments}</p>
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
                              <strong>Statut:</strong> {getStatusBadge(selectedReport.status)}
                            </div>
                            <div className="mb-3">
                              <strong>Date de soumission:</strong> {selectedReport.submissionDate}
                            </div>
                            <div className="mb-3">
                              <strong>Date limite:</strong> {selectedReport.dueDate}
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
                          <p>{selectedReport.content}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div>
                      <h6 className="text-primary mb-3">Documents joints</h6>
                      {selectedReport.attachments.length === 0 ? (
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
                              {selectedReport.attachments.map((doc) => (
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
                                      doc.status === 'Approuvé' || doc.status === 'Validé' ? 'bg-success' : 
                                      doc.status === 'En attente' ? 'bg-warning' : 
                                      doc.status === 'Rejeté' ? 'bg-danger' : 'bg-secondary'
                                    }`}>
                                      {doc.status}
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
                {selectedReport.status === 'submitted' && (
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
                <p>Rapport de {selectedReport.studentName} - {selectedReport.title}</p>
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