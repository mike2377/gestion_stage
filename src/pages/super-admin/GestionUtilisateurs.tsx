import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  FaUsers, 
  FaUserPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaDownload,
  FaCog,
  FaKey,
  FaBan,
  FaSave
} from 'react-icons/fa';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone?: string;
  role: 'etudiant' | 'enseignant' | 'responsable' | 'entreprise' | 'tuteur' | 'admin' | 'super_admin';
  est_actif: boolean;
  date_creation: any;
  derniere_connexion?: any;
  url_photo_profil?: string;
}

// Fonction de normalisation pour uniformiser les champs utilisateur en français
function normaliserUtilisateur(user: any) {
  return {
    id: user.id,
    uid: user.uid,
    email: user.email,
    prenom: user.prenom || user.firstName || '',
    nom: user.nom || user.lastName || '',
    telephone: user.telephone || user.phone || '',
    role: user.role,
    est_actif: user.est_actif !== undefined ? user.est_actif : user.isActive,
    date_creation: user.date_creation || user.createdAt || null,
    derniere_connexion: user.derniere_connexion || user.updatedAt || null,
    url_photo_profil: user.url_photo_profil || user.photoURL || '',
    universiteId: user.universiteId ?? null,
    entrepriseId: user.entrepriseId ?? null,
  };
}

