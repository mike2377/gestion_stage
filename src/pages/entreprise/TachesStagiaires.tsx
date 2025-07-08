import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Task {
  id: number;
  title: string;
  description: string;
  internId: number;
  internName: string;
  internPhoto?: string;
  stageTitle: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  estimatedHours: number;
  actualHours?: number;
  supervisor: string;
  attachments?: string[];
  comments: Comment[];
  progress: number;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  isSupervisor: boolean;
}

const TachesStagiaires: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    intern: '',
    category: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Données simulées
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Développement du module authentification',
        description: 'Créer un système d\'authentification sécurisé avec JWT pour l\'application web. Inclure la gestion des rôles et permissions.',
        internId: 1,
        internName: 'Jean Dupont',
        internPhoto: '/api/photos/student-1.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        assignedDate: '01/03/2024',
        dueDate: '15/04/2024',
        status: 'in_progress',
        priority: 'high',
        category: 'Développement',
        estimatedHours: 40,
        actualHours: 25,
        supervisor: 'M. Martin',
        attachments: ['specs-auth.pdf', 'mockups-auth.png'],
        progress: 62,
        comments: [
          {
            id: 1,
            author: 'M. Martin',
            content: 'Bon début, n\'oubliez pas de tester les cas d\'erreur',
            date: '05/03/2024',
            isSupervisor: true
          },
          {
            id: 2,
            author: 'Jean Dupont',
            content: 'Merci, je vais ajouter les tests unitaires',
            date: '06/03/2024',
            isSupervisor: false
          }
        ]
      },
      {
        id: 2,
        title: 'Création de la base de données',
        description: 'Concevoir et implémenter le schéma de base de données pour le projet e-commerce. Inclure les relations et contraintes.',
        internId: 1,
        internName: 'Jean Dupont',
        internPhoto: '/api/photos/student-1.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        assignedDate: '10/03/2024',
        dueDate: '25/03/2024',
        status: 'completed',
        priority: 'medium',
        category: 'Base de données',
        estimatedHours: 20,
        actualHours: 18,
        supervisor: 'M. Martin',
        progress: 100,
        comments: [
          {
            id: 3,
            author: 'M. Martin',
            content: 'Excellent travail, la structure est bien pensée',
            date: '20/03/2024',
            isSupervisor: true
          }
        ]
      },
      {
        id: 3,
        title: 'Gestion des réseaux sociaux',
        description: 'Créer et publier du contenu sur les réseaux sociaux de l\'entreprise. Analyser les performances et proposer des améliorations.',
        internId: 2,
        internName: 'Marie Martin',
        internPhoto: '/api/photos/student-2.jpg',
        stageTitle: 'Assistant Marketing Digital',
        assignedDate: '01/04/2024',
        dueDate: '30/04/2024',
        status: 'in_progress',
        priority: 'medium',
        category: 'Marketing',
        estimatedHours: 30,
        actualHours: 15,
        supervisor: 'Mme. Dubois',
        progress: 50,
        comments: [
          {
            id: 4,
            author: 'Mme. Dubois',
            content: 'Le contenu est de bonne qualité, continuez ainsi',
            date: '10/04/2024',
            isSupervisor: true
          }
        ]
      },
      {
        id: 4,
        title: 'Tests unitaires et d\'intégration',
        description: 'Écrire des tests complets pour tous les modules développés. Assurer une couverture de code d\'au moins 80%.',
        internId: 1,
        internName: 'Jean Dupont',
        internPhoto: '/api/photos/student-1.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        assignedDate: '20/03/2024',
        dueDate: '10/04/2024',
        status: 'pending',
        priority: 'high',
        category: 'Tests',
        estimatedHours: 25,
        supervisor: 'M. Martin',
        progress: 0,
        comments: []
      },
      {
        id: 5,
        title: 'Analyse des performances SEO',
        description: 'Analyser le SEO du site web actuel et proposer des améliorations pour optimiser le référencement.',
        internId: 2,
        internName: 'Marie Martin',
        internPhoto: '/api/photos/student-2.jpg',
        stageTitle: 'Assistant Marketing Digital',
        assignedDate: '15/04/2024',
        dueDate: '15/05/2024',
        status: 'pending',
        priority: 'low',
        category: 'SEO',
        estimatedHours: 35,
        supervisor: 'Mme. Dubois',
        progress: 0,
        comments: []
      },
      {
        id: 6,
        title: 'Déploiement en production',
        description: 'Préparer et effectuer le déploiement de l\'application en production. Configurer l\'environnement et les variables.',
        internId: 1,
        internName: 'Jean Dupont',
        internPhoto: '/api/photos/student-1.jpg',
        stageTitle: 'Développeur Web Full-Stack',
        assignedDate: '01/05/2024',
        dueDate: '15/05/2024',
        status: 'overdue',
        priority: 'urgent',
        category: 'DevOps',
        estimatedHours: 15,
        actualHours: 20,
        supervisor: 'M. Martin',
        progress: 85,
        comments: [
          {
            id: 5,
            author: 'M. Martin',
            content: 'Attention aux délais, cette tâche est critique',
            date: '10/05/2024',
            isSupervisor: true
          }
        ]
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
    if (newFilters.intern) {
      filtered = filtered.filter(task => task.internId.toString() === newFilters.intern);
    }
    if (newFilters.category) {
      filtered = filtered.filter(task => task.category === newFilters.category);
    }

    setFilteredTasks(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente', icon: 'fas fa-clock' },
      in_progress: { class: 'bg-info', text: 'En cours', icon: 'fas fa-play' },
      completed: { class: 'bg-success', text: 'Terminé', icon: 'fas fa-check' },
      overdue: { class: 'bg-danger', text: 'En retard', icon: 'fas fa-exclamation-triangle' },
      cancelled: { class: 'bg-dark', text: 'Annulé', icon: 'fas fa-times' }
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
      high: { class: 'bg-danger', text: 'Élevée' },
      urgent: { class: 'bg-dark', text: 'Urgente' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.status === status).length;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 60) return 'info';
    if (progress >= 40) return 'warning';
    return 'danger';
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus as any } : task
      )
    );
    setFilteredTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus as any } : task
      )
    );
  };

  const user = {
    role: 'enterprise',
    firstName: 'TechCorp',
    lastName: 'Admin'
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
                  <i className="fas fa-tasks me-2 text-primary"></i>
                  Tâches des Stagiaires
                </h1>
                <p className="text-muted mb-0">
                  Suivez et gérez les tâches assignées à vos stagiaires
                </p>
              </div>
              <div className="d-flex gap-2">
                <div className="btn-group" role="group">
                  <button 
                    className={`btn btn-outline-secondary ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <i className="fas fa-list me-2"></i>Liste
                  </button>
                  <button 
                    className={`btn btn-outline-secondary ${viewMode === 'kanban' ? 'active' : ''}`}
                    onClick={() => setViewMode('kanban')}
                  >
                    <i className="fas fa-columns me-2"></i>Kanban
                  </button>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowTaskModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>Nouvelle tâche
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
                        <h4 className="mb-0">{tasks.length}</h4>
                        <p className="mb-0">Total tâches</p>
                      </div>
                      <i className="fas fa-tasks fa-2x opacity-50"></i>
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
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('overdue')}</h4>
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
                      <option value="cancelled">Annulé</option>
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
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Stagiaire</label>
                    <select 
                      className="form-select"
                      value={filters.intern}
                      onChange={(e) => handleFilterChange('intern', e.target.value)}
                    >
                      <option value="">Tous les stagiaires</option>
                      <option value="1">Jean Dupont</option>
                      <option value="2">Marie Martin</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Catégorie</label>
                    <select 
                      className="form-select"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">Toutes les catégories</option>
                      <option value="Développement">Développement</option>
                      <option value="Base de données">Base de données</option>
                      <option value="Tests">Tests</option>
                      <option value="Marketing">Marketing</option>
                      <option value="SEO">SEO</option>
                      <option value="DevOps">DevOps</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setFilters({ status: '', priority: '', intern: '', category: '' });
                        setFilteredTasks(tasks);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vue Liste */}
            {viewMode === 'list' && (
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
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Tâche</th>
                            <th>Stagiaire</th>
                            <th>Date limite</th>
                            <th>Progression</th>
                            <th>Statut</th>
                            <th>Priorité</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTasks.map((task) => (
                            <tr key={task.id}>
                              <td>
                                <div>
                                  <strong>{task.title}</strong><br />
                                  <small className="text-muted">{task.description.substring(0, 100)}...</small><br />
                                  <small className="text-muted">
                                    <i className="fas fa-tag me-1"></i>{task.category}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={task.internPhoto || '/default-avatar.png'} 
                                    alt="Photo"
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <strong>{task.internName}</strong><br />
                                    <small className="text-muted">{task.stageTitle}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{task.dueDate}</strong><br />
                                  <small className="text-muted">
                                    {task.estimatedHours}h estimées
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="mb-1">
                                  <div className="d-flex justify-content-between">
                                    <small>{task.progress}%</small>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar bg-${getProgressColor(task.progress)}`}
                                      style={{ width: `${task.progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td>{getStatusBadge(task.status)}</td>
                              <td>{getPriorityBadge(task.priority)}</td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      setSelectedTask(task);
                                      setShowDetailsModal(true);
                                    }}
                                    title="Voir détails"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    title="Marquer comme terminé"
                                    onClick={() => handleStatusChange(task.id, 'completed')}
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-warning"
                                    title="Modifier"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    title="Supprimer"
                                  >
                                    <i className="fas fa-trash"></i>
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
            )}

            {/* Vue Kanban */}
            {viewMode === 'kanban' && (
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="card">
                    <div className="card-header bg-secondary text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-clock me-2"></i>En attente ({filteredTasks.filter(t => t.status === 'pending').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.status === 'pending').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.title}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.internName}</small>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getProgressColor(task.progress)}`}
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card">
                    <div className="card-header bg-info text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-play me-2"></i>En cours ({filteredTasks.filter(t => t.status === 'in_progress').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.status === 'in_progress').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.title}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.internName}</small>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getProgressColor(task.progress)}`}
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-check me-2"></i>Terminées ({filteredTasks.filter(t => t.status === 'completed').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.status === 'completed').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.title}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.internName}</small>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className="progress-bar bg-success"
                                style={{ width: '100%' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card">
                    <div className="card-header bg-danger text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-exclamation-triangle me-2"></i>En retard ({filteredTasks.filter(t => t.status === 'overdue').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.status === 'overdue').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.title}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.internName}</small>
                              {getPriorityBadge(task.priority)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getProgressColor(task.progress)}`}
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Détails Tâche */}
      {showDetailsModal && selectedTask && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-tasks me-2"></i>
                  Détails de la tâche
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h5>{selectedTask.title}</h5>
                    <p className="text-muted">{selectedTask.description}</p>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Stagiaire:</strong> {selectedTask.internName}<br />
                        <strong>Stage:</strong> {selectedTask.stageTitle}<br />
                        <strong>Superviseur:</strong> {selectedTask.supervisor}
                      </div>
                      <div className="col-md-6">
                        <strong>Date d'assignation:</strong> {selectedTask.assignedDate}<br />
                        <strong>Date limite:</strong> {selectedTask.dueDate}<br />
                        <strong>Catégorie:</strong> {selectedTask.category}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Heures estimées:</strong> {selectedTask.estimatedHours}h
                        {selectedTask.actualHours && (
                          <div>
                            <strong>Heures réelles:</strong> {selectedTask.actualHours}h
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <strong>Progression:</strong> {selectedTask.progress}%<br />
                        <div className="progress mt-1">
                          <div 
                            className={`progress-bar bg-${getProgressColor(selectedTask.progress)}`}
                            style={{ width: `${selectedTask.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                      <div className="mb-3">
                        <strong>Pièces jointes:</strong>
                        <div className="mt-2">
                          {selectedTask.attachments.map((attachment, index) => (
                            <a key={index} href="#" className="btn btn-sm btn-outline-primary me-2">
                              <i className="fas fa-paperclip me-1"></i>{attachment}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-3">
                      <strong>Commentaires:</strong>
                      {selectedTask.comments.length === 0 ? (
                        <p className="text-muted mt-2">Aucun commentaire</p>
                      ) : (
                        <div className="mt-2">
                          {selectedTask.comments.map((comment) => (
                            <div key={comment.id} className="card mb-2">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <strong>{comment.author}</strong>
                                  <small className="text-muted">{comment.date}</small>
                                </div>
                                <p className="mb-0 mt-1">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body">
                        <h6>Actions rapides</h6>
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(selectedTask.id, 'completed')}
                          >
                            <i className="fas fa-check me-2"></i>Marquer comme terminé
                          </button>
                          <button className="btn btn-info btn-sm">
                            <i className="fas fa-play me-2"></i>Marquer en cours
                          </button>
                          <button className="btn btn-warning btn-sm">
                            <i className="fas fa-edit me-2"></i>Modifier
                          </button>
                          <button className="btn btn-primary btn-sm">
                            <i className="fas fa-comment me-2"></i>Ajouter commentaire
                          </button>
                        </div>
                      </div>
                    </div>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Tâche */}
      {showTaskModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Nouvelle tâche
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowTaskModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Titre de la tâche *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea className="form-control" rows="4" required></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Stagiaire *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un stagiaire</option>
                        <option value="1">Jean Dupont - Développeur Web Full-Stack</option>
                        <option value="2">Marie Martin - Assistant Marketing Digital</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Catégorie *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une catégorie</option>
                        <option value="Développement">Développement</option>
                        <option value="Base de données">Base de données</option>
                        <option value="Tests">Tests</option>
                        <option value="Marketing">Marketing</option>
                        <option value="SEO">SEO</option>
                        <option value="DevOps">DevOps</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date limite *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Heures estimées *</label>
                      <input type="number" className="form-control" min="1" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Priorité *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une priorité</option>
                        <option value="low">Faible</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Élevée</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Superviseur *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un superviseur</option>
                        <option value="M. Martin">M. Martin</option>
                        <option value="Mme. Dubois">Mme. Dubois</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowTaskModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Créer la tâche
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TachesStagiaires; 