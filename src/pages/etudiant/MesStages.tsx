import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';

interface Stage {
  id: number;
  title: string;
  enterprise: string;
  startDate: string;
  endDate: string;
  status: 'validated' | 'pending' | 'rejected' | 'in_progress' | 'completed';
  description: string;
  location: string;
  salary?: number;
  supervisor?: string;
  tutor?: string;
}

const MesStages: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [filteredStages, setFilteredStages] = useState<Stage[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    enterprise: '',
    year: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Données simulées
  useEffect(() => {
    const mockStages: Stage[] = [
      {
        id: 1,
        title: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        status: 'validated',
        description: 'Développement d\'une application web moderne avec React et Node.js',
        location: 'Paris, France',
        salary: 1200,
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont'
      },
      {
        id: 2,
        title: 'Assistant Marketing Digital',
        enterprise: 'InnovateX',
        startDate: '01/04/2024',
        endDate: '30/09/2024',
        status: 'pending',
        description: 'Gestion des réseaux sociaux et campagnes marketing',
        location: 'Lyon, France',
        salary: 1000,
        supervisor: 'Mme. Dubois'
      },
      {
        id: 3,
        title: 'Analyste de Données',
        enterprise: 'DataPlus',
        startDate: '15/05/2024',
        endDate: '15/11/2024',
        status: 'rejected',
        description: 'Analyse de données et création de rapports',
        location: 'Marseille, France',
        salary: 1100
      },
      {
        id: 4,
        title: 'Développeur Mobile',
        enterprise: 'MobileTech',
        startDate: '01/06/2024',
        endDate: '30/11/2024',
        status: 'in_progress',
        description: 'Développement d\'applications mobiles iOS et Android',
        location: 'Toulouse, France',
        salary: 1300,
        supervisor: 'M. Bernard',
        tutor: 'Dr. Moreau'
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
    if (newFilters.enterprise) {
      filtered = filtered.filter(stage => stage.enterprise === newFilters.enterprise);
    }
    if (newFilters.year) {
      filtered = filtered.filter(stage => {
        const stageYear = new Date(stage.startDate).getFullYear().toString();
        return stageYear === newFilters.year;
      });
    }

    setFilteredStages(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      validated: { class: 'bg-success', text: 'Validé' },
      pending: { class: 'bg-warning', text: 'En attente' },
      rejected: { class: 'bg-danger', text: 'Refusé' },
      in_progress: { class: 'bg-info', text: 'En cours' },
      completed: { class: 'bg-secondary', text: 'Terminé' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return stages.filter(stage => stage.status === status).length;
  };

  const user = {
    role: 'student',
    firstName: 'Jean',
    lastName: 'Dupont'
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
                  Mes Stages
                </h1>
                <p className="text-muted mb-0">
                  Gérez vos candidatures et suivez vos stages
                </p>
              </div>
              <div className="d-flex gap-2">
                <Link to="/stages/search" className="btn btn-primary">
                  <i className="fas fa-search me-2"></i>Rechercher Stages
                </Link>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>Exporter
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
                        <h4 className="mb-0">{getStatusCount('validated')}</h4>
                        <p className="mb-0">Validés</p>
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
                      <i className="fas fa-play fa-2x opacity-50"></i>
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
                      <option value="validated">Validé</option>
                      <option value="pending">En attente</option>
                      <option value="rejected">Refusé</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
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
                      <option value="TechCorp">TechCorp</option>
                      <option value="InnovateX">InnovateX</option>
                      <option value="DataPlus">DataPlus</option>
                      <option value="MobileTech">MobileTech</option>
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
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', enterprise: '', year: '' });
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
                    <Link to="/stages/search" className="btn btn-primary">
                      <i className="fas fa-search me-2"></i>Rechercher des stages
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Période</th>
                          <th>Localisation</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStages.map((stage) => (
                          <tr key={stage.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                  <i className="fas fa-briefcase text-primary"></i>
                                </div>
                                <div>
                                  <strong>{stage.title}</strong>
                                  <br />
                                  <small className="text-muted">{stage.description.substring(0, 50)}...</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.enterprise}</strong>
                                {stage.supervisor && (
                                  <>
                                    <br />
                                    <small className="text-muted">Superviseur: {stage.supervisor}</small>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.startDate} - {stage.endDate}</strong>
                                {stage.salary && (
                                  <>
                                    <br />
                                    <small className="text-muted">{stage.salary}€/mois</small>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <i className="fas fa-map-marker-alt text-muted me-1"></i>
                              {stage.location}
                            </td>
                            <td>{getStatusBadge(stage.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedStage(stage);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir les détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-info"
                                  onClick={() => {
                                    setSelectedStage(stage);
                                    setShowDocumentsModal(true);
                                  }}
                                  title="Documents"
                                >
                                  <i className="fas fa-file-alt"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => {
                                    setSelectedStage(stage);
                                    setShowContactModal(true);
                                  }}
                                  title="Contacter"
                                >
                                  <i className="fas fa-envelope"></i>
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-briefcase me-2"></i>
                  Détails du Stage
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>Informations stage
                    </h6>
                    <p><strong>Intitulé:</strong> {selectedStage.title}</p>
                    <p><strong>Entreprise:</strong> {selectedStage.enterprise}</p>
                    <p><strong>Début:</strong> {selectedStage.startDate}</p>
                    <p><strong>Fin:</strong> {selectedStage.endDate}</p>
                    <p><strong>Localisation:</strong> {selectedStage.location}</p>
                    {selectedStage.salary && (
                      <p><strong>Salaire:</strong> {selectedStage.salary}€/mois</p>
                    )}
                    <p><strong>Statut:</strong> {getStatusBadge(selectedStage.status)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-building me-2"></i>Informations entreprise
                    </h6>
                    <p><strong>Nom:</strong> {selectedStage.enterprise}</p>
                    <p><strong>Contact:</strong> contact@{selectedStage.enterprise.toLowerCase()}.fr</p>
                    <p><strong>Adresse:</strong> {selectedStage.location}</p>
                    {selectedStage.supervisor && (
                      <p><strong>Superviseur:</strong> {selectedStage.supervisor}</p>
                    )}
                    {selectedStage.tutor && (
                      <p><strong>Tuteur:</strong> {selectedStage.tutor}</p>
                    )}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-align-left me-2"></i>Description du stage
                    </h6>
                    <p>{selectedStage.description}</p>
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
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-edit me-2"></i>Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Documents */}
      {showDocumentsModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-alt me-2"></i>
                  Documents - {selectedStage.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDocumentsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <button className="btn btn-primary btn-sm">
                    <i className="fas fa-upload me-2"></i>Ajouter un document
                  </button>
                </div>
                <div className="list-group">
                  <div className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-file-pdf text-danger me-2"></i>
                      CV_Jean_Dupont.pdf
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-file-word text-primary me-2"></i>
                      Lettre_motivation_TechCorp.docx
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDocumentsModal(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Contact */}
      {showContactModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-envelope me-2"></i>
                  Contacter {selectedStage.enterprise}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowContactModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Sujet</label>
                    <input type="text" className="form-control" placeholder="Sujet de votre message" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="5" placeholder="Votre message..."></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Pièce jointe (optionnel)</label>
                    <input type="file" className="form-control" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowContactModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-paper-plane me-2"></i>Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesStages; 