import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Convention {
  id: number;
  reference: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  program: string;
  year: number;
  enterpriseId: number;
  enterpriseName: string;
  enterpriseLogo?: string;
  stageTitle: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'pending' | 'approved' | 'signed' | 'active' | 'completed' | 'cancelled';
  supervisor: string;
  tutor: string;
  responsible: string;
  salary?: number;
  insurance: string;
  workSchedule: string;
  location: string;
  objectives: string[];
  tasks: string[];
  evaluationCriteria: string[];
  documents: Document[];
  signatures: Signature[];
  createdAt: string;
  updatedAt: string;
  notes: string;
  isUrgent: boolean;
}

interface Document {
  id: number;
  name: string;
  type: 'convention' | 'annexe' | 'attestation' | 'autre';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
}

interface Signature {
  id: number;
  role: 'student' | 'enterprise' | 'university' | 'responsible';
  name: string;
  date: string;
  status: 'pending' | 'signed' | 'declined';
  comments?: string;
}

const Conventions: React.FC = () => {
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [filteredConventions, setFilteredConventions] = useState<Convention[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    student: '',
    enterprise: '',
    program: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [showConventionModal, setShowConventionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockConventions: Convention[] = [
      {
        id: 1,
        reference: 'CONV-2024-001',
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        program: 'Master Informatique',
        year: 2,
        enterpriseId: 1,
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        stageTitle: 'Développeur Web Full-Stack',
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        status: 'signed',
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        responsible: 'M. Responsable',
        salary: 1200,
        insurance: 'Assurance Responsabilité Civile',
        workSchedule: '35h/semaine',
        location: 'Paris, France',
        objectives: [
          'Développer des compétences en développement web full-stack',
          'Maîtriser React et Node.js',
          'Participer à des projets réels'
        ],
        tasks: [
          'Développement frontend avec React',
          'Développement backend avec Node.js',
          'Tests et déploiement'
        ],
        evaluationCriteria: [
          'Qualité du code',
          'Respect des délais',
          'Travail en équipe',
          'Autonomie'
        ],
        documents: [
          {
            id: 1,
            name: 'Convention de stage - Jean Dupont.pdf',
            type: 'convention',
            url: '/api/documents/convention-1.pdf',
            uploadedAt: '15/02/2024',
            uploadedBy: 'M. Responsable',
            size: '2.5 MB'
          },
          {
            id: 2,
            name: 'Annexe pédagogique.pdf',
            type: 'annexe',
            url: '/api/documents/annexe-1.pdf',
            uploadedAt: '16/02/2024',
            uploadedBy: 'Dr. Dupont',
            size: '1.8 MB'
          }
        ],
        signatures: [
          {
            id: 1,
            role: 'student',
            name: 'Jean Dupont',
            date: '20/02/2024',
            status: 'signed'
          },
          {
            id: 2,
            role: 'enterprise',
            name: 'M. Martin',
            date: '18/02/2024',
            status: 'signed'
          },
          {
            id: 3,
            role: 'university',
            name: 'Dr. Dupont',
            date: '22/02/2024',
            status: 'signed'
          },
          {
            id: 4,
            role: 'responsible',
            name: 'M. Responsable',
            date: '25/02/2024',
            status: 'signed'
          }
        ],
        createdAt: '15/02/2024',
        updatedAt: '25/02/2024',
        notes: 'Convention signée par toutes les parties. Stage en cours.',
        isUrgent: false
      },
      {
        id: 2,
        reference: 'CONV-2024-002',
        studentId: '2024002',
        studentName: 'Marie Martin',
        studentPhoto: '/api/photos/student-2.jpg',
        program: 'Master Marketing',
        year: 2,
        enterpriseId: 2,
        enterpriseName: 'MarketingPro',
        enterpriseLogo: '/api/logos/marketingpro-logo.png',
        stageTitle: 'Assistant Marketing Digital',
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        status: 'pending',
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        responsible: 'M. Responsable',
        salary: 1000,
        insurance: 'Assurance Responsabilité Civile',
        workSchedule: '35h/semaine',
        location: 'Lyon, France',
        objectives: [
          'Découvrir le marketing digital',
          'Gérer les réseaux sociaux',
          'Analyser les performances'
        ],
        tasks: [
          'Création de contenu pour les réseaux sociaux',
          'Analyse des métriques',
          'Participation aux campagnes marketing'
        ],
        evaluationCriteria: [
          'Créativité',
          'Qualité du contenu',
          'Analyse des données',
          'Travail en équipe'
        ],
        documents: [
          {
            id: 3,
            name: 'Convention de stage - Marie Martin.pdf',
            type: 'convention',
            url: '/api/documents/convention-2.pdf',
            uploadedAt: '20/02/2024',
            uploadedBy: 'M. Responsable',
            size: '2.1 MB'
          }
        ],
        signatures: [
          {
            id: 5,
            role: 'student',
            name: 'Marie Martin',
            date: '22/02/2024',
            status: 'signed'
          },
          {
            id: 6,
            role: 'enterprise',
            name: 'Mme. Dubois',
            date: '21/02/2024',
            status: 'signed'
          },
          {
            id: 7,
            role: 'university',
            name: 'Dr. Moreau',
            date: '',
            status: 'pending'
          },
          {
            id: 8,
            role: 'responsible',
            name: 'M. Responsable',
            date: '',
            status: 'pending'
          }
        ],
        createdAt: '20/02/2024',
        updatedAt: '22/02/2024',
        notes: 'En attente de signature de l\'université et du responsable.',
        isUrgent: true
      },
      {
        id: 3,
        reference: 'CONV-2023-015',
        studentId: '2023001',
        studentName: 'Sophie Bernard',
        studentPhoto: '/api/photos/student-3.jpg',
        program: 'Master Data Science',
        year: 2,
        enterpriseId: 3,
        enterpriseName: 'DataCorp',
        enterpriseLogo: '/api/logos/datacorp-logo.png',
        stageTitle: 'Data Analyst',
        startDate: '01/06/2023',
        endDate: '31/12/2023',
        status: 'completed',
        supervisor: 'M. Bernard',
        tutor: 'Dr. Petit',
        responsible: 'M. Responsable',
        salary: 1100,
        insurance: 'Assurance Responsabilité Civile',
        workSchedule: '35h/semaine',
        location: 'Marseille, France',
        objectives: [
          'Analyser des données clients',
          'Créer des visualisations',
          'Développer des modèles prédictifs'
        ],
        tasks: [
          'Nettoyage et préparation des données',
          'Création de dashboards',
          'Développement de modèles ML'
        ],
        evaluationCriteria: [
          'Qualité de l\'analyse',
          'Présentation des résultats',
          'Innovation',
          'Autonomie'
        ],
        documents: [
          {
            id: 4,
            name: 'Convention de stage - Sophie Bernard.pdf',
            type: 'convention',
            url: '/api/documents/convention-3.pdf',
            uploadedAt: '01/05/2023',
            uploadedBy: 'M. Responsable',
            size: '2.3 MB'
          },
          {
            id: 5,
            name: 'Attestation de stage.pdf',
            type: 'attestation',
            url: '/api/documents/attestation-1.pdf',
            uploadedAt: '15/01/2024',
            uploadedBy: 'M. Bernard',
            size: '1.2 MB'
          }
        ],
        signatures: [
          {
            id: 9,
            role: 'student',
            name: 'Sophie Bernard',
            date: '05/05/2023',
            status: 'signed'
          },
          {
            id: 10,
            role: 'enterprise',
            name: 'M. Bernard',
            date: '03/05/2023',
            status: 'signed'
          },
          {
            id: 11,
            role: 'university',
            name: 'Dr. Petit',
            date: '08/05/2023',
            status: 'signed'
          },
          {
            id: 12,
            role: 'responsible',
            name: 'M. Responsable',
            date: '10/05/2023',
            status: 'signed'
          }
        ],
        createdAt: '01/05/2023',
        updatedAt: '15/01/2024',
        notes: 'Stage terminé avec succès. Étudiante embauchée.',
        isUrgent: false
      }
    ];
    setConventions(mockConventions);
    setFilteredConventions(mockConventions);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = conventions;

    if (newFilters.status) {
      filtered = filtered.filter(convention => convention.status === newFilters.status);
    }
    if (newFilters.student) {
      filtered = filtered.filter(convention => convention.studentId === newFilters.student);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(convention => convention.enterpriseName === newFilters.enterprise);
    }
    if (newFilters.program) {
      filtered = filtered.filter(convention => convention.program === newFilters.program);
    }

    setFilteredConventions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      pending: { class: 'bg-warning', text: 'En attente', icon: 'fas fa-clock' },
      approved: { class: 'bg-info', text: 'Approuvée', icon: 'fas fa-check' },
      signed: { class: 'bg-success', text: 'Signée', icon: 'fas fa-signature' },
      active: { class: 'bg-primary', text: 'Active', icon: 'fas fa-play' },
      completed: { class: 'bg-dark', text: 'Terminée', icon: 'fas fa-flag-checkered' },
      cancelled: { class: 'bg-danger', text: 'Annulée', icon: 'fas fa-times' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getSignatureStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'En attente' },
      signed: { class: 'bg-success', text: 'Signée' },
      declined: { class: 'bg-danger', text: 'Refusée' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return conventions.filter(convention => convention.status === status).length;
  };

  const getTotalConventions = () => {
    return conventions.length;
  };

  const getPendingSignatures = () => {
    return conventions.reduce((total, convention) => {
      return total + convention.signatures.filter(sig => sig.status === 'pending').length;
    }, 0);
  };

  const user = {
    role: 'responsable',
    firstName: 'M. Responsable',
    lastName: 'Stage'
  };

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        {/* Supprimer toute inclusion de Sidebar ou SidebarLayout. Retourner uniquement le contenu principal. */}
        <div className="col">
      <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-file-contract me-2 text-primary"></i>
                  Gestion des Conventions
                </h1>
                <p className="text-muted mb-0">
                  Gérez et suivez toutes les conventions de stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowConventionModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>Nouvelle convention
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
                        <h4 className="mb-0">{getTotalConventions()}</h4>
                        <p className="mb-0">Total conventions</p>
                      </div>
                      <i className="fas fa-file-contract fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('signed') + getStatusCount('active')}</h4>
                        <p className="mb-0">Signées/Actives</p>
                      </div>
                      <i className="fas fa-signature fa-2x opacity-50"></i>
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
                        <h4 className="mb-0">{getPendingSignatures()}</h4>
                        <p className="mb-0">Signatures en attente</p>
                      </div>
                      <i className="fas fa-user-check fa-2x opacity-50"></i>
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
                      <option value="pending">En attente</option>
                      <option value="approved">Approuvée</option>
                      <option value="signed">Signée</option>
                      <option value="active">Active</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Étudiant</label>
                    <select 
                      className="form-select"
                      value={filters.student}
                      onChange={(e) => handleFilterChange('student', e.target.value)}
                    >
                      <option value="">Tous les étudiants</option>
                      <option value="2024001">Jean Dupont</option>
                      <option value="2024002">Marie Martin</option>
                      <option value="2023001">Sophie Bernard</option>
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
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setFilters({ status: '', student: '', enterprise: '', program: '' });
                        setFilteredConventions(conventions);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des conventions */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Conventions ({filteredConventions.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredConventions.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune convention trouvée</h5>
                    <p className="text-muted">Aucune convention ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Référence</th>
                          <th>Étudiant</th>
                          <th>Entreprise</th>
                          <th>Stage</th>
                          <th>Période</th>
                          <th>Signatures</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConventions.map((convention) => (
                          <tr key={convention.id}>
                            <td>
                              <div>
                                <strong>{convention.reference}</strong>
                                {convention.isUrgent && (
                                  <span className="badge bg-danger ms-2">
                                    <i className="fas fa-exclamation me-1"></i>Urgent
                                  </span>
                                )}
                                <br />
                                <small className="text-muted">Créée le {convention.createdAt}</small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={convention.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{convention.studentName}</strong><br />
                                  <small className="text-muted">{convention.program} - {convention.year}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={convention.enterpriseLogo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{convention.enterpriseName}</strong><br />
                                  <small className="text-muted">{convention.supervisor}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{convention.stageTitle}</strong><br />
                                <small className="text-muted">{convention.location}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{convention.startDate} - {convention.endDate}</strong><br />
                                {convention.salary && (
                                  <small className="text-muted">{convention.salary}€/mois</small>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>
                                  {convention.signatures.filter(s => s.status === 'signed').length}/{convention.signatures.length}
                                </strong>
                                <br />
                                <div className="progress" style={{ height: '4px' }}>
                                  <div 
                                    className="progress-bar bg-success"
                                    style={{ 
                                      width: `${(convention.signatures.filter(s => s.status === 'signed').length / convention.signatures.length) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>{getStatusBadge(convention.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedConvention(convention);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Signer"
                                >
                                  <i className="fas fa-signature"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-info"
                                  title="Télécharger"
                                >
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
            </div>
              </div>
            </div>
          </div>

      {/* Modal Détails Convention */}
      {showDetailsModal && selectedConvention && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-contract me-2"></i>
                  Détails - {selectedConvention.reference}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs" id="conventionTabs">
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
                      className={`nav-link ${activeTab === 'signatures' ? 'active' : ''}`}
                      onClick={() => setActiveTab('signatures')}
                    >
                      <i className="fas fa-signature me-2"></i>Signatures
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                      onClick={() => setActiveTab('documents')}
                    >
                      <i className="fas fa-file me-2"></i>Documents
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      <i className="fas fa-list me-2"></i>Détails
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {/* Onglet Aperçu */}
                  {activeTab === 'overview' && (
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">Informations étudiant</h6>
                        <div className="d-flex align-items-center mb-3">
                          <img 
                            src={selectedConvention.studentPhoto || '/default-avatar.png'} 
                            alt="Photo"
                            className="rounded-circle me-3"
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                          <div>
                            <h5>{selectedConvention.studentName}</h5>
                            <p className="mb-0">{selectedConvention.program} - Année {selectedConvention.year}</p>
                            <p className="mb-0 text-muted">ID: {selectedConvention.studentId}</p>
                          </div>
                        </div>
                        
                        <h6 className="text-primary mb-3">Informations entreprise</h6>
                        <div className="d-flex align-items-center mb-3">
                          <img 
                            src={selectedConvention.enterpriseLogo || '/default-logo.png'} 
                            alt="Logo"
                            className="rounded me-3"
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                          />
                          <div>
                            <h6>{selectedConvention.enterpriseName}</h6>
                            <p className="mb-0">Superviseur: {selectedConvention.supervisor}</p>
                            <p className="mb-0 text-muted">{selectedConvention.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">Informations stage</h6>
                        <p><strong>Titre:</strong> {selectedConvention.stageTitle}</p>
                        <p><strong>Période:</strong> {selectedConvention.startDate} - {selectedConvention.endDate}</p>
                        <p><strong>Horaires:</strong> {selectedConvention.workSchedule}</p>
                        {selectedConvention.salary && (
                          <p><strong>Salaire:</strong> {selectedConvention.salary}€/mois</p>
                        )}
                        <p><strong>Assurance:</strong> {selectedConvention.insurance}</p>
                        
                        <h6 className="text-primary mb-3">Statut</h6>
                        <div className="mb-2">{getStatusBadge(selectedConvention.status)}</div>
                        <div className="mb-2">
                          <strong>Signatures:</strong> {selectedConvention.signatures.filter(s => s.status === 'signed').length}/{selectedConvention.signatures.length}
                        </div>
                        <div className="progress mb-3">
                          <div 
                            className="progress-bar bg-success"
                            style={{ 
                              width: `${(selectedConvention.signatures.filter(s => s.status === 'signed').length / selectedConvention.signatures.length) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Signatures */}
                  {activeTab === 'signatures' && (
                    <div>
                      <h6 className="text-primary mb-3">État des signatures</h6>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Rôle</th>
                              <th>Nom</th>
                              <th>Date</th>
                              <th>Statut</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedConvention.signatures.map((signature) => (
                              <tr key={signature.id}>
                                <td>
                                  <span className={`badge ${
                                    signature.role === 'student' ? 'bg-primary' :
                                    signature.role === 'enterprise' ? 'bg-success' :
                                    signature.role === 'university' ? 'bg-info' : 'bg-warning'
                                  }`}>
                                    {signature.role === 'student' ? 'Étudiant' :
                                     signature.role === 'enterprise' ? 'Entreprise' :
                                     signature.role === 'university' ? 'Université' : 'Responsable'}
                                  </span>
                                </td>
                                <td><strong>{signature.name}</strong></td>
                                <td>
                                  {signature.date ? signature.date : <span className="text-muted">En attente</span>}
                                </td>
                                <td>{getSignatureStatusBadge(signature.status)}</td>
                                <td>
                                  {signature.status === 'pending' && (
                                    <button className="btn btn-sm btn-outline-success">
                                      <i className="fas fa-signature me-1"></i>Signer
                                    </button>
                                  )}
                                  {signature.status === 'signed' && (
                                    <button className="btn btn-sm btn-outline-info">
                                      <i className="fas fa-eye me-1"></i>Voir
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">Documents associés</h6>
                        <button className="btn btn-primary btn-sm">
                          <i className="fas fa-upload me-2"></i>Ajouter document
                        </button>
                      </div>
                      {selectedConvention.documents.length === 0 ? (
                        <p className="text-muted">Aucun document associé.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Nom</th>
                                <th>Type</th>
                                <th>Taille</th>
                                <th>Ajouté le</th>
                                <th>Par</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedConvention.documents.map((document) => (
                                <tr key={document.id}>
                                  <td><strong>{document.name}</strong></td>
                                  <td>
                                    <span className={`badge ${
                                      document.type === 'convention' ? 'bg-primary' :
                                      document.type === 'annexe' ? 'bg-success' :
                                      document.type === 'attestation' ? 'bg-info' : 'bg-secondary'
                                    }`}>
                                      {document.type}
                                    </span>
                                  </td>
                                  <td>{document.size}</td>
                                  <td>{document.uploadedAt}</td>
                                  <td>{document.uploadedBy}</td>
                                  <td>
                                    <div className="btn-group" role="group">
                                      <button className="btn btn-sm btn-outline-primary" title="Télécharger">
                                        <i className="fas fa-download"></i>
                                      </button>
                                      <button className="btn btn-sm btn-outline-warning" title="Modifier">
                                        <i className="fas fa-edit"></i>
                                      </button>
                                      <button className="btn btn-sm btn-outline-danger" title="Supprimer">
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
                  )}

                  {/* Onglet Détails */}
                  {activeTab === 'details' && (
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">Objectifs du stage</h6>
                        <ul className="list-group list-group-flush">
                          {selectedConvention.objectives.map((objective, index) => (
                            <li key={index} className="list-group-item">
                              <i className="fas fa-check text-success me-2"></i>{objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary mb-3">Tâches principales</h6>
                        <ul className="list-group list-group-flush">
                          {selectedConvention.tasks.map((task, index) => (
                            <li key={index} className="list-group-item">
                              <i className="fas fa-tasks text-info me-2"></i>{task}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-12 mt-4">
                        <h6 className="text-primary mb-3">Critères d'évaluation</h6>
                        <div className="row">
                          {selectedConvention.evaluationCriteria.map((criterion, index) => (
                            <div key={index} className="col-md-6 mb-2">
                              <span className="badge bg-light text-dark me-2">{index + 1}</span>
                              {criterion}
                            </div>
                          ))}
                        </div>
                      </div>
                      {selectedConvention.notes && (
                        <div className="col-12 mt-4">
                          <h6 className="text-primary mb-3">Notes</h6>
                          <div className="card">
                            <div className="card-body">
                              <p className="mb-0">{selectedConvention.notes}</p>
                            </div>
                          </div>
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
                <button className="btn btn-primary">
                  <i className="fas fa-download me-2"></i>Télécharger la convention
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Convention */}
      {showConventionModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Nouvelle convention
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowConventionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Étudiant *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un étudiant</option>
                        <option value="2024001">Jean Dupont - Master Informatique</option>
                        <option value="2024002">Marie Martin - Master Marketing</option>
                      </select>
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
                      <label className="form-label">Stage *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un stage</option>
                        <option value="1">Développeur Web Full-Stack</option>
                        <option value="2">Assistant Marketing Digital</option>
                        <option value="3">Data Analyst</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tuteur *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un tuteur</option>
                        <option value="1">Dr. Dupont</option>
                        <option value="2">Dr. Moreau</option>
                        <option value="3">Dr. Petit</option>
                      </select>
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
                      <label className="form-label">Horaires de travail *</label>
                      <input type="text" className="form-control" placeholder="ex: 35h/semaine" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Lieu de stage *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Objectifs du stage</label>
                      <textarea className="form-control" rows="3" placeholder="Un objectif par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Tâches principales</label>
                      <textarea className="form-control" rows="3" placeholder="Une tâche par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Critères d'évaluation</label>
                      <textarea className="form-control" rows="3" placeholder="Un critère par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Notes</label>
                      <textarea className="form-control" rows="2"></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowConventionModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Créer la convention
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conventions; 