import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Convention {
  id: number;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  enterpriseId: number;
  enterpriseName: string;
  enterpriseLogo?: string;
  stageTitle: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'signed';
  supervisor: string;
  tutor: string;
  program: string;
  year: number;
  salary?: number;
  location: string;
  submittedDate: string;
  reviewedDate?: string;
  signedDate?: string;
  comments?: string;
  documents: Document[];
  requirements: string[];
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
  url: string;
}

const Conventions: React.FC = () => {
  const [conventions, setConventions] = useState<Convention[]>([]);
  const [filteredConventions, setFilteredConventions] = useState<Convention[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    year: '',
    enterprise: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockConventions: Convention[] = [
      {
        id: 1,
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        enterpriseId: 1,
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        stageTitle: 'Développeur Web Full-Stack',
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        status: 'approved',
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        program: 'Master Informatique',
        year: 2,
        salary: 800,
        location: 'Paris',
        submittedDate: '15/02/2024',
        reviewedDate: '20/02/2024',
        signedDate: '25/02/2024',
        comments: 'Convention conforme aux exigences académiques',
        requirements: ['Master Informatique', 'Connaissances React/Node.js', 'Anglais courant'],
        documents: [
          {
            id: 1,
            name: 'Convention_stage_Jean_Dupont.pdf',
            type: 'Convention',
            uploadDate: '15/02/2024',
            status: 'Approuvé',
            url: '/api/documents/convention-1.pdf'
          },
          {
            id: 2,
            name: 'Annexe_technique_Jean_Dupont.pdf',
            type: 'Annexe',
            uploadDate: '15/02/2024',
            status: 'Approuvé',
            url: '/api/documents/annexe-1.pdf'
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
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        status: 'pending',
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        program: 'Master Marketing',
        year: 2,
        salary: 700,
        location: 'Lyon',
        submittedDate: '20/03/2024',
        requirements: ['Master Marketing', 'Expérience réseaux sociaux', 'Créativité'],
        documents: [
          {
            id: 3,
            name: 'Convention_stage_Marie_Martin.pdf',
            type: 'Convention',
            uploadDate: '20/03/2024',
            status: 'En attente',
            url: '/api/documents/convention-2.pdf'
          }
        ]
      },
      {
        id: 3,
        studentId: '2024003',
        studentName: 'Pierre Durand',
        studentPhoto: '/api/photos/student-3.jpg',
        enterpriseId: 3,
        enterpriseName: 'DataCorp',
        enterpriseLogo: '/api/logos/datacorp-logo.png',
        stageTitle: 'Data Analyst',
        startDate: '01/06/2024',
        endDate: '31/12/2024',
        status: 'draft',
        supervisor: 'M. Bernard',
        tutor: 'Dr. Petit',
        program: 'Master Data Science',
        year: 2,
        salary: 750,
        location: 'Marseille',
        submittedDate: '01/05/2024',
        requirements: ['Master Statistiques/Informatique', 'Python/R', 'SQL'],
        documents: [
          {
            id: 4,
            name: 'Convention_stage_Pierre_Durand.pdf',
            type: 'Convention',
            uploadDate: '01/05/2024',
            status: 'Brouillon',
            url: '/api/documents/convention-3.pdf'
          }
        ]
      },
      {
        id: 4,
        studentId: '2024004',
        studentName: 'Sophie Bernard',
        studentPhoto: '/api/photos/student-4.jpg',
        enterpriseId: 4,
        enterpriseName: 'DesignStudio',
        enterpriseLogo: '/api/logos/designstudio-logo.png',
        stageTitle: 'UX/UI Designer',
        startDate: '01/09/2024',
        endDate: '28/02/2025',
        status: 'rejected',
        supervisor: 'Mme. Laurent',
        tutor: 'Dr. Roux',
        program: 'Master Design',
        year: 2,
        salary: 650,
        location: 'Toulouse',
        submittedDate: '15/04/2024',
        reviewedDate: '20/04/2024',
        comments: 'Convention rejetée - conditions de travail non conformes',
        requirements: ['Master Design/Arts', 'Portfolio', 'Outils design'],
        documents: [
          {
            id: 5,
            name: 'Convention_stage_Sophie_Bernard.pdf',
            type: 'Convention',
            uploadDate: '15/04/2024',
            status: 'Rejeté',
            url: '/api/documents/convention-4.pdf'
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
        startDate: '01/05/2024',
        endDate: '31/10/2024',
        status: 'signed',
        supervisor: 'M. Durand',
        tutor: 'Dr. Simon',
        program: 'Master Informatique',
        year: 2,
        salary: 800,
        location: 'Bordeaux',
        submittedDate: '10/04/2024',
        reviewedDate: '15/04/2024',
        signedDate: '20/04/2024',
        comments: 'Convention signée et validée',
        requirements: ['Master Informatique', 'React Native', 'Swift'],
        documents: [
          {
            id: 6,
            name: 'Convention_stage_Lucas_Moreau.pdf',
            type: 'Convention',
            uploadDate: '10/04/2024',
            status: 'Signé',
            url: '/api/documents/convention-5.pdf'
          },
          {
            id: 7,
            name: 'Convention_signee_Lucas_Moreau.pdf',
            type: 'Convention signée',
            uploadDate: '20/04/2024',
            status: 'Validé',
            url: '/api/documents/convention-signed-5.pdf'
          }
        ]
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
    if (newFilters.program) {
      filtered = filtered.filter(convention => convention.program === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(convention => convention.year.toString() === newFilters.year);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(convention => convention.enterpriseId.toString() === newFilters.enterprise);
    }

    setFilteredConventions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      pending: { class: 'bg-warning', text: 'En attente', icon: 'fas fa-clock' },
      approved: { class: 'bg-success', text: 'Approuvée', icon: 'fas fa-check' },
      rejected: { class: 'bg-danger', text: 'Rejetée', icon: 'fas fa-times' },
      signed: { class: 'bg-primary', text: 'Signée', icon: 'fas fa-signature' }
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
    return conventions.filter(convention => convention.status === status).length;
  };

  const handleStatusChange = (conventionId: number, newStatus: string) => {
    setConventions(prev => 
      prev.map(convention => 
        convention.id === conventionId ? { ...convention, status: newStatus as any } : convention
      )
    );
    setFilteredConventions(prev => 
      prev.map(convention => 
        convention.id === conventionId ? { ...convention, status: newStatus as any } : convention
      )
    );
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
                  <i className="fas fa-file-contract me-2 text-primary"></i>
                  Conventions de Stage
                </h1>
                <p className="text-muted mb-0">
                  Gérez et validez les conventions de stage de vos étudiants
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
                        <h4 className="mb-0">{conventions.length}</h4>
                        <p className="mb-0">Total conventions</p>
                      </div>
                      <i className="fas fa-file-contract fa-2x opacity-50"></i>
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
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('approved') + getStatusCount('signed')}</h4>
                        <p className="mb-0">Approuvées</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('rejected')}</h4>
                        <p className="mb-0">Rejetées</p>
                      </div>
                      <i className="fas fa-times-circle fa-2x opacity-50"></i>
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
                      <option value="rejected">Rejetée</option>
                      <option value="signed">Signée</option>
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
                        setFilteredConventions(conventions);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
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
                          <th>Étudiant</th>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Période</th>
                          <th>Statut</th>
                          <th>Date soumission</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredConventions.map((convention) => (
                          <tr key={convention.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={convention.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{convention.studentName}</strong><br />
                                  <small className="text-muted">{convention.program} - {convention.year}</small><br />
                                  <small className="text-muted">ID: {convention.studentId}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{convention.stageTitle}</strong><br />
                              <small className="text-muted">{convention.location}</small><br />
                              {convention.salary && (
                                <small className="text-muted">{convention.salary}€/mois</small>
                              )}
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
                              {convention.startDate} - {convention.endDate}
                            </td>
                            <td>{getStatusBadge(convention.status)}</td>
                            <td>
                              {convention.submittedDate}<br />
                              {convention.reviewedDate && (
                                <small className="text-muted">Révisée: {convention.reviewedDate}</small>
                              )}
                            </td>
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
                                {convention.status === 'pending' && (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-outline-success"
                                      title="Approuver"
                                      onClick={() => handleStatusChange(convention.id, 'approved')}
                                    >
                                      <i className="fas fa-check"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      title="Rejeter"
                                      onClick={() => {
                                        setSelectedConvention(convention);
                                        setShowReviewModal(true);
                                      }}
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </>
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

      {/* Modal Détails Convention */}
      {showDetailsModal && selectedConvention && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-contract me-2"></i>
                  Détails de la convention - {selectedConvention.studentName}
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
                            <p><strong>Nom:</strong> {selectedConvention.studentName}</p>
                            <p><strong>ID Étudiant:</strong> {selectedConvention.studentId}</p>
                            <p><strong>Programme:</strong> {selectedConvention.program}</p>
                            <p><strong>Année:</strong> {selectedConvention.year}</p>
                            <p><strong>Tuteur:</strong> {selectedConvention.tutor}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations stage</h6>
                            <p><strong>Stage:</strong> {selectedConvention.stageTitle}</p>
                            <p><strong>Entreprise:</strong> {selectedConvention.enterpriseName}</p>
                            <p><strong>Localisation:</strong> {selectedConvention.location}</p>
                            <p><strong>Période:</strong> {selectedConvention.startDate} - {selectedConvention.endDate}</p>
                            <p><strong>Superviseur:</strong> {selectedConvention.supervisor}</p>
                            {selectedConvention.salary && (
                              <p><strong>Salaire:</strong> {selectedConvention.salary}€/mois</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-primary mb-3">Prérequis</h6>
                          <ul className="list-unstyled">
                            {selectedConvention.requirements.map((req, index) => (
                              <li key={index}><i className="fas fa-check text-success me-2"></i>{req}</li>
                            ))}
                          </ul>
                        </div>

                        {selectedConvention.comments && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Commentaires</h6>
                            <p>{selectedConvention.comments}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>Statut et dates</h6>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedConvention.status)}
                            </div>
                            <div className="mb-3">
                              <strong>Soumission:</strong> {selectedConvention.submittedDate}
                            </div>
                            {selectedConvention.reviewedDate && (
                              <div className="mb-3">
                                <strong>Révision:</strong> {selectedConvention.reviewedDate}
                              </div>
                            )}
                            {selectedConvention.signedDate && (
                              <div className="mb-3">
                                <strong>Signature:</strong> {selectedConvention.signedDate}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div>
                      <h6 className="text-primary mb-3">Documents de la convention</h6>
                      {selectedConvention.documents.length === 0 ? (
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
                              {selectedConvention.documents.map((doc) => (
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
                {selectedConvention.status === 'pending' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => handleStatusChange(selectedConvention.id, 'approved')}
                    >
                      <i className="fas fa-check me-2"></i>Approuver
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowReviewModal(true);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Rejeter
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet Convention */}
      {showReviewModal && selectedConvention && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-times me-2"></i>Rejeter la convention
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowReviewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Convention de {selectedConvention.studentName} - {selectedConvention.stageTitle}</p>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Motif du rejet *</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      placeholder="Expliquez les raisons du rejet..."
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Recommandations</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Suggestions d'amélioration..."
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
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    handleStatusChange(selectedConvention.id, 'rejected');
                    setShowReviewModal(false);
                  }}
                >
                  <i className="fas fa-times me-2"></i>Rejeter
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