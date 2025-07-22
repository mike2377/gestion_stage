import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { FaUserTie, FaEnvelope, FaPhone, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Employe {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  poste: string;
  role: string;
  entrepriseId: string;
}

interface EmployeFormData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  poste: string;
  role: string;
}

const initialFormData: EmployeFormData = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  poste: '',
  role: ''
};

const Employes: React.FC = () => {
  const { user } = useAuth();
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<EmployeFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeToDelete, setEmployeToDelete] = useState<Employe | null>(null);

  const fetchEmployes = async () => {
    if (!user?.entrepriseId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'utilisateurs'),
        where('entrepriseId', '==', user.entrepriseId),
        where('role', 'in', ['tuteur', 'entreprise'])
      );
      const snap = await getDocs(q);
      setEmployes(
        snap.docs.map(doc => ({
          id: doc.id,
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          email: doc.data().email || '',
          telephone: doc.data().telephone || '',
          poste: doc.data().poste || '',
          role: doc.data().role || '',
          entrepriseId: doc.data().entrepriseId || ''
        }))
      );
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
      toast.error('Erreur lors du chargement des employés');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployes();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.entrepriseId) return;

    try {
      const employeData = {
        firstName: formData.prenom,
        lastName: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        poste: formData.poste,
        role: formData.role,
        entrepriseId: user.entrepriseId
      };

      if (editingId) {
        const employeRef = doc(db, 'utilisateurs', editingId);
        await updateDoc(employeRef, employeData);
        toast.success('Employé modifié avec succès');
      } else {
        await addDoc(collection(db, 'utilisateurs'), employeData);
        toast.success('Employé ajouté avec succès');
      }

      setShowModal(false);
      setFormData(initialFormData);
      setEditingId(null);
      fetchEmployes();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (employe: Employe) => {
    setFormData({
      prenom: employe.firstName || (employe as any).prenom || '',
      nom: employe.lastName || (employe as any).nom || '',
      email: employe.email,
      telephone: employe.telephone,
      poste: employe.poste,
      role: employe.role
    });
    setEditingId(employe.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!employeToDelete) return;

    try {
      await deleteDoc(doc(db, 'utilisateurs', employeToDelete.id));
      toast.success('Employé supprimé avec succès');
      setShowDeleteConfirm(false);
      setEmployeToDelete(null);
      fetchEmployes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const confirmDelete = (employe: Employe) => {
    setEmployeToDelete(employe);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="container-fluid">
      {/* En-tête avec stats */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">
              <FaUserTie className="me-2 text-primary" />
              Employés (Tuteurs)
            </h1>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                setFormData(initialFormData);
                setEditingId(null);
                setShowModal(true);
              }}
            >
              <FaUserPlus className="me-2" />
              Ajouter un employé
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-body">
              <h5 className="card-title text-primary">Total des employés</h5>
              <p className="card-text display-6">{employes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des employés */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Nom</th>
                    <th>Contact</th>
                    <th>Poste</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-4">
                        Aucun employé trouvé
                      </td>
                    </tr>
                  ) : (
                    employes.map(emp => (
                      <tr key={emp.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle p-2 me-3">
                              <FaUserTie className="text-primary" />
                            </div>
                            <div className="fw-bold">
                              {(emp.firstName || emp.prenom || '') + ' ' + (emp.lastName || emp.nom || '')}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div><FaEnvelope className="me-2 text-muted" />{emp.email}</div>
                          <div><FaPhone className="me-2 text-muted" />{emp.telephone}</div>
                        </td>
                        <td>{emp.poste || 'Non défini'}</td>
                        <td>
                          <span className={`badge ${emp.role === 'tuteur' ? 'bg-info' : 'bg-primary'}`}>
                            {emp.role === 'tuteur' ? 'Tuteur' : 'Entreprise'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEdit(emp)}
                          >
                            <FaEdit /> Modifier
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDelete(emp)}
                          >
                            <FaTrash /> Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajout/Modification */}
      {showModal && (
        <div className="modal fade show" tabIndex={-1} style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId ? 'Modifier un employé' : 'Ajouter un employé'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEditingId(null);
                  }}
                  aria-label="Fermer"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Prénom</label>
                      <input
                        type="text"
                        className="form-control"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nom</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Téléphone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Poste</label>
                      <input
                        type="text"
                        className="form-control"
                        name="poste"
                        value={formData.poste}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rôle</label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Sélectionner un rôle</option>
                        <option value="tuteur">Tuteur</option>
                        <option value="entreprise">Entreprise</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingId(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteConfirm && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setEmployeToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer l'employé{' '}
                  <strong>
                    {employeToDelete?.firstName} {employeToDelete?.lastName}
                  </strong>
                  ?
                </p>
                <p className="text-danger">
                  <small>Cette action est irréversible.</small>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setEmployeToDelete(null);
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
};

export default Employes; 