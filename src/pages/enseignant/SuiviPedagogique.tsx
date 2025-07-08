import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
  program: string;
  year: number;
  stageTitle: string;
  enterpriseName: string;
  enterpriseLogo?: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'terminated';
  supervisor: string;
  tutor: string;
  progress: number;
  evaluation: number;
  lastContact: string;
  nextContact: string;
  notes: Note[];
  meetings: Meeting[];
  objectives: Objective[];
  challenges: Challenge[];
}

interface Note {
  id: number;
  date: string;
  content: string;
  type: 'general' | 'academic' | 'professional' | 'warning';
  author: string;
}

interface Meeting {
  id: number;
  date: string;
  type: 'phone' | 'video' | 'onsite' | 'email';
  duration: number;
  topics: string[];
  outcomes: string[];
  nextActions: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Objective {
  id: number;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  identifiedDate: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  solutions: string[];
  support: string[];
}

const SuiviPedagogique: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    year: '',
    tutor: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: 1,
        studentId: '2024001',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '06 12 34 56 78',
        photo: '/api/photos/student-1.jpg',
        program: 'Master Informatique',
        year: 2,
        stageTitle: 'Développeur Web Full-Stack',
        enterpriseName: 'TechCorp Solutions',
        enterpriseLogo: '/api/logos/techcorp-logo.png',
        startDate: '01/03/2024',
        endDate: '31/08/2024',
        status: 'active',
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        progress: 75,
        evaluation: 4.5,
        lastContact: '15/04/2024',
        nextContact: '15/05/2024',
        notes: [
          {
            id: 1,
            date: '15/04/2024',
            content: 'Excellent progrès technique, très autonome dans son travail. Développe bien ses compétences React et Node.js.',
            type: 'academic',
            author: 'Dr. Dupont'
          },
          {
            id: 2,
            date: '01/04/2024',
            content: 'Premier contact téléphonique positif. L\'étudiant s\'adapte bien à l\'environnement de travail.',
            type: 'general',
            author: 'Dr. Dupont'
          }
        ],
        meetings: [
          {
            id: 1,
            date: '15/04/2024',
            type: 'video',
            duration: 45,
            topics: ['Progression technique', 'Difficultés rencontrées', 'Objectifs du mois prochain'],
            outcomes: ['Étudiant très satisfait de son stage', 'Progression conforme aux attentes'],
            nextActions: ['Préparer l\'évaluation mi-parcours', 'Planifier la prochaine réunion'],
            status: 'completed'
          },
          {
            id: 2,
            date: '15/05/2024',
            type: 'video',
            duration: 45,
            topics: ['Évaluation mi-parcours', 'Projets futurs'],
            outcomes: [],
            nextActions: [],
            status: 'scheduled'
          }
        ],
        objectives: [
          {
            id: 1,
            title: 'Maîtriser React et TypeScript',
            description: 'Développer une expertise solide en React et TypeScript',
            targetDate: '30/04/2024',
            status: 'completed',
            progress: 100,
            priority: 'high'
          },
          {
            id: 2,
            title: 'Implémenter l\'authentification',
            description: 'Créer un système d\'authentification sécurisé',
            targetDate: '15/05/2024',
            status: 'in_progress',
            progress: 80,
            priority: 'high'
          },
          {
            id: 3,
            title: 'Tests unitaires',
            description: 'Écrire des tests complets pour les composants',
            targetDate: '30/05/2024',
            status: 'pending',
            progress: 0,
            priority: 'medium'
          }
        ],
        challenges: [
          {
            id: 1,
            title: 'Gestion du temps',
            description: 'Difficulté à estimer le temps nécessaire pour certaines tâches',
            identifiedDate: '01/04/2024',
            status: 'in_progress',
            priority: 'medium',
            solutions: ['Utilisation d\'outils de gestion de projet', 'Mentorat avec le superviseur'],
            support: ['Formation sur les méthodologies agiles', 'Suivi plus régulier']
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
        program: 'Master Marketing',
        year: 2,
        stageTitle: 'Assistant Marketing Digital',
        enterpriseName: 'MarketingPro',
        enterpriseLogo: '/api/logos/marketingpro-logo.png',
        startDate: '01/04/2024',
        endDate: '31/07/2024',
        status: 'active',
        supervisor: 'Mme. Dubois',
        tutor: 'Dr. Moreau',
        progress: 60,
        evaluation: 4.2,
        lastContact: '10/04/2024',
        nextContact: '10/05/2024',
        notes: [
          {
            id: 3,
            date: '10/04/2024',
            content: 'Bonne intégration dans l\'équipe marketing. Créativité appréciée pour le contenu des réseaux sociaux.',
            type: 'professional',
            author: 'Dr. Moreau'
          }
        ],
        meetings: [
          {
            id: 3,
            date: '10/04/2024',
            type: 'phone',
            duration: 30,
            topics: ['Intégration dans l\'équipe', 'Premiers projets'],
            outcomes: ['Intégration réussie', 'Projets bien accueillis'],
            nextActions: ['Suivi des performances', 'Évaluation des compétences'],
            status: 'completed'
          }
        ],
        objectives: [
          {
            id: 4,
            title: 'Gestion des réseaux sociaux',
            description: 'Maîtriser la gestion complète des réseaux sociaux',
            targetDate: '30/04/2024',
            status: 'completed',
            progress: 100,
            priority: 'high'
          },
          {
            id: 5,
            title: 'Analyse des performances',
            description: 'Analyser et optimiser les campagnes marketing',
            targetDate: '30/05/2024',
            status: 'in_progress',
            progress: 50,
            priority: 'medium'
          }
        ],
        challenges: []
      },
      {
        id: 3,
        studentId: '2024003',
        firstName: 'Sophie',
        lastName: 'Bernard',
        email: 'sophie.bernard@email.com',
        phone: '06 55 66 77 88',
        photo: '/api/photos/student-4.jpg',
        program: 'Master Data Science',
        year: 2,
        stageTitle: 'Data Analyst',
        enterpriseName: 'DataCorp',
        enterpriseLogo: '/api/logos/datacorp-logo.png',
        startDate: '01/06/2023',
        endDate: '31/12/2023',
        status: 'completed',
        supervisor: 'M. Bernard',
        tutor: 'Dr. Petit',
        progress: 100,
        evaluation: 4.8,
        lastContact: '15/12/2023',
        nextContact: 'N/A',
        notes: [
          {
            id: 4,
            date: '15/12/2023',
            content: 'Stage exceptionnellement réussi. L\'étudiante a dépassé toutes les attentes et a contribué significativement aux projets de l\'entreprise.',
            type: 'academic',
            author: 'Dr. Petit'
          }
        ],
        meetings: [
          {
            id: 4,
            date: '15/12/2023',
            type: 'onsite',
            duration: 60,
            topics: ['Bilan final', 'Présentation des réalisations'],
            outcomes: ['Stage très réussi', 'Recommandation forte'],
            nextActions: ['Rédaction du rapport final', 'Évaluation finale'],
            status: 'completed'
          }
        ],
        objectives: [
          {
            id: 6,
            title: 'Développement de modèles prédictifs',
            description: 'Créer des modèles de machine learning performants',
            targetDate: '30/11/2023',
            status: 'completed',
            progress: 100,
            priority: 'high'
          }
        ],
        challenges: []
      }
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = students;

    if (newFilters.status) {
      filtered = filtered.filter(student => student.status === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(student => student.program === newFilters.program);
    }
    if (newFilters.year) {
      filtered = filtered.filter(student => student.year.toString() === newFilters.year);
    }
    if (newFilters.tutor) {
      filtered = filtered.filter(student => student.tutor === newFilters.tutor);
    }

    setFilteredStudents(filtered);
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

  const getStatusCount = (status: string) => {
    return students.filter(student => student.status === status).length;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
    return 'danger';
  };

  const getNoteTypeBadge = (type: string) => {
    const typeConfig = {
      general: { class: 'bg-secondary', text: 'Général' },
      academic: { class: 'bg-primary', text: 'Académique' },
      professional: { class: 'bg-success', text: 'Professionnel' },
      warning: { class: 'bg-danger', text: 'Avertissement' }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getObjectiveStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente' },
      in_progress: { class: 'bg-info', text: 'En cours' },
      completed: { class: 'bg-success', text: 'Terminé' },
      overdue: { class: 'bg-danger', text: 'En retard' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getChallengeStatusBadge = (status: string) => {
    const statusConfig = {
      open: { class: 'bg-warning', text: 'Ouvert' },
      in_progress: { class: 'bg-info', text: 'En cours' },
      resolved: { class: 'bg-success', text: 'Résolu' },
      escalated: { class: 'bg-danger', text: 'Escaladé' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const user = {
    role: 'enseignant',
    firstName: 'Dr. Dupont',
    lastName: 'Enseignant'
  };

  return (
    <div className="dashboard-container">
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
                  <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
                  Suivi Pédagogique
                </h1>
                <p className="text-muted mb-0">
                  Accompagnez vos étudiants dans leur parcours de stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-chart-bar me-2"></i>Rapports
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{students.length}</h4>
                        <p className="mb-0">Total étudiants</p>
                      </div>
                      <i className="fas fa-user-graduate fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('active')}</h4>
                        <p className="mb-0">En cours</p>
                      </div>
                      <i className="fas fa-play-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('completed')}</h4>
                        <p className="mb-0">Terminés</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">4.5</h4>
                        <p className="mb-0">Note moyenne</p>
                      </div>
                      <i className="fas fa-star fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fas fa-filter me-2"></i>Filtres
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Statut</label>
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
                  <div className="col-md-3">
                    <label className="form-label">Programme</label>
                    <select 
                      className="form-select"
                      value={filters.program}
                      onChange={(e) => handleFilterChange('program', e.target.value)}
                    >
                      <option value="">Tous les programmes</option>
                      <option value="Master Informatique">Master Informatique</option>
                      <option value="Master Marketing">Master Marketing</option>
                      <option value="Master Data Science">Master Data Science</option>
                      <option value="Master Design">Master Design</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Année</label>
                    <select 
                      className="form-select"
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                    >
                      <option value="">Toutes les années</option>
                      <option value="1">1ère année</option>
                      <option value="2">2ème année</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', program: '', year: '', tutor: '' });
                        setFilteredStudents(students);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des étudiants */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Étudiants suivis ({filteredStudents.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredStudents.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun étudiant trouvé</h5>
                    <p className="text-muted">Aucun étudiant ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Progression</th>
                          <th>Évaluation</th>
                          <th>Dernier contact</th>
                          <th>Prochain contact</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={student.photo || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-3"
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{student.firstName} {student.lastName}</strong><br />
                                  <small className="text-muted">{student.program} - {student.year}</small><br />
                                  <small className="text-muted">ID: {student.studentId}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <strong>{student.stageTitle}</strong><br />
                              <small className="text-muted">{student.supervisor}</small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={student.enterpriseLogo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{student.enterpriseName}</strong>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="mb-1">
                                <div className="d-flex justify-content-between">
                                  <small>{student.progress}%</small>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                  <div 
                                    className={`progress-bar bg-${getProgressColor(student.progress)}`}
                                    style={{ width: `${student.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">{student.evaluation}/5</span>
                                <div className="d-flex">
                                  {[...Array(5)].map((_, i) => (
                                    <i 
                                      key={i} 
                                      className={`fas fa-star ${i < Math.floor(student.evaluation) ? 'text-warning' : 'text-muted'}`}
                                    ></i>
                                  ))}
                                </div>
                              </div>
                            </td>
                            <td>
                              {student.lastContact}<br />
                              <small className="text-muted">{student.tutor}</small>
                            </td>
                            <td>
                              {student.nextContact !== 'N/A' ? (
                                <>
                                  {student.nextContact}<br />
                                  <small className="text-muted">Planifié</small>
                                </>
                              ) : (
                                <span className="text-muted">Terminé</span>
                              )}
                            </td>
                            <td>{getStatusBadge(student.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Planifier réunion"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowMeetingModal(true);
                                  }}
                                >
                                  <i className="fas fa-calendar"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Ajouter note"
                                  onClick={() => {
                                    setSelectedStudent(student);
                                    setShowNoteModal(true);
                                  }}
                                >
                                  <i className="fas fa-sticky-note"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-info"
                                  title="Contacter"
                                >
                                  <i className="fas fa-envelope"></i>
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

      {/* Modal Détails Étudiant */}
      {showDetailsModal && selectedStudent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-graduate me-2"></i>
                  Suivi - {selectedStudent.firstName} {selectedStudent.lastName}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ul className="nav nav-tabs" id="studentTabs">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <i className="fas fa-info-circle me-2"></i>Aperçu
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('notes')}
                    >
                      <i className="fas fa-sticky-note me-2"></i>Notes
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'meetings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('meetings')}
                    >
                      <i className="fas fa-calendar me-2"></i>Réunions
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'objectives' ? 'active' : ''}`}
                      onClick={() => setActiveTab('objectives')}
                    >
                      <i className="fas fa-target me-2"></i>Objectifs
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'challenges' ? 'active' : ''}`}
                      onClick={() => setActiveTab('challenges')}
                    >
                      <i className="fas fa-exclamation-triangle me-2"></i>Défis
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {/* Onglet Aperçu */}
                  {activeTab === 'overview' && (
                    <div className="row">
                      <div className="col-md-4 text-center">
                        <img 
                          src={selectedStudent.photo || '/default-avatar.png'} 
                          alt="Photo"
                          className="rounded-circle mb-3"
                          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <h5>{selectedStudent.firstName} {selectedStudent.lastName}</h5>
                        <p className="text-muted">{selectedStudent.program} - {selectedStudent.year}</p>
                        <p className="text-muted">{selectedStudent.email}</p>
                        <p className="text-muted">{selectedStudent.phone}</p>
                      </div>
                      <div className="col-md-8">
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Informations stage</h6>
                            <p><strong>Stage:</strong> {selectedStudent.stageTitle}</p>
                            <p><strong>Entreprise:</strong> {selectedStudent.enterpriseName}</p>
                            <p><strong>Période:</strong> {selectedStudent.startDate} - {selectedStudent.endDate}</p>
                            <p><strong>Superviseur:</strong> {selectedStudent.supervisor}</p>
                            <p><strong>Tuteur:</strong> {selectedStudent.tutor}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Progression</h6>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between">
                                <span>Progression globale</span>
                                <span>{selectedStudent.progress}%</span>
                              </div>
                              <div className="progress">
                                <div 
                                  className={`progress-bar bg-${getProgressColor(selectedStudent.progress)}`}
                                  style={{ width: `${selectedStudent.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="me-2">Évaluation: {selectedStudent.evaluation}/5</span>
                              <div className="d-flex">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(selectedStudent.evaluation) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Contact</h6>
                            <p><strong>Dernier contact:</strong> {selectedStudent.lastContact}</p>
                            <p><strong>Prochain contact:</strong> {selectedStudent.nextContact}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">Statistiques</h6>
                            <p><strong>Notes:</strong> {selectedStudent.notes.length}</p>
                            <p><strong>Réunions:</strong> {selectedStudent.meetings.length}</p>
                            <p><strong>Objectifs:</strong> {selectedStudent.objectives.length}</p>
                            <p><strong>Défis:</strong> {selectedStudent.challenges.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Notes */}
                  {activeTab === 'notes' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">Notes de suivi</h6>
                        <button className="btn btn-primary btn-sm">
                          <i className="fas fa-plus me-2"></i>Nouvelle note
                        </button>
                      </div>
                      {selectedStudent.notes.length === 0 ? (
                        <p className="text-muted">Aucune note disponible.</p>
                      ) : (
                        <div className="row">
                          {selectedStudent.notes.map((note) => (
                            <div key={note.id} className="col-12 mb-3">
                              <div className="card">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="card-title mb-0">
                                      {getNoteTypeBadge(note.type)}
                                    </h6>
                                    <small className="text-muted">{note.date} - {note.author}</small>
                                  </div>
                                  <p className="card-text">{note.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Onglet Réunions */}
                  {activeTab === 'meetings' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="text-primary mb-0">Réunions de suivi</h6>
                        <button className="btn btn-primary btn-sm">
                          <i className="fas fa-plus me-2"></i>Nouvelle réunion
                        </button>
                      </div>
                      {selectedStudent.meetings.length === 0 ? (
                        <p className="text-muted">Aucune réunion planifiée.</p>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Durée</th>
                                <th>Statut</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedStudent.meetings.map((meeting) => (
                                <tr key={meeting.id}>
                                  <td>{meeting.date}</td>
                                  <td>
                                    <span className={`badge ${
                                      meeting.type === 'video' ? 'bg-primary' :
                                      meeting.type === 'phone' ? 'bg-success' :
                                      meeting.type === 'onsite' ? 'bg-warning' : 'bg-info'
                                    }`}>
                                      {meeting.type}
                                    </span>
                                  </td>
                                  <td>{meeting.duration} min</td>
                                  <td>
                                    <span className={`badge ${
                                      meeting.status === 'completed' ? 'bg-success' :
                                      meeting.status === 'scheduled' ? 'bg-warning' : 'bg-danger'
                                    }`}>
                                      {meeting.status}
                                    </span>
                                  </td>
                                  <td>
                                    <button className="btn btn-sm btn-outline-primary">
                                      <i className="fas fa-eye"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Onglet Objectifs */}
                  {activeTab === 'objectives' && (
                    <div>
                      <h6 className="text-primary mb-3">Objectifs pédagogiques</h6>
                      {selectedStudent.objectives.length === 0 ? (
                        <p className="text-muted">Aucun objectif défini.</p>
                      ) : (
                        <div className="row">
                          {selectedStudent.objectives.map((objective) => (
                            <div key={objective.id} className="col-12 mb-3">
                              <div className="card">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="card-title mb-0">{objective.title}</h6>
                                    <div className="d-flex gap-2">
                                      {getObjectiveStatusBadge(objective.status)}
                                      <span className={`badge bg-${objective.priority === 'high' ? 'danger' : objective.priority === 'medium' ? 'warning' : 'success'}`}>
                                        {objective.priority}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="card-text">{objective.description}</p>
                                  <div className="mb-2">
                                    <div className="d-flex justify-content-between">
                                      <small>Progression: {objective.progress}%</small>
                                      <small>Date limite: {objective.targetDate}</small>
                                    </div>
                                    <div className="progress">
                                      <div 
                                        className={`progress-bar bg-${getProgressColor(objective.progress)}`}
                                        style={{ width: `${objective.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Onglet Défis */}
                  {activeTab === 'challenges' && (
                    <div>
                      <h6 className="text-primary mb-3">Défis et difficultés</h6>
                      {selectedStudent.challenges.length === 0 ? (
                        <p className="text-muted">Aucun défi identifié.</p>
                      ) : (
                        <div className="row">
                          {selectedStudent.challenges.map((challenge) => (
                            <div key={challenge.id} className="col-12 mb-3">
                              <div className="card">
                                <div className="card-body">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="card-title mb-0">{challenge.title}</h6>
                                    <div className="d-flex gap-2">
                                      {getChallengeStatusBadge(challenge.status)}
                                      <span className={`badge bg-${challenge.priority === 'critical' ? 'danger' : challenge.priority === 'high' ? 'warning' : 'success'}`}>
                                        {challenge.priority}
                                      </span>
                                    </div>
                                  </div>
                                  <p className="card-text">{challenge.description}</p>
                                  <div className="row">
                                    <div className="col-md-6">
                                      <h6 className="text-primary">Solutions proposées</h6>
                                      <ul className="list-unstyled">
                                        {challenge.solutions.map((solution, index) => (
                                          <li key={index}><i className="fas fa-check text-success me-2"></i>{solution}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div className="col-md-6">
                                      <h6 className="text-primary">Support nécessaire</h6>
                                      <ul className="list-unstyled">
                                        {challenge.support.map((support, index) => (
                                          <li key={index}><i className="fas fa-hands-helping text-info me-2"></i>{support}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <small className="text-muted">Identifié le: {challenge.identifiedDate}</small>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Réunion */}
      {showMeetingModal && selectedStudent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-calendar me-2"></i>Planifier une réunion
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowMeetingModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Planifier une réunion avec {selectedStudent.firstName} {selectedStudent.lastName}</p>
                {/* Ici on ajouterait le formulaire de planification */}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowMeetingModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Planifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Note */}
      {showNoteModal && selectedStudent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-sticky-note me-2"></i>Ajouter une note
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowNoteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Ajouter une note pour {selectedStudent.firstName} {selectedStudent.lastName}</p>
                {/* Ici on ajouterait le formulaire de note */}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowNoteModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuiviPedagogique; 