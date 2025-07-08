import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Evaluation {
  id: number;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  program: string;
  year: number;
  enterpriseName: string;
  stageTitle: string;
  evaluator: string;
  evaluatorRole: 'tuteur' | 'enseignant' | 'responsable' | 'entreprise';
  date: string;
  score: number;
  status: 'pending' | 'completed' | 'in_progress';
  comments: string;
  criteria: { label: string; score: number; max: number; }[];
}

const Evaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    evaluator: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const mockEvaluations: Evaluation[] = [
      {
        id: 1,
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        program: 'Master Informatique',
        year: 2,
        enterpriseName: 'TechCorp Solutions',
        stageTitle: 'Développeur Web Full-Stack',
        evaluator: 'Dr. Dupont',
        evaluatorRole: 'enseignant',
        date: '15/04/2024',
        score: 4.5,
        status: 'completed',
        comments: 'Très bon stage, étudiant motivé et compétent.',
        criteria: [
          { label: 'Compétences techniques', score: 5, max: 5 },
          { label: 'Autonomie', score: 4, max: 5 },
          { label: 'Communication', score: 4, max: 5 },
          { label: 'Respect des délais', score: 5, max: 5 }
        ]
      },
      {
        id: 2,
        studentId: '2024002',
        studentName: 'Marie Martin',
        studentPhoto: '/api/photos/student-2.jpg',
        program: 'Master Marketing',
        year: 2,
        enterpriseName: 'MarketingPro',
        stageTitle: 'Assistant Marketing Digital',
        evaluator: 'Mme. Dubois',
        evaluatorRole: 'tuteur',
        date: '10/04/2024',
        score: 4.2,
        status: 'completed',
        comments: 'Bonne intégration, créativité appréciée.',
        criteria: [
          { label: 'Créativité', score: 5, max: 5 },
          { label: 'Rigueur', score: 4, max: 5 },
          { label: 'Travail en équipe', score: 4, max: 5 },
          { label: 'Respect des consignes', score: 4, max: 5 }
        ]
      },
      {
        id: 3,
        studentId: '2024003',
        studentName: 'Sophie Bernard',
        studentPhoto: '/api/photos/student-3.jpg',
        program: 'Master Data Science',
        year: 2,
        enterpriseName: 'DataCorp',
        stageTitle: 'Data Analyst',
        evaluator: 'M. Bernard',
        evaluatorRole: 'entreprise',
        date: '15/12/2023',
        score: 4.8,
        status: 'completed',
        comments: 'Stage exceptionnel, embauche recommandée.',
        criteria: [
          { label: 'Analyse de données', score: 5, max: 5 },
          { label: 'Innovation', score: 5, max: 5 },
          { label: 'Présentation', score: 4, max: 5 },
          { label: 'Autonomie', score: 5, max: 5 }
        ]
      },
      {
        id: 4,
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        program: 'Master Informatique',
        year: 2,
        enterpriseName: 'TechCorp Solutions',
        stageTitle: 'Développeur Web Full-Stack',
        evaluator: 'M. Martin',
        evaluatorRole: 'tuteur',
        date: '01/04/2024',
        score: 4.3,
        status: 'completed',
        comments: 'Bon travail, progression constante.',
        criteria: [
          { label: 'Compétences techniques', score: 4, max: 5 },
          { label: 'Autonomie', score: 4, max: 5 },
          { label: 'Communication', score: 5, max: 5 },
          { label: 'Respect des délais', score: 4, max: 5 }
        ]
      }
    ];
    setEvaluations(mockEvaluations);
    setFilteredEvaluations(mockEvaluations);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = evaluations;
    if (newFilters.status) {
      filtered = filtered.filter(e => e.status === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(e => e.program === newFilters.program);
    }
    if (newFilters.evaluator) {
      filtered = filtered.filter(e => e.evaluator === newFilters.evaluator);
    }
    setFilteredEvaluations(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'En attente' },
      completed: { class: 'bg-success', text: 'Terminée' },
      in_progress: { class: 'bg-info', text: 'En cours' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const user = {
    role: 'responsable',
    firstName: 'M. Responsable',
    lastName: 'Stage'
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-star-half-alt me-2 text-primary"></i>
                  Évaluations des Stages
                </h1>
                <p className="text-muted mb-0">
                  Consultez et gérez les évaluations des étudiants en stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fas fa-filter me-2"></i>Filtres
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Statut</label>
                    <select className="form-select" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
                      <option value="">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="completed">Terminée</option>
                      <option value="in_progress">En cours</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Programme</label>
                    <select className="form-select" value={filters.program} onChange={e => handleFilterChange('program', e.target.value)}>
                      <option value="">Tous les programmes</option>
                      <option value="Master Informatique">Master Informatique</option>
                      <option value="Master Marketing">Master Marketing</option>
                      <option value="Master Data Science">Master Data Science</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Évaluateur</label>
                    <select className="form-select" value={filters.evaluator} onChange={e => handleFilterChange('evaluator', e.target.value)}>
                      <option value="">Tous</option>
                      <option value="Dr. Dupont">Dr. Dupont</option>
                      <option value="Mme. Dubois">Mme. Dubois</option>
                      <option value="M. Bernard">M. Bernard</option>
                      <option value="M. Martin">M. Martin</option>
                    </select>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={() => {
                      setFilters({ status: '', program: '', evaluator: '' });
                      setFilteredEvaluations(evaluations);
                    }}>
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Évaluations ({filteredEvaluations.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredEvaluations.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune évaluation trouvée</h5>
                    <p className="text-muted">Aucune évaluation ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Évaluateur</th>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvaluations.map(evaluation => (
                          <tr key={evaluation.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img src={evaluation.studentPhoto || '/default-avatar.png'} alt="Photo" className="rounded-circle me-2" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
                                <div>
                                  <strong>{evaluation.studentName}</strong><br />
                                  <small className="text-muted">{evaluation.program} - {evaluation.year}</small>
                                </div>
                              </div>
                            </td>
                            <td><strong>{evaluation.stageTitle}</strong></td>
                            <td><strong>{evaluation.enterpriseName}</strong></td>
                            <td><strong>{evaluation.evaluator}</strong><br /><small className="text-muted">{evaluation.evaluatorRole}</small></td>
                            <td>{evaluation.date}</td>
                            <td>
                              <span className="me-2">{evaluation.score}/5</span>
                              <span className="d-inline-block">
                                {[...Array(5)].map((_, i) => (
                                  <i key={i} className={`fas fa-star ${i < Math.floor(evaluation.score) ? 'text-warning' : 'text-muted'}`}></i>
                                ))}
                              </span>
                            </td>
                            <td>{getStatusBadge(evaluation.status)}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedEvaluation(evaluation); setShowDetailsModal(true); }} title="Voir détails">
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
            </div>
          </div>
        </div>
      </div>
      {/* Modal Détails Evaluation */}
      {showDetailsModal && selectedEvaluation && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-star-half-alt me-2"></i>
                  Détails de l'évaluation - {selectedEvaluation.studentName}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4 text-center">
                    <img src={selectedEvaluation.studentPhoto || '/default-avatar.png'} alt="Photo" className="rounded-circle mb-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    <h5>{selectedEvaluation.studentName}</h5>
                    <p className="text-muted">{selectedEvaluation.program} - {selectedEvaluation.year}</p>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-primary mb-2">Stage</h6>
                    <p><strong>{selectedEvaluation.stageTitle}</strong> chez <strong>{selectedEvaluation.enterpriseName}</strong></p>
                    <h6 className="text-primary mb-2">Évaluateur</h6>
                    <p><strong>{selectedEvaluation.evaluator}</strong> ({selectedEvaluation.evaluatorRole})</p>
                    <h6 className="text-primary mb-2">Date</h6>
                    <p>{selectedEvaluation.date}</p>
                  </div>
                </div>
                <h6 className="text-primary mb-2">Critères d'évaluation</h6>
                <ul className="list-group mb-3">
                  {selectedEvaluation.criteria.map((c, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      {c.label}
                      <span className="badge bg-info">
                        {c.score}/{c.max}
                      </span>
                    </li>
                  ))}
                </ul>
                <h6 className="text-primary mb-2">Commentaires</h6>
                <div className="card">
                  <div className="card-body">
                    <p className="mb-0">{selectedEvaluation.comments}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evaluations; 