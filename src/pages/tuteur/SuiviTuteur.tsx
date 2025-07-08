import React, { useState } from 'react';
import { 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaEye, 
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
  FaStar,
  FaBuilding,
  FaGraduationCap,
  FaFileAlt,
  FaDownload,
  FaPlus,
  FaMapMarkerAlt,
  FaPhone
} from 'react-icons/fa';

interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  entreprise: string;
  stage: string;
  statut: 'en_cours' | 'termine' | 'en_attente' | 'suspendu';
  dateDebut: string;
  dateFin: string;
  progression: number;
  noteGlobale: number;
  derniereActivite: string;
  tuteurEntreprise: string;
  responsable: string;
  derniereEvaluation: string;
  prochaineEvaluation: string;
}

interface Evaluation {
  id: number;
  stagiaire: string;
  date: string;
  type: 'mi_parcours' | 'finale' | 'hebdomadaire';
  note: number;
  commentaires: string;
  statut: 'en_attente' | 'terminee' | 'en_cours';
}

const SuiviTuteur: React.FC = () => {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([
    {
      id: 1,
      nom: "Koné",
      prenom: "Fatou",
      email: "fatou.kone@email.com",
      telephone: "+225 07 08 12 34 56",
      entreprise: "Tech Solutions SARL",
      stage: "Développement Web Full-Stack",
      statut: "en_cours",
      dateDebut: "2024-01-02",
      dateFin: "2024-06-30",
      progression: 75,
      noteGlobale: 4.2,
      derniereActivite: "Il y a 2 heures",
      tuteurEntreprise: "M. Diallo",
      responsable: "Dr. Traoré",
      derniereEvaluation: "2024-01-08",
      prochaineEvaluation: "2024-01-15"
    },
    {
      id: 2,
      nom: "Traoré",
      prenom: "Moussa",
      email: "moussa.traore@email.com",
      telephone: "+225 07 08 12 34 57",
      entreprise: "Finance Plus SA",
      stage: "Analyse Financière",
      statut: "en_cours",
      dateDebut: "2024-01-05",
      dateFin: "2024-07-15",
      progression: 60,
      noteGlobale: 3.8,
      derniereActivite: "Il y a 1 jour",
      tuteurEntreprise: "Mme. Ouattara",
      responsable: "Dr. Koné",
      derniereEvaluation: "2024-01-10",
      prochaineEvaluation: "2024-01-17"
    },
    {
      id: 3,
      nom: "Ouattara",
      prenom: "Aminata",
      email: "aminata.ouattara@email.com",
      telephone: "+225 07 08 12 34 58",
      entreprise: "Digital Marketing Pro",
      stage: "Marketing Digital",
      statut: "termine",
      dateDebut: "2023-09-01",
      dateFin: "2024-01-15",
      progression: 100,
      noteGlobale: 4.5,
      derniereActivite: "Il y a 3 jours",
      tuteurEntreprise: "M. Bamba",
      responsable: "Dr. Traoré",
      derniereEvaluation: "2024-01-12",
      prochaineEvaluation: "Terminé"
    },
    {
      id: 4,
      nom: "Bamba",
      prenom: "Kouassi",
      email: "kouassi.bamba@email.com",
      telephone: "+225 07 08 12 34 59",
      entreprise: "Construction Moderne",
      stage: "Gestion de Projet BTP",
      statut: "en_attente",
      dateDebut: "2024-02-01",
      dateFin: "2024-08-31",
      progression: 25,
      noteGlobale: 3.5,
      derniereActivite: "Il y a 5 jours",
      tuteurEntreprise: "M. Koné",
      responsable: "Dr. Ouattara",
      derniereEvaluation: "2024-01-05",
      prochaineEvaluation: "2024-01-20"
    }
  ]);

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    {
      id: 1,
      stagiaire: "Fatou Koné",
      date: "2024-01-08",
      type: "mi_parcours",
      note: 4.2,
      commentaires: "Excellente progression technique, bonne intégration dans l'équipe.",
      statut: "terminee"
    },
    {
      id: 2,
      stagiaire: "Moussa Traoré",
      date: "2024-01-10",
      type: "hebdomadaire",
      note: 3.8,
      commentaires: "Bon travail sur l'analyse des données financières.",
      statut: "terminee"
    },
    {
      id: 3,
      stagiaire: "Aminata Ouattara",
      date: "2024-01-12",
      type: "finale",
      note: 4.5,
      commentaires: "Stage excellent, toutes les compétences acquises avec brio.",
      statut: "terminee"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterEntreprise, setFilterEntreprise] = useState('');
  const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('suivi');

  const statuts = ['en_cours', 'termine', 'en_attente', 'suspendu'];
  const entreprises = ['Tech Solutions SARL', 'Finance Plus SA', 'Digital Marketing Pro', 'Construction Moderne'];

  const filteredStagiaires = stagiaires.filter(stagiaire => {
    const matchesSearch = 
      stagiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stagiaire.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = !filterStatut || stagiaire.statut === filterStatut;
    const matchesEntreprise = !filterEntreprise || stagiaire.entreprise === filterEntreprise;
    
    return matchesSearch && matchesStatut && matchesEntreprise;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return <span className="badge bg-primary"><FaClock /> En cours</span>;
      case 'termine':
        return <span className="badge bg-success"><FaCheckCircle /> Terminé</span>;
      case 'en_attente':
        return <span className="badge bg-warning"><FaExclamationTriangle /> En attente</span>;
      case 'suspendu':
        return <span className="badge bg-danger"><FaExclamationTriangle /> Suspendu</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
  };

  const getNoteStars = (note: number) => {
    return '★'.repeat(Math.floor(note)) + '☆'.repeat(5 - Math.floor(note));
  };

  const handleVoirDetails = (stagiaire: Stagiaire) => {
    setSelectedStagiaire(stagiaire);
    setShowModal(true);
  };

  const getEvaluationsStagiaire = (stagiaireId: number) => {
    return evaluations.filter(evaluation => evaluation.stagiaire.includes(stagiaires.find(s => s.id === stagiaireId)?.prenom || ''));
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaUsers className="me-2 text-primary" />
            Suivi des Stagiaires
          </h1>
          <p className="text-muted">Suivez et évaluez vos stagiaires</p>
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
                    Total Stagiaires
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stagiaires.length}</div>
                </div>
                <div className="col-auto">
                  <FaUsers className="fa-2x text-gray-300" />
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
                    Stages en Cours
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stagiaires.filter(s => s.statut === 'en_cours').length}
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
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Note Moyenne
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {(stagiaires.reduce((sum, s) => sum + s.noteGlobale, 0) / stagiaires.length).toFixed(1)}
                  </div>
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
                    Évaluations à faire
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {stagiaires.filter(s => s.statut === 'en_cours').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaFileAlt className="fa-2x text-gray-300" />
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
                  placeholder="Rechercher un stagiaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <option value="">Tous les statuts</option>
                {statuts.map(statut => (
                  <option key={statut} value={statut}>
                    {statut === 'en_cours' ? 'En cours' : 
                     statut === 'termine' ? 'Terminé' : 
                     statut === 'en_attente' ? 'En attente' : 'Suspendu'}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filterEntreprise}
                onChange={(e) => setFilterEntreprise(e.target.value)}
              >
                <option value="">Toutes les entreprises</option>
                {entreprises.map(entreprise => (
                  <option key={entreprise} value={entreprise}>{entreprise}</option>
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
                className={`nav-link ${activeTab === 'suivi' ? 'active' : ''}`}
                onClick={() => setActiveTab('suivi')}
              >
                <FaUsers className="me-2" />
                Suivi des Stagiaires
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'evaluations' ? 'active' : ''}`}
                onClick={() => setActiveTab('evaluations')}
              >
                <FaStar className="me-2" />
                Évaluations
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === 'suivi' && (
            <div className="table-responsive">
              <table className="table table-bordered" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Stagiaire</th>
                    <th>Entreprise</th>
                    <th>Stage</th>
                    <th>Statut</th>
                    <th>Progression</th>
                    <th>Note</th>
                    <th>Prochaine Évaluation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStagiaires.map(stagiaire => (
                    <tr key={stagiaire.id}>
                      <td>
                        <div>
                          <strong>{stagiaire.prenom} {stagiaire.nom}</strong>
                          <br />
                          <small className="text-muted">
                            <FaEnvelope className="me-1" />
                            {stagiaire.email}
                          </small>
                          <br />
                          <small className="text-muted">
                            <FaPhone className="me-1" />
                            {stagiaire.telephone}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaBuilding className="me-1 text-muted" />
                          {stagiaire.entreprise}
                          <br />
                          <small className="text-muted">
                            Tuteur: {stagiaire.tuteurEntreprise}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaGraduationCap className="me-1 text-muted" />
                          {stagiaire.stage}
                          <br />
                          <small className="text-muted">
                            {stagiaire.dateDebut} - {stagiaire.dateFin}
                          </small>
                        </div>
                      </td>
                      <td>{getStatutBadge(stagiaire.statut)}</td>
                      <td>
                        <div className="progress" style={{ height: '20px' }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${stagiaire.progression}%` }}
                          >
                            {stagiaire.progression}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-warning">
                          {getNoteStars(stagiaire.noteGlobale)}
                          <span className="text-muted ms-1">({stagiaire.noteGlobale})</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaCalendarAlt className="me-1 text-muted" />
                          {stagiaire.prochaineEvaluation}
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleVoirDetails(stagiaire)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Évaluer"
                          >
                            <FaStar />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            title="Contacter"
                          >
                            <FaEnvelope />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'evaluations' && (
            <div className="table-responsive">
              <table className="table table-bordered" width="100%" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Stagiaire</th>
                    <th>Type d'évaluation</th>
                    <th>Date</th>
                    <th>Note</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map(evaluation => (
                    <tr key={evaluation.id}>
                      <td>
                        <strong>{evaluation.stagiaire}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {evaluation.type === 'mi_parcours' ? 'Mi-parcours' :
                           evaluation.type === 'finale' ? 'Finale' : 'Hebdomadaire'}
                        </span>
                      </td>
                      <td>
                        <FaCalendarAlt className="me-1 text-muted" />
                        {evaluation.date}
                      </td>
                      <td>
                        <div className="text-warning">
                          {getNoteStars(evaluation.note)}
                          <span className="text-muted ms-1">({evaluation.note})</span>
                        </div>
                      </td>
                      <td>
                        {evaluation.statut === 'terminee' ? 
                          <span className="badge bg-success"><FaCheckCircle /> Terminée</span> :
                          evaluation.statut === 'en_cours' ?
                          <span className="badge bg-warning"><FaClock /> En cours</span> :
                          <span className="badge bg-secondary"><FaExclamationTriangle /> En attente</span>
                        }
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-primary" title="Voir détails">
                            <FaEye />
                          </button>
                          <button className="btn btn-sm btn-outline-warning" title="Modifier">
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-info" title="Télécharger">
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
        </div>
      </div>

      {/* Modal Détails Stagiaire */}
      {showModal && selectedStagiaire && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Détails du stagiaire - {selectedStagiaire.prenom} {selectedStagiaire.nom}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations personnelles</h6>
                    <p><strong>Email:</strong> {selectedStagiaire.email}</p>
                    <p><strong>Téléphone:</strong> {selectedStagiaire.telephone}</p>
                    <p><strong>Statut:</strong> {getStatutBadge(selectedStagiaire.statut)}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informations du stage</h6>
                    <p><strong>Entreprise:</strong> {selectedStagiaire.entreprise}</p>
                    <p><strong>Stage:</strong> {selectedStagiaire.stage}</p>
                    <p><strong>Tuteur entreprise:</strong> {selectedStagiaire.tuteurEntreprise}</p>
                    <p><strong>Responsable:</strong> {selectedStagiaire.responsable}</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Progression</h6>
                    <div className="progress mb-3" style={{ height: '25px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${selectedStagiaire.progression}%` }}
                      >
                        {selectedStagiaire.progression}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Évaluations</h6>
                    <p><strong>Note globale:</strong> 
                      <span className="text-warning ms-2">
                        {getNoteStars(selectedStagiaire.noteGlobale)} ({selectedStagiaire.noteGlobale})
                      </span>
                    </p>
                    <p><strong>Dernière évaluation:</strong> {selectedStagiaire.derniereEvaluation}</p>
                    <p><strong>Prochaine évaluation:</strong> {selectedStagiaire.prochaineEvaluation}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Période</h6>
                    <p><strong>Date de début:</strong> {selectedStagiaire.dateDebut}</p>
                    <p><strong>Date de fin:</strong> {selectedStagiaire.dateFin}</p>
                    <p><strong>Dernière activité:</strong> {selectedStagiaire.derniereActivite}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fermer
                </button>
                <button type="button" className="btn btn-primary">
                  <FaStar className="me-2" />
                  Évaluer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default SuiviTuteur; 