import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Tache {
  id: number;
  titre: string;
  description: string;
  idEtudiant: string;
  nomEtudiant: string;
  photoEtudiant?: string;
  titreStage: string;
  nomEntreprise: string;
  logoEntreprise?: string;
  dateAttribution: string;
  dateEcheance: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'retard' | 'annulee';
  priorite: 'basse' | 'moyenne' | 'haute' | 'urgente';
  categorie: string;
  heuresEstimees: number;
  heuresReelles?: number;
  encadrant: string;
  tuteur: string;
  programme: string;
  annee: number;
  fichiers?: string[];
  commentaires: Commentaire[];
  progression: number;
  noteEvaluation?: number;
}

interface Commentaire {
  id: number;
  auteur: string;
  contenu: string;
  date: string;
  estEncadrant: boolean;
}

const TachesStagiaires: React.FC = () => {
  const [tasks, setTasks] = useState<Tache[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Tache[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    student: '',
    category: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Tache | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Données simulées
  useEffect(() => {
    const mockTasks: Tache[] = [
      {
        id: 1,
        titre: 'Développement du module authentification',
        description: 'Créer un système d\'authentification sécurisé avec JWT pour l\'application web. Inclure la gestion des rôles et permissions.',
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        titreStage: 'Développeur Web Full-Stack',
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        dateAttribution: '01/03/2024',
        dateEcheance: '15/04/2024',
        statut: 'en_cours',
        priorite: 'haute',
        categorie: 'Développement',
        heuresEstimees: 40,
        heuresReelles: 25,
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        progression: 62,
        noteEvaluation: 4.5,
        commentaires: [
          {
            id: 1,
            auteur: 'M. Martin',
            contenu: 'Bon début, n\'oubliez pas de tester les cas d\'erreur',
            date: '05/03/2024',
            estEncadrant: true
          },
          {
            id: 2,
            auteur: 'Jean Dupont',
            contenu: 'Merci, je vais ajouter les tests unitaires',
            date: '06/03/2024',
            estEncadrant: false
          }
        ]
      },
      {
        id: 2,
        titre: 'Création de la base de données',
        description: 'Concevoir et implémenter le schéma de base de données pour le projet e-commerce. Inclure les relations et contraintes.',
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        titreStage: 'Développeur Web Full-Stack',
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        dateAttribution: '10/03/2024',
        dateEcheance: '25/03/2024',
        statut: 'terminee',
        priorite: 'moyenne',
        categorie: 'Base de données',
        heuresEstimees: 20,
        heuresReelles: 18,
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        progression: 100,
        noteEvaluation: 4.8,
        commentaires: [
          {
            id: 3,
            auteur: 'M. Martin',
            contenu: 'Excellent travail, la structure est bien pensée',
            date: '20/03/2024',
            estEncadrant: true
          }
        ]
      },
      {
        id: 3,
        titre: 'Gestion des réseaux sociaux',
        description: 'Créer et publier du contenu sur les réseaux sociaux de l\'entreprise. Analyser les performances et proposer des améliorations.',
        idEtudiant: '2024002',
        nomEtudiant: 'Marie Martin',
        photoEtudiant: '/api/photos/student-2.jpg',
        titreStage: 'Assistant Marketing Digital',
        nomEntreprise: 'MarketingPro',
        logoEntreprise: '/api/logos/marketingpro-logo.png',
        dateAttribution: '01/04/2024',
        dateEcheance: '30/04/2024',
        statut: 'en_cours',
        priorite: 'moyenne',
        categorie: 'Marketing',
        heuresEstimees: 30,
        heuresReelles: 15,
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        programme: 'Master Marketing',
        annee: 2,
        progression: 50,
        noteEvaluation: 4.2,
        commentaires: [
          {
            id: 4,
            auteur: 'Mme. Dubois',
            contenu: 'Le contenu est de bonne qualité, continuez ainsi',
            date: '10/04/2024',
            estEncadrant: true
          }
        ]
      },
      {
        id: 4,
        titre: 'Tests unitaires et d\'intégration',
        description: 'Écrire des tests complets pour tous les modules développés. Assurer une couverture de code d\'au moins 80%.',
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        titreStage: 'Développeur Web Full-Stack',
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        dateAttribution: '20/03/2024',
        dateEcheance: '10/04/2024',
        statut: 'en_attente',
        priorite: 'haute',
        categorie: 'Tests',
        heuresEstimees: 25,
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        progression: 0,
        commentaires: []
      },
      {
        id: 5,
        titre: 'Analyse des performances SEO',
        description: 'Analyser le SEO du site web actuel et proposer des améliorations pour optimiser le référencement.',
        idEtudiant: '2024002',
        nomEtudiant: 'Marie Martin',
        photoEtudiant: '/api/photos/student-2.jpg',
        titreStage: 'Assistant Marketing Digital',
        nomEntreprise: 'MarketingPro',
        logoEntreprise: '/api/logos/marketingpro-logo.png',
        dateAttribution: '15/04/2024',
        dateEcheance: '15/05/2024',
        statut: 'en_attente',
        priorite: 'basse',
        categorie: 'SEO',
        heuresEstimees: 35,
        encadrant: 'Mme. Dubois',
        tuteur: 'Dr. Moreau',
        programme: 'Master Marketing',
        annee: 2,
        progression: 0,
        commentaires: []
      },
      {
        id: 6,
        titre: 'Déploiement en production',
        description: 'Préparer et effectuer le déploiement de l\'application en production. Configurer l\'environnement et les variables.',
        idEtudiant: '2024001',
        nomEtudiant: 'Jean Dupont',
        photoEtudiant: '/api/photos/student-1.jpg',
        titreStage: 'Développeur Web Full-Stack',
        nomEntreprise: 'TechCorp Solutions',
        logoEntreprise: '/api/logos/techcorp-logo.png',
        dateAttribution: '01/05/2024',
        dateEcheance: '15/05/2024',
        statut: 'retard',
        priorite: 'urgente',
        categorie: 'DevOps',
        heuresEstimees: 15,
        heuresReelles: 20,
        encadrant: 'M. Martin',
        tuteur: 'Dr. Dupont',
        programme: 'Master Informatique',
        annee: 2,
        progression: 85,
        noteEvaluation: 3.5,
        commentaires: [
          {
            id: 5,
            auteur: 'M. Martin',
            contenu: 'Attention aux délais, cette tâche est critique',
            date: '10/05/2024',
            estEncadrant: true
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
      filtered = filtered.filter(task => task.statut === newFilters.status);
    }
    if (newFilters.priority) {
      filtered = filtered.filter(task => task.priorite === newFilters.priority);
    }
    if (newFilters.student) {
      filtered = filtered.filter(task => task.idEtudiant === newFilters.student);
    }
    if (newFilters.category) {
      filtered = filtered.filter(task => task.categorie === newFilters.category);
    }

    setFilteredTasks(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      en_attente: { class: 'bg-secondary', text: 'En attente', icon: 'fas fa-clock' },
      en_cours: { class: 'bg-info', text: 'En cours', icon: 'fas fa-play' },
      terminee: { class: 'bg-success', text: 'Terminé', icon: 'fas fa-check' },
      retard: { class: 'bg-danger', text: 'En retard', icon: 'fas fa-exclamation-triangle' },
      annulee: { class: 'bg-dark', text: 'Annulé', icon: 'fas fa-times' }
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
      basse: { class: 'bg-success', text: 'Faible' },
      moyenne: { class: 'bg-warning', text: 'Moyenne' },
      haute: { class: 'bg-danger', text: 'Élevée' },
      urgente: { class: 'bg-dark', text: 'Urgente' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return tasks.filter(task => task.statut === status).length;
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
        task.id === taskId ? { ...task, statut: newStatus as any } : task
      )
    );
    setFilteredTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, statut: newStatus as any } : task
      )
    );
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
                  <i className="fas fa-tasks me-2 text-primary"></i>
                  Tâches des Stagiaires
                </h1>
                <p className="text-muted mb-0">
                  Suivez et gérez les tâches assignées à vos étudiants
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
                        <h4 className="mb-0">{getStatusCount('en_cours')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('terminee')}</h4>
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
                        <h4 className="mb-0">{getStatusCount('retard')}</h4>
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
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="terminee">Terminé</option>
                      <option value="retard">En retard</option>
                      <option value="annulee">Annulé</option>
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
                      <option value="basse">Faible</option>
                      <option value="moyenne">Moyenne</option>
                      <option value="haute">Élevée</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Étudiant</label>
                    <select 
                      className="form-select"
                      value={filters.student}
                      onChange={(e) => handleFilterChange('student', e.target.value)}
                    >
                      <option value="">Tous les étudiants</option>
                      <option value="2024001">Jean Dupont</option>
                      <option value="2024002">Marie Martin</option>
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
                        setFilters({ status: '', priority: '', student: '', category: '' });
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
                            <th>Étudiant</th>
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
                                  <strong>{task.titre}</strong><br />
                                  <small className="text-muted">{task.description.substring(0, 100)}...</small><br />
                                  <small className="text-muted">
                                    <i className="fas fa-tag me-1"></i>{task.categorie}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <img 
                                    src={task.photoEtudiant || '/default-avatar.png'} 
                                    alt="Photo"
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                  />
                                  <div>
                                    <strong>{task.nomEtudiant}</strong><br />
                                    <small className="text-muted">{task.titreStage}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{task.dateEcheance}</strong><br />
                                  <small className="text-muted">
                                    {task.heuresEstimees}h estimées
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div className="mb-1">
                                  <div className="d-flex justify-content-between">
                                    <small>{task.progression}%</small>
                                  </div>
                                  <div className="progress" style={{ height: '6px' }}>
                                    <div 
                                      className={`progress-bar bg-${getProgressColor(task.progression)}`}
                                      style={{ width: `${task.progression}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td>{getStatusBadge(task.statut)}</td>
                              <td>{getPriorityBadge(task.priorite)}</td>
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
                                    onClick={() => handleStatusChange(task.id, 'terminee')}
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
                        <i className="fas fa-clock me-2"></i>En attente ({filteredTasks.filter(t => t.statut === 'en_attente').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.statut === 'en_attente').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.titre}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.nomEtudiant}</small>
                              {getPriorityBadge(task.priorite)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getProgressColor(task.progression)}`}
                                style={{ width: `${task.progression}%` }}
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
                        <i className="fas fa-play me-2"></i>En cours ({filteredTasks.filter(t => t.statut === 'en_cours').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.statut === 'en_cours').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.titre}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.nomEtudiant}</small>
                              {getPriorityBadge(task.priorite)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getProgressColor(task.progression)}`}
                                style={{ width: `${task.progression}%` }}
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
                        <i className="fas fa-check me-2"></i>Terminées ({filteredTasks.filter(t => t.statut === 'terminee').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.statut === 'terminee').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.titre}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.nomEtudiant}</small>
                              {getPriorityBadge(task.priorite)}
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
                        <i className="fas fa-exclamation-triangle me-2"></i>En retard ({filteredTasks.filter(t => t.statut === 'retard').length})
                      </h6>
                    </div>
                    <div className="card-body">
                      {filteredTasks.filter(task => task.statut === 'retard').map((task) => (
                        <div key={task.id} className="card mb-3 task-card">
                          <div className="card-body">
                            <h6 className="card-title">{task.titre}</h6>
                            <p className="card-text small">{task.description.substring(0, 80)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{task.nomEtudiant}</small>
                              {getPriorityBadge(task.priorite)}
                            </div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                              <div 
                                className={`progress-bar bg-${getProgressColor(task.progression)}`}
                                style={{ width: `${task.progression}%` }}
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
                    <h5>{selectedTask.titre}</h5>
                    <p className="text-muted">{selectedTask.description}</p>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Étudiant:</strong> {selectedTask.nomEtudiant}<br />
                        <strong>Stage:</strong> {selectedTask.titreStage}<br />
                        <strong>Encadrant:</strong> {selectedTask.encadrant}
                      </div>
                      <div className="col-md-6">
                        <strong>Date d'attribution:</strong> {selectedTask.dateAttribution}<br />
                        <strong>Date limite:</strong> {selectedTask.dateEcheance}<br />
                        <strong>Catégorie:</strong> {selectedTask.categorie}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Heures estimées:</strong> {selectedTask.heuresEstimees}h
                        {selectedTask.heuresReelles && (
                          <div>
                            <strong>Heures réelles:</strong> {selectedTask.heuresReelles}h
                          </div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <strong>Progression:</strong> {selectedTask.progression}%<br />
                        <div className="progress mt-1">
                          <div 
                            className={`progress-bar bg-${getProgressColor(selectedTask.progression)}`}
                            style={{ width: `${selectedTask.progression}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {selectedTask.commentaires.length > 0 && (
                      <div className="mb-3">
                        <strong>Commentaires:</strong>
                        <div className="mt-2">
                          {selectedTask.commentaires.map((comment) => (
                            <div key={comment.id} className="card mb-2">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <strong>{comment.auteur}</strong>
                                  <small className="text-muted">{comment.date}</small>
                                </div>
                                <p className="mb-0 mt-1">{comment.contenu}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-body">
                        <h6>Actions rapides</h6>
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusChange(selectedTask.id, 'terminee')}
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
                      <label className="form-label">Étudiant *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un étudiant</option>
                        <option value="2024001">Jean Dupont - Développeur Web Full-Stack</option>
                        <option value="2024002">Marie Martin - Assistant Marketing Digital</option>
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
                        <option value="basse">Faible</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="haute">Élevée</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Encadrant *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un encadrant</option>
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