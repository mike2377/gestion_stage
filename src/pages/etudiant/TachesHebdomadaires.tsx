import React, { useState, useEffect } from 'react';
// Supprimer : import Sidebar from '../../components/layout/Sidebar';

interface WeeklyTask {
  id: number;
  title: string;
  description: string;
  stageId: number;
  stageTitle: string;
  enterprise: string;
  week: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  category: string;
  estimatedHours: number;
  actualHours?: number;
  supervisor?: string;
  tutor?: string;
  attachments?: string[];
  comments?: string[];
}

const TachesHebdomadaires: React.FC = () => {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<WeeklyTask[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    stage: '',
    week: ''
  });
  // Supprimer : const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<WeeklyTask | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    stageId: '',
    week: '',
    dueDate: '',
    priority: 'medium',
    category: '',
    estimatedHours: 0
  });

  // Données simulées
  useEffect(() => {
    const mockTasks: WeeklyTask[] = [
      {
        id: 1,
        title: 'Analyse des besoins utilisateur',
        description: 'Conduire des entretiens avec les utilisateurs finaux pour comprendre leurs besoins et attentes concernant l\'application.',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        week: 1,
        dueDate: '2024-03-08',
        status: 'completed',
        priority: 'high',
        category: 'Analyse',
        estimatedHours: 8,
        actualHours: 10,
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont',
        attachments: ['rapport_analyse.pdf', 'entretiens_utilisateurs.docx'],
        comments: [
          { author: 'M. Martin', text: 'Excellent travail d\'analyse', date: '2024-03-07' },
          { author: 'Dr. Dupont', text: 'Bien structuré, continuez ainsi', date: '2024-03-08' }
        ]
      },
      {
        id: 2,
        title: 'Conception de l\'architecture technique',
        description: 'Définir l\'architecture technique de l\'application, choisir les technologies et créer les diagrammes UML.',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        week: 2,
        dueDate: '2024-03-15',
        status: 'in_progress',
        priority: 'high',
        category: 'Conception',
        estimatedHours: 12,
        actualHours: 6,
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont'
      },
      {
        id: 3,
        title: 'Développement du frontend',
        description: 'Implémenter les interfaces utilisateur avec React et TypeScript selon les maquettes fournies.',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        week: 3,
        dueDate: '2024-03-22',
        status: 'pending',
        priority: 'medium',
        category: 'Développement',
        estimatedHours: 16,
        supervisor: 'M. Martin'
      },
      {
        id: 4,
        title: 'Tests unitaires et d\'intégration',
        description: 'Écrire et exécuter les tests unitaires et d\'intégration pour valider le bon fonctionnement du code.',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        week: 4,
        dueDate: '2024-03-29',
        status: 'pending',
        priority: 'medium',
        category: 'Tests',
        estimatedHours: 10,
        supervisor: 'M. Martin'
      },
      {
        id: 5,
        title: 'Présentation des résultats',
        description: 'Préparer et présenter les résultats du stage devant l\'équipe et les enseignants.',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        week: 6,
        dueDate: '2024-04-12',
        status: 'pending',
        priority: 'high',
        category: 'Présentation',
        estimatedHours: 4,
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont'
      },
      {
        id: 6,
        title: 'Rédaction du rapport de stage',
        description: 'Rédiger le rapport de stage détaillant le travail réalisé, les méthodologies utilisées et les résultats obtenus.',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        enterprise: 'TechCorp',
        week: 7,
        dueDate: '2024-04-19',
        status: 'pending',
        priority: 'high',
        category: 'Rédaction',
        estimatedHours: 20,
        supervisor: 'M. Martin',
        tutor: 'Dr. Dupont'
      }
    ];
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = tasks;

    if (newFilters.status) {
      filtered = filtered.filter(task => task.status === newFilters.status);
    }
    if (newFilters.priority) {
      filtered = filtered.filter(task => task.priority === newFilters.priority);
    }
    if (newFilters.stage) {
      filtered = filtered.filter(task => task.stageId.toString() === newFilters.stage);
    }
    if (newFilters.week) {
      filtered = filtered.filter(task => task.week.toString() === newFilters.week);
    }

    setFilteredTasks(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente', icon: 'fas fa-clock' },
      in_progress: { class: 'bg-info', text: 'En cours', icon: 'fas fa-play' },
      completed: { class: 'bg-success', text: 'Terminé', icon: 'fas fa-check' },
      overdue: { class: 'bg-danger', text: 'En retard', icon: 'fas fa-exclamation-triangle' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { class: 'bg-success', text: 'Faible' },
      medium: { class: 'bg-warning', text: 'Moyenne' },
      high: { class: 'bg-danger', text: 'Élevée' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getProgressPercentage = (task: WeeklyTask) => {
    if (task.status === 'completed') return 100;
    if (task.status === 'in_progress' && task.actualHours) {
      return Math.min((task.actualHours / task.estimatedHours) * 100, 100);
    }
    return 0;
  };

  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getOverdueTasks = () => {
    const today = new Date();
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== 'completed';
    });
  };

  const user = {
    role: 'student',
    firstName: 'Jean',
    lastName: 'Dupont'
  };

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        {/* Supprimer : div className={`col-auto ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`} */}
        <div className="col">
          <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-tasks me-2 text-primary"></i>
                  Tâches Hebdomadaires
                </h1>
                <p className="text-muted mb-0">
                  Suivez vos tâches et objectifs hebdomadaires
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowAddTaskModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>Ajouter une tâche
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
              </div>
            </div>

            {/* Alertes */}
            {getOverdueTasks().length > 0 && (
              <div className="alert alert-danger mb-4">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <strong>Attention !</strong> Vous avez {getOverdueTasks().length} tâche(s) en retard.
              </div>
            )}

            {/* Statistiques */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{tasks.length}</h4>
                        <p className="mb-0">Total tâches</p>
                      </div>
                      <i className="fas fa-tasks fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('completed')}</h4>
                        <p className="mb-0">Terminées</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('in_progress')}</h4>
                        <p className="mb-0">En cours</p>
                      </div>
                      <i className="fas fa-play-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getOverdueTasks().length}</h4>
                        <p className="mb-0">En retard</p>
                      </div>
                      <i className="fas fa-exclamation-triangle fa-2x opacity-50"></i>
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
                      <option value="pending">En attente</option>
                      <option value="in_progress">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="overdue">En retard</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Priorité</label>
                    <select 
                      className="form-select"
                      value={filters.priority}
                      onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="">Toutes les priorités</option>
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Stage</label>
                    <select 
                      className="form-select"
                      value={filters.stage}
                      onChange={(e) => handleFilterChange('stage', e.target.value)}
                    >
                      <option value="">Tous les stages</option>
                      <option value="1">Développeur Web Full-Stack - TechCorp</option>
                      <option value="2">Assistant Marketing Digital - InnovateX</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ status: '', priority: '', stage: '', week: '' });
                        setFilteredTasks(tasks);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tâches */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Tâches ({filteredTasks.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune tâche trouvée</h5>
                    <p className="text-muted">Aucune tâche ne correspond à vos critères de recherche.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddTaskModal(true)}
                    >
                      <i className="fas fa-plus me-2"></i>Ajouter une tâche
                    </button>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm hover-shadow">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h6 className="card-title mb-0">{task.title}</h6>
                              <div className="d-flex gap-1">
                                {getPriorityBadge(task.priority)}
                                {getStatusBadge(task.status)}
                              </div>
                            </div>
                            
                            <p className="card-text text-muted small">
                              {task.description.length > 100 
                                ? `${task.description.substring(0, 100)}...` 
                                : task.description
                              }
                            </p>

                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <small className="text-muted">Progression</small>
                                <small className="text-muted">{Math.round(getProgressPercentage(task))}%</small>
                              </div>
                              <div className="progress" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar" 
                                  style={{ width: `${getProgressPercentage(task)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-6">
                                <small className="text-muted">Semaine</small><br />
                                <strong>Semaine {task.week}</strong>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Échéance</small><br />
                                <strong>{new Date(task.dueDate).toLocaleDateString('fr-FR')}</strong>
                              </div>
                            </div>

                            <div className="row mb-3">
                              <div className="col-6">
                                <small className="text-muted">Heures estimées</small><br />
                                <strong>{task.estimatedHours}h</strong>
                              </div>
                              <div className="col-6">
                                <small className="text-muted">Heures réelles</small><br />
                                <strong>{task.actualHours || 0}h</strong>
                              </div>
                            </div>

                            <div className="mb-3">
                              <small className="text-muted">Stage :</small><br />
                              <strong className="text-primary">{task.stageTitle}</strong><br />
                              <small className="text-muted">{task.enterprise}</small>
                            </div>

                            <div className="d-flex gap-2">
                              <button 
                                className="btn btn-primary btn-sm flex-fill"
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowTaskModal(true);
                                }}
                              >
                                <i className="fas fa-eye me-1"></i>Détails
                              </button>
                              <button 
                                className="btn btn-outline-success btn-sm"
                                title="Marquer comme terminé"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button 
                                className="btn btn-outline-warning btn-sm"
                                title="Modifier"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Détails Tâche */}
      {showTaskModal && selectedTask && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-tasks me-2"></i>
                  {selectedTask.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowTaskModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-align-left me-2"></i>Description
                    </h6>
                    <p>{selectedTask.description}</p>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>Informations
                    </h6>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedTask.status)}</p>
                    <p><strong>Priorité:</strong> {getPriorityBadge(selectedTask.priority)}</p>
                    <p><strong>Semaine:</strong> Semaine {selectedTask.week}</p>
                    <p><strong>Échéance:</strong> {new Date(selectedTask.dueDate).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Heures estimées:</strong> {selectedTask.estimatedHours}h</p>
                    {selectedTask.actualHours && (
                      <p><strong>Heures réelles:</strong> {selectedTask.actualHours}h</p>
                    )}
                    <p><strong>Catégorie:</strong> {selectedTask.category}</p>
                  </div>
                </div>
                
                <hr />
                
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-building me-2"></i>Stage associé
                    </h6>
                    <p><strong>Intitulé:</strong> {selectedTask.stageTitle}</p>
                    <p><strong>Entreprise:</strong> {selectedTask.enterprise}</p>
                    {selectedTask.supervisor && (
                      <p><strong>Superviseur:</strong> {selectedTask.supervisor}</p>
                    )}
                    {selectedTask.tutor && (
                      <p><strong>Tuteur:</strong> {selectedTask.tutor}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-chart-line me-2"></i>Progression
                    </h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Progression globale</small>
                        <small>{Math.round(getProgressPercentage(selectedTask))}%</small>
                      </div>
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${getProgressPercentage(selectedTask)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-paperclip me-2"></i>Pièces jointes
                        </h6>
                        <div className="list-group">
                          {selectedTask.attachments.map((attachment, index) => (
                            <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <i className="fas fa-file me-2"></i>
                                {attachment}
                              </div>
                              <button className="btn btn-sm btn-outline-primary">
                                <i className="fas fa-download"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectedTask.comments && selectedTask.comments.length > 0 && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-comments me-2"></i>Commentaires
                        </h6>
                        <div className="list-group">
                          {selectedTask.comments.map((comment, index) => (
                            <div key={index} className="list-group-item">
                              <div className="d-flex justify-content-between">
                                <strong>{comment.author}</strong>
                                <small className="text-muted">{comment.date}</small>
                              </div>
                              <p className="mb-0 mt-1">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowTaskModal(false)}
                >
                  Fermer
                </button>
                <button type="button" className="btn btn-success">
                  <i className="fas fa-check me-2"></i>Marquer comme terminé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter Tâche */}
      {showAddTaskModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Ajouter une tâche
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddTaskModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Titre *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    ></textarea>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Stage associé</label>
                      <select
                        className="form-select"
                        value={newTask.stageId}
                        onChange={(e) => setNewTask(prev => ({ ...prev, stageId: e.target.value }))}
                      >
                        <option value="">Sélectionner un stage</option>
                        <option value="1">Développeur Web Full-Stack - TechCorp</option>
                        <option value="2">Assistant Marketing Digital - InnovateX</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Semaine</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newTask.week}
                        onChange={(e) => setNewTask(prev => ({ ...prev, week: e.target.value }))}
                        min="1"
                        max="52"
                      />
                    </div>
                  </div>
                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Échéance</label>
                      <input
                        type="date"
                        className="form-control"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Priorité</label>
                      <select
                        className="form-select"
                        value={newTask.priority}
                        onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                      >
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-3 mt-3">
                    <div className="col-md-6">
                      <label className="form-label">Catégorie</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newTask.category}
                        onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="ex: Développement, Tests, Documentation..."
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Heures estimées</label>
                      <input
                        type="number"
                        className="form-control"
                        value={newTask.estimatedHours}
                        onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                        min="0"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddTaskModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TachesHebdomadaires; 