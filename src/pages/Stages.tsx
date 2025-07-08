import React, { useState, useEffect } from 'react';

interface StageOffer {
  id: number;
  title: string;
  enterprise: string;
  description: string;
  duration: string;
  location: string;
  salary: number;
  applications: number;
  domain: string;
  requirements: string[];
  startDate: string;
  endDate: string;
  isNew: boolean;
  isUrgent: boolean;
  technologies?: string[];
  enterpriseLogo?: string;
}

const Stages: React.FC = () => {
  const [offers, setOffers] = useState<StageOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<StageOffer[]>([]);
  const [filters, setFilters] = useState({
    domain: '',
    location: '',
    duration: '',
    keywords: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Données simulées
  useEffect(() => {
    const mockOffers: StageOffer[] = [
      {
        id: 1,
        title: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        description: 'Développement d\'une application web moderne utilisant React, Node.js et MongoDB. Vous participerez à la conception et au développement de nouvelles fonctionnalités.',
        duration: '6 mois',
        location: 'Paris',
        salary: 1200,
        applications: 5,
        domain: 'Informatique',
        requirements: ['React', 'Node.js', 'MongoDB', 'Git'],
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        isNew: true,
        isUrgent: false,
        technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        enterpriseLogo: '/api/logos/techcorp.png'
      },
      {
        id: 2,
        title: 'Assistant Marketing Digital',
        enterprise: 'InnovateX',
        description: 'Gestion des réseaux sociaux et campagnes marketing. Création de contenu, analyse des performances et optimisation des stratégies marketing.',
        duration: '4 mois',
        location: 'Lyon',
        salary: 1000,
        applications: 8,
        domain: 'Marketing',
        requirements: ['Marketing digital', 'Réseaux sociaux', 'Analytics'],
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        isNew: false,
        isUrgent: true,
        enterpriseLogo: '/api/logos/innovatex.png'
      },
      {
        id: 3,
        title: 'Analyste de Données',
        enterprise: 'DataPlus',
        description: 'Analyse de données et création de rapports. Utilisation d\'outils d\'analyse pour extraire des insights business.',
        duration: '5 mois',
        location: 'Marseille',
        salary: 1100,
        applications: 3,
        domain: 'Data/Analyse',
        requirements: ['Python', 'SQL', 'Excel', 'Tableau'],
        startDate: '15/05/2024',
        endDate: '15/10/2024',
        isNew: false,
        isUrgent: false,
        technologies: ['Python', 'SQL', 'Pandas', 'Tableau'],
        enterpriseLogo: '/api/logos/dataplus.png'
      },
      {
        id: 4,
        title: 'Développeur Mobile iOS/Android',
        enterprise: 'MobileTech',
        description: 'Développement d\'applications mobiles pour iOS et Android. Utilisation de React Native et des technologies mobiles modernes.',
        duration: '6 mois',
        location: 'Toulouse',
        salary: 1300,
        applications: 2,
        domain: 'Informatique',
        requirements: ['React Native', 'JavaScript', 'Git'],
        startDate: '01/06/2024',
        endDate: '30/11/2024',
        isNew: true,
        isUrgent: false,
        technologies: ['React Native', 'JavaScript', 'Xcode', 'Android Studio'],
        enterpriseLogo: '/api/logos/mobiletech.png'
      },
      {
        id: 5,
        title: 'Assistant Commercial',
        enterprise: 'SalesPro',
        description: 'Support à l\'équipe commerciale, prospection clients et suivi des ventes. Développement de compétences en relation client.',
        duration: '3 mois',
        location: 'Bordeaux',
        salary: 900,
        applications: 12,
        domain: 'Commerce',
        requirements: ['Relation client', 'Excel', 'CRM'],
        startDate: '01/07/2024',
        endDate: '30/09/2024',
        isNew: false,
        isUrgent: true,
        enterpriseLogo: '/api/logos/salespro.png'
      },
      {
        id: 6,
        title: 'Développeur Frontend',
        enterprise: 'WebSolutions',
        description: 'Création d\'interfaces utilisateur modernes et responsives. Utilisation des dernières technologies frontend.',
        duration: '4 mois',
        location: 'Nantes',
        salary: 1150,
        applications: 6,
        domain: 'Informatique',
        requirements: ['HTML/CSS', 'JavaScript', 'React', 'Figma'],
        startDate: '01/08/2024',
        endDate: '30/11/2024',
        isNew: false,
        isUrgent: false,
        technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
        enterpriseLogo: '/api/logos/websolutions.png'
      }
    ];
    setOffers(mockOffers);
    setFilteredOffers(mockOffers);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: typeof filters) => {
    let filtered = offers;

    if (currentFilters.domain) {
      filtered = filtered.filter(offer => offer.domain === currentFilters.domain);
    }
    if (currentFilters.location) {
      filtered = filtered.filter(offer => offer.location === currentFilters.location);
    }
    if (currentFilters.duration) {
      filtered = filtered.filter(offer => {
        const duration = parseInt(offer.duration.split(' ')[0]);
        switch (currentFilters.duration) {
          case '1-3 mois':
            return duration <= 3;
          case '3-6 mois':
            return duration > 3 && duration <= 6;
          case '6+ mois':
            return duration > 6;
          default:
            return true;
        }
      });
    }
    if (currentFilters.keywords) {
      const keywords = currentFilters.keywords.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(keywords) ||
        offer.description.toLowerCase().includes(keywords) ||
        offer.enterprise.toLowerCase().includes(keywords) ||
        offer.requirements.some(req => req.toLowerCase().includes(keywords))
      );
    }

    applySorting(filtered);
  };

  const applySorting = (offersToSort: StageOffer[]) => {
    let sorted = [...offersToSort];
    
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'salary':
        sorted.sort((a, b) => b.salary - a.salary);
        break;
      case 'applications':
        sorted.sort((a, b) => a.applications - b.applications);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setFilteredOffers(sorted);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    applySorting(filteredOffers);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <i className="fas fa-briefcase me-3"></i>
          Offres de Stages
        </h1>
        <p className="lead text-muted">
          Découvrez les meilleures opportunités de stage pour développer vos compétences
        </p>
      </div>

      {/* Statistiques */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card bg-primary text-white text-center">
            <div className="card-body">
              <i className="fas fa-briefcase fa-2x mb-2"></i>
              <h4 className="mb-0">{offers.length}</h4>
              <p className="mb-0">Offres disponibles</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white text-center">
            <div className="card-body">
              <i className="fas fa-building fa-2x mb-2"></i>
              <h4 className="mb-0">{new Set(offers.map(o => o.enterprise)).size}</h4>
              <p className="mb-0">Entreprises partenaires</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white text-center">
            <div className="card-body">
              <i className="fas fa-map-marker-alt fa-2x mb-2"></i>
              <h4 className="mb-0">{new Set(offers.map(o => o.location)).size}</h4>
              <p className="mb-0">Villes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white text-center">
            <div className="card-body">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h4 className="mb-0">{offers.reduce((sum, o) => sum + o.applications, 0)}</h4>
              <p className="mb-0">Candidatures totales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et contrôles */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Domaine</label>
              <select 
                className="form-select"
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
              >
                <option value="">Tous les domaines</option>
                <option value="Informatique">Informatique</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Commerce">Commerce</option>
                <option value="Data/Analyse">Data/Analyse</option>
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
              <label className="form-label">Durée</label>
              <select 
                className="form-select"
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
              >
                <option value="">Toutes les durées</option>
                <option value="1-3 mois">1-3 mois</option>
                <option value="3-6 mois">3-6 mois</option>
                <option value="6+ mois">6+ mois</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">&nbsp;</label>
              <button 
                className="btn btn-primary w-100"
                onClick={() => {
                  setFilters({ domain: '', location: '', duration: '', keywords: '' });
                  setFilteredOffers(offers);
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
                  placeholder="Rechercher par mots-clés (développeur, marketing, data...)"
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
        <h4>Offres trouvées ({filteredOffers.length})</h4>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="date">Trier par date</option>
            <option value="salary">Trier par salaire</option>
            <option value="applications">Trier par candidatures</option>
            <option value="title">Trier par titre</option>
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

      {/* Affichage des offres */}
      {filteredOffers.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search fa-4x text-muted mb-3"></i>
          <h5 className="text-muted">Aucune offre trouvée</h5>
          <p className="text-muted">Aucune offre ne correspond à vos critères de recherche.</p>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setFilters({ domain: '', location: '', duration: '', keywords: '' });
              setFilteredOffers(offers);
            }}
          >
            <i className="fas fa-times me-2"></i>Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'row g-4' : ''}>
          {filteredOffers.map((offer) => (
            <div key={offer.id} className={viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'mb-4'}>
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
                    <h5 className="card-title">{offer.title}</h5>
                    <div>
                      {offer.isNew && (
                        <span className="badge bg-success me-1">Nouveau</span>
                      )}
                      {offer.isUrgent && (
                        <span className="badge bg-warning">Urgent</span>
                      )}
                    </div>
                  </div>
                  <h6 className="card-subtitle mb-2 text-muted">
                    <i className="fas fa-building me-1"></i>
                    {offer.enterprise}
                  </h6>
                  <p className="card-text">
                    {viewMode === 'list' 
                      ? offer.description 
                      : offer.description.length > 120 
                        ? `${offer.description.substring(0, 120)}...` 
                        : offer.description
                    }
                  </p>
                  
                  {viewMode === 'grid' && (
                    <>
                      <div className="row mb-3">
                        <div className="col-6">
                          <small className="text-muted">Durée</small><br />
                          <strong>{offer.duration}</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Localisation</small><br />
                          <strong>
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {offer.location}
                          </strong>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-6">
                          <small className="text-muted">Gratification</small><br />
                          <strong>{offer.salary}€/mois</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted">Candidatures</small><br />
                          <strong>{offer.applications}</strong>
                        </div>
                      </div>
                    </>
                  )}

                  {viewMode === 'list' && (
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <small className="text-muted">Durée</small><br />
                        <strong>{offer.duration}</strong>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Localisation</small><br />
                        <strong>{offer.location}</strong>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Gratification</small><br />
                        <strong>{offer.salary}€/mois</strong>
                      </div>
                      <div className="col-md-3">
                        <small className="text-muted">Candidatures</small><br />
                        <strong>{offer.applications}</strong>
                      </div>
                    </div>
                  )}

                  {offer.technologies && (
                    <div className="mb-3">
                      <small className="text-muted">Technologies :</small><br />
                      <div className="d-flex flex-wrap gap-1">
                        {offer.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="badge bg-light text-dark">
                            {tech}
                          </span>
                        ))}
                        {offer.technologies.length > 3 && (
                          <span className="badge bg-light text-dark">
                            +{offer.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary flex-fill">
                      <i className="fas fa-eye me-2"></i>Voir détails
                    </button>
                    <button className="btn btn-outline-success">
                      <i className="fas fa-paper-plane"></i>
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
                Publiez vos offres de stage et trouvez les meilleurs talents
              </p>
              <button className="btn btn-light btn-lg">
                <i className="fas fa-plus me-2"></i>Publier une offre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stages; 