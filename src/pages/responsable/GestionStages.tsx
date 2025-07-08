import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Stage {
  id: number;
  title: string;
  description: string;
  enterpriseId: number;
  enterpriseName: string;
  enterpriseLogo?: string;
  location: string;
  duration: number;
  startDate: string;
  endDate: string;
  salary?: number;
  status: 'draft' | 'published' | 'closed' | 'archived';
  category: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  supervisor: string;
  supervisorEmail: string;
  supervisorPhone: string;
  maxCandidates: number;
  currentCandidates: number;
  applications: Application[];
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
  isFeatured: boolean;
  isUrgent: boolean;
  tags: string[];
}

interface Application {
  id: number;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  program: string;
  year: number;
  email: string;
  phone: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  cv?: string;
  coverLetter?: string;
  motivation: string;
  skills: string[];
  experience: string;
  availability: string;
  evaluation?: number;
  notes?: string;
}

const GestionStages: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [filteredStages, setFilteredStages] = useState<Stage[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    enterprise: '',
    location: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockStages: Stage[] = [
      {
        id: 1,
        title: 'Développeur Web Full-Stack',
        description: 'Nous recherchons un stagiaire motivé pour rejoindre notre équipe de développement. Vous participerez à la création d\'applications web modernes en utilisant les dernières technologies.',
        enterpriseId: 1,
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        location: 'Paris, France',
        duration: 6,
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        salary: 1200,
        status: 'published',
        category: 'Développement',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Git'],
        requirements: [
          'Étudiant en Master Informatique',
          'Connaissance de JavaScript/TypeScript',
          'Expérience avec React ou framework similaire',
          'Bonne maîtrise de Git'
        ],
        benefits: [
          'Environnement de travail moderne',
          'Mentorat personnalisé',
          'Possibilité d\'embauche',
          'Télétravail possible'
        ],
        supervisor: 'M. Martin',
        supervisorEmail: 'martin@techcorp.com',
        supervisorPhone: '01 23 45 67 89',
        maxCandidates: 10,
        currentCandidates: 8,
        applications: [
          {
            id: 1,
            studentId: '2024001',
            studentName: 'Jean Dupont',
            studentPhoto: '/api/photos/student-1.jpg',
            program: 'Master Informatique',
            year: 2,
            email: 'jean.dupont@email.com',
            phone: '06 12 34 56 78',
            status: 'shortlisted',
            appliedDate: '15/02/2024',
            motivation: 'Passionné par le développement web, je souhaite mettre en pratique mes connaissances dans un environnement professionnel.',
            skills: ['React', 'Node.js', 'JavaScript', 'HTML/CSS'],
            experience: 'Projets universitaires et stage de 3 mois',
            availability: 'Immédiate',
            evaluation: 4.5,
            notes: 'Excellent profil, très motivé'
          },
          {
            id: 2,
            studentId: '2024002',
            studentName: 'Marie Martin',
            studentPhoto: '/api/photos/student-2.jpg',
            program: 'Master Informatique',
            year: 2,
            email: 'marie.martin@email.com',
            phone: '06 98 76 54 32',
            status: 'pending',
            appliedDate: '20/02/2024',
            motivation: 'Intéressée par le développement full-stack et les nouvelles technologies.',
            skills: ['JavaScript', 'Python', 'SQL', 'Git'],
            experience: 'Projets académiques',
            availability: 'À partir de mars 2024'
          }
        ],
        createdAt: '01/02/2024',
        updatedAt: '15/02/2024',
        views: 156,
        favorites: 23,
        isFeatured: true,
        isUrgent: false,
        tags: ['Full-Stack', 'React', 'Node.js', 'Startup']
      },
      {
        id: 2,
        title: 'Assistant Marketing Digital',
        description: 'Stage en marketing digital pour gérer les réseaux sociaux, analyser les performances et participer aux campagnes marketing.',
        enterpriseId: 2,
        enterpriseName: 'MarketingPro',
        enterpriseLogo: '/api/logos/marketingpro-logo.png',
        location: 'Lyon, France',
        duration: 4,
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        salary: 1000,
        status: 'published',
        category: 'Marketing',
        skills: ['Réseaux sociaux', 'Google Analytics', 'Content Marketing', 'SEO'],
        requirements: [
          'Étudiant en Master Marketing ou Communication',
          'Maîtrise des réseaux sociaux',
          'Bonne expression écrite',
          'Créativité'
        ],
        benefits: [
          'Formation aux outils marketing',
          'Travail en équipe',
          'Bureau moderne',
          'Horaires flexibles'
        ],
        supervisor: 'Mme. Dubois',
        supervisorEmail: 'dubois@marketingpro.com',
        supervisorPhone: '04 56 78 90 12',
        maxCandidates: 8,
        currentCandidates: 5,
        applications: [
          {
            id: 3,
            studentId: '2024003',
            studentName: 'Sophie Bernard',
            studentPhoto: '/api/photos/student-3.jpg',
            program: 'Master Marketing',
            year: 2,
            email: 'sophie.bernard@email.com',
            phone: '06 55 66 77 88',
            status: 'reviewed',
            appliedDate: '10/02/2024',
            motivation: 'Passionnée par le marketing digital et les réseaux sociaux.',
            skills: ['Instagram', 'Facebook', 'Content Creation', 'Analytics'],
            experience: 'Stage en agence de communication',
            availability: 'Immédiate',
            evaluation: 4.2
          }
        ],
        createdAt: '05/02/2024',
        updatedAt: '12/02/2024',
        views: 89,
        favorites: 12,
        isFeatured: false,
        isUrgent: true,
        tags: ['Marketing', 'Digital', 'Réseaux sociaux']
      },
      {
        id: 3,
        title: 'Data Analyst',
        description: 'Stage en analyse de données pour traiter et analyser les données clients, créer des rapports et des visualisations.',
        enterpriseId: 3,
        enterpriseName: 'DataCorp',
        enterpriseLogo: '/api/logos/datacorp-logo.png',
        location: 'Marseille, France',
        duration: 6,
        startDate: '01/06/2023',
        endDate: '31/12/2023',
        salary: 1100,
        status: 'closed',
        category: 'Data Science',
        skills: ['Python', 'SQL', 'Tableau', 'Excel', 'Machine Learning'],
        requirements: [
          'Étudiant en Master Data Science ou Statistiques',
          'Maîtrise de Python et SQL',
          'Connaissance des outils de visualisation',
          'Esprit d\'analyse'
        ],
        benefits: [
          'Accès aux données réelles',
          'Formation aux outils avancés',
          'Travail sur des projets concrets',
          'Équipe internationale'
        ],
        supervisor: 'M. Bernard',
        supervisorEmail: 'bernard@datacorp.com',
        supervisorPhone: '04 91 23 45 67',
        maxCandidates: 6,
        currentCandidates: 6,
        applications: [
          {
            id: 4,
            studentId: '2024004',
            studentName: 'Pierre Durand',
            studentPhoto: '/api/photos/student-4.jpg',
            program: 'Master Data Science',
            year: 2,
            email: 'pierre.durand@email.com',
            phone: '06 11 22 33 44',
            status: 'accepted',
            appliedDate: '01/05/2023',
            motivation: 'Passionné par l\'analyse de données et l\'intelligence artificielle.',
            skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning'],
            experience: 'Projets de recherche en ML',
            availability: 'Immédiate',
            evaluation: 4.8,
            notes: 'Profil exceptionnel, embauché'
          }
        ],
        createdAt: '01/05/2023',
        updatedAt: '15/06/2023',
        views: 234,
        favorites: 45,
        isFeatured: true,
        isUrgent: false,
        tags: ['Data', 'Analytics', 'Python', 'ML']
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
    if (newFilters.category) {
      filtered = filtered.filter(stage => stage.category === newFilters.category);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(stage => stage.enterpriseName === newFilters.enterprise);
    }
    if (newFilters.location) {
      filtered = filtered.filter(stage => stage.location === newFilters.location);
    }

    setFilteredStages(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      published: { class: 'bg-success', text: 'Publié', icon: 'fas fa-check' },
      closed: { class: 'bg-warning', text: 'Fermé', icon: 'fas fa-lock' },
      archived: { class: 'bg-dark', text: 'Archivé', icon: 'fas fa-archive' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente' },
      reviewed: { class: 'bg-info', text: 'Examinée' },
      shortlisted: { class: 'bg-warning', text: 'Sélectionnée' },
      interviewed: { class: 'bg-primary', text: 'Entretien' },
      accepted: { class: 'bg-success', text: 'Acceptée' },
      rejected: { class: 'bg-danger', text: 'Refusée' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return stages.filter(stage => stage.status === status).length;
  };

  const getTotalApplications = () => {
    return stages.reduce((total, stage) => total + stage.applications.length, 0);
  };

  const getTotalViews = () => {
    return stages.reduce((total, stage) => total + stage.views, 0);
  };

  const user = {
    role: 'responsable',
    firstName: 'M. Responsable',
    lastName: 'Stage'
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
                  Gérez et supervisez tous les stages proposés
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowStageModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>Nouveau stage
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
                        <h4 className="mb-0">{getStatusCount('published')}</h4>
                        <p className="mb-0">Publiés</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getTotalApplications()}</h4>
                        <p className="mb-0">Candidatures</p>
                      </div>
                      <i className="fas fa-users fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getTotalViews()}</h4>
                        <p className="mb-0">Vues totales</p>
                      </div>
                      <i className="fas fa-eye fa-2x opacity-50"></i>
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
                      <option value="published">Publié</option>
                      <option value="closed">Fermé</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Catégorie</label>
                    <select 
                      className="form-select"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">Toutes les catégories</option>
                      <option value="Développement">Développement</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Entreprise</label>
                    <select 
                      className="form-select"
                      value={filters.enterprise}
                      onChange={(e) => handleFilterChange('enterprise', e.target.value)}
                    >
                      <option value="">Toutes les entreprises</option>
                      <option value="TechCorp Solutions">TechCorp Solutions</option>
                      <option value="MarketingPro">MarketingPro</option>
                      <option value="DataCorp">DataCorp</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Localisation</label>
                    <select 
                      className="form-select"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <option value="">Toutes les localisations</option>
                      <option value="Paris, France">Paris</option>
                      <option value="Lyon, France">Lyon</option>
                      <option value="Marseille, France">Marseille</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setFilters({ status: '', category: '', enterprise: '', location: '' });
                        setFilteredStages(stages);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser les filtres
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
                          <th>Localisation</th>
                          <th>Durée</th>
                          <th>Candidatures</th>
                          <th>Vues</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStages.map((stage) => (
                          <tr key={stage.id}>
                            <td>
                              <div>
                                <strong>{stage.title}</strong>
                                {stage.isFeatured && (
                                  <span className="badge bg-warning ms-2">
                                    <i className="fas fa-star me-1"></i>À la une
                                  </span>
                                )}
                                {stage.isUrgent && (
                                  <span className="badge bg-danger ms-2">
                                    <i className="fas fa-exclamation me-1"></i>Urgent
                                  </span>
                                )}
                                <br />
                                <small className="text-muted">{stage.description.substring(0, 100)}...</small><br />
                                <small className="text-muted">
                                  <i className="fas fa-tag me-1"></i>{stage.category}
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
                              <div>
                                <strong>{stage.location}</strong><br />
                                <small className="text-muted">
                                  {stage.startDate} - {stage.endDate}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.duration} mois</strong><br />
                                {stage.salary && (
                                  <small className="text-muted">{stage.salary}€/mois</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.currentCandidates}/{stage.maxCandidates}</strong><br />
                                <div className="progress" style={{ height: '4px' }}>
                                  <div 
                                    className="progress-bar bg-info"
                                    style={{ width: `${(stage.currentCandidates / stage.maxCandidates) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.views}</strong><br />
                                <small className="text-muted">
                                  <i className="fas fa-heart text-danger me-1"></i>{stage.favorites}
                                </small>
                              </div>
                            </td>
                            <td>{getStatusBadge(stage.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedStage(stage);
                                    setShowApplicationsModal(true);
                                  }}
                                  title="Voir candidatures"
                                >
                                  <i className="fas fa-users"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Dupliquer"
                                >
                                  <i className="fas fa-copy"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash"></i>
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

      {/* Modal Candidatures */}
      {showApplicationsModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-users me-2"></i>
                  Candidatures - {selectedStage.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowApplicationsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Informations du stage</h6>
                    <p><strong>Entreprise:</strong> {selectedStage.enterpriseName}</p>
                    <p><strong>Localisation:</strong> {selectedStage.location}</p>
                    <p><strong>Durée:</strong> {selectedStage.duration} mois</p>
                    <p><strong>Superviseur:</strong> {selectedStage.supervisor}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Statistiques</h6>
                    <p><strong>Candidatures:</strong> {selectedStage.applications.length}/{selectedStage.maxCandidates}</p>
                    <p><strong>Vues:</strong> {selectedStage.views}</p>
                    <p><strong>Favoris:</strong> {selectedStage.favorites}</p>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedStage.status)}</p>
                  </div>
                </div>

                {selectedStage.applications.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune candidature</h5>
                    <p className="text-muted">Aucun étudiant n'a encore postulé pour ce stage.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Programme</th>
                          <th>Date de candidature</th>
                          <th>Compétences</th>
                          <th>Statut</th>
                          <th>Évaluation</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStage.applications.map((application) => (
                          <tr key={application.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={application.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{application.studentName}</strong><br />
                                  <small className="text-muted">{application.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{application.program}</strong><br />
                                <small className="text-muted">Année {application.year}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{application.appliedDate}</strong><br />
                                <small className="text-muted">{application.availability}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                {application.skills.slice(0, 3).map((skill, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1">{skill}</span>
                                ))}
                                {application.skills.length > 3 && (
                                  <span className="badge bg-secondary">+{application.skills.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td>{getApplicationStatusBadge(application.status)}</td>
                            <td>
                              {application.evaluation ? (
                                <div className="d-flex align-items-center">
                                  <span className="me-2">{application.evaluation}/5</span>
                                  <div className="d-flex">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(application.evaluation!) ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">Non évalué</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button className="btn btn-sm btn-outline-primary" title="Voir profil">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-success" title="Accepter">
                                  <i className="fas fa-check"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-warning" title="Entretien">
                                  <i className="fas fa-calendar"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" title="Refuser">
                                  <i className="fas fa-times"></i>
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
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApplicationsModal(false)}
                >
                  Fermer
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-download me-2"></i>Exporter les candidatures
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau Stage */}
      {showStageModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Nouveau stage
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowStageModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Titre du stage *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea className="form-control" rows="4" required></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Entreprise *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une entreprise</option>
                        <option value="1">TechCorp Solutions</option>
                        <option value="2">MarketingPro</option>
                        <option value="3">DataCorp</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Catégorie *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une catégorie</option>
                        <option value="Développement">Développement</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Localisation *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Durée (mois) *</label>
                      <input type="number" className="form-control" min="1" max="12" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de début *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de fin *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Salaire (€/mois)</label>
                      <input type="number" className="form-control" min="0" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre max de candidats *</label>
                      <input type="number" className="form-control" min="1" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Superviseur *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email superviseur *</label>
                      <input type="email" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Compétences requises</label>
                      <input type="text" className="form-control" placeholder="Séparées par des virgules" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Prérequis</label>
                      <textarea className="form-control" rows="3" placeholder="Un prérequis par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Avantages</label>
                      <textarea className="form-control" rows="3" placeholder="Un avantage par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="featured" />
                        <label className="form-check-label" htmlFor="featured">
                          Mettre en avant
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="urgent" />
                        <label className="form-check-label" htmlFor="urgent">
                          Stage urgent
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowStageModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Créer le stage
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