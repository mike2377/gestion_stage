import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

interface Entreprise {
  id: number;
  nom: string;
  secteur: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  siteWeb: string;
  nombreEmployes: string;
  statut: 'active' | 'inactive' | 'en_attente';
  dateCreation: string;
  nombreStages: number;
  note: number;
}

const GestionEntreprises: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [entreprises, setEntreprises] = useState<any[]>([]);
  const [loadingEntreprises, setLoadingEntreprises] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nouvelleEntreprise, setNouvelleEntreprise] = useState({ nom: '', email: '', secteur: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingEntreprise, setEditingEntreprise] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchEntreprises = async () => {
    setLoadingEntreprises(true);
    try {
      const snap = await getDocs(collection(db, 'entreprises'));
      setEntreprises(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des entreprises');
    } finally {
      setLoadingEntreprises(false);
    }
  };

  useEffect(() => {
    fetchEntreprises();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'entreprises'), nouvelleEntreprise);
      setEntreprises(prev => [...prev, { id: docRef.id, ...nouvelleEntreprise }]);
      setNouvelleEntreprise({ nom: '', email: '', secteur: '' });
      setShowAddModal(false);
    } catch (e) {
      setError('Erreur lors de l\'ajout');
    }
  };

  const handleEdit = (e: any) => {
    setEditingId(e.id);
    setEditingEntreprise({ ...e });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'entreprises', editingId), editingEntreprise);
      setEntreprises(prev => prev.map(e => e.id === editingId ? { ...e, ...editingEntreprise } : e));
      setEditingId(null);
      setEditingEntreprise(null);
    } catch (e) {
      setError('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'entreprises', id));
      setEntreprises(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      setError('Erreur lors de la suppression');
    }
  };

  // Ajout de la fonction getStatutBadge
  const getStatutBadge = (statut: 'active' | 'inactive' | 'en_attente') => {
    switch (statut) {
      case 'active':
        return <span className="badge bg-success">Active</span>;
      case 'inactive':
        return <span className="badge bg-secondary">Inactive</span>;
      case 'en_attente':
        return <span className="badge bg-warning text-dark">En attente</span>;
      default:
        return <span className="badge bg-light text-dark">Inconnu</span>;
    }
  };

  // Ajout de la fonction getNoteStars
  const getNoteStars = (note: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= Math.round(note) ? '#ffc107' : '#e4e5e9' }}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  if (loading) return <div>Chargement...</div>;
  if (role !== 'super_admin') return <div>Accès refusé</div>;
  if (loadingEntreprises) return <div>Chargement des entreprises...</div>;
  if (error) {
    console.error('Erreur GestionEntreprises:', error, 'role:', role, 'loading:', loading);
    return <div className="alert alert-danger mt-4">Erreur : {error} <br/>Rôle : {role} <br/>Loading : {loading ? 'true' : 'false'}</div>;
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaBuilding className="me-2 text-primary" />
            Gestion des Entreprises
          </h1>
          <p className="text-muted">Gérez les entreprises partenaires du système de stages</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" />
          Nouvelle Entreprise
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Entreprises
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{entreprises.length}</div>
                </div>
                <div className="col-auto">
                  <FaBuilding className="fa-2x text-gray-300" />
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
                    Entreprises Actives
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {entreprises.filter(e => e.statut === 'active').length}
                  </div>
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
                    En Attente
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {entreprises.filter(e => e.statut === 'en_attente').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaExclamationTriangle className="fa-2x text-gray-300" />
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
                    Total Stages
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {entreprises.reduce((sum, e) => sum + (typeof e.nombreStages === 'number' && !isNaN(e.nombreStages) ? e.nombreStages : 0), 0)}
                  </div>
                </div>
                <div className="col-auto">
                  <FaUsers className="fa-2x text-gray-300" />
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
                  placeholder="Rechercher une entreprise..."
                  value={nouvelleEntreprise.nom}
                  onChange={(e) => setNouvelleEntreprise({ ...nouvelleEntreprise, nom: e.target.value })}
                />
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={nouvelleEntreprise.secteur}
                onChange={(e) => setNouvelleEntreprise({ ...nouvelleEntreprise, secteur: e.target.value })}
              >
                <option value="">Tous les secteurs</option>
                {['Informatique', 'Finance', 'Agriculture', 'Marketing', 'BTP', 'Santé', 'Éducation'].map(secteur => (
                  <option key={secteur} value={secteur}>{secteur}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <select
                className="form-select"
                value={nouvelleEntreprise.statut}
                onChange={(e) => setNouvelleEntreprise({ ...nouvelleEntreprise, statut: e.target.value as 'active' | 'inactive' | 'en_attente' })}
              >
                <option value="">Tous les statuts</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="en_attente">En attente</option>
              </select>
            </div>
            <div className="col-md-2 mb-3">
              <button type="submit" className="btn btn-outline-secondary w-100">
                <FaFilter className="me-1" />
                Filtrer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Entreprises Table */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des Entreprises</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing="0">
              <thead>
                <tr>
                  <th>Entreprise</th>
                  <th>Secteur</th>
                  <th>Localisation</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th>Stages</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entreprises.map(entreprise => (
                  <tr key={entreprise.id}>
                    <td>
                      <div>
                        <strong>{entreprise.nom}</strong>
                        <br />
                        <small className="text-muted">
                          <FaUsers className="me-1" />
                          {entreprise.nombreEmployes} employés
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-info">{entreprise.secteur}</span>
                    </td>
                    <td>
                      <div>
                        <FaMapMarkerAlt className="me-1 text-muted" />
                        {entreprise.ville}
                        <br />
                        <small className="text-muted">{entreprise.adresse}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div><FaPhone className="me-1 text-muted" /> {entreprise.telephone}</div>
                        <div><FaEnvelope className="me-1 text-muted" /> {entreprise.email}</div>
                        <div><FaGlobe className="me-1 text-muted" /> {entreprise.siteWeb}</div>
                      </div>
                    </td>
                    <td>{getStatutBadge(entreprise.statut)}</td>
                    <td>
                      <span className="badge bg-primary">{entreprise.nombreStages} stages</span>
                    </td>
                    <td>
                      <div className="text-warning">
                        {getNoteStars(entreprise.note)}
                        <span className="text-muted ms-1">({entreprise.note})</span>
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(entreprise)}
                          title="Modifier"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(entreprise.id)}
                          title="Supprimer"
                        >
                          <FaTrash />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-info"
                          title="Voir détails"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier l'entreprise</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => { setEditingId(null); setEditingEntreprise(null); }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nom de l'entreprise</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingEntreprise?.nom}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, nom: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Secteur d'activité</label>
                      <select
                        className="form-select"
                        value={editingEntreprise?.secteur}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, secteur: e.target.value })}
                      >
                        <option value="">Tous les secteurs</option>
                        {['Informatique', 'Finance', 'Agriculture', 'Marketing', 'BTP', 'Santé', 'Éducation'].map(secteur => (
                          <option key={secteur} value={secteur}>{secteur}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Adresse</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingEntreprise?.adresse}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, adresse: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ville</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingEntreprise?.ville}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, ville: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingEntreprise?.telephone}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, telephone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={editingEntreprise?.email}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Site web</label>
                      <input
                        type="url"
                        className="form-control"
                        value={editingEntreprise?.siteWeb}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, siteWeb: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre d'employés</label>
                      <select
                        className="form-select"
                        value={editingEntreprise?.nombreEmployes}
                        onChange={(e) => setEditingEntreprise({ ...editingEntreprise, nombreEmployes: e.target.value })}
                      >
                        <option value="1-10">1-10</option>
                        <option value="10-50">10-50</option>
                        <option value="50-100">50-100</option>
                        <option value="100-250">100-250</option>
                        <option value="250-500">250-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Statut</label>
                    <select
                      className="form-select"
                      value={editingEntreprise?.statut}
                      onChange={(e) => setEditingEntreprise({ ...editingEntreprise, statut: e.target.value as 'active' | 'inactive' | 'en_attente' })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="en_attente">En attente</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setEditingId(null); setEditingEntreprise(null); }}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nouvelle Entreprise</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => { handleAdd(e); setShowAddModal(false); }}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nom de l'entreprise</label>
                      <input type="text" className="form-control" value={nouvelleEntreprise.nom} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, nom: e.target.value })} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Secteur d'activité</label>
                      <select className="form-select" value={nouvelleEntreprise.secteur} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, secteur: e.target.value })} required>
                        <option value="">Choisir...</option>
                        {['Informatique', 'Finance', 'Agriculture', 'Marketing', 'BTP', 'Santé', 'Éducation'].map(secteur => (
                          <option key={secteur} value={secteur}>{secteur}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Adresse</label>
                      <input type="text" className="form-control" value={nouvelleEntreprise.adresse || ''} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, adresse: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ville</label>
                      <input type="text" className="form-control" value={nouvelleEntreprise.ville || ''} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, ville: e.target.value })} />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Téléphone</label>
                      <input type="text" className="form-control" value={nouvelleEntreprise.telephone || ''} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, telephone: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={nouvelleEntreprise.email} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, email: e.target.value })} required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Site web</label>
                      <input type="url" className="form-control" value={nouvelleEntreprise.siteWeb || ''} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, siteWeb: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre d'employés</label>
                      <select className="form-select" value={nouvelleEntreprise.nombreEmployes || ''} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, nombreEmployes: e.target.value })}>
                        <option value="">Choisir...</option>
                        <option value="1-10">1-10</option>
                        <option value="10-50">10-50</option>
                        <option value="50-100">50-100</option>
                        <option value="100-250">100-250</option>
                        <option value="250-500">250-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Statut</label>
                    <select className="form-select" value={nouvelleEntreprise.statut || ''} onChange={e => setNouvelleEntreprise({ ...nouvelleEntreprise, statut: e.target.value as 'active' | 'inactive' | 'en_attente' })} required>
                      <option value="">Choisir...</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="en_attente">En attente</option>
                    </select>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Backdrop */}
      {editingId && (
        <div className="modal-backdrop fade show"></div>
      )}
      {showAddModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default GestionEntreprises; 