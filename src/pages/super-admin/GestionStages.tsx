import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FaBriefcase, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaHourglassHalf, FaUniversity } from 'react-icons/fa';

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
  const [universites, setUniversites] = useState<{
    id: string;
    nom: string;
  }[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stages' | 'etudiants'>('stages');
  const [selectedUniversiteId, setSelectedUniversiteId] = useState<string>('');

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

  useEffect(() => {
    // Charger universités et utilisateurs pour la section étudiants par université
    const fetchUniversites = async () => {
      const snap = await getDocs(collection(db, 'universites'));
      setUniversites(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    const fetchUtilisateurs = async () => {
      const snap = await getDocs(collection(db, 'utilisateurs'));
      setUtilisateurs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUniversites();
    fetchUtilisateurs();
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

  const getStatusBadge = (statut: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Actif' },
      completed: { class: 'bg-info', text: 'Terminé' },
      cancelled: { class: 'bg-danger', text: 'Annulé' },
      pending: { class: 'bg-warning', text: 'En attente' }
    };
    // Correction : valeur par défaut si statut inconnu
    const config = statusConfig[statut] || { class: 'bg-secondary', text: statut || 'Inconnu' };
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'full-time': { class: 'bg-primary', text: 'Temps plein' },
      'part-time': { class: 'bg-secondary', text: 'Temps partiel' },
      'remote': { class: 'bg-success', text: 'Télétravail' },
      'hybrid': { class: 'bg-info', text: 'Hybride' }
    };
    // Correction : valeur par défaut si type inconnu
    const config = typeConfig[type] || { class: 'bg-secondary', text: type || 'Inconnu' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return stages.filter(internship => internship.status === status).length;
  };

  const getApprovalCount = (approved: boolean) => {
    return stages.filter(internship => internship.isApproved === approved).length;
  };

  const handleDeleteConfirm = (id: string) => {
    if(window.confirm('Êtes-vous sûr de vouloir supprimer ce stage ?')) {
      handleDelete(id);
    }
  };

  const renderEtudiantsParUniversite = () => (
    <div className="mt-4">
      <h4><FaUniversity className="me-2 text-primary" />Étudiants en stage par université</h4>
      {/* Selecteur d'université */}
      <div className="mb-3" style={{ maxWidth: 400 }}>
        <select className="form-select" value={selectedUniversiteId} onChange={e => setSelectedUniversiteId(e.target.value)}>
          <option value="">Toutes les universités</option>
          {universites.map(u => (
            <option key={u.id} value={u.id}>{u.nom}</option>
          ))}
        </select>
      </div>
      {(selectedUniversiteId ? universites.filter(u => u.id === selectedUniversiteId) : universites).map(univ => {
        // Trouver les étudiants de cette université
        const etudiants = utilisateurs.filter(u => u.role === 'etudiant' && u.universiteId === univ.id);
        // Pour chaque étudiant, trouver son stage (en cours, terminé, etc.)
        const etudiantsAvecStage = etudiants.map(etudiant => {
          const stage = stages.find(s => s.student && (s.student.id === etudiant.id || s.student.email === etudiant.email));
          return { etudiant, stage };
        }).filter(e => e.stage); // Ne garder que ceux qui ont un stage
        if (etudiantsAvecStage.length === 0) return null;
        return (
          <div key={univ.id} className="mb-4">
            <h5 className="mb-2">{univ.nom}</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Tuteur</th>
                    <th>Enseignant référent</th>
                    <th>Statut du stage</th>
                  </tr>
                </thead>
                <tbody>
                  {etudiantsAvecStage.map(({ etudiant, stage }, idx) => (
                    <tr key={idx}>
                      <td>{etudiant.prenom} {etudiant.nom}</td>
                      <td>{etudiant.email}</td>
                      <td>{stage.enterprise}</td>
                      <td>{stage.mentor ? `${stage.mentor.name} (${stage.mentor.email})` : '-'}</td>
                      <td>{stage.enseignant ? `${stage.enseignant.name} (${stage.enseignant.email})` : '-'}</td>
                      <td>{getStatusBadge(stage.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaBriefcase className="me-2 text-primary" />
            Gestion des Stages
          </h1>
          <p className="text-muted mb-0">Gérez les offres de stage du système</p>
        </div>
      </div>

      {/* Cards de stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">{stages.length}</h4>
                <p className="mb-0">Total Stages</p>
              </div>
              <FaBriefcase className="fa-2x" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">{getStatusCount('active')}</h4>
                <p className="mb-0">Actifs</p>
              </div>
              <FaCheck className="fa-2x" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">{getStatusCount('pending')}</h4>
                <p className="mb-0">En attente</p>
              </div>
              <FaHourglassHalf className="fa-2x" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-0">{getStatusCount('cancelled')}</h4>
                <p className="mb-0">Annulés</p>
              </div>
              <FaTimes className="fa-2x" />
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input type="text" className="form-control" placeholder="Rechercher un stage..." value={filters.enterprise} onChange={e => handleFilterChange('enterprise', e.target.value)} />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">{filteredStages.length} stage(s) trouvé(s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des stages */}
      <div className="card">
        <div className="card-body">
          <div className="mb-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button className={`nav-link${activeTab === 'stages' ? ' active' : ''}`} onClick={() => setActiveTab('stages')}>Stages</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link${activeTab === 'etudiants' ? ' active' : ''}`} onClick={() => setActiveTab('etudiants')}>Étudiants par université</button>
              </li>
            </ul>
          </div>
          {activeTab === 'stages' ? (
            filteredStages.length === 0 ? (
              <div className="text-center py-4">
                <FaBriefcase className="fa-3x text-muted mb-3" />
                <h5>Aucun stage trouvé</h5>
                <p className="text-muted">Aucune offre de stage ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Titre</th>
                      <th>Entreprise</th>
                      <th>Localisation</th>
                      <th>Type</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStages.map((stage) => (
                      <tr key={stage.id}>
                        <td><strong>{stage.title}</strong></td>
                        <td>{stage.enterprise}</td>
                        <td>{stage.location}</td>
                        <td>{getTypeBadge(stage.type)}</td>
                        <td>{getStatusBadge(stage.status)}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedStage(stage); setShowDetailsModal(true); }} title="Voir les détails"><FaEye /></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteConfirm(stage.id)} title="Supprimer"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            renderEtudiantsParUniversite()
          )}
        </div>
      </div>

      {/* Modal Détails Stage */}
      {showDetailsModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaBriefcase className="me-2" />
                  {selectedStage.title}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Entreprise :</strong> {selectedStage.enterprise}</p>
                <p><strong>Localisation :</strong> {selectedStage.location}</p>
                <p><strong>Type :</strong> {getTypeBadge(selectedStage.type)}</p>
                <p><strong>Statut :</strong> {getStatusBadge(selectedStage.status)}</p>
                <p><strong>Description :</strong> {selectedStage.description}</p>
                <p><strong>Durée :</strong> {selectedStage.duration}</p>
                <p><strong>Période :</strong> {selectedStage.startDate} - {selectedStage.endDate}</p>
                <p><strong>Salaire :</strong> {selectedStage.salary || 'Non renseigné'}</p>
                <p><strong>Étudiants associés :</strong></p>
                {selectedStage.students && selectedStage.students.length > 0 ? (
                  <ul>
                    {selectedStage.students.map((student: any, index: number) => (
                      <li key={index}>
                        {student.name} ({student.email}) - Programme: {student.program}, Année: {student.year}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Aucun étudiant associé à ce stage.</p>
                )}
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

export default GestionStages; 