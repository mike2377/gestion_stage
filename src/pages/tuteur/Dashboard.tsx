import React, { useState } from 'react';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaClock,
  FaGraduationCap,
  FaBuilding,
  FaChartLine,
  FaBell,
  FaEnvelope,
  FaFileAlt,
  FaStar,
  FaMapMarkerAlt
} from 'react-icons/fa';

interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  entreprise: string;
  stage: string;
  statut: 'en_cours' | 'termine' | 'en_attente';
  progression: number;
  derniereActivite: string;
  note: number;
}

interface Tache {
  id: number;
  titre: string;
  description: string;
  stagiaire: string;
  dateEcheance: string;
  priorite: 'haute' | 'moyenne' | 'basse';
  statut: 'en_attente' | 'en_cours' | 'terminee';
}

const Dashboard: React.FC = () => {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([
    {
      id: 1,
      nom: "Koné",
      prenom: "Fatou",
      email: "fatou.kone@email.com",
      entreprise: "Tech Solutions SARL",
      stage: "Développement Web Full-Stack",
      statut: "en_cours",
      progression: 75,
      derniereActivite: "Il y a 2 heures",
      note: 4.2
    },
    {
      id: 2,
      nom: "Traoré",
      prenom: "Moussa",
      email: "moussa.traore@email.com",
      entreprise: "Finance Plus SA",
      stage: "Analyse Financière",
      statut: "en_cours",
      progression: 60,
      derniereActivite: "Il y a 1 jour",
      note: 3.8
    },
    {
      id: 3,
      nom: "Ouattara",
      prenom: "Aminata",
      email: "aminata.ouattara@email.com",
      entreprise: "Digital Marketing Pro",
      stage: "Marketing Digital",
      statut: "termine",
      progression: 100,
      derniereActivite: "Il y a 3 jours",
      note: 4.5
    },
    {
      id: 4,
      nom: "Bamba",
      prenom: "Kouassi",
      email: "kouassi.bamba@email.com",
      entreprise: "Construction Moderne",
      stage: "Gestion de Projet BTP",
      statut: "en_attente",
      progression: 25,
      derniereActivite: "Il y a 5 jours",
      note: 3.5
    }
  ]);

  const [taches, setTaches] = useState<Tache[]>([
    {
      id: 1,
      titre: "Évaluation mi-parcours",
      description: "Réaliser l'évaluation de Fatou Koné",
      stagiaire: "Fatou Koné",
      dateEcheance: "2024-01-15",
      priorite: "haute",
      statut: "en_attente"
    },
    {
      id: 2,
      titre: "Suivi hebdomadaire",
      description: "Point hebdomadaire avec Moussa Traoré",
      stagiaire: "Moussa Traoré",
      dateEcheance: "2024-01-12",
      priorite: "moyenne",
      statut: "en_cours"
    },
    {
      id: 3,
      titre: "Validation rapport final",
      description: "Valider le rapport final d'Aminata Ouattara",
      stagiaire: "Aminata Ouattara",
      dateEcheance: "2024-01-10",
      priorite: "haute",
      statut: "terminee"
    }
  ]);

  const totalStagiaires = stagiaires.length;
  const stagiairesEnCours = stagiaires.filter(s => s.statut === 'en_cours').length;
  const stagiairesTermines = stagiaires.filter(s => s.statut === 'termine').length;
  const tachesEnAttente = taches.filter(t => t.statut === 'en_attente').length;

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_cours':
        return <span className="badge bg-primary"><FaClock /> En cours</span>;
      case 'termine':
        return <span className="badge bg-success"><FaCheckCircle /> Terminé</span>;
      case 'en_attente':
        return <span className="badge bg-warning"><FaExclamationTriangle /> En attente</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
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

  const getNoteStars = (note: number) => {
    return '★'.repeat(Math.floor(note)) + '☆'.repeat(5 - Math.floor(note));
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaTachometerAlt className="me-2 text-primary" />
            Tableau de Bord - Tuteur
          </h1>
          <p className="text-muted">Bienvenue, suivez vos stagiaires et gérez vos tâches</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaBell className="me-2" />
            Notifications (3)
          </button>
          <button className="btn btn-primary">
            <FaEnvelope className="me-2" />
            Nouveau message
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{totalStagiaires}</div>
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stagiairesEnCours}</div>
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
                    Stages Terminés
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stagiairesTermines}</div>
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
                    Tâches en Attente
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{tachesEnAttente}</div>
                </div>
                <div className="col-auto">
                  <FaExclamationTriangle className="fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Stagiaires */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaUsers className="me-2" />
                Mes Stagiaires
              </h6>
            </div>
            <div className="card-body">
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagiaires.map(stagiaire => (
                      <tr key={stagiaire.id}>
                        <td>
                          <div>
                            <strong>{stagiaire.prenom} {stagiaire.nom}</strong>
                            <br />
                            <small className="text-muted">{stagiaire.email}</small>
                            <br />
                            <small className="text-muted">
                              Dernière activité: {stagiaire.derniereActivite}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <FaBuilding className="me-1 text-muted" />
                            {stagiaire.entreprise}
                          </div>
                        </td>
                        <td>
                          <div>
                            <FaGraduationCap className="me-1 text-muted" />
                            {stagiaire.stage}
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
                            {getNoteStars(stagiaire.note)}
                            <span className="text-muted ms-1">({stagiaire.note})</span>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" title="Voir profil">
                              <FaUsers />
                            </button>
                            <button className="btn btn-sm btn-outline-success" title="Évaluer">
                              <FaStar />
                            </button>
                            <button className="btn btn-sm btn-outline-info" title="Contacter">
                              <FaEnvelope />
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
        </div>

        {/* Tâches et Activités */}
        <div className="col-xl-4 col-lg-5">
          {/* Tâches */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaCalendarAlt className="me-2" />
                Tâches Prioritaires
              </h6>
            </div>
            <div className="card-body">
              {taches.map(tache => (
                <div key={tache.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">{tache.titre}</h6>
                    {getPrioriteBadge(tache.priorite)}
                  </div>
                  <p className="text-muted small mb-2">{tache.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <FaUsers className="me-1" />
                      {tache.stagiaire}
                    </small>
                    <small className="text-muted">
                      <FaCalendarAlt className="me-1" />
                      {tache.dateEcheance}
                    </small>
                  </div>
                  <div className="mt-2">
                    <button className="btn btn-sm btn-outline-primary">
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activités récentes */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaChartLine className="me-2" />
                Activités Récentes
              </h6>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Évaluation soumise</h6>
                    <p className="text-muted small mb-0">Fatou Koné - Il y a 2 heures</p>
                  </div>
                </div>
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Rapport validé</h6>
                    <p className="text-muted small mb-0">Aminata Ouattara - Il y a 1 jour</p>
                  </div>
                </div>
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Nouveau stagiaire assigné</h6>
                    <p className="text-muted small mb-0">Kouassi Bamba - Il y a 3 jours</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Point hebdomadaire</h6>
                    <p className="text-muted small mb-0">Moussa Traoré - Il y a 5 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de progression */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaChartLine className="me-2" />
                Progression des Stages
              </h6>
            </div>
            <div className="card-body">
              <div className="chart-container" style={{ height: '300px' }}>
                <div className="d-flex align-items-end justify-content-between h-100">
                  {stagiaires.map((stagiaire, index) => (
                    <div key={stagiaire.id} className="d-flex flex-column align-items-center">
                      <div
                        className="bg-primary mb-2"
                        style={{
                          width: '40px',
                          height: `${(stagiaire.progression / 100) * 200}px`,
                          borderRadius: '4px'
                        }}
                      ></div>
                      <small className="text-muted text-center">
                        {stagiaire.prenom}<br />
                        {stagiaire.progression}%
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 