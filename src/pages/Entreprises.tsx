import React, { useState, useEffect } from 'react';

interface Enterprise {
  id: number;
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  logo?: string;
  employeeCount: string;
  foundedYear: number;
  activeOffers: number;
  totalStages: number;
  rating: number;
  verified: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
  specialties: string[];
}

const Entreprises: React.FC = () => {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [filteredEnterprises, setFilteredEnterprises] = useState<Enterprise[]>([]);
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    size: '',
    keywords: ''
  });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Données simulées
  useEffect(() => {
    const mockEnterprises: Enterprise[] = [
      {
        id: 1,
        name: 'TechCorp',
        industry: 'Technologie',
        location: 'Paris',
        description: 'Leader dans le développement de solutions innovantes pour les entreprises. Spécialisée dans l\'intelligence artificielle et le développement web.',
        website: 'https://techcorp.fr',
        logo: '/api/logos/techcorp.png',
        employeeCount: '50-200',
        foundedYear: 2015,
        activeOffers: 3,
        totalStages: 25,
        rating: 4.8,
        verified: true,
        contactEmail: 'contact@techcorp.fr',
        contactPhone: '+33 1 23 45 67 89',
        address: '123 Rue de la Tech, 75001 Paris',
        specialties: ['Développement Web', 'IA', 'Mobile', 'Cloud']
      },
      {
        id: 2,
        name: 'InnovateX',
        industry: 'Marketing',
        location: 'Lyon',
        description: 'Agence de marketing digital spécialisée dans la transformation numérique des entreprises. Expertise en stratégie digitale et création de contenu.',
        website: 'https://innovatex.fr',
        logo: '/api/logos/innovatex.png',
        employeeCount: '10-50',
        foundedYear: 2018,
        activeOffers: 2,
        totalStages: 15,
        rating: 4.6,
        verified: true,
        contactEmail: 'hello@innovatex.fr',
        contactPhone: '+33 4 78 12 34 56',
        address: '456 Avenue de l\'Innovation, 69000 Lyon',
        specialties: ['Marketing Digital', 'SEO', 'Réseaux Sociaux', 'Content Marketing']
      },
      {
        id: 3,
        name: 'DataPlus',
        industry: 'Data/Analyse',
        location: 'Marseille',
        description: 'Expert en analyse de données et business intelligence. Aide les entreprises à prendre des décisions basées sur les données.',
        website: 'https://dataplus.fr',
        logo: '/api/logos/dataplus.png',
        employeeCount: '20-100',
        foundedYear: 2016,
        activeOffers: 1,
        totalStages: 12,
        rating: 4.7,
        verified: true,
        contactEmail: 'info@dataplus.fr',
        contactPhone: '+33 4 91 23 45 67',
        address: '789 Boulevard des Données, 13000 Marseille',
        specialties: ['Data Science', 'Business Intelligence', 'Machine Learning', 'Analytics']
      },
      {
        id: 4,
        name: 'MobileTech',
        industry: 'Technologie',
        location: 'Toulouse',
        description: 'Spécialiste du développement mobile et des applications innovantes. Expertise en React Native et développement cross-platform.',
        website: 'https://mobiletech.fr',
        logo: '/api/logos/mobiletech.png',
        employeeCount: '10-50',
        foundedYear: 2019,
        activeOffers: 2,
        totalStages: 8,
        rating: 4.5,
        verified: false,
        contactEmail: 'contact@mobiletech.fr',
        contactPhone: '+33 5 61 23 45 67',
        address: '321 Rue du Mobile, 31000 Toulouse',
        specialties: ['Développement Mobile', 'React Native', 'iOS', 'Android']
      },
      {
        id: 5,
        name: 'SalesPro',
        industry: 'Commerce',
        location: 'Bordeaux',
        description: 'Conseil en vente et développement commercial. Accompagne les entreprises dans leur stratégie de croissance commerciale.',
        website: 'https://salespro.fr',
        logo: '/api/logos/salespro.png',
        employeeCount: '5-20',
        foundedYear: 2020,
        activeOffers: 1,
        totalStages: 5,
        rating: 4.3,
        verified: false,
        contactEmail: 'contact@salespro.fr',
        contactPhone: '+33 5 56 12 34 56',
        address: '654 Avenue du Commerce, 33000 Bordeaux',
        specialties: ['Vente', 'CRM', 'Prospection', 'Formation Commerciale']
      },
      {
        id: 6,
        name: 'WebSolutions',
        industry: 'Technologie',
        location: 'Nantes',
        description: 'Agence web spécialisée dans la création de sites et applications web modernes. Expertise en UX/UI et développement frontend.',
        website: 'https://websolutions.fr',
        logo: '/api/logos/websolutions.png',
        employeeCount: '10-50',
        foundedYear: 2017,
        activeOffers: 1,
        totalStages: 18,
        rating: 4.9,
        verified: true,
        contactEmail: 'hello@websolutions.fr',
        contactPhone: '+33 2 40 12 34 56',
        address: '987 Rue du Web, 44000 Nantes',
        specialties: ['Développement Web', 'UX/UI', 'Frontend', 'E-commerce']
      }
    ];
    setEnterprises(mockEnterprises);
    setFilteredEnterprises(mockEnterprises);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: typeof filters) => {
    let filtered = enterprises;

    if (currentFilters.industry) {
      filtered = filtered.filter(enterprise => enterprise.industry === currentFilters.industry);
    }
    if (currentFilters.location) {
      filtered = filtered.filter(enterprise => enterprise.location === currentFilters.location);
    }
    if (currentFilters.size) {
      filtered = filtered.filter(enterprise => enterprise.employeeCount === currentFilters.size);
    }
    if (currentFilters.keywords) {
      const keywords = currentFilters.keywords.toLowerCase();
      filtered = filtered.filter(enterprise => 
        enterprise.name.toLowerCase().includes(keywords) ||
        enterprise.description.toLowerCase().includes(keywords) ||
        enterprise.specialties.some(specialty => specialty.toLowerCase().includes(keywords))
      );
    }

    applySorting(filtered);
  };

  const applySorting = (enterprisesToSort: Enterprise[]) => {
    let sorted = [...enterprisesToSort];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'offers':
        sorted.sort((a, b) => b.activeOffers - a.activeOffers);
        break;
      case 'stages':
        sorted.sort((a, b) => b.totalStages - a.totalStages);
        break;
    }
    
    setFilteredEnterprises(sorted);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    applySorting(filteredEnterprises);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
    }

    return stars;
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <i className="fas fa-building me-3"></i>
          Nos Entreprises Partenaires
        </h1>
        <p className="lead text-muted">
          Découvrez les entreprises qui font confiance à nos étudiants
        </p>
      </div>

      {/* Statistiques */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-primary text-white text-center">
            <div className="card-body">
              <i className="fas fa-building fa-2x mb-2"></i>
              <h4 className="mb-0">{enterprises.length}</h4>
              <p className="mb-0">Entreprises partenaires</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white text-center">
            <div className="card-body">
              <i className="fas fa-briefcase fa-2x mb-2"></i>
              <h4 className="mb-0">{enterprises.reduce((sum, e) => sum + e.activeOffers, 0)}</h4>
              <p className="mb-0">Offres actives</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white text-center">
            <div className="card-body">
              <i className="fas fa-map-marker-alt fa-2x mb-2"></i>
              <h4 className="mb-0">{new Set(enterprises.map(e => e.location)).size}</h4>
              <p className="mb-0">Villes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white text-center">
            <div className="card-body">
              <i className="fas fa-star fa-2x mb-2"></i>
              <h4 className="mb-0">4.6</h4>
              <p className="mb-0">Note moyenne</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Secteur d'activité</label>
              <select 
                className="form-select"
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
              >
                <option value="">Tous les secteurs</option>
                <option value="Technologie">Technologie</option>
                <option value="Marketing">Marketing</option>
                <option value="Data/Analyse">Data/Analyse</option>
                <option value="Commerce">Commerce</option>
                <option value="Finance">Finance</option>
                <option value="Santé">Santé</option>
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
                <option value="Paris">Paris</option>
                <option value="Lyon">Lyon</option>
                <option value="Marseille">Marseille</option>
                <option value="Toulouse">Toulouse</option>
                <option value="Bordeaux">Bordeaux</option>
                <option value="Nantes">Nantes</option>
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
                <option value="1-10">1-10 employés</option>
                <option value="10-50">10-50 employés</option>
                <option value="50-200">50-200 employés</option>
                <option value="200+">200+ employés</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">&nbsp;</label>
              <button 
                className="btn btn-primary w-100"
                onClick={() => {
                  setFilters({ industry: '', location: '', size: '', keywords: '' });
                  setFilteredEnterprises(enterprises);
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
                  placeholder="Rechercher par nom, spécialité..."
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

      {/* Contrôles d'affichage */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Entreprises trouvées ({filteredEnterprises.length})</h4>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="name">Trier par nom</option>
            <option value="rating">Trier par note</option>
            <option value="offers">Trier par offres actives</option>
            <option value="stages">Trier par stages totaux</option>
          </select>
          <div className="btn-group" role="group">
            <button 
              type="button" 
              className={`btn btn-outline-primary ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="fas fa-th"></i>
            </button>
            <button 
              type="button" 
              className={`btn btn-outline-primary ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Affichage des entreprises */}
      {filteredEnterprises.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search fa-4x text-muted mb-3"></i>
          <h5 className="text-muted">Aucune entreprise trouvée</h5>
          <p className="text-muted">Aucune entreprise ne correspond à vos critères de recherche.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setFilters({ industry: '', location: '', size: '', keywords: '' });
              setFilteredEnterprises(enterprises);
            }}
          >
            <i className="fas fa-times me-2"></i>Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'row g-4' : ''}>
          {filteredEnterprises.map((enterprise) => (
            <div key={enterprise.id} className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'mb-4'}>
              <div className={`card h-100 shadow-sm hover-shadow ${viewMode === 'list' ? 'flex-row' : ''}`}>
                {viewMode === 'list' && (
                  <div className="card-img-top" style={{ width: '200px', height: '200px' }}>
                    <div className="h-100 d-flex align-items-center justify-content-center bg-light">
                      <i className="fas fa-building fa-3x text-muted"></i>
                    </div>
                  </div>
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{enterprise.name}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary">{enterprise.industry}</span>
                        {enterprise.verified && (
                          <span className="badge bg-success">
                            <i className="fas fa-check-circle me-1"></i>Vérifiée
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="mb-1">
                        {renderStars(enterprise.rating)}
                      </div>
                      <small className="text-muted">{enterprise.rating}/5</small>
                    </div>
                  </div>

                  <p className="card-text text-muted">
                    {viewMode === 'list' 
                      ? enterprise.description 
                      : enterprise.description.length > 120 
                        ? `${enterprise.description.substring(0, 120)}...` 
                        : enterprise.description
                    }
                  </p>

                  {viewMode === 'grid' && (
                    <>
                      <div className="row mb-3">
                        <div className="col-6">
                          <small className="text-muted">Localisation</small><br />
                          <strong>
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {enterprise.location}
                          </strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Taille</small><br />
                          <strong>{enterprise.employeeCount} employés</strong>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-6">
                          <small className="text-muted">Offres actives</small><br />
                          <strong className="text-primary">{enterprise.activeOffers}</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Stages totaux</small><br />
                          <strong>{enterprise.totalStages}</strong>
                        </div>
                      </div>
                    </>
                  )}

                  {viewMode === 'list' && (
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <small className="text-muted">Localisation</small><br />
                        <strong>{enterprise.location}</strong>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Taille</small><br />
                        <strong>{enterprise.employeeCount}</strong>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Offres actives</small><br />
                        <strong className="text-primary">{enterprise.activeOffers}</strong>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Stages totaux</small><br />
                        <strong>{enterprise.totalStages}</strong>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-muted">Spécialités :</small><br />
                    <div className="d-flex flex-wrap gap-1">
                      {enterprise.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          {specialty}
                        </span>
                      ))}
                      {enterprise.specialties.length > 3 && (
                        <span className="badge bg-light text-dark">
                          +{enterprise.specialties.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary flex-fill">
                      <i className="fas fa-eye me-2"></i>Voir détails
                    </button>
                    <button className="btn btn-outline-success">
                      <i className="fas fa-briefcase"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to action */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-primary text-white text-center">
            <div className="card-body py-5">
              <h3 className="mb-3">Vous êtes une entreprise ?</h3>
              <p className="lead mb-4">
                Rejoignez notre réseau de partenaires et accédez aux meilleurs talents
              </p>
              <button className="btn btn-light btn-lg me-3">
                <i className="fas fa-building me-2"></i>Devenir partenaire
              </button>
              <button className="btn btn-outline-light btn-lg">
                <i className="fas fa-info-circle me-2"></i>En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entreprises; 