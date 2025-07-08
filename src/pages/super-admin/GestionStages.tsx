import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Internship {
  id: number;
  title: string;
  description: string;
  enterprise: string;
  location: string;
  duration: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  type: 'full-time' | 'part-time' | 'remote' | 'hybrid';
  salary?: string;
  applications: number;
  maxApplications: number;
  requirements: string[];
  benefits: string[];
  supervisor: string;
  supervisorEmail: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  student?: {
    id: number;
    name: string;
    email: string;
    program: string;
    year: number;
  };
  mentor?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  evaluations: {
    student: number;
    enterprise: number;
    mentor: number;
  };
}

const GestionStages: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [stages, setStages] = useState<any[]>([]);
  const [loadingStages, setLoadingStages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nouveauStage, setNouveauStage] = useState({ titre: '', entreprise: '', statut: 'en cours' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<any>(null);
  const [filteredStages, setFilteredStages] = useState<any[]>([]);
  const [filters, setFilters] = useState({ status: '', type: '', enterprise: '', approved: '' });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStage, setSelectedStage] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const fetchStages = async () => {
    setLoadingStages(true);
    try {
      const snap = await getDocs(collection(db, 'stages'));
      setStages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setFilteredStages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des stages');
    } finally {
      setLoadingStages(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'stages'), nouveauStage);
      setNouveauStage({ titre: '', entreprise: '', statut: 'en cours' });
      fetchStages();
    } catch (e) {
      setError('Erreur lors de l\'ajout');
    }
  };

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setEditingStage({ ...s });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'stages', editingId), editingStage);
      setEditingId(null);
      setEditingStage(null);
      fetchStages();
    } catch (e) {
      setError('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'stages', id));
      fetchStages();
    } catch (e) {
      setError('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    let filtered = stages;
    if (filters.status) filtered = filtered.filter(stage => stage.status === filters.status);
    if (filters.type) filtered = filtered.filter(stage => stage.type === filters.type);
    if (filters.enterprise) filtered = filtered.filter(stage => (stage.enterprise || '').toLowerCase().includes(filters.enterprise.toLowerCase()));
    if (filters.approved) filtered = filtered.filter(stage => stage.isApproved === (filters.approved === 'true'));
    setFilteredStages(filtered);
  }, [filters, stages]);

  if (loading) return <div>Chargement...</div>;
  if (role !== 'super_admin') return <div>Accès refusé</div>;
  if (loadingStages) return <div>Chargement des stages...</div>;
  if (error) return <div>{error}</div>;

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = stages;
    if (newFilters.status) {
      filtered = filtered.filter(internship => internship.status === newFilters.status);
    }
    if (newFilters.type) {
      filtered = filtered.filter(internship => internship.type === newFilters.type);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(internship => internship.enterprise.toLowerCase().includes(newFilters.enterprise.toLowerCase()));
    }
    if (newFilters.approved) {
      filtered = filtered.filter(internship => internship.isApproved === (newFilters.approved === 'true'));
    }
    setFilteredStages(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Actif' },
      completed: { class: 'bg-info', text: 'Terminé' },
      cancelled: { class: 'bg-danger', text: 'Annulé' },
      pending: { class: 'bg-warning', text: 'En attente' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'full-time': { class: 'bg-primary', text: 'Temps plein' },
      'part-time': { class: 'bg-secondary', text: 'Temps partiel' },
      'remote': { class: 'bg-success', text: 'Télétravail' },
      'hybrid': { class: 'bg-info', text: 'Hybride' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return stages.filter(internship => internship.status === status).length;
  };

  const getApprovalCount = (approved: boolean) => {
    return stages.filter(internship => internship.isApproved === approved).length;
  };

  return (
    <div className="container mt-4">
      <h2>Gestion des Stages</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-3">
        <input type="text" placeholder="Titre" value={editingId ? editingStage?.title : nouveauStage.title} onChange={e => editingId ? setEditingStage({ ...editingStage, title: e.target.value }) : setNouveauStage({ ...nouveauStage, title: e.target.value })} required />
        <input type="text" placeholder="Entreprise" value={editingId ? editingStage?.enterprise : nouveauStage.enterprise} onChange={e => editingId ? setEditingStage({ ...editingStage, enterprise: e.target.value }) : setNouveauStage({ ...nouveauStage, enterprise: e.target.value })} required />
        <input type="text" placeholder="Localisation" value={editingId ? editingStage?.location : nouveauStage.location} onChange={e => editingId ? setEditingStage({ ...editingStage, location: e.target.value }) : setNouveauStage({ ...nouveauStage, location: e.target.value })} />
        <input type="text" placeholder="Durée" value={editingId ? editingStage?.duration : nouveauStage.duration} onChange={e => editingId ? setEditingStage({ ...editingStage, duration: e.target.value }) : setNouveauStage({ ...nouveauStage, duration: e.target.value })} />
        <input type="text" placeholder="Date de début" value={editingId ? editingStage?.startDate : nouveauStage.startDate} onChange={e => editingId ? setEditingStage({ ...editingStage, startDate: e.target.value }) : setNouveauStage({ ...nouveauStage, startDate: e.target.value })} />
        <input type="text" placeholder="Date de fin" value={editingId ? editingStage?.endDate : nouveauStage.endDate} onChange={e => editingId ? setEditingStage({ ...editingStage, endDate: e.target.value }) : setNouveauStage({ ...nouveauStage, endDate: e.target.value })} />
        <input type="text" placeholder="Salaire" value={editingId ? editingStage?.salary : nouveauStage.salary} onChange={e => editingId ? setEditingStage({ ...editingStage, salary: e.target.value }) : setNouveauStage({ ...nouveauStage, salary: e.target.value })} />
        <select value={editingId ? editingStage?.status : nouveauStage.status} onChange={e => editingId ? setEditingStage({ ...editingStage, status: e.target.value as 'active' | 'completed' | 'cancelled' | 'pending' }) : setNouveauStage({ ...nouveauStage, status: e.target.value as 'active' | 'completed' | 'cancelled' | 'pending' })}>
          <option value="active">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                      <option value="pending">En attente</option>
                    </select>
        <select value={editingId ? editingStage?.type : nouveauStage.type} onChange={e => editingId ? setEditingStage({ ...editingStage, type: e.target.value as 'full-time' | 'part-time' | 'remote' | 'hybrid' }) : setNouveauStage({ ...nouveauStage, type: e.target.value as 'full-time' | 'part-time' | 'remote' | 'hybrid' })}>
                      <option value="full-time">Temps plein</option>
                      <option value="part-time">Temps partiel</option>
                      <option value="remote">Télétravail</option>
                      <option value="hybrid">Hybride</option>
                    </select>
        <button type="submit" className="btn btn-primary ms-2">{editingId ? 'Modifier' : 'Ajouter'}</button>
        {editingId && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingId(null); setEditingStage(null); }}>Annuler</button>}
      </form>
      {stages.length === 0 ? (
        <div>Aucun stage trouvé.</div>
      ) : (
        <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Titre</th>
                          <th>Entreprise</th>
                          <th>Localisation</th>
                          <th>Statut</th>
                          <th>Type</th>
                          <th>Candidatures</th>
                          <th>Approuvé</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
            {filteredStages.map(s => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.enterprise}</td>
                <td>{s.location}</td>
                <td>{getStatusBadge(s.status)}</td>
                <td>{getTypeBadge(s.type)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                    <span className="me-2">{s.applications}/{s.maxApplications}</span>
                                <div className="progress flex-grow-1" style={{ height: '6px' }}>
                                  <div 
                                    className="progress-bar bg-primary"
                        style={{ width: `${(s.applications / s.maxApplications) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                  {s.isApproved ? (
                                <i className="fas fa-check-circle text-success"></i>
                              ) : (
                                <i className="fas fa-times-circle text-danger"></i>
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                      className="btn btn-sm btn-warning me-2"
                                  onClick={() => {
                        setSelectedStage(s);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setEditingStage(s);
                        setEditingId(s.id);
                      }}
                      title="Éditer"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                    {!s.isApproved && (
                                  <button 
                        className="btn btn-sm btn-warning me-2"
                                    onClick={() => {
                          setSelectedStage(s);
                                      setShowApprovalModal(true);
                                    }}
                                    title="Approuver"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                )}
                                <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(s.id)}
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
                )}

      {/* Modal Détails Stage */}
      {showDetailsModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-briefcase me-2"></i>
                  {selectedStage.title}
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
                    <h6 className="text-primary mb-3">Description</h6>
                    <p>{selectedStage.description}</p>
                    
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <h6 className="text-primary">Informations générales</h6>
                        <ul className="list-unstyled">
                          <li><strong>Entreprise:</strong> {selectedStage.enterprise}</li>
                          <li><strong>Localisation:</strong> {selectedStage.location}</li>
                          <li><strong>Durée:</strong> {selectedStage.duration}</li>
                          <li><strong>Période:</strong> {selectedStage.startDate} - {selectedStage.endDate}</li>
                          <li><strong>Salaire:</strong> {selectedStage.salary || 'Non renseigné'}</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary">Supervision</h6>
                        <ul className="list-unstyled">
                          <li><strong>Superviseur:</strong> {selectedStage.supervisor}</li>
                          <li><strong>Email:</strong> {selectedStage.supervisorEmail}</li>
                          {selectedStage.mentor && (
                            <>
                              <li><strong>Mentor:</strong> {selectedStage.mentor.name}</li>
                              <li><strong>Rôle:</strong> {selectedStage.mentor.role}</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <h6 className="text-primary">Prérequis</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {selectedStage.requirements.map((req, index) => (
                            <span key={index} className="badge bg-light text-dark">{req}</span>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-primary">Avantages</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {selectedStage.benefits.map((benefit, index) => (
                            <span key={index} className="badge bg-success">{benefit}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="card-header">
                        <h6 className="mb-0">Statistiques</h6>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Candidatures</label>
                          <div className="d-flex justify-content-between">
                            <span>{selectedStage.applications}</span>
                            <span className="text-muted">/ {selectedStage.maxApplications}</span>
                          </div>
                          <div className="progress mt-1">
                            <div 
                              className="progress-bar bg-primary"
                              style={{ width: `${(selectedStage.applications / selectedStage.maxApplications) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        {selectedStage.student && (
                          <div className="mb-3">
                            <h6 className="text-primary">Stagiaire assigné</h6>
                            <div className="border rounded p-2">
                              <strong>{selectedStage.student.name}</strong><br />
                              <small className="text-muted">{selectedStage.student.email}</small><br />
                              <small className="text-muted">{selectedStage.student.program} - {selectedStage.student.year}</small>
                            </div>
                          </div>
                        )}

                        {selectedStage.evaluations && (
                          <div className="mb-3">
                            <h6 className="text-primary">Évaluations</h6>
                            <div className="row g-2">
                              <div className="col-6">
                                <small>Étudiant</small>
                                <div className="d-flex align-items-center">
                                  <span className="me-1">{selectedStage.evaluations.student}</span>
                                  <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <i 
                                        key={star} 
                                        className={`fas fa-star ${star <= selectedStage.evaluations.student ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="col-6">
                                <small>Entreprise</small>
                                <div className="d-flex align-items-center">
                                  <span className="me-1">{selectedStage.evaluations.enterprise}</span>
                                  <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <i 
                                        key={star} 
                                        className={`fas fa-star ${star <= selectedStage.evaluations.enterprise ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-3">
                          <h6 className="text-primary">Tags</h6>
                          <div className="d-flex flex-wrap gap-1">
                            {selectedStage.tags.map((tag, index) => (
                              <span key={index} className="badge bg-secondary">{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h6 className="text-primary">Informations système</h6>
                          <ul className="list-unstyled small">
                            <li><strong>Créé:</strong> {selectedStage.createdAt}</li>
                            <li><strong>Modifié:</strong> {selectedStage.updatedAt}</li>
                            {selectedStage.approvedBy && (
                              <li><strong>Approuvé par:</strong> {selectedStage.approvedBy}</li>
                            )}
                            {selectedStage.approvedAt && (
                              <li><strong>Approuvé le:</strong> {selectedStage.approvedAt}</li>
                            )}
                          </ul>
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
                <button className="btn btn-primary">
                  <i className="fas fa-edit me-2"></i>Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Approbation */}
      {showApprovalModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-check me-2"></i>
                  Approuver le stage
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowApprovalModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir approuver le stage <strong>"{selectedStage.title}"</strong> ?</p>
                <p className="text-muted">Cette action rendra le stage visible pour les étudiants et permettra les candidatures.</p>
                
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="notify_enterprise" />
                  <label className="form-check-label" htmlFor="notify_enterprise">
                    Notifier l'entreprise par email
                  </label>
                </div>
                
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="publish_immediately" />
                  <label className="form-check-label" htmlFor="publish_immediately">
                    Publier immédiatement
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApprovalModal(false)}
                >
                  Annuler
                </button>
                <button className="btn btn-success">
                  <i className="fas fa-check me-2"></i>Approuver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionStages; 