import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUniversity, 
  FaPlus, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaUsers,
  FaGraduationCap,
  FaTimes,
  FaSave
} from 'react-icons/fa';

interface Universite {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  site_web: string;
  description: string;
  nombre_etudiants: number;
  nombre_professeurs: number;
  date_creation: any;
  est_actif: boolean;
}

const GestionUniversites: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [universites, setUniversites] = useState<Universite[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUniversite, setEditingUniversite] = useState<Universite | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUniversite, setSelectedUniversite] = useState<Universite | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    site_web: '',
    description: '',
    nombre_etudiants: 0,
    nombre_professeurs: 0,
    est_actif: true
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (role !== 'super_admin') return;
    fetchUniversites();
  }, [role]);

  const fetchUniversites = async () => {
    setLoadingData(true);
    try {
      const universitesQuery = query(collection(db, "universites"), orderBy("nom"));
      const snapshot = await getDocs(universitesQuery);
      const universitesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Universite[];
      setUniversites(universitesData);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des universités');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const universiteData = {
        ...formData,
        date_creation: new Date(),
        nombre_etudiants: Number(formData.nombre_etudiants),
        nombre_professeurs: Number(formData.nombre_professeurs)
      };

      if (editingUniversite) {
        await updateDoc(doc(db, "universites", editingUniversite.id), universiteData);
        setSuccess('Université mise à jour avec succès');
      } else {
        await addDoc(collection(db, "universites"), universiteData);
        setSuccess('Université ajoutée avec succès');
      }

      setShowModal(false);
      setEditingUniversite(null);
      resetForm();
      fetchUniversites();
    } catch (err) {
      setError('Erreur lors de l\'opération');
    }
  };

  const handleEdit = (universite: Universite) => {
    setEditingUniversite(universite);
    setFormData({
      nom: universite.nom,
      adresse: universite.adresse,
      telephone: universite.telephone,
      email: universite.email,
      site_web: universite.site_web,
      description: universite.description,
      nombre_etudiants: universite.nombre_etudiants,
      nombre_professeurs: universite.nombre_professeurs,
      est_actif: universite.est_actif
    });
    setShowModal(true);
  };

  const handleDelete = async (universite: Universite) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'université "${universite.nom}" ?`)) {
      try {
        await deleteDoc(doc(db, "universites", universite.id));
        setSuccess('Université supprimée avec succès');
        fetchUniversites();
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleViewDetails = (universite: Universite) => {
    setSelectedUniversite(universite);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      adresse: '',
      telephone: '',
      email: '',
      site_web: '',
      description: '',
      nombre_etudiants: 0,
      nombre_professeurs: 0,
      est_actif: true
    });
  };

  const filteredUniversites = universites.filter(universite =>
    universite.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    universite.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    universite.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Chargement...</span>
    </div>
  </div>;

  if (role !== 'super_admin') return <div className="container mt-4">
    <div className="alert alert-danger">
      <h4>Accès refusé</h4>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  </div>;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaUniversity className="me-2 text-primary" />
            Gestion des Universités
          </h1>
          <p className="text-muted mb-0">
            Gérez les universités partenaires du système
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditingUniversite(null);
            resetForm();
            setShowModal(true);
          }}
        >
          <FaPlus className="me-2" />
          Nouvelle Université
        </button>
      </div>

      {/* Alertes */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {/* Statistiques */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{universites.length}</h4>
                  <p className="mb-0">Total Universités</p>
                </div>
                <div className="align-self-center">
                  <FaUniversity className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{universites.filter(u => u.est_actif).length}</h4>
                  <p className="mb-0">Universités Actives</p>
                </div>
                <div className="align-self-center">
                  <FaUsers className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">
                    {universites.reduce((sum, u) => sum + u.nombre_etudiants, 0).toLocaleString()}
                  </h4>
                  <p className="mb-0">Total Étudiants</p>
                </div>
                <div className="align-self-center">
                  <FaGraduationCap className="fa-2x" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">
                    {universites.reduce((sum, u) => sum + u.nombre_professeurs, 0).toLocaleString()}
                  </h4>
                  <p className="mb-0">Total Professeurs</p>
                </div>
                <div className="align-self-center">
                  <FaUsers className="fa-2x" />
                </div>
              </div>
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
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher une université..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                {filteredUniversites.length} université(s) trouvée(s)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des universités */}
      <div className="card">
        <div className="card-body">
          {loadingData ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : filteredUniversites.length === 0 ? (
            <div className="text-center py-4">
              <FaUniversity className="fa-3x text-muted mb-3" />
              <h5>Aucune université trouvée</h5>
              <p className="text-muted">
                {searchTerm ? 'Aucune université ne correspond à votre recherche.' : 'Aucune université n\'a été ajoutée pour le moment.'}
              </p>
              {!searchTerm && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setEditingUniversite(null);
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  <FaPlus className="me-2" />
                  Ajouter la première université
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Université</th>
                    <th>Adresse</th>
                    <th>Contact</th>
                    <th>Étudiants</th>
                    <th>Professeurs</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUniversites.map((universite) => (
                    <tr key={universite.id}>
                      <td>
                        <div>
                          <strong>{universite.nom}</strong>
                          {universite.site_web && (
                            <div>
                              <small className="text-muted">
                                <FaGlobe className="me-1" />
                                {universite.site_web}
                              </small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <FaMapMarkerAlt className="me-1 text-muted" />
                          {universite.adresse}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <FaPhone className="me-1 text-muted" />
                            {universite.telephone}
                          </div>
                          <div>
                            <FaEnvelope className="me-1 text-muted" />
                            {universite.email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {universite.nombre_etudiants.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-warning">
                          {universite.nombre_professeurs.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${universite.est_actif ? 'bg-success' : 'bg-secondary'}`}>
                          {universite.est_actif ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewDetails(universite)}
                            title="Voir les détails"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEdit(universite)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(universite)}
                            title="Supprimer"
                          >
                            <FaTrash />
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

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUniversite ? 'Modifier l\'université' : 'Nouvelle université'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingUniversite(null);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nom de l'université *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.nom}
                        onChange={(e) => setFormData({...formData, nom: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Site web</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.site_web}
                        onChange={(e) => setFormData({...formData, site_web: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Adresse *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.adresse}
                        onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telephone}
                        onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre d'étudiants</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.nombre_etudiants}
                        onChange={(e) => setFormData({...formData, nombre_etudiants: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre de professeurs</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.nombre_professeurs}
                        onChange={(e) => setFormData({...formData, nombre_professeurs: parseInt(e.target.value) || 0})}
                        min="0"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="est_actif"
                          checked={formData.est_actif}
                          onChange={(e) => setFormData({...formData, est_actif: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="est_actif">
                          Université active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUniversite(null);
                      resetForm();
                    }}
                  >
                    <FaTimes className="me-2" />
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FaSave className="me-2" />
                    {editingUniversite ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {showDetailsModal && selectedUniversite && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaUniversity className="me-2" />
                  Détails de l'université
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedUniversite(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <h4>{selectedUniversite.nom}</h4>
                    <span className={`badge ${selectedUniversite.est_actif ? 'bg-success' : 'bg-secondary'} mb-3`}>
                      {selectedUniversite.est_actif ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <h6><FaMapMarkerAlt className="me-2 text-muted" />Adresse</h6>
                    <p>{selectedUniversite.adresse}</p>
                  </div>
                  <div className="col-md-6">
                    <h6><FaPhone className="me-2 text-muted" />Téléphone</h6>
                    <p>{selectedUniversite.telephone}</p>
                  </div>
                  <div className="col-md-6">
                    <h6><FaEnvelope className="me-2 text-muted" />Email</h6>
                    <p>{selectedUniversite.email}</p>
                  </div>
                  <div className="col-md-6">
                    <h6><FaGlobe className="me-2 text-muted" />Site web</h6>
                    <p>
                      {selectedUniversite.site_web ? (
                        <a href={selectedUniversite.site_web} target="_blank" rel="noopener noreferrer">
                          {selectedUniversite.site_web}
                        </a>
                      ) : (
                        'Non spécifié'
                      )}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6><FaGraduationCap className="me-2 text-muted" />Nombre d'étudiants</h6>
                    <p>{selectedUniversite.nombre_etudiants.toLocaleString()}</p>
                  </div>
                  <div className="col-md-6">
                    <h6><FaUsers className="me-2 text-muted" />Nombre de professeurs</h6>
                    <p>{selectedUniversite.nombre_professeurs.toLocaleString()}</p>
                  </div>
                  {selectedUniversite.description && (
                    <div className="col-12">
                      <h6>Description</h6>
                      <p>{selectedUniversite.description}</p>
                    </div>
                  )}
                  <div className="col-12">
                    <h6>Date de création</h6>
                    <p>
                      {selectedUniversite.date_creation?.toDate?.() 
                        ? selectedUniversite.date_creation.toDate().toLocaleDateString()
                        : 'Non spécifiée'
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedUniversite(null);
                  }}
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedUniversite(null);
                    handleEdit(selectedUniversite);
                  }}
                >
                  <FaEdit className="me-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUniversites; 