import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
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
  FaGraduationCap,
  FaBuilding,
  FaFileAlt,
  FaDownload,
  FaPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaUserGraduate,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';

interface Intern {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
  stageTitle: string;
  stageId: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'terminated';
  supervisor: string;
  tutor: string;
  university: string;
  program: string;
  year: number;
  evaluation: number;
  progress: number;
  tasks: Task[];
  documents: Document[];
  evaluations: Evaluation[];
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  assignedDate: string;
  completedDate?: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
}

interface Evaluation {
  id: number;
  date: string;
  type: 'midterm' | 'final';
  grade: number;
  comments: string;
  evaluator: string;
}

const MesStagiaires: React.FC = () => {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [filteredInterns, setFilteredInterns] = useState<Intern[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    stage: '',
    supervisor: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockInterns: Intern[] = [
      {
        id: 1,
        studentId: '2024001',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '06 12 34 56 78',
        photo: '/api/photos/student-1.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        stageId: 1,
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        status: 'active',
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        university: 'Université de Paris',
        program: 'Master Informatique',
        year: 2,
        evaluation: 4.5,
        progress: 75,
        tasks: [
          {
            id: 1,
            title: 'Développement du frontend',
            description: 'Créer les interfaces utilisateur avec React',
            dueDate: '15/04/2024',
            status: 'completed',
            priority: 'high',
            assignedDate: '01/03/2024',
            completedDate: '10/04/2024'
          },
          {
            id: 2,
            title: 'Intégration API',
            description: 'Connecter le frontend aux APIs backend',
            dueDate: '30/04/2024',
            status: 'in_progress',
            priority: 'high',
            assignedDate: '15/03/2024'
          },
          {
            id: 3,
            title: 'Tests unitaires',
            description: 'Écrire les tests pour les composants',
            dueDate: '15/05/2024',
            status: 'pending',
            priority: 'medium',
            assignedDate: '01/04/2024'
          }
        ],
        documents: [
          {
            id: 1,
            name: 'Convention_stage_Jean_Dupont.pdf',
            type: 'Convention',
            uploadDate: '28/02/2024',
            status: 'Approuvé'
          },
          {
            id: 2,
            name: 'Rapport_mensuel_Jean_Dupont.pdf',
            type: 'Rapport',
            uploadDate: '01/04/2024',
            status: 'En attente'
          }
        ],
        evaluations: [
          {
            id: 1,
            date: '01/04/2024',
            type: 'midterm',
            grade: 4.5,
            comments: 'Excellent travail, très autonome et créatif',
            evaluator: 'M. Martin'
          }
        ]
      },
      {
        id: 2,
        studentId: '2024002',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        phone: '06 98 76 54 32',
        photo: '/api/photos/student-2.jpg',
        stageTitle: 'Assistant Marketing Digital',
        stageId: 2,
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        status: 'active',
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        university: 'Université de Lyon',
        program: 'Master Marketing',
        year: 2,
        evaluation: 4.2,
        progress: 60,
        tasks: [
          {
            id: 4,
            title: 'Gestion réseaux sociaux',
            description: 'Créer et publier du contenu sur les réseaux',
            dueDate: '15/04/2024',
            status: 'completed',
            priority: 'high',
            assignedDate: '01/04/2024',
            completedDate: '12/04/2024'
          },
          {
            id: 5,
            title: 'Analyse des performances',
            description: 'Analyser les métriques des campagnes',
            dueDate: '30/04/2024',
            status: 'in_progress',
            priority: 'medium',
            assignedDate: '10/04/2024'
          }
        ],
        documents: [
          {
            id: 3,
            name: 'Convention_stage_Marie_Martin.pdf',
            type: 'Convention',
            uploadDate: '25/03/2024',
            status: 'Approuvé'
          }
        ],
        evaluations: []
      },
      {
        id: 3,
        studentId: '2024003',
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@email.com',
        phone: '06 55 66 77 88',
        photo: '/api/photos/student-4.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        stageId: 1,
        startDate: '01/06/2023',
        endDate: '31/12/2023',
        status: 'completed',
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        university: 'Université de Toulouse',
        program: 'Master Informatique',
        year: 2,
        evaluation: 4.8,
        progress: 100,
        tasks: [],
        documents: [
          {
            id: 4,
            name: 'Rapport_final_Sophie_Bernard.pdf',
            type: 'Rapport final',
            uploadDate: '15/12/2023',
            status: 'Approuvé'
          }
        ],
        evaluations: [
          {
            id: 2,
            date: '15/12/2023',
            type: 'final',
            grade: 4.8,
            comments: 'Excellente stagiaire, travail de qualité exceptionnelle',
            evaluator: 'M. Martin'
          }
        ]
      }
    ];
    setInterns(mockInterns);
    setFilteredInterns(mockInterns);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = interns;

    if (newFilters.status) {
      filtered = filtered.filter(intern => intern.status === newFilters.status);
    }
    if (newFilters.stage) {
      filtered = filtered.filter(intern => intern.stageId.toString() === newFilters.stage);
    }
    if (newFilters.supervisor) {
      filtered = filtered.filter(intern => intern.supervisor === newFilters.supervisor);
    }

    setFilteredInterns(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'En cours', icon: 'fas fa-play' },
      completed: { class: 'bg-primary', text: 'Terminé', icon: 'fas fa-check' },
      terminated: { class: 'bg-danger', text: 'Terminé', icon: 'fas fa-times' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getTaskStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente' },
      in_progress: { class: 'bg-info', text: 'En cours' },
      completed: { class: 'bg-success', text: 'Terminé' },
      overdue: { class: 'bg-danger', text: 'En retard' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return interns.filter(intern => intern.status === status).length;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
    return 'danger';
  };

  const user = {
    role: 'enterprise',
    firstName: 'TechCorp',
    lastName: 'Admin'
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaUsers className="me-2 text-primary" />
            Mes Stagiaires
          </h1>
          <p className="text-muted">Gérez et suivez vos stagiaires</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            Nouveau stagiaire
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{interns.length}</div>
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{getStatusCount('active')}</div>
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{getStatusCount('completed')}</div>
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
                    Note Moyenne
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{interns.length > 0 ? (interns.reduce((sum, s) => sum + s.evaluation, 0) / interns.length).toFixed(1) : 'N/A'}</div>
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
                  placeholder="Rechercher un stagiaire..."
                  value={filters.supervisor}
                  onChange={(e) => handleFilterChange('supervisor', e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="active">En cours</option>
                <option value="completed">Terminé</option>
                <option value="terminated">Terminé</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={filters.stage}
                onChange={(e) => handleFilterChange('stage', e.target.value)}
              >
                <option value="">Tous les stages</option>
                <option value="1">Développeur Web Full-Stack</option>
                <option value="2">Assistant Marketing Digital</option>
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
                <FaUsers className="me-2" />
                Liste des Stagiaires
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'statistiques' ? 'active' : ''}`}
                onClick={() => setActiveTab('statistiques')}
              >
                <FaChartLine className="me-2" />
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
                        onClick={() => handleSort('lastName')}
                      >
                        Stagiaire {getSortIcon('lastName')}
                      </button>
                    </th>
                    <th>Formation</th>
                    <th>Statut</th>
                    <th>Progression</th>
                    <th>Note</th>
                    <th>
                      <button 
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => handleSort('startDate')}
                      >
                        Date Début {getSortIcon('startDate')}
                      </button>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterns.map((intern) => (
                    <tr key={intern.id}>
                      <td>
                        <div>
                          <strong>{intern.firstName} {intern.lastName}</strong>
                          <br />
                          <small className="text-muted">
                            <FaEnvelope className="me-1" />
                            {intern.email}
                          </small>
                          <br />
                          <small className="text-muted">
                            <FaPhone className="me-1" />
                            {intern.phone}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaGraduationCap className="me-1 text-muted" />
                          {intern.stageTitle}
                          <br />
                          <small className="text-muted">
                            <FaBuilding className="me-1" />
                            {intern.university}
                          </small>
                        </div>
                      </td>
                      <td>{getStatusBadge(intern.status)}</td>
                      <td>
                        <div className="progress" style={{ height: '20px' }}>
                          <div
                            className="progress-bar"
                            style={{ width: `${intern.progress}%` }}
                          >
                            {intern.progress}%
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`${getProgressColor(intern.evaluation)}`}>
                          {intern.evaluation.toFixed(1)}
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaCalendarAlt className="me-1 text-muted" />
                          {intern.startDate}
                          <br />
                          <small className="text-muted">
                            Fin: {intern.endDate}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSelectedIntern(intern);
                              setShowDetailsModal(true);
                            }}
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
                          <button
                            className="btn btn-sm btn-outline-warning"
                            title="Modifier"
                          >
                            <FaEdit />
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
                <h6>Répartition par statut</h6>
                <div className="chart-container mb-4">
                  {['active', 'completed', 'terminated'].map(statut => {
                    const count = interns.filter(s => s.status === statut).length;
                    const percentage = interns.length > 0 ? (count / interns.length) * 100 : 0;
                    return (
                      <div key={statut} className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-xs font-weight-bold">
                            {statut === 'active' ? 'En cours' :
                             statut === 'completed' ? 'Terminé' : 'Terminé'}
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
                              backgroundColor: statut === 'active' ? '#007bff' :
                                              statut === 'completed' ? '#28a745' : '#dc3545'
                            }}
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
                      <span>Évaluation</span>
                      <span>{(interns.reduce((sum, s) => sum + s.evaluation, 0) / interns.length).toFixed(1)}</span>
                    </div>
                    <div className="progress mb-2" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: `${(interns.reduce((sum, s) => sum + s.evaluation, 0) / interns.length) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Stagiaire */}
      {showDetailsModal && selectedIntern && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Détails du stagiaire - {selectedIntern.firstName} {selectedIntern.lastName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informations personnelles</h6>
                    <p><strong>Email:</strong> {selectedIntern.email}</p>
                    <p><strong>Téléphone:</strong> {selectedIntern.phone}</p>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedIntern.status)}</p>
                    <p><strong>Université:</strong> {selectedIntern.university}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Informations du stage</h6>
                    <p><strong>Formation:</strong> {selectedIntern.stageTitle}</p>
                    <p><strong>Tuteur:</strong> {selectedIntern.tutor}</p>
                    <p><strong>Superviseur:</strong> {selectedIntern.supervisor}</p>
                    <p><strong>Période:</strong> {selectedIntern.startDate} - {selectedIntern.endDate}</p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Progression</h6>
                    <div className="progress mb-3" style={{ height: '25px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${selectedIntern.progress}%` }}
                      >
                        {selectedIntern.progress}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Évaluations</h6>
                    <p><strong>Note globale:</strong> 
                      <span className={`${getProgressColor(selectedIntern.evaluation)} ms-2`}>
                        {selectedIntern.evaluation.toFixed(1)}
                      </span>
                    </p>
                    <p><strong>Évaluation:</strong> {selectedIntern.evaluation}/5</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Compétences</h6>
                    <div className="mb-3">
                      {/* Add skills display logic here */}
                    </div>
                    <h6>Tâches en cours</h6>
                    <ul className="list-unstyled">
                      {selectedIntern.tasks.map((task, index) => (
                        <li key={index} className="mb-1">
                          <FaFileAlt className="me-2 text-muted" />
                          {task.title}
                        </li>
                      ))}
                    </ul>
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
      {showDetailsModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default MesStagiaires; 