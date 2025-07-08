import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Enterprise {
  id: number;
  name: string;
  logo?: string;
  sector: string;
  size: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  partnershipDate: string;
  totalInternships: number;
  activeInternships: number;
  completedInternships: number;
  averageRating: number;
  description: string;
  specialties: string[];
  benefits: string[];
}

const Entreprises: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [filteredEnterprises, setFilteredEnterprises] = useState<Enterprise[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    sector: '',
    size: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const mockEnterprises: Enterprise[] = [
      {
        id: 1,
        name: 'TechCorp Solutions',
        logo: '/api/logos/techcorp-logo.png',
        sector: 'Technologie',
        size: '50-200 employés',
        location: 'Paris, France',
        website: 'https://techcorp.com',
        email: 'contact@techcorp.com',
        phone: '01 23 45 67 89',
        contactPerson: 'M. Martin',
        contactEmail: 'martin@techcorp.com',
        contactPhone: '01 23 45 67 90',
        status: 'active',
        partnershipDate: '2023-01-15',
        totalInternships: 25,
        activeInternships: 8,
        completedInternships: 17,
        averageRating: 4.5,
        description: 'Entreprise spécialisée dans le développement de solutions web et mobiles innovantes.',
        specialties: ['Développement Web', 'Applications Mobiles', 'Cloud Computing'],
        benefits: ['Environnement moderne', 'Mentorat personnalisé', 'Possibilité d\'embauche']
      },
      {
        id: 2,
        name: 'MarketingPro',
        logo: '/api/logos/marketingpro-logo.png',
        sector: 'Marketing',
        size: '20-50 employés',
        location: 'Lyon, France',
        website: 'https://marketingpro.com',
        email: 'contact@marketingpro.com',
        phone: '04 56 78 90 12',
        contactPerson: 'Mme. Dubois',
        contactEmail: 'dubois@marketingpro.com',
        contactPhone: '04 56 78 90 13',
        status: 'active',
        partnershipDate: '2023-03-20',
        totalInternships: 15,
        activeInternships: 5,
        completedInternships: 10,
        averageRating: 4.2,
        description: 'Agence de marketing digital spécialisée dans les réseaux sociaux et le content marketing.',
        specialties: ['Marketing Digital', 'Réseaux Sociaux', 'Content Marketing'],
        benefits: ['Formation aux outils', 'Travail en équipe', 'Horaires flexibles']
      },
      {
        id: 3,
        name: 'DataCorp',
        logo: '/api/logos/datacorp-logo.png',
        sector: 'Data Science',
        size: '100-500 employés',
        location: 'Marseille, France',
        website: 'https://datacorp.com',
        email: 'contact@datacorp.com',
        phone: '04 91 23 45 67',
        contactPerson: 'M. Bernard',
        contactEmail: 'bernard@datacorp.com',
        contactPhone: '04 91 23 45 68',
        status: 'active',
        partnershipDate: '2022-09-10',
        totalInternships: 35,
        activeInternships: 12,
        completedInternships: 23,
        averageRating: 4.8,
        description: 'Leader dans l\'analyse de données et l\'intelligence artificielle.',
        specialties: ['Data Science', 'Machine Learning', 'Business Intelligence'],
        benefits: ['Accès aux données réelles', 'Formation avancée', 'Équipe internationale']
      },
      {
        id: 4,
        name: 'DesignStudio',
        logo: '/api/logos/designstudio-logo.png',
        sector: 'Design',
        size: '10-20 employés',
        location: 'Bordeaux, France',
        website: 'https://designstudio.com',
        email: 'contact@designstudio.com',
        phone: '05 56 78 90 12',
        contactPerson: 'M. Durand',
        contactEmail: 'durand@designstudio.com',
        contactPhone: '05 56 78 90 13',
        status: 'pending',
        partnershipDate: '2024-02-01',
        totalInternships: 8,
        activeInternships: 3,
        completedInternships: 5,
        averageRating: 4.0,
        description: 'Studio de design créatif spécialisé dans l\'UX/UI et le branding.',
        specialties: ['UX/UI Design', 'Branding', 'Design Graphique'],
        benefits: ['Projets créatifs', 'Bureau moderne', 'Formation design']
      }
    ];
    setEnterprises(mockEnterprises);
    setFilteredEnterprises(mockEnterprises);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = enterprises;
    if (newFilters.status) {
      filtered = filtered.filter(enterprise => enterprise.status === newFilters.status);
    }
    if (newFilters.sector) {
      filtered = filtered.filter(enterprise => enterprise.sector === newFilters.sector);
    }
    if (newFilters.size) {
      filtered = filtered.filter(enterprise => enterprise.size === newFilters.size);
    }
    setFilteredEnterprises(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Active' },
      inactive: { class: 'bg-danger', text: 'Inactive' },
      pending: { class: 'bg-warning', text: 'En attente' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getSectorCount = (sector: string) => {
    return enterprises.filter(enterprise => enterprise.sector === sector).length;
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-building me-2 text-primary"></i>
                  Gestion des Entreprises
                </h1>
                <p className="text-muted mb-0">
                  Gérez les entreprises partenaires de la plateforme
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowEnterpriseModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>Nouvelle entreprise
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
                        <h4 className="mb-0">{enterprises.length}</h4>
                        <p className="mb-0">Total entreprises</p>
                      </div>
                      <i className="fas fa-building fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getSectorCount('Technologie')}</h4>
                        <p className="mb-0">Technologie</p>
                      </div>
                      <i className="fas fa-laptop-code fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getSectorCount('Marketing')}</h4>
                        <p className="mb-0">Marketing</p>
                      </div>
                      <i className="fas fa-bullhorn fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getSectorCount('Data Science')}</h4>
                        <p className="mb-0">Data Science</p>
                      </div>
                      <i className="fas fa-chart-bar fa-2x opacity-50"></i>
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Secteur</label>
                    <select 
                      className="form-select"
                      value={filters.sector}
                      onChange={(e) => handleFilterChange('sector', e.target.value)}
                    >
                      <option value="">Tous les secteurs</option>
                      <option value="Technologie">Technologie</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Taille</label>
                    <select 
                      className="form-select"
                      value={filters.size}
                      onChange={(e) => handleFilterChange('size', e.target.value)}
                    >
                      <option value="">Toutes les tailles</option>
                      <option value="1-10 employés">1-10 employés</option>
                      <option value="10-20 employés">10-20 employés</option>
                      <option value="20-50 employés">20-50 employés</option>
                      <option value="50-200 employés">50-200 employés</option>
                      <option value="100-500 employés">100-500 employés</option>
                      <option value="500+ employés">500+ employés</option>
                    </select>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', sector: '', size: '' });
                        setFilteredEnterprises(enterprises);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des entreprises */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Entreprises ({filteredEnterprises.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredEnterprises.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune entreprise trouvée</h5>
                    <p className="text-muted">Aucune entreprise ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Entreprise</th>
                          <th>Secteur</th>
                          <th>Localisation</th>
                          <th>Contact</th>
                          <th>Stages</th>
                          <th>Note</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnterprises.map((enterprise) => (
                          <tr key={enterprise.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={enterprise.logo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{enterprise.name}</strong><br />
                                  <small className="text-muted">{enterprise.size}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">{enterprise.sector}</span>
                            </td>
                            <td>{enterprise.location}</td>
                            <td>
                              <div>
                                <strong>{enterprise.contactPerson}</strong><br />
                                <small className="text-muted">{enterprise.contactEmail}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{enterprise.activeInternships}/{enterprise.totalInternships}</strong><br />
                                <small className="text-muted">Actifs/Total</small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">{enterprise.averageRating}/5</span>
                                <div className="d-flex">
                                  {[...Array(5)].map((_, i) => (
                                    <i 
                                      key={i} 
                                      className={`fas fa-star ${i < Math.floor(enterprise.averageRating) ? 'text-warning' : 'text-muted'}`}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td>{getStatusBadge(enterprise.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedEnterprise(enterprise);
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
                                  className="btn btn-sm btn-outline-info"
                                  title="Contacter"
                                >
                                  <i className="fas fa-envelope"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Gérer partenariat"
                                >
                                  <i className="fas fa-handshake"></i>
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

      {/* Modal Détails Entreprise */}
      {showDetailsModal && selectedEnterprise && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-building me-2"></i>
                  Détails - {selectedEnterprise.name}
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
                      src={selectedEnterprise.logo || '/default-logo.png'} 
                      alt="Logo"
                      className="rounded mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                    />
                    <h5>{selectedEnterprise.name}</h5>
                    <p className="text-muted">{selectedEnterprise.sector}</p>
                    <p className="text-muted">{selectedEnterprise.size}</p>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">Informations générales</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Localisation:</strong> {selectedEnterprise.location}</p>
                        <p><strong>Site web:</strong> <a href={selectedEnterprise.website} target="_blank" rel="noopener noreferrer">{selectedEnterprise.website}</a></p>
                        <p><strong>Email:</strong> {selectedEnterprise.email}</p>
                        <p><strong>Téléphone:</strong> {selectedEnterprise.phone}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Contact principal:</strong> {selectedEnterprise.contactPerson}</p>
                        <p><strong>Email contact:</strong> {selectedEnterprise.contactEmail}</p>
                        <p><strong>Téléphone contact:</strong> {selectedEnterprise.contactPhone}</p>
                        <p><strong>Date partenariat:</strong> {selectedEnterprise.partnershipDate}</p>
                      </div>
                    </div>

                    <h6 className="text-primary mb-3 mt-4">Statistiques</h6>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-primary">{selectedEnterprise.totalInternships}</h4>
                          <p className="text-muted">Total stages</p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-success">{selectedEnterprise.activeInternships}</h4>
                          <p className="text-muted">Stages actifs</p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-info">{selectedEnterprise.completedInternships}</h4>
                          <p className="text-muted">Stages terminés</p>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text-center">
                          <h4 className="text-warning">{selectedEnterprise.averageRating}/5</h4>
                          <p className="text-muted">Note moyenne</p>
                        </div>
                      </div>
                    </div>

                    <h6 className="text-primary mb-3 mt-4">Description</h6>
                    <p>{selectedEnterprise.description}</p>

                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="text-primary mb-2">Spécialités</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {selectedEnterprise.specialties.map((specialty, index) => (
                            <span key={index} className="badge bg-light text-dark">{specialty}</span>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary mb-2">Avantages</h6>
                        <ul className="list-unstyled">
                          {selectedEnterprise.benefits.map((benefit, index) => (
                            <li key={index}><i className="fas fa-check text-success me-2"></i>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
                <button className="btn btn-primary">
                  <i className="fas fa-edit me-2"></i>Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Entreprise */}
      {showEnterpriseModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Nouvelle entreprise
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEnterpriseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Nom de l'entreprise *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Secteur *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un secteur</option>
                        <option value="Technologie">Technologie</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design</option>
                        <option value="Finance">Finance</option>
                        <option value="Consulting">Consulting</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Taille *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une taille</option>
                        <option value="1-10 employés">1-10 employés</option>
                        <option value="10-20 employés">10-20 employés</option>
                        <option value="20-50 employés">20-50 employés</option>
                        <option value="50-200 employés">50-200 employés</option>
                        <option value="100-500 employés">100-500 employés</option>
                        <option value="500+ employés">500+ employés</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Localisation *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Site web</label>
                      <input type="url" className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone *</label>
                      <input type="tel" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contact principal *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email contact *</label>
                      <input type="email" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="3"></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Spécialités</label>
                      <input type="text" className="form-control" placeholder="Séparées par des virgules" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Avantages</label>
                      <textarea className="form-control" rows="3" placeholder="Un avantage par ligne"></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEnterpriseModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Créer l'entreprise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entreprises; 