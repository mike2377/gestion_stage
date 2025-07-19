import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
  const { user } = useAuth();
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
  const [evaluators, setEvaluators] = useState<{ id: string, name: string }[]>([]);

  useEffect(() => {
    if (!user || !user.universiteId) return;
    const fetchEvaluations = async () => {
      // On suppose que chaque évaluation a un champ universiteId
      const q = query(collection(db, 'evaluations'), where('universiteId', '==', user.universiteId));
      const snap = await getDocs(q);
      const evals: Evaluation[] = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          studentId: data.studentId || data.idEtudiant || '',
          studentName: data.studentName || data.nomEtudiant || '',
          studentPhoto: data.studentPhoto || data.photoEtudiant || '',
          program: data.program || data.programme || '',
          year: data.year || data.annee || '',
          enterpriseName: data.enterpriseName || data.nomEntreprise || '',
          stageTitle: data.stageTitle || data.titreStage || '',
          evaluator: data.evaluator || data.encadrant || data.tuteur || '',
          evaluatorRole: data.evaluatorRole || data.typeEvaluation || '',
          date: data.date || data.dateEvaluation || '',
          score: data.score || data.noteGlobale || 0,
          status: data.status || data.statut || '',
          comments: data.comments || data.commentaires || '',
          criteria: data.criteria || data.notes || [],
        };
      });
      setEvaluations(evals);
      setFilteredEvaluations(evals);
    };
    fetchEvaluations();
    // Charger les évaluateurs (enseignants et tuteurs)
    const fetchEvaluators = async () => {
      const q = query(
        collection(db, 'utilisateurs'),
        where('universiteId', '==', user.universiteId),
        where('role', 'in', ['teacher', 'enseignant', 'tutor', 'tuteur'])
      );
      const snap = await getDocs(q);
      setEvaluators(snap.docs.map(doc => ({
        id: doc.id,
        name: (doc.data().firstName || doc.data().prenom || '') + ' ' + (doc.data().lastName || doc.data().nom || '')
      })));
    };
    fetchEvaluators();
  }, [user]);

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

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        {/* Supprimer toute inclusion de Sidebar ou SidebarLayout. Retourner uniquement le contenu principal. */}
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
                      <option value="">Tous les évaluateurs</option>
                      {evaluators.map(ev => (
                        <option key={ev.id} value={ev.name}>{ev.name}</option>
                      ))}
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