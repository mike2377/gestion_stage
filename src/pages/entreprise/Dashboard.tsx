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
  FaMapMarkerAlt,
  FaIndustry,
  FaHandshake
} from 'react-icons/fa';

interface Stagiaire {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  formation: string;
  statut: 'en_cours' | 'termine' | 'en_attente';
  progression: number;
  derniereActivite: string;
  note: number;
  tuteur: string;
  dateDebut: string;
  dateFin: string;
}

interface Offre {
  id: number;
  titre: string;
  description: string;
  statut: 'active' | 'inactive' | 'en_attente';
  nombreCandidatures: number;
  dateCreation: string;
  dateExpiration: string;
  type: 'stage' | 'alternance' | 'emploi';
}

const Dashboard: React.FC = () => {
  const [stagiaires, setStagiaires] = useState<Stagiaire[]>([
    {
      id: 1,
      nom: "Koné",
      prenom: "Fatou",
      email: "fatou.kone@email.com",
      formation: "Développement Web Full-Stack",
      statut: "en_cours",
      progression: 75,
      derniereActivite: "Il y a 2 heures",
      note: 4.2,
      tuteur: "M. Diallo",
      dateDebut: "2024-01-02",
      dateFin: "2024-06-30"
    },
    {
      id: 2,
      nom: "Traoré",
      prenom: "Moussa",
      email: "moussa.traore@email.com",
      formation: "Analyse Financière",
      statut: "en_cours",
      progression: 60,
      derniereActivite: "Il y a 1 jour",
      note: 3.8,
      tuteur: "Mme. Ouattara",
      dateDebut: "2024-01-05",
      dateFin: "2024-07-15"
    },
    {
      id: 3,
      nom: "Ouattara",
      prenom: "Aminata",
      email: "aminata.ouattara@email.com",
      formation: "Marketing Digital",
      statut: "termine",
      progression: 100,
      derniereActivite: "Il y a 3 jours",
      note: 4.5,
      tuteur: "M. Bamba",
      dateDebut: "2023-09-01",
      dateFin: "2024-01-15"
    }
  ]);

  const [offres, setOffres] = useState<Offre[]>([
    {
      id: 1,
      titre: "Stage Développeur Full-Stack",
      description: "Stage de 6 mois en développement web avec React et Node.js",
      statut: "active",
      nombreCandidatures: 12,
      dateCreation: "2024-01-05",
      dateExpiration: "2024-02-15",
      type: "stage"
    },
    {
      id: 2,
      titre: "Alternance Analyste Financier",
      description: "Alternance en analyse financière pour étudiants en Master",
      statut: "active",
      nombreCandidatures: 8,
      dateCreation: "2024-01-10",
      dateExpiration: "2024-03-01",
      type: "alternance"
    },
    {
      id: 3,
      titre: "Stage Marketing Digital",
      description: "Stage de 4 mois en marketing digital et réseaux sociaux",
      statut: "inactive",
      nombreCandidatures: 15,
      dateCreation: "2023-12-01",
      dateExpiration: "2024-01-15",
      type: "stage"
    }
  ]);

  const totalStagiaires = stagiaires.length;
  const stagiairesEnCours = stagiaires.filter(s => s.statut === 'en_cours').length;
  const stagiairesTermines = stagiaires.filter(s => s.statut === 'termine').length;
  const offresActives = offres.filter(o => o.statut === 'active').length;
  const totalCandidatures = offres.reduce((sum, offre) => sum + offre.nombreCandidatures, 0);

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

  const getStatutOffreBadge = (statut: string) => {
    switch (statut) {
      case 'active':
        return <span className="badge bg-success"><FaCheckCircle /> Active</span>;
      case 'inactive':
        return <span className="badge bg-secondary"><FaTimes /> Inactive</span>;
      case 'en_attente':
        return <span className="badge bg-warning"><FaExclamationTriangle /> En attente</span>;
      default:
        return <span className="badge bg-secondary">{statut}</span>;
    }
  };

  const getTypeOffreBadge = (type: string) => {
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
            Tableau de Bord - Entreprise
          </h1>
          <p className="text-muted">Bienvenue, suivez vos stagiaires et gérez vos offres</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaBell className="me-2" />
            Notifications (2)
          </button>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            Nouvelle offre
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
                    Offres Actives
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{offresActives}</div>
                </div>
                <div className="col-auto">
                  <FaHandshake className="fa-2x text-gray-300" />
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
                    Total Candidatures
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{totalCandidatures}</div>
                </div>
                <div className="col-auto">
                  <FaFileAlt className="fa-2x text-gray-300" />
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
                      <th>Formation</th>
                      <th>Statut</th>
                      <th>Progression</th>
                      <th>Note</th>
                      <th>Tuteur</th>
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
                            <small className="text-muted">
                              <FaEnvelope className="me-1" />
                              {stagiaire.email}
                            </small>
                            <br />
                            <small className="text-muted">
                              Dernière activité: {stagiaire.derniereActivite}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <FaGraduationCap className="me-1 text-muted" />
                            {stagiaire.formation}
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
                            {getNoteStars(stagiaire.note)}
                            <span className="text-muted ms-1">({stagiaire.note})</span>
                          </div>
                        </td>
                        <td>
                          <div>
                            <FaUsers className="me-1 text-muted" />
                            {stagiaire.tuteur}
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

        {/* Offres et Activités */}
        <div className="col-xl-4 col-lg-5">
          {/* Offres actives */}
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaHandshake className="me-2" />
                Offres Actives
              </h6>
            </div>
            <div className="card-body">
              {offres.filter(offre => offre.statut === 'active').map(offre => (
                <div key={offre.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0">{offre.titre}</h6>
                    {getTypeOffreBadge(offre.type)}
                  </div>
                  <p className="text-muted small mb-2">{offre.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <FaFileAlt className="me-1" />
                      {offre.nombreCandidatures} candidatures
                    </small>
                    <small className="text-muted">
                      <FaCalendarAlt className="me-1" />
                      Expire: {offre.dateExpiration}
                    </small>
                  </div>
                  <div className="mt-2">
                    <button className="btn btn-sm btn-outline-primary">
                      Voir candidatures
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
                    <h6 className="mb-1">Nouvelle candidature</h6>
                    <p className="text-muted small mb-0">Stage Développeur - Il y a 1 heure</p>
                  </div>
                </div>
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Stage terminé</h6>
                    <p className="text-muted small mb-0">Aminata Ouattara - Il y a 2 jours</p>
                  </div>
                </div>
                <div className="timeline-item mb-3">
                  <div className="timeline-marker bg-warning"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Évaluation à faire</h6>
                    <p className="text-muted small mb-0">Fatou Koné - Il y a 3 jours</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <h6 className="mb-1">Nouvelle offre publiée</h6>
                    <p className="text-muted small mb-0">Alternance Analyste - Il y a 5 jours</p>
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

      {/* Informations entreprise */}
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaBuilding className="me-2" />
                Informations Entreprise
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-primary">Tech Solutions SARL</div>
                    <div className="text-muted">Nom de l'entreprise</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-success">Informatique</div>
                    <div className="text-muted">Secteur d'activité</div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-info">50-100</div>
                    <div className="text-muted">Nombre d'employés</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-warning">Abidjan</div>
                    <div className="text-muted">Localisation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <FaIndustry className="me-2" />
                Statistiques Partenariat
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-primary">3</div>
                    <div className="text-muted">Stages en cours</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-success">15</div>
                    <div className="text-muted">Stages terminés</div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-info">4.2</div>
                    <div className="text-muted">Note moyenne</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center">
                    <div className="h4 text-warning">2 ans</div>
                    <div className="text-muted">Partenariat</div>
                  </div>
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