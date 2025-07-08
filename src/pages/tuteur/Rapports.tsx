import React, { useState } from 'react';
import { 
  FaFileAlt, 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaDownload,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaEnvelope,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChartBar,
  FaPrint,
  FaShare
} from 'react-icons/fa';

interface Rapport {
  id: number;
  titre: string;
  stagiaire: string;
  stagiaireId: number;
  type: 'hebdomadaire' | 'mensuel' | 'mi_parcours' | 'final' | 'incident';
  dateCreation: string;
  dateModification: string;
  statut: 'brouillon' | 'en_revision' | 'valide' | 'publie';
  contenu: string;
  resume: string;
  noteGlobale: number;
  pointsPositifs: string[];
  pointsAmelioration: string[];
  recommandations: string;
  tuteurEntreprise: string;
  entreprise: string;
  stage: string;
  periode: string;
  fichiers: string[];
  motsCles: string[];
}

const Rapports: React.FC = () => {
  const [rapports, setRapports] = useState<Rapport[]>([
    {
      id: 1,
      titre: "Rapport hebdomadaire - Fatou Koné - Semaine 2",
      stagiaire: "Fatou Koné",
      stagiaireId: 1,
      type: "hebdomadaire",
      dateCreation: "2024-01-08",
      dateModification: "2024-01-08",
      statut: "valide",
      contenu: "Fatou a continué son apprentissage du framework React avec succès. Elle a développé plusieurs composants réutilisables et a participé activement aux réunions d'équipe. Son intégration dans l'équipe se fait naturellement.",
      resume: "Excellente progression technique et bonne intégration dans l'équipe.",
      noteGlobale: 4.2,
      pointsPositifs: [
        "Excellente maîtrise de React",
        "Bonne communication avec l'équipe",
        "Autonomie dans le développement"
      ],
      pointsAmelioration: [
        "Améliorer la documentation du code",
        "Participer davantage aux revues de code"
      ],
      recommandations: "Continuer dans cette voie, excellent potentiel.",
      tuteurEntreprise: "M. Diallo",
      entreprise: "Tech Solutions SARL",
      stage: "Développement Web Full-Stack",
      periode: "Semaine 2 (8-12 janvier 2024)",
      fichiers: ["rapport_hebdo_semaine2.pdf", "exemples_code.zip"],
      motsCles: ["React", "Développement", "Intégration", "Autonomie"]
    },
    {
      id: 2,
      titre: "Rapport mensuel - Moussa Traoré - Janvier 2024",
      stagiaire: "Moussa Traoré",
      stagiaireId: 2,
      type: "mensuel",
      dateCreation: "2024-01-31",
      dateModification: "2024-02-01",
      statut: "en_revision",
      contenu: "Moussa a réalisé d'excellentes analyses financières pour plusieurs projets. Il maîtrise bien les outils Excel et les logiciels d'analyse financière. Quelques améliorations nécessaires dans la présentation des résultats.",
      resume: "Bon travail d'analyse, amélioration nécessaire en communication.",
      noteGlobale: 3.8,
      pointsPositifs: [
        "Excellente maîtrise des outils d'analyse",
        "Rigueur dans les calculs",
        "Ponctualité et assiduité"
      ],
      pointsAmelioration: [
        "Améliorer la présentation des résultats",
        "Développer la communication orale"
      ],
      recommandations: "Travailler sur la présentation et la communication.",
      tuteurEntreprise: "Mme. Ouattara",
      entreprise: "Finance Plus SA",
      stage: "Analyse Financière",
      periode: "Janvier 2024",
      fichiers: ["rapport_mensuel_janvier.pdf", "analyses_financieres.xlsx"],
      motsCles: ["Analyse", "Finance", "Excel", "Communication"]
    },
    {
      id: 3,
      titre: "Rapport final - Aminata Ouattara",
      stagiaire: "Aminata Ouattara",
      stagiaireId: 3,
      type: "final",
      dateCreation: "2024-01-15",
      dateModification: "2024-01-15",
      statut: "publie",
      contenu: "Stage excellent de bout en bout. Aminata a démontré une capacité d'adaptation exceptionnelle et une créativité remarquable dans ses campagnes marketing. Elle a contribué significativement à l'augmentation du trafic web de 40%.",
      resume: "Stage exceptionnel avec des résultats concrets et mesurables.",
      noteGlobale: 4.7,
      pointsPositifs: [
        "Créativité exceptionnelle",
        "Résultats mesurables (40% d'augmentation)",
        "Excellente capacité d'adaptation",
        "Leadership naturel"
      ],
      pointsAmelioration: [
        "Aucun point d'amélioration majeur"
      ],
      recommandations: "Excellent candidat pour un poste permanent.",
      tuteurEntreprise: "M. Bamba",
      entreprise: "Digital Marketing Pro",
      stage: "Marketing Digital",
      periode: "Septembre 2023 - Janvier 2024",
      fichiers: ["rapport_final.pdf", "portfolio_campagnes.pdf", "statistiques_performance.pdf"],
      motsCles: ["Marketing", "Digital", "Créativité", "Performance", "Leadership"]
    },
    {
      id: 4,
      titre: "Rapport d'incident - Kouassi Bamba",
      stagiaire: "Kouassi Bamba",
      stagiaireId: 4,
      type: "incident",
      dateCreation: "2024-01-10",
      dateModification: "2024-01-10",
      statut: "valide",
      contenu: "Incident mineur lors de la gestion d'un planning de chantier. Kouassi a mal interprété les priorités, causant un léger retard. Il a reconnu son erreur et proposé des solutions pour éviter que cela ne se reproduise.",
      resume: "Incident mineur avec bonne prise de conscience et solutions proposées.",
      noteGlobale: 3.2,
      pointsPositifs: [
        "Reconnaissance de l'erreur",
        "Propositions de solutions",
        "Attitude constructive"
      ],
      pointsAmelioration: [
        "Améliorer la compréhension des priorités",
        "Développer la communication avec les équipes"
      ],
      recommandations: "Renforcer la formation sur la gestion des priorités.",
      tuteurEntreprise: "M. Koné",
      entreprise: "Construction Moderne",
      stage: "Gestion de Projet BTP",
      periode: "10 janvier 2024",
      fichiers: ["rapport_incident.pdf", "plan_amelioration.pdf"],
      motsCles: ["Incident", "Gestion", "Priorités", "Communication"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterStagiaire, setFilterStagiaire] = useState('');
  const [sortField, setSortField] = useState('dateCreation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rapportToDelete, setRapportToDelete] = useState<Rapport | null>(null);
  const [activeTab, setActiveTab] = useState('liste');

  const types = ['hebdomadaire', 'mensuel', 'mi_parcours', 'final', 'incident'];
  const statuts = ['brouillon', 'en_revision', 'valide', 'publie'];
  const stagiaires = ['Fatou Koné', 'Moussa Traoré', 'Aminata Ouattara', 'Kouassi Bamba'];

  const filteredRapports = rapports.filter(rapport => {
    const matchesSearch = 
      rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.contenu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.stagiaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.motsCles.some(mot => mot.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !filterType || rapport.type === filterType;
    const matchesStatut = !filterStatut || rapport.statut === filterStatut;
    const matchesStagiaire = !filterStagiaire || rapport.stagiaire === filterStagiaire;
    
    return matchesSearch && matchesType && matchesStatut && matchesStagiaire;
  });

  // Tri des rapports
  const sortedRapports = [...filteredRapports].sort((a, b) => {
    let aValue = a[sortField as keyof Rapport];
    let bValue = b[sortField as keyof Rapport];
    
    if (sortField === 'dateCreation' || sortField === 'dateModification') {
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

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'brouillon':
        return <span className="badge bg-secondary"><FaClock /> Brouillon</span>;
      case 'en_revision':
        return <span className="badge bg-warning"><FaExclamationTriangle /> En révision</span>;
      case 'valide':
        return <span className="badge bg-success"><FaCheckCircle /> Validé</span>;
      case 'publie':
        return <span className="badge bg-info"><FaCheckCircle /> Publié</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'hebdomadaire':
        return <span className="badge bg-primary">Hebdomadaire</span>;
      case 'mensuel':
        return <span className="badge bg-info">Mensuel</span>;
      case 'mi_parcours':
        return <span className="badge bg-warning">Mi-parcours</span>;
      case 'final':
        return <span className="badge bg-danger">Final</span>;
      case 'incident':
        return <span className="badge bg-dark">Incident</span>;
      default:
        return <span className="badge bg-secondary">{type}</span>;
    }
  };

  const getNoteStars = (note: number) => {
    return '★'.repeat(Math.floor(note)) + '☆'.repeat(5 - Math.floor(note));
  };

  const getNoteColor = (note: number) => {
    if (note >= 4.5) return 'text-success';
    if (note >= 4.0) return 'text-primary';
    if (note >= 3.5) return 'text-warning';
    return 'text-danger';
  };

  const handleEdit = (rapport: Rapport) => {
    setSelectedRapport(rapport);
    setShowModal(true);
  };

  const handleDelete = (rapport: Rapport) => {
    setRapportToDelete(rapport);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (rapportToDelete) {
      setRapports(rapports.filter(r => r.id !== rapportToDelete.id));
      setShowDeleteModal(false);
      setRapportToDelete(null);
    }
  };

  const totalRapports = rapports.length;
  const rapportsValides = rapports.filter(r => r.statut === 'valide' || r.statut === 'publie').length;
  const noteMoyenne = rapports.length > 0 
    ? rapports.reduce((sum, r) => sum + r.noteGlobale, 0) / rapports.length 
    : 0;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaFileAlt className="me-2 text-primary" />
            Rapports de Suivi
          </h1>
          <p className="text-muted">Gérez et consultez les rapports de suivi de vos stagiaires</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            Nouveau rapport
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
                    Total Rapports
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{totalRapports}</div>
                </div>
                <div className="col-auto">
                  <FaFileAlt className="fa-2x text-gray-300" />
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
                    Rapports Validés
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{rapportsValides}</div>
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

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    En Révision
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {rapports.filter(r => r.statut === 'en_revision').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaExclamationTriangle className="fa-2x text-gray-300" />
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
            <div className="col-md-3 mb-3">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un rapport..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">Tous les types</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'hebdomadaire' ? 'Hebdomadaire' :
                     type === 'mensuel' ? 'Mensuel' :
                     type === 'mi_parcours' ? 'Mi-parcours' :
                     type === 'final' ? 'Final' : 'Incident'}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <select
                className="form-select"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <option value="">Tous statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>
                    {statut === 'brouillon' ? 'Brouillon' :
                     statut === 'en_revision' ? 'En révision' :
                     statut === 'valide' ? 'Validé' : 'Publié'}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filterStagiaire}
                onChange={(e) => setFilterStagiaire(e.target.value)}
              >
                <option value="">Tous stagiaires</option>
                {stagiaires.map(stagiaire => (
                  <option key={stagiaire} value={stagiaire}>{stagiaire}</option>
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
                className={`nav-link ${activeTab === 'liste' ? 'active' : ''}`}
                onClick={() => setActiveTab('liste')}
              >
                <FaFileAlt className="me-2" />
                Liste des Rapports
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'statistiques' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistiques')}
              >
                <FaChartBar className="me-2" />
                Statistiques
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'liste' && (
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
                    <th>Stagiaire</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Note</th>
                    <th>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleSort('dateCreation')}
                      >
                        Date Création {getSortIcon('dateCreation')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRapports.map(rapport => (
                    <tr key={rapport.id}>
                      <td>
                        <div>
                          <strong>{rapport.titre}</strong>
                          <br />
                          <small className="text-muted">{rapport.resume}</small>
                          <br />
                          <small className="text-muted">
                            <FaCalendarAlt className="me-1" />
                            {rapport.periode}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{rapport.stagiaire}</strong>
                          <br />
                          <small className="text-muted">{rapport.stage}</small>
                          <br />
                          <small className="text-muted">
                            <FaUsers className="me-1" />
                            {rapport.entreprise}
                          </small>
                        </div>
                      </td>
                      <td>{getTypeBadge(rapport.type)}</td>
                      <td>{getStatutBadge(rapport.statut)}</td>
                      <td>
                        <div className={`${getNoteColor(rapport.noteGlobale)}`}>
                          {getNoteStars(rapport.noteGlobale)}
                          <span className="ms-1">({rapport.noteGlobale})</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaCalendarAlt className="me-1 text-muted" />
                          {rapport.dateCreation}
                          {rapport.dateModification !== rapport.dateCreation && (
                            <>
                              <br />
                              <small className="text-muted">
                                Modifié: {rapport.dateModification}
                              </small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(rapport)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(rapport)}
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
                            title="Télécharger"
                          >
                            <FaDownload />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Imprimer"
                          >
                            <FaPrint />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'statistiques' && (
            <div className="row">
              <div className="col-md-6">
                <h6>Répartition par type de rapport</h6>
                <div className="chart-container mb-4">
                  {types.map(type => {
                    const count = rapports.filter(r => r.type === type).length;
                    const percentage = rapports.length > 0 ? (count / rapports.length) * 100 : 0;
                    return (
                      <div key={type} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-xs font-weight-bold">
                            {type === 'hebdomadaire' ? 'Hebdomadaire' :
                             type === 'mensuel' ? 'Mensuel' :
                             type === 'mi_parcours' ? 'Mi-parcours' :
                             type === 'final' ? 'Final' : 'Incident'}
                          </span>
                          <span className="text-xs font-weight-bold">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="progress" style={{ height: '15px' }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-6">
                <h6>Répartition par statut</h6>
                <div className="chart-container">
                  {statuts.map(statut => {
                    const count = rapports.filter(r => r.statut === statut).length;
                    const percentage = rapports.length > 0 ? (count / rapports.length) * 100 : 0;
                    return (
                      <div key={statut} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-xs font-weight-bold">
                            {statut === 'brouillon' ? 'Brouillon' :
                             statut === 'en_revision' ? 'En révision' :
                             statut === 'valide' ? 'Validé' : 'Publié'}
                          </span>
                          <span className="text-xs font-weight-bold">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="progress" style={{ height: '15px' }}>
                          <div
                            className="progress-bar"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: statut === 'brouillon' ? '#6c757d' :
                                              statut === 'en_revision' ? '#ffc107' :
                                              statut === 'valide' ? '#28a745' : '#17a2b8'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && selectedRapport && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le rapport - {selectedRapport.titre}</h5>
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
                      <label className="form-label">Titre</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedRapport.titre}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Type de rapport</label>
                      <select className="form-select" defaultValue={selectedRapport.type}>
                        {types.map(type => (
                          <option key={type} value={type}>
                            {type === 'hebdomadaire' ? 'Hebdomadaire' :
                             type === 'mensuel' ? 'Mensuel' :
                             type === 'mi_parcours' ? 'Mi-parcours' :
                             type === 'final' ? 'Final' : 'Incident'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stagiaire</label>
                      <select className="form-select" defaultValue={selectedRapport.stagiaire}>
                        {stagiaires.map(stagiaire => (
                          <option key={stagiaire} value={stagiaire}>{stagiaire}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Statut</label>
                      <select className="form-select" defaultValue={selectedRapport.statut}>
                        {statuts.map(statut => (
                          <option key={statut} value={statut}>
                            {statut === 'brouillon' ? 'Brouillon' :
                             statut === 'en_revision' ? 'En révision' :
                             statut === 'valide' ? 'Validé' : 'Publié'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Résumé</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={selectedRapport.resume}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contenu détaillé</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      defaultValue={selectedRapport.contenu}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Note globale</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={selectedRapport.noteGlobale}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Période</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedRapport.periode}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Recommandations</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={selectedRapport.recommandations}
                    />
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
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && rapportToDelete && (
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
                  Êtes-vous sûr de vouloir supprimer le rapport <strong>"{rapportToDelete.titre}"</strong> ?
                </p>
                <p className="text-danger">
                  Cette action est irréversible.
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

export default Rapports; 