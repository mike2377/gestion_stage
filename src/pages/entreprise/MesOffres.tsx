import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  FaHandshake, 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUsers,
  FaFileAlt,
  FaDownload,
  FaEnvelope,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaMapMarkerAlt,
  FaIndustry,
  FaGraduationCap,
  FaStar
} from 'react-icons/fa';

interface OffreStage {
  id: number;
  titre: string;
  description: string;
  duree: string;
  lieu: string;
  remuneration: number;
  nbCandidatures: number;
  domaine: string;
  exigences: string[];
  dateDebut: string;
  dateFin: string;
  statut: 'active' | 'inactive' | 'brouillon' | 'expiree';
  creeLe: string;
  modifieLe: string;
  technologies?: string[];
  nbCandidaturesMax?: number;
  urgent: boolean;
  enVedette: boolean;
}

interface Candidature {
  id: number;
  stagiaire: string;
  email: string;
  formation: string;
  universite: string;
  dateCandidature: string;
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'entretien';
  note: number;
  cv: string;
  lettreMotivation: string;
}

const MesOffres: React.FC = () => {
  const [offers, setOffers] = useState<OffreStage[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<OffreStage[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    domain: '',
    keywords: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OffreStage | null>(null);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    duration: '',
    location: '',
    salary: 0,
    domain: '',
    requirements: '',
    startDate: '',
    endDate: '',
    technologies: '',
    maxApplications: 0,
    isUrgent: false,
    isFeatured: false
  });

  const [candidatures, setCandidatures] = useState<Candidature[]>([
    {
      id: 1,
      stagiaire: "Fatou Koné",
      email: "fatou.kone@email.com",
      formation: "Master Informatique",
      universite: "Université Félix Houphouët-Boigny",
      dateCandidature: "2024-01-08",
      statut: "en_attente",
      note: 4.2,
      cv: "cv_fatou_kone.pdf",
      lettreMotivation: "lettre_fatou_kone.pdf"
    },
    {
      id: 2,
      stagiaire: "Moussa Traoré",
      email: "moussa.traore@email.com",
      formation: "Master Finance",
      universite: "Université Alassane Ouattara",
      dateCandidature: "2024-01-12",
      statut: "entretien",
      note: 3.8,
      cv: "cv_moussa_traore.pdf",
      lettreMotivation: "lettre_moussa_traore.pdf"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [sortField, setSortField] = useState('dateCreation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [offreToDelete, setOffreToDelete] = useState<OffreStage | null>(null);
  const [activeTab, setActiveTab] = useState('offres');

  // Données simulées
  useEffect(() => {
    const mockOffers: OffreStage[] = [
      {
        id: 1,
        titre: 'Développeur Web Full-Stack',
        description: 'Développement d\'une application web moderne utilisant React, Node.js et MongoDB. Vous participerez à la conception et au développement de nouvelles fonctionnalités.',
        duree: '6 mois',
        lieu: 'Paris',
        remuneration: 1200,
        nbCandidatures: 5,
        domaine: 'Informatique',
        exigences: ['React', 'Node.js', 'MongoDB', 'Git'],
        dateDebut: '01/03/2024',
        dateFin: '31/08/2024',
        statut: 'active',
        creeLe: '15/01/2024',
        modifieLe: '20/01/2024',
        technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
        nbCandidaturesMax: 10,
        urgent: false,
        enVedette: true
      },
      {
        id: 2,
        titre: 'Assistant Marketing Digital',
        description: 'Gestion des réseaux sociaux et campagnes marketing. Création de contenu, analyse des performances et optimisation des stratégies marketing.',
        duree: '4 mois',
        lieu: 'Lyon',
        remuneration: 1000,
        nbCandidatures: 8,
        domaine: 'Marketing',
        exigences: ['Marketing digital', 'Réseaux sociaux', 'Analytics'],
        dateDebut: '01/04/2024',
        dateFin: '31/07/2024',
        statut: 'active',
        creeLe: '10/01/2024',
        modifieLe: '15/01/2024',
        nbCandidaturesMax: 15,
        urgent: true,
        enVedette: false
      },
      {
        id: 3,
        titre: 'Analyste de Données',
        description: 'Analyse de données et création de rapports. Utilisation d\'outils d\'analyse pour extraire des insights business.',
        duree: '5 mois',
        lieu: 'Marseille',
        remuneration: 1100,
        nbCandidatures: 3,
        domaine: 'Data/Analyse',
        exigences: ['Python', 'SQL', 'Excel', 'Tableau'],
        dateDebut: '15/05/2024',
        dateFin: '15/10/2024',
        statut: 'inactive',
        creeLe: '05/01/2024',
        modifieLe: '12/01/2024',
        technologies: ['Python', 'SQL', 'Pandas', 'Tableau'],
        nbCandidaturesMax: 8,
        urgent: false,
        enVedette: false
      },
      {
        id: 4,
        titre: 'Développeur Mobile',
        description: 'Développement d\'applications mobiles pour iOS et Android. Utilisation de React Native et des technologies mobiles modernes.',
        duree: '6 mois',
        lieu: 'Toulouse',
        remuneration: 1300,
        nbCandidatures: 0,
        domaine: 'Informatique',
        exigences: ['React Native', 'JavaScript', 'Git'],
        dateDebut: '01/06/2024',
        dateFin: '30/11/2024',
        statut: 'brouillon',
        creeLe: '20/01/2024',
        modifieLe: '20/01/2024',
        technologies: ['React Native', 'JavaScript', 'Xcode', 'Android Studio'],
        nbCandidaturesMax: 12,
        urgent: false,
        enVedette: false
      }
    ];
    setOffers(mockOffers);
    setFilteredOffers(mockOffers);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = offers;

    if (newFilters.status) {
      filtered = filtered.filter(offer => offer.statut === newFilters.status);
    }
    if (newFilters.domain) {
      filtered = filtered.filter(offer => offer.domaine === newFilters.domain);
    }
    if (newFilters.keywords) {
      const keywords = newFilters.keywords.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.titre.toLowerCase().includes(keywords) ||
        offer.description.toLowerCase().includes(keywords) ||
        offer.exigences.some(req => req.toLowerCase().includes(keywords))
      );
    }

    setFilteredOffers(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Active', icon: 'fas fa-check-circle' },
      inactive: { class: 'bg-secondary', text: 'Inactive', icon: 'fas fa-pause-circle' },
      brouillon: { class: 'bg-warning', text: 'Brouillon', icon: 'fas fa-edit' },
      expiree: { class: 'bg-danger', text: 'Expirée', icon: 'fas fa-times-circle' }
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
    return offers.filter(offer => offer.statut === status).length;
  };

  const handleAddOffer = () => {
    // Simulation d'ajout
    console.log('Nouvelle offre:', newOffer);
    setShowAddModal(false);
    setNewOffer({
      title: '',
      description: '',
      duration: '',
      location: '',
      salary: 0,
      domain: '',
      requirements: '',
      startDate: '',
      endDate: '',
      technologies: '',
      maxApplications: 0,
      isUrgent: false,
      isFeatured: false
    });
  };

  const user = {
    role: 'enterprise',
    firstName: 'TechCorp',
    lastName: 'Admin'
  };

  const types = ['stage', 'alternance', 'emploi'];
  const statuts = ['active', 'inactive', 'en_attente', 'expiree'];

  const filteredOffres = offers.filter(offer => {
    const matchesSearch = 
      offer.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.exigences.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || offer.domaine === filterType;
    const matchesStatut = !filterStatut || offer.statut === filterStatut;
    
    return matchesSearch && matchesType && matchesStatut;
  });

  // Tri des offres
  const sortedOffres = [...filteredOffres].sort((a, b) => {
    let aValue = a[sortField as keyof OffreStage];
    let bValue = b[sortField as keyof OffreStage];
    
    if (sortField === 'dateDebut' || sortField === 'dateFin') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <FaSort className="text-muted" />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const getStatutBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success"><FaCheckCircle /> Active</span>;
      case 'inactive':
        return <span className="badge bg-secondary"><FaExclamationTriangle /> Inactive</span>;
      case 'en_attente':
        return <span className="badge bg-warning"><FaExclamationTriangle /> En attente</span>;
      case 'expiree':
        return <span className="badge bg-danger"><FaExclamationTriangle /> Expirée</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'stage':
        return <span className="badge bg-primary">Stage</span>;
      case 'alternance':
        return <span className="badge bg-info">Alternance</span>;
      case 'emploi':
        return <span className="badge bg-success">Emploi</span>;
      default:
        return <span className="badge bg-secondary">{type}</span>;
    }
  };

  const getStatutCandidatureBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <span className="badge bg-warning">En attente</span>;
      case 'acceptee':
        return <span className="badge bg-success">Acceptée</span>;
      case 'refusee':
        return <span className="badge bg-danger">Refusée</span>;
      case 'entretien':
        return <span className="badge bg-info">Entretien</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
  };

  const handleEdit = (offer: OffreStage) => {
    setSelectedOffer(offer);
    setShowModal(true);
  };

  const handleDelete = (offer: OffreStage) => {
    setOffreToDelete(offer);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (offreToDelete) {
      setOffers(offers.filter(o => o.id !== offreToDelete.id));
      setShowDeleteModal(false);
      setOffreToDelete(null);
    }
  };

  const totalOffres = offers.length;
  const offresActives = offers.filter(o => o.statut === 'active').length;
  const totalCandidatures = offers.reduce((sum, offre) => sum + offre.nbCandidatures, 0);
  const noteMoyenne = candidatures.length > 0 
    ? candidatures.reduce((sum, c) => sum + c.note, 0) / candidatures.length 
    : 0;

  return (
    <div className="container-fluid">
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
                  <FaHandshake className="me-2 text-primary" />
                  Mes Offres de Stage
                </h1>
                <p className="text-muted mb-0">
                  Gérez vos offres de stage et suivez les candidatures
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus className="me-2" />
                  Nouvelle offre
                </button>
                <button className="btn btn-outline-secondary">
                  <FaDownload className="me-2" />
                  Exporter
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total Offres
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{totalOffres}</div>
                      </div>
                      <div className="col-auto">
                        <FaHandshake className="fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Offres Actives
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{offresActives}</div>
                      </div>
                      <div className="col-auto">
                        <FaCheckCircle className="fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-info shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                          Total Candidatures
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{totalCandidatures}</div>
                      </div>
                      <div className="col-auto">
                        <FaUsers className="fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Note Moyenne
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">{noteMoyenne.toFixed(1)}</div>
                      </div>
                      <div className="col-auto">
                        <FaStar className="fa-2x text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Filtres et Recherche</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher une offre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <select
                      className="form-select"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="">Tous les types</option>
                      {types.map(type => (
                        <option key={type} value={type}>
                          {type === 'stage' ? 'Stage' :
                           type === 'alternance' ? 'Alternance' : 'Emploi'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3 mb-3">
                    <select
                      className="form-select"
                      value={filterStatut}
                      onChange={(e) => setFilterStatut(e.target.value)}
                    >
                      <option value="">Tous statuts</option>
                      {statuts.map(statut => (
                        <option key={statut} value={statut}>
                          {statut === 'active' ? 'Active' :
                           statut === 'inactive' ? 'Inactive' :
                           statut === 'en_attente' ? 'En attente' : 'Expirée'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2 mb-3">
                    <button className="btn btn-outline-secondary w-100">
                      <FaFilter className="me-1" />
                      Filtrer
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'offres' ? 'active' : ''}`}
                      onClick={() => setActiveTab('offres')}
                    >
                      <FaHandshake className="me-2" />
                      Mes Offres
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'candidatures' ? 'active' : ''}`}
                      onClick={() => setActiveTab('candidatures')}
                    >
                      <FaUsers className="me-2" />
                      Candidatures
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === 'offres' && (
                  <div className="table-responsive">
                    <table className="table table-bordered" width="100%" cellSpacing="0">
                      <thead>
                        <tr>
                          <th>
                            <button 
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('titre')}
                            >
                              Titre {getSortIcon('titre')}
                            </button>
                          </th>
                          <th>Type</th>
                          <th>Statut</th>
                          <th>Candidatures</th>
                          <th>
                            <button 
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleSort('dateFin')}
                            >
                              Date Expiration {getSortIcon('dateFin')}
                            </button>
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedOffres.map((offer) => (
                          <tr key={offer.id}>
                            <td>
                              <div>
                                <strong>{offer.titre}</strong>
                                {offer.urgent && (
                                  <span className="badge bg-danger ms-2">Urgent</span>
                                )}
                                {offer.enVedette && (
                                  <span className="badge bg-warning ms-1">À la une</span>
                                )}
                                <br />
                                <small className="text-muted">{offer.description.substring(0, 100)}...</small>
                              </div>
                            </td>
                            <td>{getTypeBadge(offer.domaine)}</td>
                            <td>{getStatutBadge(offer.statut)}</td>
                            <td>
                              <div>
                                <span className="badge bg-primary">{offer.nbCandidatures} candidatures</span>
                                <br />
                                <small className="text-muted">
                                  {offer.nbCandidaturesMax && (
                                    <span>/{offer.nbCandidaturesMax}</span>
                                  )}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <FaCalendarAlt className="me-1 text-muted" />
                                {offer.dateFin}
                              </div>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(offer)}
                                  title="Modifier"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(offer)}
                                  title="Supprimer"
                                >
                                  <FaTrash />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-info"
                                  title="Voir détails"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  title="Voir candidatures"
                                >
                                  <FaUsers />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'candidatures' && (
                  <div className="table-responsive">
                    <table className="table table-bordered" width="100%" cellSpacing="0">
                      <thead>
                        <tr>
                          <th>Candidat</th>
                          <th>Formation</th>
                          <th>Statut</th>
                          <th>Note</th>
                          <th>Date Candidature</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidatures.map(candidature => (
                          <tr key={candidature.id}>
                            <td>
                              <div>
                                <strong>{candidature.stagiaire}</strong>
                                <br />
                                <small className="text-muted">
                                  <FaEnvelope className="me-1" />
                                  {candidature.email}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <FaGraduationCap className="me-1 text-muted" />
                                {candidature.formation}
                                <br />
                                <small className="text-muted">
                                  <FaIndustry className="me-1" />
                                  {candidature.universite}
                                </small>
                              </div>
                            </td>
                            <td>{getStatutCandidatureBadge(candidature.statut)}</td>
                            <td>
                              <div className="text-warning">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <FaStar key={i} className={i < Math.floor(candidature.note) ? 'text-warning' : 'text-muted'} />
                                ))}
                                <span className="text-muted ms-1">({candidature.note})</span>
                              </div>
                            </td>
                            <td>
                              <div>
                                <FaCalendarAlt className="me-1 text-muted" />
                                {candidature.dateCandidature}
                              </div>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button className="btn btn-sm btn-outline-primary" title="Voir CV">
                                  <FaFileAlt />
                                </button>
                                <button className="btn btn-sm btn-outline-info" title="Voir lettre">
                                  <FaEnvelope />
                                </button>
                                <button className="btn btn-sm btn-outline-success" title="Accepter">
                                  <FaCheckCircle />
                                </button>
                                <button className="btn btn-sm btn-outline-danger" title="Refuser">
                                  <FaTimes />
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

      {/* Modal Ajouter Offre */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaPlus className="me-2" />
                  Nouvelle offre de stage
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label">Titre du stage *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="ex: Développeur Web Full-Stack"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Domaine *</label>
                      <select
                        className="form-select"
                        value={newOffer.domain}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, domain: e.target.value }))}
                        required
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Informatique">Informatique</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Data/Analyse">Data/Analyse</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description détaillée *</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={newOffer.description}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez le stage, les missions, les objectifs..."
                      required
                    ></textarea>
                  </div>

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Localisation *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newOffer.location}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="ex: Paris, Lyon..."
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Durée *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newOffer.duration}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="ex: 6 mois"
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Gratification (€/mois) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newOffer.salary}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre max de candidatures</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newOffer.maxApplications}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, maxApplications: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Date de début *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newOffer.startDate}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de fin *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newOffer.endDate}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Compétences requises *</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newOffer.requirements}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="ex: React, Node.js, Git (séparées par des virgules)"
                      required
                    ></textarea>
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Technologies (optionnel)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newOffer.technologies}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, technologies: e.target.value }))}
                      placeholder="ex: React, TypeScript, MongoDB"
                    />
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isUrgent"
                          checked={newOffer.isUrgent}
                          onChange={(e) => setNewOffer(prev => ({ ...prev, isUrgent: e.target.checked }))}
                        />
                        <label className="form-check-label" htmlFor="isUrgent">
                          Offre urgente
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isFeatured"
                          checked={newOffer.isFeatured}
                          onChange={(e) => setNewOffer(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        />
                        <label className="form-check-label" htmlFor="isFeatured">
                          Mettre en avant
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
                  onClick={() => setShowAddModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleAddOffer}
                >
                  <FaPlus className="me-2" />
                  Créer l'offre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Modifier Offre */}
      {showModal && selectedOffer && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaEdit className="me-2" />
                  Modifier l'offre
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label className="form-label">Titre du poste</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedOffer.titre}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Type</label>
                      <select className="form-select" defaultValue={selectedOffer.domaine}>
                        {types.map(type => (
                          <option key={type} value={type}>
                            {type === 'stage' ? 'Stage' :
                             type === 'alternance' ? 'Alternance' : 'Emploi'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      defaultValue={selectedOffer.description}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Lieu</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedOffer.lieu}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Rémunération</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedOffer.remuneration.toString()}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date de début</label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={selectedOffer.dateDebut}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date de fin</label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={selectedOffer.dateFin}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date d'expiration</label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={selectedOffer.dateFin}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre de places</label>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={selectedOffer.nbCandidaturesMax}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Profil recherché</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={selectedOffer.exigences.join(', ')}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Statut</label>
                    <select className="form-select" defaultValue={selectedOffer.statut}>
                      {statuts.map(statut => (
                        <option key={statut} value={statut}>
                          {statut === 'active' ? 'Active' :
                           statut === 'inactive' ? 'Inactive' :
                           statut === 'en_attente' ? 'En attente' : 'Expirée'}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <FaSave className="me-2" />
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && offreToDelete && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer l'offre <strong>"{selectedOffer?.titre}"</strong> ?
                </p>
                <p className="text-danger">
                  Cette action supprimera également toutes les candidatures associées.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showModal || showDeleteModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default MesOffres; 