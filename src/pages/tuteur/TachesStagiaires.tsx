import React, { useState } from 'react';
import { 
  FaTasks, 
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
  FaStar,
  FaFileAlt,
  FaDownload,
  FaEnvelope,
  FaBell,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

interface Tache {
  id: number;
  titre: string;
  description: string;
  stagiaire: string;
  stagiaireId: number;
  type: 'evaluation' | 'suivi' | 'rapport' | 'autre';
  priorite: 'haute' | 'moyenne' | 'basse';
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'retard';
  dateCreation: string;
  dateEcheance: string;
  dateTerminaison?: string;
  note?: number;
  commentaires?: string;
  fichiers: string[];
}

interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  entreprise: string;
  stage: string;
  statut: 'en_cours' | 'termine' | 'en_attente';
}

const TachesStagiaires: React.FC = () => {
  const [taches, setTaches] = useState<Tache[]>([
    {
      id: 1,
      titre: "Évaluation mi-parcours - Fatou Koné",
      description: "Réaliser l'évaluation de mi-parcours pour Fatou Koné dans le cadre de son stage de développement web.",
      stagiaire: "Fatou Koné",
      stagiaireId: 1,
      type: "evaluation",
      priorite: "haute",
      statut: "en_attente",
      dateCreation: "2024-01-10",
      dateEcheance: "2024-01-15",
      fichiers: ["grille_evaluation.pdf", "rapport_stage.pdf"]
    },
    {
      id: 2,
      titre: "Suivi hebdomadaire - Moussa Traoré",
      description: "Point hebdomadaire avec Moussa Traoré pour faire le point sur ses activités d'analyse financière.",
      stagiaire: "Moussa Traoré",
      stagiaireId: 2,
      type: "suivi",
      priorite: "moyenne",
      statut: "en_cours",
      dateCreation: "2024-01-08",
      dateEcheance: "2024-01-12",
      fichiers: ["compte_rendu_semaine.pdf"]
    },
    {
      id: 3,
      titre: "Validation rapport final - Aminata Ouattara",
      description: "Valider le rapport final d'Aminata Ouattara pour son stage en marketing digital.",
      stagiaire: "Aminata Ouattara",
      stagiaireId: 3,
      type: "rapport",
      priorite: "haute",
      statut: "terminee",
      dateCreation: "2024-01-05",
      dateEcheance: "2024-01-10",
      dateTerminaison: "2024-01-09",
      note: 4.5,
      commentaires: "Excellent rapport, bien structuré et complet.",
      fichiers: ["rapport_final.pdf", "presentation.pdf"]
    },
    {
      id: 4,
      titre: "Évaluation initiale - Kouassi Bamba",
      description: "Première évaluation de Kouassi Bamba pour son stage en gestion de projet BTP.",
      stagiaire: "Kouassi Bamba",
      stagiaireId: 4,
      type: "evaluation",
      priorite: "moyenne",
      statut: "retard",
      dateCreation: "2024-01-03",
      dateEcheance: "2024-01-08",
      fichiers: ["grille_evaluation.pdf"]
    },
    {
      id: 5,
      titre: "Réunion de coordination",
      description: "Réunion de coordination avec les tuteurs d'entreprise pour faire le point sur les stages.",
      stagiaire: "Tous",
      stagiaireId: 0,
      type: "autre",
      priorite: "basse",
      statut: "en_attente",
      dateCreation: "2024-01-12",
      dateEcheance: "2024-01-20",
      fichiers: ["ordre_du_jour.pdf"]
    }
  ]);

  const [stagiaires] = useState<Stagiaire[]>([
    { id: 1, nom: "Koné", prenom: "Fatou", email: "fatou.kone@email.com", entreprise: "Tech Solutions SARL", stage: "Développement Web", statut: "en_cours" },
    { id: 2, nom: "Traoré", prenom: "Moussa", email: "moussa.traore@email.com", entreprise: "Finance Plus SA", stage: "Analyse Financière", statut: "en_cours" },
    { id: 3, nom: "Ouattara", prenom: "Aminata", email: "aminata.ouattara@email.com", entreprise: "Digital Marketing Pro", stage: "Marketing Digital", statut: "termine" },
    { id: 4, nom: "Bamba", prenom: "Kouassi", email: "kouassi.bamba@email.com", entreprise: "Construction Moderne", stage: "Gestion de Projet BTP", statut: "en_attente" }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPriorite, setFilterPriorite] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterStagiaire, setFilterStagiaire] = useState('');
  const [sortField, setSortField] = useState('dateEcheance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [selectedTache, setSelectedTache] = useState<Tache | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tacheToDelete, setTacheToDelete] = useState<Tache | null>(null);

  const types = ['evaluation', 'suivi', 'rapport', 'autre'];
  const priorites = ['haute', 'moyenne', 'basse'];
  const statuts = ['en_attente', 'en_cours', 'terminee', 'retard'];

  const filteredTaches = taches.filter(tache => {
    const matchesSearch = 
      tache.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tache.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tache.stagiaire.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || tache.type === filterType;
    const matchesPriorite = !filterPriorite || tache.priorite === filterPriorite;
    const matchesStatut = !filterStatut || tache.statut === filterStatut;
    const matchesStagiaire = !filterStagiaire || tache.stagiaire === filterStagiaire;
    
    return matchesSearch && matchesType && matchesPriorite && matchesStatut && matchesStagiaire;
  });

  // Tri des tâches
  const sortedTaches = [...filteredTaches].sort((a, b) => {
    let aValue = a[sortField as keyof Tache];
    let bValue = b[sortField as keyof Tache];
    
    if (sortField === 'dateEcheance' || sortField === 'dateCreation') {
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

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case 'haute':
        return <span className="badge bg-danger">Haute</span>;
      case 'moyenne':
        return <span className="badge bg-warning">Moyenne</span>;
      case 'basse':
        return <span className="badge bg-info">Basse</span>;
      default:
        return <span className="badge bg-secondary">{priorite}</span>;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <span className="badge bg-secondary"><FaClock /> En attente</span>;
      case 'en_cours':
        return <span className="badge bg-primary"><FaClock /> En cours</span>;
      case 'terminee':
        return <span className="badge bg-success"><FaCheckCircle /> Terminée</span>;
      case 'retard':
        return <span className="badge bg-danger"><FaExclamationTriangle /> En retard</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'evaluation':
        return <span className="badge bg-primary"><FaStar /> Évaluation</span>;
      case 'suivi':
        return <span className="badge bg-info"><FaUsers /> Suivi</span>;
      case 'rapport':
        return <span className="badge bg-success"><FaFileAlt /> Rapport</span>;
      case 'autre':
        return <span className="badge bg-secondary">Autre</span>;
      default:
        return <span className="badge bg-secondary">{type}</span>;
    }
  };

  const handleEdit = (tache: Tache) => {
    setSelectedTache(tache);
    setShowModal(true);
  };

  const handleDelete = (tache: Tache) => {
    setTacheToDelete(tache);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (tacheToDelete) {
      setTaches(taches.filter(t => t.id !== tacheToDelete.id));
      setShowDeleteModal(false);
      setTacheToDelete(null);
    }
  };

  const isEnRetard = (dateEcheance: string) => {
    return new Date(dateEcheance) < new Date();
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaTasks className="me-2 text-primary" />
            Tâches des Stagiaires
          </h1>
          <p className="text-muted">Gérez les tâches et évaluations de vos stagiaires</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            Nouvelle tâche
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
                    Total Tâches
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{taches.length}</div>
                </div>
                <div className="col-auto">
                  <FaTasks className="fa-2x text-gray-300" />
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
                    Tâches Terminées
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {taches.filter(t => t.statut === 'terminee').length}
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
                    {taches.filter(t => t.statut === 'en_cours').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaClock className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    En Retard
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {taches.filter(t => t.statut === 'retard').length}
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
                  placeholder="Rechercher une tâche..."
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
                    {type === 'evaluation' ? 'Évaluation' :
                     type === 'suivi' ? 'Suivi' :
                     type === 'rapport' ? 'Rapport' : 'Autre'}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <select
                className="form-select"
                value={filterPriorite}
                onChange={(e) => setFilterPriorite(e.target.value)}
              >
                <option value="">Toutes priorités</option>
                {priorites.map(priorite => (
                  <option key={priorite} value={priorite}>
                    {priorite === 'haute' ? 'Haute' :
                     priorite === 'moyenne' ? 'Moyenne' : 'Basse'}
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
                     statut === 'terminee' ? 'Terminée' : 'En retard'}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <select
                className="form-select"
                value={filterStagiaire}
                onChange={(e) => setFilterStagiaire(e.target.value)}
              >
                <option value="">Tous stagiaires</option>
                {stagiaires.map(stagiaire => (
                  <option key={stagiaire.id} value={stagiaire.prenom + ' ' + stagiaire.nom}>
                    {stagiaire.prenom} {stagiaire.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1 mb-3">
              <button className="btn btn-outline-secondary w-100">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tâches Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des Tâches</h6>
        </div>
        <div className="card-body">
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
                  <th>Priorité</th>
                  <th>Statut</th>
                  <th>
                    <button 
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => handleSort('dateEcheance')}
                    >
                      Échéance {getSortIcon('dateEcheance')}
                    </button>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTaches.map(tache => (
                  <tr key={tache.id} className={isEnRetard(tache.dateEcheance) && tache.statut !== 'terminee' ? 'table-warning' : ''}>
                    <td>
                      <div>
                        <strong>{tache.titre}</strong>
                        <br />
                        <small className="text-muted">{tache.description.substring(0, 100)}...</small>
                        {tache.fichiers.length > 0 && (
                          <div className="mt-1">
                            <small className="text-info">
                              <FaFileAlt className="me-1" />
                              {tache.fichiers.length} fichier(s)
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{tache.stagiaire}</strong>
                        <br />
                        <small className="text-muted">
                          {stagiaires.find(s => s.id === tache.stagiaireId)?.stage || 'N/A'}
                        </small>
                      </div>
                    </td>
                    <td>{getTypeBadge(tache.type)}</td>
                    <td>{getPrioriteBadge(tache.priorite)}</td>
                    <td>{getStatutBadge(tache.statut)}</td>
                    <td>
                      <div>
                        <FaCalendarAlt className="me-1 text-muted" />
                        {tache.dateEcheance}
                        {isEnRetard(tache.dateEcheance) && tache.statut !== 'terminee' && (
                          <div className="text-danger small">
                            <FaExclamationTriangle className="me-1" />
                            En retard
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(tache)}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(tache)}
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
                          title="Marquer comme terminée"
                        >
                          <FaCheckCircle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && selectedTache && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier la tâche</h5>
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
                        defaultValue={selectedTache.titre}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stagiaire</label>
                      <select className="form-select" defaultValue={selectedTache.stagiaire}>
                        {stagiaires.map(stagiaire => (
                          <option key={stagiaire.id} value={stagiaire.prenom + ' ' + stagiaire.nom}>
                            {stagiaire.prenom} {stagiaire.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={selectedTache.description}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Type</label>
                      <select className="form-select" defaultValue={selectedTache.type}>
                        {types.map(type => (
                          <option key={type} value={type}>
                            {type === 'evaluation' ? 'Évaluation' :
                             type === 'suivi' ? 'Suivi' :
                             type === 'rapport' ? 'Rapport' : 'Autre'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Priorité</label>
                      <select className="form-select" defaultValue={selectedTache.priorite}>
                        {priorites.map(priorite => (
                          <option key={priorite} value={priorite}>
                            {priorite === 'haute' ? 'Haute' :
                             priorite === 'moyenne' ? 'Moyenne' : 'Basse'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Statut</label>
                      <select className="form-select" defaultValue={selectedTache.statut}>
                        {statuts.map(statut => (
                          <option key={statut} value={statut}>
                            {statut === 'en_attente' ? 'En attente' :
                             statut === 'en_cours' ? 'En cours' :
                             statut === 'terminee' ? 'Terminée' : 'En retard'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date d'échéance</label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={selectedTache.dateEcheance}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Note (si applicable)</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        max="5"
                        step="0.1"
                        defaultValue={selectedTache.note}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Commentaires</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      defaultValue={selectedTache.commentaires}
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
      {showDeleteModal && tacheToDelete && (
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
                  Êtes-vous sûr de vouloir supprimer la tâche <strong>"{tacheToDelete.titre}"</strong> ?
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

export default TachesStagiaires; 