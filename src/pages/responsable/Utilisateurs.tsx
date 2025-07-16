import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'responsible' | 'enterprise' | 'tutor' | 'admin';
  status: 'active' | 'inactive' | 'pending';
  program?: string;
  year?: number;
  enterpriseName?: string;
  lastLogin: string;
  createdAt: string;
  phone?: string;
  photo?: string;
  universiteId?: string;
}

const Utilisateurs: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    program: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const ROLE_LABELS: Record<string, string> = {
    student: 'Étudiant',
    etudiant: 'Étudiant',
    teacher: 'Enseignant',
    enseignant: 'Enseignant',
    responsible: 'Responsable',
    responsable: 'Responsable',
    enterprise: 'Entreprise',
    entreprise: 'Entreprise',
  };
  const ROLE_BADGE: Record<string, string> = {
    student: 'bg-primary',
    etudiant: 'bg-primary',
    teacher: 'bg-success',
    enseignant: 'bg-success',
    responsible: 'bg-warning',
    responsable: 'bg-warning',
    enterprise: 'bg-info',
    entreprise: 'bg-info',
  };

  useEffect(() => {
    if (!user || !user.universiteId) return;
    const fetchUsers = async () => {
      const q = query(
        collection(db, 'utilisateurs'),
        where('universiteId', '==', user.universiteId),
        where('role', 'in', [
          'student', 'etudiant', 'teacher', 'enseignant',
          'responsible', 'responsable', 'enterprise', 'entreprise'])
      );
      const querySnapshot = await getDocs(q);
      const usersData: User[] = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          firstName: data.firstName || data.prenom || '',
          lastName: data.lastName || data.nom || '',
          email: data.email || '',
          role: data.role,
          status: data.isActive ? 'active' : 'inactive',
          program: data.program,
          year: data.year,
          lastLogin: data.lastLogin || '',
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toLocaleDateString() : data.createdAt) : '',
          phone: data.phone,
          photo: data.avatar,
          universiteId: data.universiteId,
        };
      });
      setUsers(usersData);
      setFilteredUsers(usersData);
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    // Charger les étudiants en attente depuis Firestore pour cette université
    if (!user || !user.universiteId) return;
    const fetchPendingStudents = async () => {
      const q = query(
        collection(db, 'utilisateurs'),
        where('role', 'in', ['student', 'etudiant']),
        where('universiteId', '==', user.universiteId),
        where('statut', '==', 'en_attente')
      );
      const querySnapshot = await getDocs(q);
      setPendingStudents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPendingStudents();
  }, [user]);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = users;
    if (newFilters.role) {
      filtered = filtered.filter(user => user.role === newFilters.role);
    }
    if (newFilters.status) {
      filtered = filtered.filter(user => user.status === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(user => user.program === newFilters.program);
    }
    setFilteredUsers(filtered);
  };

  const getRoleBadge = (role: string) => {
    const badge = ROLE_BADGE[role] || 'bg-secondary';
    const label = ROLE_LABELS[role] || role;
    return <span className={`badge ${badge}`}>{label}</span>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: 'bg-success', text: 'Actif' },
      inactive: { class: 'bg-danger', text: 'Inactif' },
      pending: { class: 'bg-warning', text: 'En attente' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getRoleCount = (role: string) => {
    return users.filter(user => user.role === role).length;
  };

  const handleValidate = async (studentId: string) => {
    await updateDoc(doc(db, 'utilisateurs', studentId), { statut: 'validé' });
    setPendingStudents(pendingStudents.filter(s => s.id !== studentId));
    setToast("Étudiant validé avec succès !");
    setTimeout(() => setToast(null), 3000);
  };
  const handleReject = async (studentId: string) => {
    await updateDoc(doc(db, 'utilisateurs', studentId), { statut: 'rejeté' });
    setPendingStudents(pendingStudents.filter(s => s.id !== studentId));
    setToast("Étudiant rejeté.");
    setTimeout(() => setToast(null), 3000);
  };

  const ALL_ROLES = [
    { value: '', label: 'Tous les rôles' },
    { value: 'student', label: 'Étudiant' },
    { value: 'teacher', label: 'Enseignant' },
    { value: 'responsible', label: 'Responsable' },
    { value: 'enterprise', label: 'Entreprise' },
  ];

  return (
    <div className="dashboard-container">
      {/* Notification toast */}
      {toast && (
        <div className="toast show position-fixed top-0 end-0 m-3" style={{zIndex: 9999, minWidth: 250}}>
          <div className="toast-header bg-primary text-white">
            <strong className="me-auto">Notification</strong>
            <button type="button" className="btn-close" onClick={() => setToast(null)}></button>
          </div>
          <div className="toast-body">{toast}</div>
        </div>
      )}
      {/* Alerte étudiants en attente */}
      {pendingStudents.length > 0 && (
        <div className="alert alert-warning text-center mb-4">
          <i className="fas fa-bell me-2"></i>
          {pendingStudents.length} étudiant(s) en attente de validation
        </div>
      )}
      <div className="row g-0">
        <div className="col">
          <div className="dashboard-content p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-users me-2 text-primary"></i>
                  Gestion des Utilisateurs
                </h1>
                <p className="text-muted mb-0">
                  Gérez tous les utilisateurs de la plateforme
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowUserModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>Nouvel utilisateur
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="row mb-4" style={{ rowGap: 0 }}>
              <div className="col-12 col-md-4">
                <div className="card bg-primary text-white h-100">
                  <div className="card-body text-center">
                    <h4 className="mb-0">{getRoleCount('student') + getRoleCount('etudiant')}</h4>
                    <p className="mb-0">Étudiants</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card bg-success text-white h-100">
                  <div className="card-body text-center">
                    <h4 className="mb-0">{getRoleCount('teacher') + getRoleCount('enseignant')}</h4>
                    <p className="mb-0">Enseignants</p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card bg-info text-white h-100">
                  <div className="card-body text-center">
                    <h4 className="mb-0">{getRoleCount('enterprise') + getRoleCount('entreprise')}</h4>
                    <p className="mb-0">Entreprises</p>
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
                    <label className="form-label">Rôle</label>
                    <select 
                      className="form-select"
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                    >
                      {ALL_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Statut</label>
                    <select 
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                      <option value="pending">En attente</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Programme</label>
                    <select 
                      className="form-select"
                      value={filters.program}
                      onChange={(e) => handleFilterChange('program', e.target.value)}
                    >
                      <option value="">Tous les programmes</option>
                      <option value="Master Informatique">Master Informatique</option>
                      <option value="Master Marketing">Master Marketing</option>
                      <option value="Master Data Science">Master Data Science</option>
                    </select>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ role: '', status: '', program: '' });
                        setFilteredUsers(users);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Utilisateurs ({filteredUsers.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
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
                          <th>Rôle</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={user.photo || '/default-avatar.png'} 
                                  alt="Photo"
                                  className="rounded-circle me-2"
                                  style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                                <div>
                                  <strong>{user.firstName} {user.lastName}</strong><br />
                                  {user.program && (
                                    <small className="text-muted">{user.program} - {user.year}</small>
                                  )}
                                  {user.enterpriseName && (
                                    <small className="text-muted">{user.enterpriseName}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{getRoleBadge(user.role)}</td>
                            <td>{getStatusBadge(user.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowDetailsModal(true);
                                  }}
                                  title="Voir détails"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Réinitialiser mot de passe"
                                >
                                  <i className="fas fa-key"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  title="Désactiver"
                                >
                                  <i className="fas fa-ban"></i>
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

            {/* Étudiants en attente de validation */}
            <div className="card mb-4">
              <div className="card-header bg-warning text-dark">
                <b>Étudiants en attente de validation</b>
              </div>
              <div className="card-body">
                {pendingStudents.length === 0 ? (
                  <div className="text-muted">Aucun étudiant en attente.</div>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Université</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingStudents.map(student => (
                        <tr key={student.id}>
                          <td>{student.firstName} {student.lastName}</td>
                          <td>{student.email}</td>
                          <td>{student.university}</td>
                          <td>
                            <button className="btn btn-success btn-sm me-2" onClick={() => handleValidate(student.id)}>Valider</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(student.id)}>Rejeter</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Détails Utilisateur */}
      {showDetailsModal && selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user me-2"></i>
                  Détails - {selectedUser.firstName} {selectedUser.lastName}
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
                      src={selectedUser.photo || '/default-avatar.png'} 
                      alt="Photo"
                      className="rounded-circle mb-3"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h5>{selectedUser.firstName} {selectedUser.lastName}</h5>
                    <p className="text-muted">{selectedUser.email}</p>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-primary mb-3">Informations générales</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Rôle:</strong> {getRoleBadge(selectedUser.role)}</p>
                        <p><strong>Statut:</strong> {getStatusBadge(selectedUser.status)}</p>
                        <p><strong>Téléphone:</strong> {selectedUser.phone || 'Non renseigné'}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Dernière connexion:</strong> {selectedUser.lastLogin}</p>
                        <p><strong>Date de création:</strong> {selectedUser.createdAt}</p>
                        {selectedUser.program && (
                          <p><strong>Programme:</strong> {selectedUser.program} - {selectedUser.year}</p>
                        )}
                        {selectedUser.enterpriseName && (
                          <p><strong>Entreprise:</strong> {selectedUser.enterpriseName}</p>
                        )}
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

      {/* Modal Nouvel Utilisateur */}
      {showUserModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>Nouvel utilisateur
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowUserModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Prénom *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nom *</label>
                      <input type="text" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone</label>
                      <input type="tel" className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rôle *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un rôle</option>
                        <option value="student">Étudiant</option>
                        <option value="teacher">Enseignant</option>
                        <option value="responsible">Responsable</option>
                        <option value="enterprise">Entreprise</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Statut *</label>
                      <select className="form-select" required>
                        <option value="">Sélectionner un statut</option>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="pending">En attente</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Programme</label>
                      <select className="form-select">
                        <option value="">Sélectionner un programme</option>
                        <option value="Master Informatique">Master Informatique</option>
                        <option value="Master Marketing">Master Marketing</option>
                        <option value="Master Data Science">Master Data Science</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Année</label>
                      <select className="form-select">
                        <option value="">Sélectionner une année</option>
                        <option value="1">1ère année</option>
                        <option value="2">2ème année</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowUserModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Créer l'utilisateur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utilisateurs; 