import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { 
  FaBuilding, 
  FaSave, 
  FaUndo, 
  FaEdit, 
  FaEye, 
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaUsers,
  FaIndustry,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaLock,
  FaKey,
  FaTrash,
  FaUpload,
  FaDownload,
  FaShieldAlt,
  FaStar
} from 'react-icons/fa';
import { db, auth } from '../../config/firebase';
import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';

interface EnterpriseProfile {
  id: number;
  name: string;
  siret: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  sector: string;
  size: string;
  description: string;
  logo?: string;
  foundedYear: number;
  employees: number;
  contactPerson: {
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  documents: {
    id: number;
    name: string;
    type: string;
    uploadDate: string;
    status: string;
  }[];
  statistics: {
    totalInterns: number;
    activeInterns: number;
    completedInterns: number;
    averageRating: number;
    totalOffers: number;
    activeOffers: number;
  };
}

const MonProfil: React.FC = () => {
  const [profile, setProfile] = useState<EnterpriseProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Données simulées
  useEffect(() => {
    const mockProfile: EnterpriseProfile = {
      id: 1,
      name: 'TechCorp Solutions',
      siret: '12345678901234',
      address: '123 Rue de l\'Innovation',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '+33 1 23 45 67 89',
      email: 'contact@techcorp-solutions.fr',
      website: 'https://www.techcorp-solutions.fr',
      sector: 'Technologies de l\'information',
      size: '50-100 employés',
      description: 'TechCorp Solutions est une entreprise innovante spécialisée dans le développement de solutions logicielles modernes. Nous créons des applications web et mobiles de haute qualité pour nos clients.',
      logo: '/api/logos/techcorp-logo.png',
      foundedYear: 2018,
      employees: 75,
      contactPerson: {
        firstName: 'Jean',
        lastName: 'Martin',
        position: 'Directeur des Ressources Humaines',
        email: 'jean.martin@techcorp-solutions.fr',
        phone: '+33 1 23 45 67 90'
      },
      socialMedia: {
        linkedin: 'https://linkedin.com/company/techcorp-solutions',
        twitter: 'https://twitter.com/techcorp_sol',
        facebook: 'https://facebook.com/techcorpsolutions'
      },
      documents: [
        {
          id: 1,
          name: 'Kbis_TechCorp_Solutions.pdf',
          type: 'Kbis',
          uploadDate: '15/01/2024',
          status: 'Approuvé'
        },
        {
          id: 2,
          name: 'Attestation_assurance_TechCorp.pdf',
          type: 'Attestation d\'assurance',
          uploadDate: '20/01/2024',
          status: 'Approuvé'
        },
        {
          id: 3,
          name: 'Convention_stage_template.pdf',
          type: 'Convention type',
          uploadDate: '25/01/2024',
          status: 'En attente'
        }
      ],
      statistics: {
        totalInterns: 12,
        activeInterns: 3,
        completedInterns: 9,
        averageRating: 4.6,
        totalOffers: 8,
        activeOffers: 2
      }
    };
    setProfile(mockProfile);
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      // Récupérer le document utilisateur correspondant à l'uid connecté
      const userAuth = auth.currentUser;
      if (!userAuth) return;
      const q = query(collection(db, 'utilisateurs'), where('uid', '==', userAuth.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userDoc = snap.docs[0];
        await updateDoc(doc(db, 'utilisateurs', userDoc.id), {
          ...profile,
          updatedAt: new Date(),
        });
        setMessage({ type: 'success', text: 'Profil sauvegardé avec succès !' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde du profil.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    const statusConfig = {
      'Approuvé': { class: 'bg-success', text: 'Approuvé' },
      'En attente': { class: 'bg-warning', text: 'En attente' },
      'Rejeté': { class: 'bg-danger', text: 'Rejeté' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const user = {
    role: 'enterprise',
    firstName: 'TechCorp',
    lastName: 'Admin'
  };

  if (!profile) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container-fluid">
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
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-building me-2 text-primary"></i>
                  Mon Profil Entreprise
                </h1>
                <p className="text-muted mb-0">
                  Gérez les informations de votre entreprise
                </p>
              </div>
              <div className="d-flex gap-2">
                {!isEditing ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit me-2"></i>Modifier
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      <i className="fas fa-times me-2"></i>Annuler
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={handleSave}
                    >
                      <i className="fas fa-save me-2"></i>Sauvegarder
                    </button>
                  </>
                )}
                <button 
                  className="btn btn-outline-warning"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <i className="fas fa-key me-2"></i>Changer mot de passe
                </button>
              </div>
            </div>

            {/* Message de notification */}
            {message && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
              </div>
            )}

            {/* Tabs */}
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <FaBuilding className="me-2" />
                      Aperçu
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      <FaBuilding className="me-2" />
                      Détails entreprise
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                      onClick={() => setActiveTab('contact')}
                    >
                      <FaUsers className="me-2" />
                      Contact principal
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                      onClick={() => setActiveTab('documents')}
                    >
                      <FaFileAlt className="me-2" />
                      Documents
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'statistics' ? 'active' : ''}`}
                      onClick={() => setActiveTab('statistics')}
                    >
                      <FaChartBar className="me-2" />
                      Statistiques
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {/* Contenu des onglets */}
                <div className="tab-content">
                  {/* Onglet Aperçu */}
                  {activeTab === 'overview' && (
                    <div className="row">
                      <div className="col-md-4">
                        <div className="card text-center">
                          <div className="card-body">
                            <img 
                              src={profile.logo || '/default-logo.png'} 
                              alt="Logo"
                              className="rounded mb-3"
                              style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                            />
                            <h4>{profile.name}</h4>
                            <p className="text-muted">{profile.sector}</p>
                            <p className="text-muted">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {profile.city}, {profile.country}
                            </p>
                            <div className="d-flex justify-content-center gap-2">
                              {profile.socialMedia.linkedin && (
                                <a href={profile.socialMedia.linkedin} className="btn btn-outline-primary btn-sm" target="_blank">
                                  <i className="fab fa-linkedin"></i>
                                </a>
                              )}
                              {profile.socialMedia.twitter && (
                                <a href={profile.socialMedia.twitter} className="btn btn-outline-info btn-sm" target="_blank">
                                  <i className="fab fa-twitter"></i>
                                </a>
                              )}
                              {profile.socialMedia.facebook && (
                                <a href={profile.socialMedia.facebook} className="btn btn-outline-primary btn-sm" target="_blank">
                                  <i className="fab fa-facebook"></i>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="row g-4">
                          <div className="col-md-6">
                            <div className="card bg-primary text-white">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <h4 className="mb-0">{profile.statistics.totalInterns}</h4>
                                    <p className="mb-0">Total stagiaires</p>
                                  </div>
                                  <i className="fas fa-user-graduate fa-2x opacity-50"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card bg-success text-white">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <h4 className="mb-0">{profile.statistics.activeInterns}</h4>
                                    <p className="mb-0">Stagiaires actifs</p>
                                  </div>
                                  <i className="fas fa-play-circle fa-2x opacity-50"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card bg-info text-white">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <h4 className="mb-0">{profile.statistics.averageRating.toFixed(1)}</h4>
                                    <p className="mb-0">Note moyenne</p>
                                  </div>
                                  <i className="fas fa-star fa-2x opacity-50"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="card bg-warning text-white">
                              <div className="card-body">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <h4 className="mb-0">{profile.statistics.activeOffers}</h4>
                                    <p className="mb-0">Offres actives</p>
                                  </div>
                                  <i className="fas fa-briefcase fa-2x opacity-50"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card mt-4">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="fas fa-info-circle me-2"></i>À propos
                            </h5>
                            <p className="card-text">{profile.description}</p>
                            <div className="row">
                              <div className="col-md-6">
                                <p><strong>Fondée en:</strong> {profile.foundedYear}</p>
                                <p><strong>Effectifs:</strong> {profile.employees} employés</p>
                              </div>
                              <div className="col-md-6">
                                <p><strong>Taille:</strong> {profile.size}</p>
                                <p><strong>Site web:</strong> <a href={profile.website} target="_blank">{profile.website}</a></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Détails entreprise */}
                  {activeTab === 'details' && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-4">
                          <i className="fas fa-building me-2"></i>Informations de l'entreprise
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Nom de l'entreprise *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.name}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">SIRET *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.siret}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Adresse *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.address}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Ville *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.city}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Code postal *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.postalCode}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Pays *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.country}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone *</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              value={profile.phone}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              value={profile.email}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Site web</label>
                            <input 
                              type="url" 
                              className="form-control" 
                              value={profile.website}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Secteur d'activité *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.sector}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Taille de l'entreprise</label>
                            <select 
                              className="form-select" 
                              value={profile.size}
                              disabled={!isEditing}
                            >
                              <option value="1-10 employés">1-10 employés</option>
                              <option value="11-50 employés">11-50 employés</option>
                              <option value="50-100 employés">50-100 employés</option>
                              <option value="100-500 employés">100-500 employés</option>
                              <option value="500+ employés">500+ employés</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Année de création</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              value={profile.foundedYear}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Description de l'entreprise</label>
                            <textarea 
                              className="form-control" 
                              rows={4}
                              value={profile.description}
                              disabled={!isEditing}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Contact principal */}
                  {activeTab === 'contact' && (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title mb-4">
                          <i className="fas fa-user me-2"></i>Contact principal
                        </h5>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Prénom *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.contactPerson.firstName}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Nom *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.contactPerson.lastName}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fonction *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.contactPerson.position}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              value={profile.contactPerson.email}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone *</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              value={profile.contactPerson.phone}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Onglet Documents */}
                  {activeTab === 'documents' && (
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h5 className="card-title mb-0">
                            <i className="fas fa-file-alt me-2"></i>Documents de l'entreprise
                          </h5>
                          <button 
                            className="btn btn-primary"
                            onClick={() => setShowDocumentModal(true)}
                          >
                            <i className="fas fa-upload me-2"></i>Ajouter un document
                          </button>
                        </div>
                        {profile.documents.length === 0 ? (
                          <p className="text-muted">Aucun document disponible.</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Document</th>
                                  <th>Type</th>
                                  <th>Date d'upload</th>
                                  <th>Statut</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {profile.documents.map((doc) => (
                                  <tr key={doc.id}>
                                    <td>
                                      <i className="fas fa-file-pdf text-danger me-2"></i>
                                      {doc.name}
                                    </td>
                                    <td>
                                      <span className="badge bg-light text-dark">{doc.type}</span>
                                    </td>
                                    <td>{doc.uploadDate}</td>
                                    <td>{getDocumentStatusBadge(doc.status)}</td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-primary">
                                          <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-success">
                                          <i className="fas fa-download"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-danger">
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
                  )}

                  {/* Onglet Statistiques */}
                  {activeTab === 'statistics' && (
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="fas fa-chart-pie me-2"></i>Répartition des stagiaires
                            </h5>
                            <div className="row text-center">
                              <div className="col-6">
                                <div className="border-end">
                                  <h3 className="text-primary">{profile.statistics.activeInterns}</h3>
                                  <p className="text-muted">Actifs</p>
                                </div>
                              </div>
                              <div className="col-6">
                                <h3 className="text-success">{profile.statistics.completedInterns}</h3>
                                <p className="text-muted">Terminés</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="fas fa-star me-2"></i>Évaluation moyenne
                            </h5>
                            <div className="text-center">
                              <h2 className="text-warning">{profile.statistics.averageRating.toFixed(1)}/5</h2>
                              <div className="d-flex justify-content-center">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(profile.statistics.averageRating) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                              <p className="text-muted mt-2">Basé sur {profile.statistics.totalInterns} évaluations</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="fas fa-chart-line me-2"></i>Évolution des offres
                            </h5>
                            <div className="row text-center">
                              <div className="col-md-4">
                                <h4 className="text-primary">{profile.statistics.totalOffers}</h4>
                                <p className="text-muted">Total des offres</p>
                              </div>
                              <div className="col-md-4">
                                <h4 className="text-success">{profile.statistics.activeOffers}</h4>
                                <p className="text-muted">Offres actives</p>
                              </div>
                              <div className="col-md-4">
                                <h4 className="text-info">{profile.statistics.totalOffers - profile.statistics.activeOffers}</h4>
                                <p className="text-muted">Offres fermées</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Ajouter Document */}
      {showDocumentModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-upload me-2"></i>Ajouter un document
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDocumentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Type de document *</label>
                    <select className="form-select" required>
                      <option value="">Sélectionner un type</option>
                      <option value="Kbis">Kbis</option>
                      <option value="Attestation d'assurance">Attestation d'assurance</option>
                      <option value="Convention type">Convention type</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fichier *</label>
                    <input type="file" className="form-control" accept=".pdf,.doc,.docx" required />
                    <div className="form-text">Formats acceptés: PDF, DOC, DOCX (max 5MB)</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" placeholder="Description optionnelle du document..."></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDocumentModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-upload me-2"></i>Uploader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Changer mot de passe */}
      {showPasswordModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-key me-2"></i>Changer le mot de passe
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Mot de passe actuel *</label>
                    <input type={showPassword ? "text" : "password"} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nouveau mot de passe *</label>
                    <input type="password" className="form-control" required />
                    <div className="form-text">Minimum 8 caractères, incluant majuscules, minuscules et chiffres</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmer le nouveau mot de passe *</label>
                    <input type="password" className="form-control" required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="fas fa-save me-2"></i>Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonProfil; 