import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Stage {
  id: string;
  title: string;
  description: string;
  enterpriseId: string;
  enterpriseName: string;
  enterpriseLogo?: string;
  location: string;
  duration: number;
  startDate: string;
  endDate: string;
  salary?: number;
  status: string;
  category: string;
  skills: string[];
  requirements: string[];
  benefits: string[];
  supervisor: string;
  supervisorEmail: string;
  supervisorPhone: string;
  maxCandidates: number;
  currentCandidates: number;
  applications?: Application[];
  createdAt: string;
  updatedAt: string;
  views?: number;
  favorites?: number;
  isFeatured?: boolean;
  isUrgent?: boolean;
  tags?: string[];
  isPaid?: boolean;
}

interface Application {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  program: string;
  year: number;
  email: string;
  phone: string;
  status: string;
  appliedDate: string;
  cv?: string;
  coverLetter?: string;
  motivation: string;
  skills: string[];
  experience: string;
  availability: string;
  evaluation?: number;
  notes?: string;
}

const GestionStages: React.FC = () => {
  const { user } = useAuth();
  const [stages, setStages] = useState<Stage[]>([]);
  const [filteredStages, setFilteredStages] = useState<Stage[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    enterprise: '',
    location: ''
  });
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [editStage, setEditStage] = useState<Stage | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [entreprises, setEntreprises] = useState<{ id: string; name: string; sector: string }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [newStage, setNewStage] = useState({
    title: '',
    description: '',
    enterpriseId: '',
    category: '',
    location: '',
    duration: 1,
    startDate: '',
    endDate: '',
    salary: 0,
    maxCandidates: 1,
    skills: '',
    requirements: '',
    benefits: '',
        isFeatured: false,
        isUrgent: false,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetchStages = async () => {
      const q = query(collection(db, 'stages'), where('universiteId', '==', user.universiteId));
      const snapshot = await getDocs(q);
      const stagesData: Stage[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.titre || '',
          description: data.description || '',
          enterpriseId: data.entreprise?.id || '',
          enterpriseName: data.entreprise?.nom || '',
          enterpriseLogo: data.entreprise?.logo,
          location: data.localisation || '',
          duration: data.duree || 0,
          startDate: data.date_debut || '',
          endDate: data.date_fin || '',
          salary: data.salaire,
          status: data.statut || '',
          category: data.categorie || '',
          skills: data.competences || [],
          requirements: data.prerequis || [],
          benefits: data.avantages || [],
          supervisor: data.superviseur || '',
          supervisorEmail: data.email_superviseur || '',
          supervisorPhone: data.tel_superviseur || '',
          maxCandidates: data.nb_max_candidats || 0,
          currentCandidates: data.nb_candidats_actuels || 0,
          applications: data.candidatures || [],
          createdAt: data.cree_le || '',
          updatedAt: data.maj_le || '',
          views: data.vues,
          favorites: data.favoris,
          isFeatured: data.en_avant,
          isUrgent: data.urgent,
          tags: data.tags || [],
          isPaid: data.payant,
        };
      });
      setStages(stagesData);
      setFilteredStages(stagesData);
      setLoading(false);
    };
    const fetchEntreprises = async () => {
      // Récupérer toutes les entreprises, sans filtre universiteId
      const snapshot = await getDocs(collection(db, 'entreprises'));
      const entreprises = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        name: docSnap.data().name || docSnap.data().nom || '',
        sector: docSnap.data().sector || docSnap.data().secteur || '',
        location: docSnap.data().location || docSnap.data().adresse || docSnap.data().address || '',
        ville: docSnap.data().ville || docSnap.data().city || '',
        adresse: docSnap.data().adresse || docSnap.data().address || '',
      }));
      setEntreprises(entreprises);
      // Extraire les secteurs uniques pour le filtre catégorie
      const secteursUniques = Array.from(new Set(entreprises.map(e => e.sector).filter(Boolean)));
      setCategories(secteursUniques);
    };
    fetchStages();
    fetchEntreprises();
  }, [user]);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = stages;
    if (newFilters.status) {
      filtered = filtered.filter(stage => stage.status === newFilters.status);
    }
    if (newFilters.category) {
      filtered = filtered.filter(stage => stage.category === newFilters.category);
    }
    if (newFilters.enterprise) {
      filtered = filtered.filter(stage => stage.enterpriseName === newFilters.enterprise);
    }
    if (newFilters.location) {
      filtered = filtered.filter(stage => stage.location === newFilters.location);
    }
    setFilteredStages(filtered);
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce stage ?')) return;
    await deleteDoc(doc(db, 'stages', stageId));
    setStages(prev => prev.filter(s => s.id !== stageId));
    setFilteredStages(prev => prev.filter(s => s.id !== stageId));
  };

  const handleDuplicateStage = async (stage: Stage) => {
    const { id, ...stageData } = stage;
    const newStage = {
      ...stageData,
      title: stage.title + ' (copie)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    };
    const docRef = await addDoc(collection(db, 'stages'), newStage);
    setStages(prev => [...prev, { ...newStage, id: docRef.id }]);
    setFilteredStages(prev => [...prev, { ...newStage, id: docRef.id }]);
  };

  const handleEditStage = (stage: Stage) => {
    setEditStage(stage);
    setShowEditModal(true);
  };

  const handleSaveEditStage = async (updatedStage: Stage) => {
    await updateDoc(doc(db, 'stages', updatedStage.id), updatedStage);
    setStages(prev => prev.map(s => s.id === updatedStage.id ? updatedStage : s));
    setFilteredStages(prev => prev.map(s => s.id === updatedStage.id ? updatedStage : s));
    setShowEditModal(false);
    setEditStage(null);
  };

  const handleCreateStage = async () => {
    if (!user) return;
    setCreating(true);
    if (!newStage.title || !newStage.description || !newStage.enterpriseId || !newStage.category || !newStage.location || !newStage.startDate || !newStage.endDate) {
      setCreating(false);
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const entreprise = entreprises.find(e => e.id === newStage.enterpriseId);
    const now = new Date().toISOString();
    const stageData = {
      titre: newStage.title,
      description: newStage.description,
      entreprise: {
        id: newStage.enterpriseId,
        nom: entreprise?.name || '',
        logo: entreprise?.logo || '',
      },
      localisation: newStage.location,
      duree: Number(newStage.duration),
      date_debut: newStage.startDate,
      date_fin: newStage.endDate,
      salaire: Number(newStage.salary),
      statut: 'brouillon',
      categorie: newStage.category,
      competences: newStage.skills ? newStage.skills.split(',').map(s => s.trim()) : [],
      prerequis: newStage.requirements ? newStage.requirements.split('\n').map(r => r.trim()) : [],
      avantages: newStage.benefits ? newStage.benefits.split('\n').map(b => b.trim()) : [],
      superviseur: '',
      email_superviseur: '',
      tel_superviseur: '',
      nb_max_candidats: Number(newStage.maxCandidates),
      nb_candidats_actuels: 0,
      cree_le: now,
      maj_le: now,
      en_avant: newStage.isFeatured,
      urgent: newStage.isUrgent,
      universiteId: user.universiteId,
      payant: Number(newStage.salary) > 0,
    };
    try {
      const docRef = await addDoc(collection(db, 'stages'), stageData);
      const addedStage = { ...stageData, id: docRef.id };
      setStages(prev => [...prev, addedStage]);
      setFilteredStages(prev => [...prev, addedStage]);
      setShowStageModal(false);
      setNewStage({
        title: '', description: '', enterpriseId: '', category: '', location: '', duration: 1, startDate: '', endDate: '', salary: 0, maxCandidates: 1, skills: '', requirements: '', benefits: '', isFeatured: false, isUrgent: false
      });
    } catch (e) {
      alert('Erreur lors de la création du stage.');
    }
    setCreating(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { class: 'bg-secondary', text: 'Brouillon', icon: 'fas fa-edit' },
      published: { class: 'bg-success', text: 'Publié', icon: 'fas fa-check' },
      closed: { class: 'bg-warning', text: 'Fermé', icon: 'fas fa-lock' },
      archived: { class: 'bg-dark', text: 'Archivé', icon: 'fas fa-archive' },
      desactive: { class: 'bg-danger', text: 'Désactivé', icon: 'fas fa-times' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-secondary', text: 'En attente' },
      reviewed: { class: 'bg-info', text: 'Examinée' },
      shortlisted: { class: 'bg-warning', text: 'Sélectionnée' },
      interviewed: { class: 'bg-primary', text: 'Entretien' },
      accepted: { class: 'bg-success', text: 'Acceptée' },
      rejected: { class: 'bg-danger', text: 'Refusée' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusCount = (status: string) => {
    return stages.filter(stage => stage.status === status).length;
  };

  const getTotalApplications = () => {
    return stages.reduce((total, stage) => total + (stage.applications?.length || 0), 0);
  };

  const getTotalViews = () => {
    return stages.reduce((total, stage) => total + (stage.views || 0), 0);
  };

  return (
      <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-briefcase me-2 text-primary"></i>
                  Gestion des Stages
                </h1>
                <p className="text-muted mb-0">
                  Gérez et supervisez tous les stages proposés
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
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
                        <h4 className="mb-0">{stages.length}</h4>
                        <p className="mb-0">Total stages</p>
                      </div>
                      <i className="fas fa-briefcase fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('published')}</h4>
                        <p className="mb-0">Publiés</p>
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
                        <h4 className="mb-0">{getTotalApplications()}</h4>
                        <p className="mb-0">Candidatures</p>
                      </div>
                      <i className="fas fa-users fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getTotalViews()}</h4>
                        <p className="mb-0">Vues totales</p>
                      </div>
                      <i className="fas fa-eye fa-2x opacity-50"></i>
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
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="closed">Fermé</option>
                      <option value="archived">Archivé</option>
                <option value="desactive">Désactivé</option>
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Entreprise</label>
                    <select 
                      className="form-select"
                      value={filters.enterprise}
                      onChange={(e) => handleFilterChange('enterprise', e.target.value)}
                    >
                      <option value="">Toutes les entreprises</option>
                {entreprises.map(e => (
                  <option key={e.id} value={e.name}>{e.name}</option>
                ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Localisation</label>
                    <select 
                      className="form-select"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <option value="">Toutes les localisations</option>
                      <option value="Paris, France">Paris</option>
                      <option value="Lyon, France">Lyon</option>
                      <option value="Marseille, France">Marseille</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setFilters({ status: '', category: '', enterprise: '', location: '' });
                        setFilteredStages(stages);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser les filtres
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des stages */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Stages ({filteredStages.length})
                </h5>
              </div>
              <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Chargement des stages...</p>
            </div>
          ) : filteredStages.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun stage trouvé</h5>
                    <p className="text-muted">Aucun stage ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Localisation</th>
                          <th>Durée</th>
                          <th>Candidatures</th>
                          <th>Vues</th>
                          <th>Statut</th>
                    <th>Payant</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStages.map((stage) => (
                          <tr key={stage.id}>
                            <td>
                              <div>
                                <strong>{stage.title}</strong>
                                {stage.isFeatured && (
                                  <span className="badge bg-warning ms-2">
                                    <i className="fas fa-star me-1"></i>À la une
                                  </span>
                                )}
                                {stage.isUrgent && (
                                  <span className="badge bg-danger ms-2">
                                    <i className="fas fa-exclamation me-1"></i>Urgent
                                  </span>
                                )}
                                <br />
                                <small className="text-muted">{stage.description.substring(0, 100)}...</small><br />
                                <small className="text-muted">
                                  <i className="fas fa-tag me-1"></i>{stage.category}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={stage.enterpriseLogo || '/default-logo.png'} 
                                  alt="Logo"
                                  className="rounded me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'contain' }}
                                />
                                <div>
                                  <strong>{stage.enterpriseName}</strong><br />
                                  <small className="text-muted">{stage.supervisor}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.location}</strong><br />
                                <small className="text-muted">
                                  {stage.startDate} - {stage.endDate}
                                </small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.currentCandidates}/{stage.maxCandidates}</strong><br />
                                <div className="progress" style={{ height: '4px' }}>
                                  <div 
                                    className="progress-bar bg-info"
                                    style={{ width: `${(stage.currentCandidates / stage.maxCandidates) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{stage.views}</strong><br />
                                <small className="text-muted">
                                  <i className="fas fa-heart text-danger me-1"></i>{stage.favorites}
                                </small>
                              </div>
                            </td>
                            <td>{getStatusBadge(stage.status)}</td>
                      <td>
                        {stage.salary && stage.salary > 0 ? (
                          <span className="badge bg-success">Oui</span>
                        ) : (
                          <span className="badge bg-danger">Non</span>
                        )}
                      </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedStage(stage);
                                    setShowApplicationsModal(true);
                                  }}
                                  title="Voir candidatures"
                                >
                                  <i className="fas fa-users"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                            onClick={() => handleEditStage(stage)}
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                            onClick={() => handleDuplicateStage(stage)}
                                  title="Dupliquer"
                                >
                                  <i className="fas fa-copy"></i>
                                </button>
                          {stage.status === 'published' && (
                            <button className="btn btn-sm btn-outline-danger" onClick={async () => {
                              if (window.confirm('Voulez-vous vraiment désactiver ce stage ?')) {
                                await updateDoc(doc(db, 'stages', stage.id), { statut: 'desactive' });
                                setStages(prev => prev.map(s => s.id === stage.id ? { ...s, status: 'desactive' } : s));
                                setFilteredStages(prev => prev.map(s => s.id === stage.id ? { ...s, status: 'desactive' } : s));
                              }
                            }}>
                              <i className="fas fa-ban me-1"></i>Désactiver
                            </button>
                          )}
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteStage(stage.id)}
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

      {/* Modal Candidatures */}
      {showApplicationsModal && selectedStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-users me-2"></i>
                  Candidatures - {selectedStage.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowApplicationsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6>Informations du stage</h6>
                    <p><strong>Entreprise:</strong> {selectedStage.enterpriseName}</p>
                    <p><strong>Localisation:</strong> {selectedStage.location}</p>
                    <p><strong>Durée:</strong> {selectedStage.duration} mois</p>
                    <p><strong>Superviseur:</strong> {selectedStage.supervisor}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Statistiques</h6>
                    <p><strong>Candidatures:</strong> {selectedStage.currentCandidates}/{selectedStage.maxCandidates}</p>
                    <p><strong>Vues:</strong> {selectedStage.views}</p>
                    <p><strong>Favoris:</strong> {selectedStage.favorites}</p>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedStage.status)}</p>
                  </div>
                </div>

                {selectedStage.applications?.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-users fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucune candidature</h5>
                    <p className="text-muted">Aucun étudiant n'a encore postulé pour ce stage.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Programme</th>
                          <th>Date de candidature</th>
                          <th>Compétences</th>
                          <th>Statut</th>
                          <th>Évaluation</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStage.applications?.map((application) => (
                          <tr key={application.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={application.studentPhoto || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{application.studentName}</strong><br />
                                  <small className="text-muted">{application.email}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{application.program}</strong><br />
                                <small className="text-muted">Année {application.year}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{application.appliedDate}</strong><br />
                                <small className="text-muted">{application.availability}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                {application.skills.slice(0, 3).map((skill, index) => (
                                  <span key={index} className="badge bg-light text-dark me-1">{skill}</span>
                                ))}
                                {application.skills.length > 3 && (
                                  <span className="badge bg-secondary">+{application.skills.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td>{getApplicationStatusBadge(application.status)}</td>
                            <td>
                              {application.evaluation ? (
                                <div className="d-flex align-items-center">
                                  <span className="me-2">{application.evaluation}/5</span>
                                  <div className="d-flex">
                                    {[...Array(5)].map((_, i) => (
                                      <i 
                                        key={i} 
                                        className={`fas fa-star ${i < Math.floor(application.evaluation!) ? 'text-warning' : 'text-muted'}`}
                                      ></i>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted">Non évalué</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button className="btn btn-sm btn-outline-primary" title="Voir profil">
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-success" title="Accepter">
                                  <i className="fas fa-check"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-warning" title="Entretien">
                                  <i className="fas fa-calendar"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" title="Refuser">
                                  <i className="fas fa-times"></i>
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
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApplicationsModal(false)}
                >
                  Fermer
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-download me-2"></i>Exporter les candidatures
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouveau Stage */}
      {showStageModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Créer un stage
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowStageModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={e => { e.preventDefault(); handleCreateStage(); }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Titre du stage *</label>
                      <input type="text" className="form-control" required value={newStage.title} onChange={e => setNewStage(s => ({ ...s, title: e.target.value }))} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea className="form-control" rows={4} required value={newStage.description} onChange={e => setNewStage(s => ({ ...s, description: e.target.value }))}></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Entreprise *</label>
                      <select className="form-select" required value={newStage.enterpriseId} onChange={e => {
                        const id = e.target.value;
                        const entreprise = entreprises.find(ent => ent.id === id);
                        let localisation = '';
                        if (entreprise) {
                          if (entreprise.ville && entreprise.adresse) {
                            localisation = entreprise.ville + ', ' + entreprise.adresse;
                          } else if (entreprise.ville) {
                            localisation = entreprise.ville;
                          } else if (entreprise.adresse) {
                            localisation = entreprise.adresse;
                          } else {
                            localisation = entreprise.location || '';
                          }
                        }
                        setNewStage(s => ({
                          ...s,
                          enterpriseId: id,
                          category: entreprise?.sector || '',
                          location: localisation
                        }));
                      }}>
                        <option value="">Sélectionner une entreprise</option>
                        {entreprises.map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Catégorie *</label>
                      <select className="form-select" required value={newStage.category} onChange={e => setNewStage(s => ({ ...s, category: e.target.value }))}>
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Localisation *</label>
                      <input type="text" className="form-control" required value={newStage.location} onChange={e => setNewStage(s => ({ ...s, location: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Durée (mois) *</label>
                      <input type="number" className="form-control" min="1" max="12" required value={newStage.duration} onChange={e => setNewStage(s => ({ ...s, duration: Number(e.target.value) }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de début *</label>
                      <input type="date" className="form-control" required value={newStage.startDate} onChange={e => setNewStage(s => ({ ...s, startDate: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de fin *</label>
                      <input type="date" className="form-control" required value={newStage.endDate} onChange={e => setNewStage(s => ({ ...s, endDate: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Salaire (€/mois)</label>
                      <input type="number" className="form-control" min="0" value={newStage.salary} onChange={e => setNewStage(s => ({ ...s, salary: Number(e.target.value) }))} />
                      <div className="form-text">Laisser à 0 si stage non rémunéré</div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre max de candidats *</label>
                      <input type="number" className="form-control" min="1" required value={newStage.maxCandidates} onChange={e => setNewStage(s => ({ ...s, maxCandidates: Number(e.target.value) }))} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Compétences requises</label>
                      <input type="text" className="form-control" placeholder="Séparées par des virgules" value={newStage.skills} onChange={e => setNewStage(s => ({ ...s, skills: e.target.value }))} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Prérequis</label>
                      <textarea className="form-control" rows={3} placeholder="Un prérequis par ligne" value={newStage.requirements} onChange={e => setNewStage(s => ({ ...s, requirements: e.target.value }))}></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Avantages</label>
                      <textarea className="form-control" rows={3} placeholder="Un avantage par ligne" value={newStage.benefits} onChange={e => setNewStage(s => ({ ...s, benefits: e.target.value }))}></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="featured" checked={newStage.isFeatured} onChange={e => setNewStage(s => ({ ...s, isFeatured: e.target.checked }))} />
                        <label className="form-check-label" htmlFor="featured">
                          Mettre en avant
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="urgent" checked={newStage.isUrgent} onChange={e => setNewStage(s => ({ ...s, isUrgent: e.target.checked }))} />
                        <label className="form-check-label" htmlFor="urgent">
                          Stage urgent
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer mt-4">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowStageModal(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary" disabled={creating}>
                      <i className="fas fa-save me-2"></i>{creating ? 'Création...' : 'Créer le stage'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editStage && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>Modifier le stage
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Formulaire d'édition du stage (à adapter selon les champs) */}
                <form onSubmit={e => { e.preventDefault(); handleSaveEditStage(editStage); }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Titre du stage *</label>
                      <input type="text" className="form-control" value={editStage.title} onChange={e => setEditStage({ ...editStage, title: e.target.value })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description *</label>
                      <textarea className="form-control" rows={4} value={editStage.description} onChange={e => setEditStage({ ...editStage, description: e.target.value })} required></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Entreprise *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une entreprise</option>
                        {entreprises.map(e => (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Catégorie *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Localisation *</label>
                      <input type="text" className="form-control" value={editStage.location} onChange={e => setEditStage({ ...editStage, location: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Durée (mois) *</label>
                      <input type="number" className="form-control" min="1" max="12" value={editStage.duration} onChange={e => setEditStage({ ...editStage, duration: parseInt(e.target.value, 10) })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de début *</label>
                      <input type="date" className="form-control" value={editStage.startDate} onChange={e => setEditStage({ ...editStage, startDate: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de fin *</label>
                      <input type="date" className="form-control" value={editStage.endDate} onChange={e => setEditStage({ ...editStage, endDate: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Salaire (€/mois)</label>
                      <input type="number" className="form-control" min="0" value={editStage.salary} onChange={e => setEditStage({ ...editStage, salary: parseFloat(e.target.value) })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre max de candidats *</label>
                      <input type="number" className="form-control" min="1" value={editStage.maxCandidates} onChange={e => setEditStage({ ...editStage, maxCandidates: parseInt(e.target.value, 10) })} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Compétences requises</label>
                      <input type="text" className="form-control" value={editStage.skills.join(', ')} onChange={e => setEditStage({ ...editStage, skills: e.target.value.split(',').map(s => s.trim()) })} placeholder="Séparées par des virgules" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Prérequis</label>
                      <textarea className="form-control" rows="3" value={editStage.requirements.join('\n')} onChange={e => setEditStage({ ...editStage, requirements: e.target.value.split('\n').map(r => r.trim()) })} placeholder="Un prérequis par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Avantages</label>
                      <textarea className="form-control" rows="3" value={editStage.benefits.join('\n')} onChange={e => setEditStage({ ...editStage, benefits: e.target.value.split('\n').map(b => b.trim()) })} placeholder="Un avantage par ligne"></textarea>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="featured" checked={editStage.isFeatured} onChange={e => setEditStage({ ...editStage, isFeatured: e.target.checked })} />
                        <label className="form-check-label" htmlFor="featured">
                          Mettre en avant
                        </label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="urgent" checked={editStage.isUrgent} onChange={e => setEditStage({ ...editStage, isUrgent: e.target.checked })} />
                        <label className="form-check-label" htmlFor="urgent">
                          Stage urgent
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary"><i className="fas fa-save me-2"></i>Sauvegarder</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionStages; 