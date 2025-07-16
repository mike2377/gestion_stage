import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Convention {
  id: number;
  idEtudiant: string;
  nomEtudiant: string;
  photoEtudiant?: string;
  idEntreprise: number;
  nomEntreprise: string;
  logoEntreprise?: string;
  titreStage: string;
  dateDebut: string;
  dateFin: string;
  statut: 'brouillon' | 'en_attente' | 'approuvee' | 'rejetee' | 'signee';
  encadrant: string;
  tuteur: string;
  programme: string;
  annee: number;
  remuneration?: number;
  lieu: string;
  dateSoumission: string;
  dateRevue?: string;
  dateSignature?: string;
  commentaires?: string;
  documents: Document[];
  exigences: string[];
}

interface Document {
  id: number;
  nom: string;
  type: string;
  dateDepot: string;
  statut: string;
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
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        idEntreprise: 1,
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        titreStage: 'Développeur Web Full-Stack',
        dateDebut: '01/03/2024',
        dateFin: '31/08/2024',
        statut: 'approuvee',
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        remuneration: 800,
        lieu: 'Paris',
        dateSoumission: '15/02/2024',
        dateRevue: '20/02/2024',
        dateSignature: '25/02/2024',
        commentaires: 'Convention conforme aux exigences académiques',
        exigences: ['Master Informatique', 'Connaissances React/Node.js', 'Anglais courant'],
        documents: [
          {
            id: 1,
            nom: 'Convention_stage_Jean_Dupont.pdf',
            type: 'Convention',
            dateDepot: '15/02/2024',
            statut: 'Approuvé',
            url: '/api/documents/convention-1.pdf'
          },
          {
            id: 2,
            nom: 'Annexe_technique_Jean_Dupont.pdf',
            type: 'Annexe',
            dateDepot: '15/02/2024',
            statut: 'Approuvé',
            url: '/api/documents/annexe-1.pdf'
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
        dateDebut: '01/04/2024',
        dateFin: '31/07/2024',
        statut: 'en_attente',
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        programme: 'Master Marketing',
        annee: 2,
        remuneration: 700,
        lieu: 'Lyon',
        dateSoumission: '20/03/2024',
        exigences: ['Master Marketing', 'Expérience réseaux sociaux', 'Créativité'],
        documents: [
          {
            id: 3,
            nom: 'Convention_stage_Marie_Martin.pdf',
            type: 'Convention',
            dateDepot: '20/03/2024',
            statut: 'En attente',
            url: '/api/documents/convention-2.pdf'
          }
        ]
      },
      {
        id: 3,
        idEtudiant: '2024003',
        nomEtudiant: 'Pierre Durand',
        photoEtudiant: '/api/photos/student-3.jpg',
        idEntreprise: 3,
        nomEntreprise: 'DataCorp',
        logoEntreprise: '/api/logos/datacorp-logo.png',
        titreStage: 'Data Analyst',
        dateDebut: '01/06/2024',
        dateFin: '31/12/2024',
        statut: 'brouillon',
        encadrant: 'M. Bernard',
        tuteur: 'Dr. Petit',
        programme: 'Master Data Science',
        annee: 2,
        remuneration: 750,
        lieu: 'Marseille',
        dateSoumission: '01/05/2024',
        exigences: ['Master Statistiques/Informatique', 'Python/R', 'SQL'],
        documents: [
          {
            id: 4,
            nom: 'Convention_stage_Pierre_Durand.pdf',
            type: 'Convention',
            dateDepot: '01/05/2024',
            statut: 'Brouillon',
            url: '/api/documents/convention-3.pdf'
          }
        ]
      },
      {
        id: 4,
        idEtudiant: '2024004',
        nomEtudiant: 'Sophie Bernard',
        photoEtudiant: '/api/photos/student-4.jpg',
        idEntreprise: 4,
        nomEntreprise: 'DesignStudio',
        logoEntreprise: '/api/logos/designstudio-logo.png',
        titreStage: 'UX/UI Designer',
        dateDebut: '01/09/2024',
        dateFin: '28/02/2025',
        statut: 'rejetee',
        encadrant: 'Mme. Laurent',
        tuteur: 'Dr. Roux',
        programme: 'Master Design',
        annee: 2,
        remuneration: 650,
        lieu: 'Toulouse',
        dateSoumission: '15/04/2024',
        dateRevue: '20/04/2024',
        commentaires: 'Convention rejetée - conditions de travail non conformes',
        exigences: ['Master Design/Arts', 'Portfolio', 'Outils design'],
        documents: [
          {
            id: 5,
            nom: 'Convention_stage_Sophie_Bernard.pdf',
            type: 'Convention',
            dateDepot: '15/04/2024',
            statut: 'Rejeté',
            url: '/api/documents/convention-4.pdf'
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
        dateDebut: '01/05/2024',
        dateFin: '31/10/2024',
        statut: 'signee',
        encadrant: 'M. Durand',
        tuteur: 'Dr. Simon',
        programme: 'Master Informatique',
        annee: 2,
        remuneration: 800,
        lieu: 'Bordeaux',
        dateSoumission: '10/04/2024',
        dateRevue: '15/04/2024',
        dateSignature: '20/04/2024',
        commentaires: 'Convention signée et validée',
        exigences: ['Master Informatique', 'React Native', 'Swift'],
        documents: [
          {
            id: 6,
            nom: 'Convention_stage_Lucas_Moreau.pdf',
            type: 'Convention',
            dateDepot: '10/04/2024',
            statut: 'Signé',
            url: '/api/documents/convention-5.pdf'
          },
          {
            id: 7,
            nom: 'Convention_signee_Lucas_Moreau.pdf',
            type: 'Convention signée',
            dateDepot: '20/04/2024',
            statut: 'Validé',
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
      filtered = filtered.filter(convention => convention.statut === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(convention => convention.programme === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(convention => convention.annee.toString() === newFilters.year);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(convention => convention.idEntreprise.toString() === newFilters.enterprise);
    }

    setFilteredConventions(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      brouillon: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      en_attente: { class: 'bg-warning', text: 'En attente', icon: 'fas fa-clock' },
      approuvee: { class: 'bg-success', text: 'Approuvée', icon: 'fas fa-check' },
      rejetee: { class: 'bg-danger', text: 'Rejetée', icon: 'fas fa-times' },
      signee: { class: 'bg-primary', text: 'Signée', icon: 'fas fa-signature' }
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
    return conventions.filter(convention => convention.statut === status).length;
  };

  const handleStatusChange = (conventionId: number, newStatus: string) => {
    setConventions(prev => 
      prev.map(convention => 
        convention.id === conventionId ? { ...convention, statut: newStatus as any } : convention
      )
    );
    setFilteredConventions(prev => 
      prev.map(convention => 
        convention.id === conventionId ? { ...convention, statut: newStatus as any } : convention
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
                        <h4 className="mb-0">{getStatusCount('en_attente')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('approuvee') + getStatusCount('signee')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('rejetee')}</h4>
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
                      <option value="brouillon">Brouillon</option>
                      <option value="en_attente">En attente</option>
                      <option value="approuvee">Approuvée</option>
                      <option value="rejetee">Rejetée</option>
                      <option value="signee">Signée</option>
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
                                  src={convention.photoEtudiant || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{convention.nomEtudiant}</strong><br />
                                  <small className="text-muted">{convention.programme} - {convention.annee}</small><br />
                                  <small className="text-muted">ID: {convention.idEtudiant}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{convention.titreStage}</strong><br />
                              <small className="text-muted">{convention.lieu}</small><br />
                              {convention.remuneration && (
                                <small className="text-muted">{convention.remuneration}€/mois</small>
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={convention.logoEntreprise || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{convention.nomEntreprise}</strong><br />
                                  <small className="text-muted">{convention.encadrant}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              {convention.dateDebut} - {convention.dateFin}
                            </td>
                            <td>{getStatusBadge(convention.statut)}</td>
                            <td>
                              {convention.dateSoumission}<br />
                              {convention.dateRevue && (
                                <small className="text-muted">Révisée: {convention.dateRevue}</small>
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
                                {convention.statut === 'en_attente' && (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-outline-success"
                                      title="Approuver"
                                      onClick={() => handleStatusChange(convention.id, 'approuvee')}
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
                  Détails de la convention - {selectedConvention.nomEtudiant}
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
                            <p><strong>Nom:</strong> {selectedConvention.nomEtudiant}</p>
                            <p><strong>ID Étudiant:</strong> {selectedConvention.idEtudiant}</p>
                            <p><strong>Programme:</strong> {selectedConvention.programme}</p>
                            <p><strong>Année:</strong> {selectedConvention.annee}</p>
                            <p><strong>Tuteur:</strong> {selectedConvention.tuteur}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations stage</h6>
                            <p><strong>Stage:</strong> {selectedConvention.titreStage}</p>
                            <p><strong>Entreprise:</strong> {selectedConvention.nomEntreprise}</p>
                            <p><strong>Localisation:</strong> {selectedConvention.lieu}</p>
                            <p><strong>Période:</strong> {selectedConvention.dateDebut} - {selectedConvention.dateFin}</p>
                            <p><strong>Encadrant:</strong> {selectedConvention.encadrant}</p>
                            {selectedConvention.remuneration && (
                              <p><strong>Rémunération:</strong> {selectedConvention.remuneration}€/mois</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <h6 className="text-primary mb-3">Prérequis</h6>
                          <ul className="list-unstyled">
                            {selectedConvention.exigences.map((exigence, index) => (
                              <li key={index}><i className="fas fa-check text-success me-2"></i>{exigence}</li>
                            ))}
                          </ul>
                        </div>

                        {selectedConvention.commentaires && (
                          <div className="mt-4">
                            <h6 className="text-primary mb-3">Commentaires</h6>
                            <p>{selectedConvention.commentaires}</p>
                          </div>
                        )}
                      </div>
                      <div className="col-md-4">
                        <div className="card">
                          <div className="card-body">
                            <h6>Statut et dates</h6>
                            <div className="mb-3">
                              <strong>Statut:</strong> {getStatusBadge(selectedConvention.statut)}
                            </div>
                            <div className="mb-3">
                              <strong>Soumission:</strong> {selectedConvention.dateSoumission}
                            </div>
                            {selectedConvention.dateRevue && (
                              <div className="mb-3">
                                <strong>Révision:</strong> {selectedConvention.dateRevue}
                              </div>
                            )}
                            {selectedConvention.dateSignature && (
                              <div className="mb-3">
                                <strong>Signature:</strong> {selectedConvention.dateSignature}
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
                {selectedConvention.statut === 'en_attente' && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => handleStatusChange(selectedConvention.id, 'approuvee')}
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
                <p>Convention de {selectedConvention.nomEtudiant} - {selectedConvention.titreStage}</p>
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
                    handleStatusChange(selectedConvention.id, 'rejetee');
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