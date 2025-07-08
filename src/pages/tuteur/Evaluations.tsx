import React, { useState } from 'react';
import { 
  FaStar, 
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
  FaChartBar,
  FaThumbsUp,
  FaThumbsDown
} from 'react-icons/fa';

interface Evaluation {
  id: number;
  stagiaire: string;
  stagiaireId: number;
  type: 'mi_parcours' | 'finale' | 'hebdomadaire' | 'mensuelle';
  dateEvaluation: string;
  dateCreation: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'validee';
  noteGlobale: number;
  noteTechnique: number;
  noteComportementale: number;
  noteAutonomie: number;
  noteIntegration: number;
  commentaires: string;
  recommandations: string;
  tuteurEntreprise: string;
  entreprise: string;
  stage: string;
  fichiers: string[];
}

interface Critere {
  id: string;
  nom: string;
  description: string;
  note: number;
  commentaire: string;
}

const Evaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: 1,
      stagiaire: "Fatou Koné",
      stagiaireId: 1,
      type: "mi_parcours",
      dateEvaluation: "2024-01-08",
      dateCreation: "2024-01-05",
      statut: "terminee",
      noteGlobale: 4.2,
      noteTechnique: 4.5,
      noteComportementale: 4.0,
      noteAutonomie: 4.3,
      noteIntegration: 4.1,
      commentaires: "Excellente progression technique, bonne intégration dans l'équipe. Fatou démontre une réelle capacité d'apprentissage et une bonne autonomie dans ses tâches.",
      recommandations: "Continuer à développer les compétences en architecture logicielle et participer davantage aux réunions d'équipe.",
      tuteurEntreprise: "M. Diallo",
      entreprise: "Tech Solutions SARL",
      stage: "Développement Web Full-Stack",
      fichiers: ["grille_evaluation.pdf", "rapport_stage.pdf", "presentation.pdf"]
    },
    {
      id: 2,
      stagiaire: "Moussa Traoré",
      stagiaireId: 2,
      type: "hebdomadaire",
      dateEvaluation: "2024-01-10",
      dateCreation: "2024-01-08",
      statut: "en_cours",
      noteGlobale: 3.8,
      noteTechnique: 4.0,
      noteComportementale: 3.5,
      noteAutonomie: 3.8,
      noteIntegration: 4.0,
      commentaires: "Bon travail sur l'analyse des données financières. Moussa progresse bien mais doit améliorer sa communication avec l'équipe.",
      recommandations: "Travailler sur la présentation des résultats et participer plus activement aux discussions d'équipe.",
      tuteurEntreprise: "Mme. Ouattara",
      entreprise: "Finance Plus SA",
      stage: "Analyse Financière",
      fichiers: ["compte_rendu_semaine.pdf"]
    },
    {
      id: 3,
      stagiaire: "Aminata Ouattara",
      stagiaireId: 3,
      type: "finale",
      dateEvaluation: "2024-01-12",
      dateCreation: "2024-01-10",
      statut: "validee",
      noteGlobale: 4.5,
      noteTechnique: 4.7,
      noteComportementale: 4.3,
      noteAutonomie: 4.6,
      noteIntegration: 4.4,
      commentaires: "Stage excellent, toutes les compétences acquises avec brio. Aminata a démontré une excellente capacité d'adaptation et d'innovation.",
      recommandations: "Continuer dans cette voie, excellent potentiel pour une carrière en marketing digital.",
      tuteurEntreprise: "M. Bamba",
      entreprise: "Digital Marketing Pro",
      stage: "Marketing Digital",
      fichiers: ["rapport_final.pdf", "presentation_finale.pdf", "portfolio.pdf"]
    },
    {
      id: 4,
      stagiaire: "Kouassi Bamba",
      stagiaireId: 4,
      type: "mensuelle",
      dateEvaluation: "2024-01-05",
      dateCreation: "2024-01-03",
      statut: "en_attente",
      noteGlobale: 3.5,
      noteTechnique: 3.8,
      noteComportementale: 3.2,
      noteAutonomie: 3.5,
      noteIntegration: 3.7,
      commentaires: "Première évaluation positive mais des améliorations nécessaires dans la gestion du temps et la communication.",
      recommandations: "Améliorer la planification des tâches et la communication avec les parties prenantes.",
      tuteurEntreprise: "M. Koné",
      entreprise: "Construction Moderne",
      stage: "Gestion de Projet BTP",
      fichiers: ["grille_evaluation.pdf"]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterStagiaire, setFilterStagiaire] = useState('');
  const [sortField, setSortField] = useState('dateEvaluation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<Evaluation | null>(null);
  const [activeTab, setActiveTab] = useState('liste');

  const types = ['mi_parcours', 'finale', 'hebdomadaire', 'mensuelle'];
  const statuts = ['en_attente', 'en_cours', 'terminee', 'validee'];
  const stagiaires = ['Fatou Koné', 'Moussa Traoré', 'Aminata Ouattara', 'Kouassi Bamba'];

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = 
      evaluation.stagiaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.commentaires.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.entreprise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || evaluation.type === filterType;
    const matchesStatut = !filterStatut || evaluation.statut === filterStatut;
    const matchesStagiaire = !filterStagiaire || evaluation.stagiaire === filterStagiaire;
    
    return matchesSearch && matchesType && matchesStatut && matchesStagiaire;
  });

  // Tri des évaluations
  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    let aValue = a[sortField as keyof Evaluation];
    let bValue = b[sortField as keyof Evaluation];
    
    if (sortField === 'dateEvaluation' || sortField === 'dateCreation') {
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
      case 'en_attente':
        return <span className="badge bg-secondary"><FaClock /> En attente</span>;
      case 'en_cours':
        return <span className="badge bg-primary"><FaClock /> En cours</span>;
      case 'terminee':
        return <span className="badge bg-success"><FaCheckCircle /> Terminée</span>;
      case 'validee':
        return <span className="badge bg-info"><FaCheckCircle /> Validée</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'mi_parcours':
        return <span className="badge bg-warning">Mi-parcours</span>;
      case 'finale':
        return <span className="badge bg-danger">Finale</span>;
      case 'hebdomadaire':
        return <span className="badge bg-info">Hebdomadaire</span>;
      case 'mensuelle':
        return <span className="badge bg-primary">Mensuelle</span>;
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

  const handleEdit = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowModal(true);
  };

  const handleDelete = (evaluation: Evaluation) => {
    setEvaluationToDelete(evaluation);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (evaluationToDelete) {
      setEvaluations(evaluations.filter(e => e.id !== evaluationToDelete.id));
      setShowDeleteModal(false);
      setEvaluationToDelete(null);
    }
  };

  const moyenneGlobale = evaluations.length > 0 
    ? evaluations.reduce((sum, e) => sum + e.noteGlobale, 0) / evaluations.length 
    : 0;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaStar className="me-2 text-primary" />
            Évaluations des Stagiaires
          </h1>
          <p className="text-muted">Gérez et suivez les évaluations de vos stagiaires</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            Nouvelle évaluation
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
                    Total Évaluations
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{evaluations.length}</div>
                </div>
                <div className="col-auto">
                  <FaStar className="fa-2x text-gray-300" />
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
                    Note Moyenne
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{moyenneGlobale.toFixed(1)}</div>
                </div>
                <div className="col-auto">
                  <FaChartBar className="fa-2x text-gray-300" />
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
                    Évaluations Validées
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {evaluations.filter(e => e.statut === 'validee').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaCheckCircle className="fa-2x text-gray-300" />
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
                    En Cours
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {evaluations.filter(e => e.statut === 'en_cours').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaClock className="fa-2x text-gray-300" />
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
                  placeholder="Rechercher une évaluation..."
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
                    {type === 'mi_parcours' ? 'Mi-parcours' :
                     type === 'finale' ? 'Finale' :
                     type === 'hebdomadaire' ? 'Hebdomadaire' : 'Mensuelle'}
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
                    {statut === 'en_attente' ? 'En attente' :
                     statut === 'en_cours' ? 'En cours' :
                     statut === 'terminee' ? 'Terminée' : 'Validée'}
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
                <FaStar className="me-2" />
                Liste des Évaluations
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
                        onClick={() => handleSort('stagiaire')}
                      >
                        Stagiaire {getSortIcon('stagiaire')}
                      </button>
                    </th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Note Globale</th>
                    <th>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleSort('dateEvaluation')}
                      >
                        Date Évaluation {getSortIcon('dateEvaluation')}
                      </button>
                    </th>
                    <th>Entreprise</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEvaluations.map(evaluation => (
                    <tr key={evaluation.id}>
                      <td>
                        <div>
                          <strong>{evaluation.stagiaire}</strong>
                          <br />
                          <small className="text-muted">{evaluation.stage}</small>
                        </div>
                      </td>
                      <td>{getTypeBadge(evaluation.type)}</td>
                      <td>{getStatutBadge(evaluation.statut)}</td>
                      <td>
                        <div className={`${getNoteColor(evaluation.noteGlobale)}`}>
                          {getNoteStars(evaluation.noteGlobale)}
                          <span className="ms-1">({evaluation.noteGlobale})</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaCalendarAlt className="me-1 text-muted" />
                          {evaluation.dateEvaluation}
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaUsers className="me-1 text-muted" />
                          {evaluation.entreprise}
                          <br />
                          <small className="text-muted">
                            Tuteur: {evaluation.tuteurEntreprise}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(evaluation)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(evaluation)}
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
                <h6>Répartition par type d'évaluation</h6>
                <div className="chart-container mb-4">
                  {types.map(type => {
                    const count = evaluations.filter(e => e.type === type).length;
                    const percentage = evaluations.length > 0 ? (count / evaluations.length) * 100 : 0;
                    return (
                      <div key={type} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-xs font-weight-bold">
                            {type === 'mi_parcours' ? 'Mi-parcours' :
                             type === 'finale' ? 'Finale' :
                             type === 'hebdomadaire' ? 'Hebdomadaire' : 'Mensuelle'}
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
                <h6>Notes moyennes par critère</h6>
                <div className="chart-container">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Technique</span>
                      <span>{(evaluations.reduce((sum, e) => sum + e.noteTechnique, 0) / evaluations.length).toFixed(1)}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(evaluations.reduce((sum, e) => sum + e.noteTechnique, 0) / evaluations.length) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Comportementale</span>
                      <span>{(evaluations.reduce((sum, e) => sum + e.noteComportementale, 0) / evaluations.length).toFixed(1)}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${(evaluations.reduce((sum, e) => sum + e.noteComportementale, 0) / evaluations.length) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Autonomie</span>
                      <span>{(evaluations.reduce((sum, e) => sum + e.noteAutonomie, 0) / evaluations.length).toFixed(1)}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${(evaluations.reduce((sum, e) => sum + e.noteAutonomie, 0) / evaluations.length) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Intégration</span>
                      <span>{(evaluations.reduce((sum, e) => sum + e.noteIntegration, 0) / evaluations.length).toFixed(1)}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-info"
                        style={{ width: `${(evaluations.reduce((sum, e) => sum + e.noteIntegration, 0) / evaluations.length) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && selectedEvaluation && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier l'évaluation - {selectedEvaluation.stagiaire}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stagiaire</label>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedEvaluation.stagiaire}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Type d'évaluation</label>
                      <select className="form-select" defaultValue={selectedEvaluation.type}>
                        {types.map(type => (
                          <option key={type} value={type}>
                            {type === 'mi_parcours' ? 'Mi-parcours' :
                             type === 'finale' ? 'Finale' :
                             type === 'hebdomadaire' ? 'Hebdomadaire' : 'Mensuelle'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date d'évaluation</label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={selectedEvaluation.dateEvaluation}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Statut</label>
                      <select className="form-select" defaultValue={selectedEvaluation.statut}>
                        {statuts.map(statut => (
                          <option key={statut} value={statut}>
                            {statut === 'en_attente' ? 'En attente' :
                             statut === 'en_cours' ? 'En cours' :
                             statut === 'terminee' ? 'Terminée' : 'Validée'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Note Technique</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={selectedEvaluation.noteTechnique}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Note Comportementale</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={selectedEvaluation.noteComportementale}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Note Autonomie</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={selectedEvaluation.noteAutonomie}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Note Intégration</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={selectedEvaluation.noteIntegration}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Commentaires</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={selectedEvaluation.commentaires}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Recommandations</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      defaultValue={selectedEvaluation.recommandations}
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
      {showDeleteModal && evaluationToDelete && (
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
                  Êtes-vous sûr de vouloir supprimer l'évaluation de <strong>{evaluationToDelete.stagiaire}</strong> ?
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

export default Evaluations; 