const GestionUtilisateurs: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    role: '',
    est_actif: '',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nouvelUtilisateur, setNouvelUtilisateur] = useState({
    email: '',
    prenom: '',
    nom: '',
    telephone: '',
    role: 'etudiant' as const,
    est_actif: true,
    password: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [universites, setUniversites] = useState<any[]>([]);
  const [entreprises, setEntreprises] = useState<any[]>([]);
  const [assocUniversiteId, setAssocUniversiteId] = useState('');
  const [assocEntrepriseId, setAssocEntrepriseId] = useState('');
  const [newUniversite, setNewUniversite] = useState({ nom: '', email: '' });
  const [newEntreprise, setNewEntreprise] = useState({ nom: '', email: '' });

  const fetchUtilisateurs = async () => {
    setLoadingUsers(true);
    try {
      const snap = await getDocs(collection(db, 'utilisateurs'));
      const usersData = snap.docs.map(doc => normaliserUtilisateur({ id: doc.id, ...doc.data() }));
      setUtilisateurs(usersData);
      setFilteredUsers(usersData);
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  useEffect(() => {
    let filtered = utilisateurs;
    if (filters.role) filtered = filtered.filter(user => user.role === filters.role);
    if (filters.est_actif) {
      const isActive = filters.est_actif === 'true';
      filtered = filtered.filter(user => user.est_actif === isActive);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(user => 
        user.prenom?.toLowerCase().includes(searchLower) ||
        user.nom?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredUsers(filtered);
  }, [filters, utilisateurs]);

  useEffect(() => {
    // Charger les universités et entreprises pour l'association
    const fetchData = async () => {
      const univSnap = await getDocs(collection(db, 'universites'));
      setUniversites(univSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const entSnap = await getDocs(collection(db, 'entreprises'));
      setEntreprises(entSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { class: string; text: string; icon: any }> = {
      etudiant: { class: 'bg-primary', text: 'Étudiant', icon: FaUsers },
      enseignant: { class: 'bg-success', text: 'Enseignant', icon: FaUsers },
      responsable: { class: 'bg-warning', text: 'Responsable', icon: FaUsers },
      entreprise: { class: 'bg-info', text: 'Entreprise', icon: FaUsers },
      tuteur: { class: 'bg-secondary', text: 'Tuteur', icon: FaUsers },
      admin: { class: 'bg-dark', text: 'Admin', icon: FaShieldAlt },
      super_admin: { class: 'bg-danger', text: 'Super Admin', icon: FaShieldAlt }
    };
    const config = roleConfig[role] || { class: 'bg-secondary', text: role || 'Inconnu', icon: FaUsers };
    const IconComponent = config.icon;
    return (
      <span className={`badge ${config.class} d-flex align-items-center gap-1`}>
        <IconComponent size={12} />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (est_actif: boolean) => {
    if (est_actif) {
      return (
        <span className="badge bg-success d-flex align-items-center gap-1">
          <FaCheckCircle size={12} />
          Actif
        </span>
      );
    } else {
      return (
        <span className="badge bg-danger d-flex align-items-center gap-1">
          <FaTimesCircle size={12} />
          Inactif
        </span>
      );
    }
  };

  const getRoleCount = (role: string) => {
    return utilisateurs.filter(user => user.role === role).length;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Jamais';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Création dans Auth
      const userCredential = await createUserWithEmailAndPassword(auth, nouvelUtilisateur.email, nouvelUtilisateur.password);
      const user = userCredential.user;
      let universiteId = assocUniversiteId;
      let entrepriseId = assocEntrepriseId;
      // 2. Création université/entreprise si besoin
      if (nouvelUtilisateur.role === 'responsable' && !assocUniversiteId && newUniversite.nom) {
        const univDoc = await addDoc(collection(db, 'universites'), { ...newUniversite, responsableUid: user.uid });
        universiteId = univDoc.id;
      }
      if (nouvelUtilisateur.role === 'entreprise' && !assocEntrepriseId && newEntreprise.nom) {
        const entDoc = await addDoc(collection(db, 'entreprises'), { ...newEntreprise, responsableUid: user.uid });
        entrepriseId = entDoc.id;
      }
      // 3. Création dans Firestore utilisateurs
      const docRef = await addDoc(collection(db, 'utilisateurs'), {
        uid: user.uid,
        email: nouvelUtilisateur.email,
        firstName: nouvelUtilisateur.prenom,
        lastName: nouvelUtilisateur.nom,
        phone: nouvelUtilisateur.telephone,
        role: nouvelUtilisateur.role,
        isActive: nouvelUtilisateur.est_actif,
        createdAt: new Date(),
        updatedAt: new Date(),
        universiteId: universiteId || null,
        entrepriseId: entrepriseId || null,
      });
      const newUser = {
        id: docRef.id,
        email: nouvelUtilisateur.email,
        prenom: nouvelUtilisateur.prenom,
        nom: nouvelUtilisateur.nom,
        telephone: nouvelUtilisateur.telephone,
        role: nouvelUtilisateur.role,
        est_actif: nouvelUtilisateur.est_actif,
        date_creation: new Date(),
        universiteId: universiteId || null,
        entrepriseId: entrepriseId || null,
      };
      setUtilisateurs(prev => [...prev, newUser]);
      setFilteredUsers(prev => [...prev, newUser]);
      setNouvelUtilisateur({
        email: '',
        prenom: '',
        nom: '',
        telephone: '',
        role: 'etudiant',
        est_actif: true,
        password: ''
      });
      setAssocUniversiteId('');
      setAssocEntrepriseId('');
      setNewUniversite({ nom: '', email: '' });
      setNewEntreprise({ nom: '', email: '' });
      setShowUserModal(false);
    } catch (e) {
      setError('Erreur lors de la création du compte (email déjà utilisé ou mot de passe trop faible)');
    }
  };

  const handleEdit = (u: User) => {
    setEditingId(u.id);
    setEditingUser({ ...u });
    setShowUserModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editingUser) return;
    try {
      await updateDoc(doc(db, 'utilisateurs', editingId), editingUser);
      setUtilisateurs(prev => prev.map(u => u.id === editingId ? { ...u, ...editingUser } : u));
      setFilteredUsers(prev => prev.map(u => u.id === editingId ? { ...u, ...editingUser } : u));
      setEditingId(null);
      setEditingUser(null);
      setShowUserModal(false);
    } catch (e) {
      setError('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteDoc(doc(db, 'utilisateurs', id));
        setUtilisateurs(prev => prev.filter(u => u.id !== id));
        setFilteredUsers(prev => prev.filter(u => u.id !== id));
      } catch (e) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleNewUser = () => {
    setNouvelUtilisateur({
      email: '',
      prenom: '',
      nom: '',
      telephone: '',
      role: 'etudiant',
      est_actif: true,
      password: ''
    });
    setEditingId(null);
    setEditingUser(null);
    setShowUserModal(true);
  };

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
  
  if (loadingUsers) return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Chargement des utilisateurs...</span>
    </div>
  </div>;
  
  if (error) return <div className="container mt-4">
    <div className="alert alert-danger">
      <h4>Erreur</h4>
      <p>{error}</p>
    </div>
  </div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaUsers className="me-2 text-primary" />
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted mb-0">
            Administration complète des utilisateurs du système
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary">
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleNewUser}
          >
            <FaUserPlus className="me-2" />
            Nouvel utilisateur
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row g-4 mb-4">
        <div className="col-md-2">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4 className="mb-0">{utilisateurs.length}</h4>
              <p className="mb-0">Total</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4 className="mb-0">{getRoleCount('etudiant')}</h4>
              <p className="mb-0">Étudiants</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4 className="mb-0">{getRoleCount('enseignant')}</h4>
              <p className="mb-0">Enseignants</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4 className="mb-0">{getRoleCount('responsable')}</h4>
              <p className="mb-0">Responsables</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-secondary text-white">
            <div className="card-body text-center">
              <h4 className="mb-0">{getRoleCount('admin') + getRoleCount('super_admin')}</h4>
              <p className="mb-0">Admins</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-dark text-white">
            <div className="card-body text-center">
              <h4 className="mb-0">{utilisateurs.filter(u => u.est_actif).length}</h4>
              <p className="mb-0">Actifs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            <FaFilter className="me-2" />
            Filtres avancés
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Recherche</label>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nom, prénom, email..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <label className="form-label">Rôle</label>
              <select 
                className="form-select"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">Tous les rôles</option>
                <option value="etudiant">Étudiant</option>
                <option value="enseignant">Enseignant</option>
                <option value="responsable">Responsable</option>
                <option value="entreprise">Entreprise</option>
                <option value="tuteur">Tuteur</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Statut</label>
              <select 
                className="form-select"
                value={filters.est_actif}
                onChange={(e) => handleFilterChange('est_actif', e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </select>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-12">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFilters({ role: '', est_actif: '', search: '' });
                }}
              >
                <FaTimesCircle className="me-2" />
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <FaUsers className="me-2" />
            Utilisateurs ({filteredUsers.length})
          </h5>
        </div>
        <div className="card-body">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <FaUsers className="fa-4x text-muted mb-3" />
              <h5 className="text-muted">Aucun utilisateur trouvé</h5>
              <p className="text-muted">Aucun utilisateur ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Dernière connexion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={user.url_photo_profil || '/default-avatar.png'} 
                            alt="Photo"
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.src = '/default-avatar.png';
                            }}
                          />
                          <div>
                            <strong>{user.nom}</strong><br />
                            <small className="text-muted">{user.prenom}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.telephone || '-'}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.est_actif)}</td>
                      <td>{formatDate(user.derniere_connexion)}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewDetails(user)}
                            title="Voir détails"
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleEdit(user)}
                            title="Modifier"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
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

      {/* Modal Nouvel/Éditer Utilisateur */}
      {showUserModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaUserPlus className="me-2" />
                  {editingId ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingId(null);
                    setEditingUser(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form id="userForm">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Prénom *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingId ? editingUser?.prenom || '' : nouvelUtilisateur.prenom}
                        onChange={e => editingId 
                          ? setEditingUser({ ...editingUser!, prenom: e.target.value })
                          : setNouvelUtilisateur({ ...nouvelUtilisateur, prenom: e.target.value })
                        }
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nom *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={editingId ? editingUser?.nom || '' : nouvelUtilisateur.nom}
                        onChange={e => editingId 
                          ? setEditingUser({ ...editingUser!, nom: e.target.value })
                          : setNouvelUtilisateur({ ...nouvelUtilisateur, nom: e.target.value })
                        }
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={editingId ? editingUser?.email || '' : nouvelUtilisateur.email}
                        onChange={e => editingId 
                          ? setEditingUser({ ...editingUser!, email: e.target.value })
                          : setNouvelUtilisateur({ ...nouvelUtilisateur, email: e.target.value })
                        }
                        required 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone</label>
                      <input 
                        type="tel" 
                        className="form-control" 
                        value={editingId ? editingUser?.telephone || '' : nouvelUtilisateur.telephone}
                        onChange={e => editingId 
                          ? setEditingUser({ ...editingUser!, telephone: e.target.value })
                          : setNouvelUtilisateur({ ...nouvelUtilisateur, telephone: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rôle *</label>
                      <select 
                        className="form-select" 
                        value={editingId ? editingUser?.role || '' : nouvelUtilisateur.role}
                        onChange={e => editingId 
                          ? setEditingUser({ ...editingUser!, role: e.target.value as any })
                          : setNouvelUtilisateur({ ...nouvelUtilisateur, role: e.target.value as any })
                        }
                        required
                      >
                        <option value="etudiant">Étudiant</option>
                        <option value="enseignant">Enseignant</option>
                        <option value="responsable">Responsable</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="tuteur">Tuteur</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                    {/* Association université/entreprise */}
                    {!editingId && !['admin', 'super_admin'].includes(nouvelUtilisateur.role) && (
                      <div className="col-12">
                        {['entreprise', 'tuteur'].includes(nouvelUtilisateur.role) ? (
                          <>
                            <label className="form-label">Associer à une entreprise *</label>
                            <select className="form-select" value={assocEntrepriseId} onChange={e => setAssocEntrepriseId(e.target.value)} required>
                              <option value="">Sélectionner une entreprise existante</option>
                              {entreprises.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                            </select>
                          </>
                        ) : (
                          <>
                            <label className="form-label">Associer à une université *</label>
                            <select className="form-select" value={assocUniversiteId} onChange={e => setAssocUniversiteId(e.target.value)} required>
                              <option value="">Sélectionner une université existante</option>
                              {universites.map(u => <option key={u.id} value={u.id}>{u.nom}</option>)}
                            </select>
                          </>
                        )}
                      </div>
                    )}
                    <div className="col-md-6">
                      <label className="form-label">Statut *</label>
                      <select 
                        className="form-select" 
                        value={editingId ? (editingUser?.est_actif ? 'true' : 'false') : (nouvelUtilisateur.est_actif ? 'true' : 'false')}
                        onChange={e => editingId 
                          ? setEditingUser({ ...editingUser!, est_actif: e.target.value === 'true' })
                          : setNouvelUtilisateur({ ...nouvelUtilisateur, est_actif: e.target.value === 'true' })
                        }
                        required
                      >
                        <option value="true">Actif</option>
                        <option value="false">Inactif</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Mot de passe *</label>
                      <input
                        type="password"
                        className="form-control"
                        value={editingId ? '' : nouvelUtilisateur.password}
                        onChange={e => setNouvelUtilisateur({ ...nouvelUtilisateur, password: e.target.value })}
                        required={!editingId}
                        autoComplete="new-password"
                        placeholder="Mot de passe initial"
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowUserModal(false);
                    setEditingId(null);
                    setEditingUser(null);
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  form="userForm"
                  className="btn btn-primary"
                  onClick={editingId ? handleUpdate : handleAdd}
                >
                  <FaSave className="me-2" />
                  {editingId ? 'Modifier' : 'Créer l\'utilisateur'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Utilisateur */}
      {showDetailsModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaEye className="me-2" />
                  Détails - {selectedUser.prenom} {selectedUser.nom}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img 
                      src={selectedUser.url_photo_profil || '/default-avatar.png'} 
                      alt="Photo"
                      className="rounded-circle mb-3"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.src = '/default-avatar.png';
                      }}
                    />
                    <h5>{selectedUser.prenom} {selectedUser.nom}</h5>
                    <p className="text-muted">{selectedUser.email}</p>
                    <div className="mb-2">
                      {getRoleBadge(selectedUser.role)}
                    </div>
                    <div className="mb-2">
                      {getStatusBadge(selectedUser.est_actif)}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">Informations générales</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Téléphone:</strong> {selectedUser.telephone || 'Non renseigné'}</p>
                        <p><strong>Dernière connexion:</strong> {formatDate(selectedUser.derniere_connexion)}</p>
                        <p><strong>Date de création:</strong> {formatDate(selectedUser.date_creation)}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>URL Photo:</strong> {selectedUser.url_photo_profil || 'Non renseigné'}</p>
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
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedUser);
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

      {/* Modal Backdrop */}
      {(showUserModal || showDetailsModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default GestionUtilisateurs; 