import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Application {
  id: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  studentPhoto?: string;
  stageTitle: string;
  stageId: number;
  applicationDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'interviewed';
  priority: 'low' | 'medium' | 'high';
  cvUrl: string;
  coverLetterUrl?: string;
  additionalDocuments?: string[];
  studentProgram: string;
  studentYear: number;
  studentUniversity: string;
  studentSkills: string[];
  studentLanguages: string[];
  notes?: string;
  interviewDate?: string;
  evaluation?: number;
  comments?: string;
}

const Candidatures: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    stage: '',
    priority: '',
    keywords: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Données simulées
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: 1,
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentEmail: 'jean.dupont@email.com',
        studentPhone: '06 12 34 56 78',
        studentPhoto: '/api/photos/student-1.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        stageId: 1,
        applicationDate: '20/01/2024',
        status: 'reviewed',
        priority: 'high',
        cvUrl: '/api/documents/cv-jean-dupont.pdf',
        coverLetterUrl: '/api/documents/lettre-jean-dupont.pdf',
        additionalDocuments: ['portfolio-jean-dupont.pdf'],
        studentProgram: 'Master Informatique',
        studentYear: 2,
        studentUniversity: 'Université de Paris',
        studentSkills: ['React', 'Node.js', 'MongoDB', 'Git', 'Docker'],
        studentLanguages: ['Français (Natif)', 'Anglais (Courant)'],
        notes: 'Profil très intéressant, compétences techniques solides',
        evaluation: 4.5
      },
      {
        id: 2,
        studentId: '2024002',
        studentName: 'Marie Martin',
        studentEmail: 'marie.martin@email.com',
        studentPhone: '06 98 76 54 32',
        studentPhoto: '/api/photos/student-2.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        stageId: 1,
        applicationDate: '18/01/2024',
        status: 'interviewed',
        priority: 'medium',
        cvUrl: '/api/documents/cv-marie-martin.pdf',
        coverLetterUrl: '/api/documents/lettre-marie-martin.pdf',
        studentProgram: 'Master Informatique',
        studentYear: 2,
        studentUniversity: 'Université de Lyon',
        studentSkills: ['React', 'Vue.js', 'Python', 'SQL'],
        studentLanguages: ['Français (Natif)', 'Anglais (Courant)', 'Espagnol (Intermédiaire)'],
        interviewDate: '25/01/2024',
        notes: 'Entretien positif, bonne motivation',
        evaluation: 4.2
      },
      {
        id: 3,
        studentId: '2024003',
        studentName: 'Pierre Durand',
        studentEmail: 'pierre.durand@email.com',
        studentPhone: '06 11 22 33 44',
        studentPhoto: '/api/photos/student-3.jpg',
        stageTitle: 'Assistant Marketing Digital',
        stageId: 2,
        applicationDate: '22/01/2024',
        status: 'pending',
        priority: 'low',
        cvUrl: '/api/documents/cv-pierre-durand.pdf',
        studentProgram: 'Master Marketing',
        studentYear: 1,
        studentUniversity: 'Université de Marseille',
        studentSkills: ['Marketing Digital', 'SEO', 'Réseaux sociaux'],
        studentLanguages: ['Français (Natif)', 'Anglais (Intermédiaire)']
      },
      {
        id: 4,
        studentId: '2024004',
        studentName: 'Sophie Bernard',
        studentEmail: 'sophie.bernard@email.com',
        studentPhone: '06 55 66 77 88',
        studentPhoto: '/api/photos/student-4.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        stageId: 1,
        applicationDate: '15/01/2024',
        status: 'accepted',
        priority: 'high',
        cvUrl: '/api/documents/cv-sophie-bernard.pdf',
        coverLetterUrl: '/api/documents/lettre-sophie-bernard.pdf',
        additionalDocuments: ['projet-react-sophie.pdf'],
        studentProgram: 'Master Informatique',
        studentYear: 2,
        studentUniversity: 'Université de Toulouse',
        studentSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        studentLanguages: ['Français (Natif)', 'Anglais (Courant)'],
        notes: 'Excellente candidate, acceptée pour le stage',
        evaluation: 4.8
      },
      {
        id: 5,
        studentId: '2024005',
        studentName: 'Lucas Moreau',
        studentEmail: 'lucas.moreau@email.com',
        studentPhone: '06 99 88 77 66',
        studentPhoto: '/api/photos/student-5.jpg',
        stageTitle: 'Assistant Marketing Digital',
        stageId: 2,
        applicationDate: '19/01/2024',
        status: 'rejected',
        priority: 'low',
        cvUrl: '/api/documents/cv-lucas-moreau.pdf',
        studentProgram: 'Licence Commerce',
        studentYear: 3,
        studentUniversity: 'Université de Bordeaux',
        studentSkills: ['Excel', 'PowerPoint', 'Réseaux sociaux'],
        studentLanguages: ['Français (Natif)'],
        notes: 'Profil ne correspond pas aux exigences du poste',
        evaluation: 2.5
      }
    ];
    setApplications(mockApplications);
    setFilteredApplications(mockApplications);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = applications;

    if (newFilters.status) {
      filtered = filtered.filter(app => app.status === newFilters.status);
    }
    if (newFilters.stage) {
      filtered = filtered.filter(app => app.stageId.toString() === newFilters.stage);
    }
    if (newFilters.priority) {
      filtered = filtered.filter(app => app.priority === newFilters.priority);
    }
    if (newFilters.keywords) {
      const keywords = newFilters.keywords.toLowerCase();
      filtered = filtered.filter(app => 
        app.studentName.toLowerCase().includes(keywords) ||
        app.studentEmail.toLowerCase().includes(keywords) ||
        app.stageTitle.toLowerCase().includes(keywords) ||
        app.studentSkills.some(skill => skill.toLowerCase().includes(keywords))
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente', icon: 'fas fa-clock' },
      reviewed: { class: 'bg-info', text: 'Examinée', icon: 'fas fa-eye' },
      interviewed: { class: 'bg-warning', text: 'Entretien', icon: 'fas fa-comments' },
      accepted: { class: 'bg-success', text: 'Acceptée', icon: 'fas fa-check' },
      rejected: { class: 'bg-danger', text: 'Refusée', icon: 'fas fa-times' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { class: 'bg-success', text: 'Faible' },
      medium: { class: 'bg-warning', text: 'Moyenne' },
      high: { class: 'bg-danger', text: 'Élevée' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  const handleStatusChange = (applicationId: number, newStatus: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus as any } : app
      )
    );
    setFilteredApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus as any } : app
      )
    );
  };

  const user = {
    role: 'enterprise',
    firstName: 'TechCorp',
    lastName: 'Admin'
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
                  <i className="fas fa-users me-2 text-primary"></i>
                  Candidatures
                </h1>
                <p className="text-muted mb-0">
                  Gérez les candidatures reçues pour vos offres de stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-filter me-2"></i>Filtres avancés
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
                        <h4 className="mb-0">{applications.length}</h4>
                        <p className="mb-0">Total candidatures</p>
                      </div>
                      <i className="fas fa-users fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-secondary text-white">
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
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('interviewed')}</h4>
                        <p className="mb-0">Entretiens</p>
                      </div>
                      <i className="fas fa-comments fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('accepted')}</h4>
                        <p className="mb-0">Acceptées</p>
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
                      <option value="reviewed">Examinée</option>
                      <option value="interviewed">Entretien</option>
                      <option value="accepted">Acceptée</option>
                      <option value="rejected">Refusée</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Offre de stage</label>
                    <select 
                      className="form-select"
                      value={filters.stage}
                      onChange={(e) => handleFilterChange('stage', e.target.value)}
                    >
                      <option value="">Toutes les offres</option>
                      <option value="1">Développeur Web Full-Stack</option>
                      <option value="2">Assistant Marketing Digital</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Priorité</label>
                    <select 
                      className="form-select"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="">Toutes les priorités</option>
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', stage: '', priority: '', keywords: '' });
                        setFilteredApplications(applications);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Rechercher par nom, email, compétences..."
                        value={filters.keywords}
                        onChange={(e) => handleFilterChange('keywords', e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des candidatures */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Candidatures ({filteredApplications.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune candidature trouvée</h5>
                    <p className="text-muted">Aucune candidature ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Candidat</th>
                          <th>Offre</th>
                          <th>Date de candidature</th>
                          <th>Statut</th>
                          <th>Priorité</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplications.map((application) => (
                          <tr key={application.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={application.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{application.studentName}</strong><br />
                                  <small className="text-muted">{application.studentEmail}</small><br />
                                  <small className="text-muted">{application.studentProgram} - {application.studentUniversity}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{application.stageTitle}</strong><br />
                              <small className="text-muted">ID: {application.studentId}</small>
                            </td>
                            <td>{application.applicationDate}</td>
                            <td>{getStatusBadge(application.status)}</td>
                            <td>{getPriorityBadge(application.priority)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Accepter"
                                  onClick={() => handleStatusChange(application.id, 'accepted')}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Programmer entretien"
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setShowInterviewModal(true);
                                  }}
                                >
                                  <i className="fas fa-calendar"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  title="Refuser"
                                  onClick={() => handleStatusChange(application.id, 'rejected')}
                                >
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
            </div>
          </div>
        </div>
      </div>

      {/* Modal Détails Candidature */}
      {showDetailsModal && selectedApplication && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  Détails de la candidature
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img 
                      src={selectedApplication.studentPhoto || '/default-avatar.png'} 
                      alt="Photo"
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <h5>{selectedApplication.studentName}</h5>
                    <p className="text-muted">{selectedApplication.studentEmail}</p>
                    <p className="text-muted">{selectedApplication.studentPhone}</p>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">Informations académiques</h6>
                    <p><strong>Programme:</strong> {selectedApplication.studentProgram}</p>
                    <p><strong>Année:</strong> {selectedApplication.studentYear}</p>
                    <p><strong>Université:</strong> {selectedApplication.studentUniversity}</p>
                    <p><strong>ID Étudiant:</strong> {selectedApplication.studentId}</p>

                    <h6 className="text-primary mb-3 mt-4">Compétences</h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {selectedApplication.studentSkills.map((skill, index) => (
                        <span key={index} className="badge bg-primary">{skill}</span>
                      ))}
                    </div>

                    <h6 className="text-primary mb-3">Langues</h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {selectedApplication.studentLanguages.map((language, index) => (
                        <span key={index} className="badge bg-info">{language}</span>
                      ))}
                    </div>

                    <h6 className="text-primary mb-3">Documents</h6>
                    <div className="list-group">
                      <a href={selectedApplication.cvUrl} className="list-group-item list-group-item-action" target="_blank">
                        <i className="fas fa-file-pdf text-danger me-2"></i>CV
                      </a>
                      {selectedApplication.coverLetterUrl && (
                        <a href={selectedApplication.coverLetterUrl} className="list-group-item list-group-item-action" target="_blank">
                          <i className="fas fa-file-word text-primary me-2"></i>Lettre de motivation
                        </a>
                      )}
                      {selectedApplication.additionalDocuments?.map((doc, index) => (
                        <a key={index} href={`/api/documents/${doc}`} className="list-group-item list-group-item-action" target="_blank">
                          <i className="fas fa-file me-2"></i>{doc}
                        </a>
                      ))}
                    </div>

                    {selectedApplication.notes && (
                      <>
                        <h6 className="text-primary mb-3 mt-4">Notes</h6>
                        <p>{selectedApplication.notes}</p>
                      </>
                    )}

                    {selectedApplication.evaluation && (
                      <>
                        <h6 className="text-primary mb-3">Évaluation</h6>
                        <div className="d-flex align-items-center">
                          <span className="me-2">{selectedApplication.evaluation}/5</span>
                          <div className="d-flex">
                            {[...Array(5)].map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < Math.floor(selectedApplication.evaluation!) ? 'text-warning' : 'text-muted'}`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
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
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => handleStatusChange(selectedApplication.id, 'accepted')}
                >
                  <i className="fas fa-check me-2"></i>Accepter
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowInterviewModal(true);
                  }}
                >
                  <i className="fas fa-calendar me-2"></i>Programmer entretien
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Entretien */}
      {showInterviewModal && selectedApplication && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-calendar me-2"></i>
                  Programmer un entretien
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowInterviewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Candidat:</strong> {selectedApplication.studentName}</p>
                <p><strong>Offre:</strong> {selectedApplication.stageTitle}</p>
                
                <form>
                  <div className="mb-3">
                    <label className="form-label">Date et heure *</label>
                    <input type="datetime-local" className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type d'entretien</label>
                    <select className="form-select">
                      <option value="video">Visioconférence</option>
                      <option value="phone">Téléphone</option>
                      <option value="onsite">Sur site</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Lien/Adresse</label>
                    <input type="text" className="form-control" placeholder="Lien Zoom, adresse..." />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" rows="3" placeholder="Informations supplémentaires..."></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowInterviewModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-calendar-plus me-2"></i>Programmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidatures; 