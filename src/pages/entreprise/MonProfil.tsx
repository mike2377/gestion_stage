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

interface ProfilEntreprise {
  id: number;
  nom: string;
  siret: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
  email: string;
  siteWeb: string;
  secteur: string;
  taille: string;
  description: string;
  logo?: string;
  anneeCreation: number;
  nbEmployes: number;
  contact: {
    prenom: string;
    nom: string;
    poste: string;
    email: string;
    telephone: string;
  };
  reseauxSociaux: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  documents: {
    id: number;
    nom: string;
    type: string;
    dateDepot: string;
    statut: string;
  }[];
  statistiques: {
    nbStagiairesTotal: number;
    nbStagiairesActifs: number;
    nbStagiairesTermines: number;
    noteMoyenne: number;
    nbOffresTotal: number;
    nbOffresActives: number;
  };
}

const MonProfil: React.FC = () => {
  const [profile, setProfile] = useState<ProfilEntreprise | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Données simulées
  useEffect(() => {
    const mockProfile: ProfilEntreprise = {
      id: 1,
      nom: 'TechCorp Solutions',
      siret: '12345678901234',
      adresse: '123 Rue de l\'Innovation',
      ville: 'Paris',
      codePostal: '75001',
      pays: 'France',
      telephone: '+33 1 23 45 67 89',
      email: 'contact@techcorp-solutions.fr',
      siteWeb: 'https://www.techcorp-solutions.fr',
      secteur: 'Technologies de l\'information',
      taille: '50-100 employés',
      description: 'TechCorp Solutions est une entreprise innovante spécialisée dans le développement de solutions logicielles modernes. Nous créons des applications web et mobiles de haute qualité pour nos clients.',
      logo: '/api/logos/techcorp-logo.png',
      anneeCreation: 2018,
      nbEmployes: 75,
      contact: {
        prenom: 'Jean',
        nom: 'Martin',
        poste: 'Directeur des Ressources Humaines',
        email: 'jean.martin@techcorp-solutions.fr',
        telephone: '+33 1 23 45 67 90'
      },
      reseauxSociaux: {
        linkedin: 'https://linkedin.com/company/techcorp-solutions',
        twitter: 'https://twitter.com/techcorp_sol',
        facebook: 'https://facebook.com/techcorpsolutions'
      },
      documents: [
        {
          id: 1,
          nom: 'Kbis_TechCorp_Solutions.pdf',
          type: 'Kbis',
          dateDepot: '15/01/2024',
          statut: 'Approuvé'
        },
        {
          id: 2,
          nom: 'Attestation_assurance_TechCorp.pdf',
          type: 'Attestation d\'assurance',
          dateDepot: '20/01/2024',
          statut: 'Approuvé'
        },
        {
          id: 3,
          nom: 'Convention_stage_template.pdf',
          type: 'Convention type',
          dateDepot: '25/01/2024',
          statut: 'En attente'
        }
      ],
      statistiques: {
        nbStagiairesTotal: 12,
        nbStagiairesActifs: 3,
        nbStagiairesTermines: 9,
        noteMoyenne: 4.6,
        nbOffresTotal: 8,
        nbOffresActives: 2
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
                            <h4>{profile.nom}</h4>
                            <p className="text-muted">{profile.secteur}</p>
                            <p className="text-muted">
                              <i className="fas fa-map-marker-alt me-1"></i>
                              {profile.ville}, {profile.pays}
                            </p>
                            <div className="d-flex justify-content-center gap-2">
                              {profile.reseauxSociaux.linkedin && (
                                <a href={profile.reseauxSociaux.linkedin} className="btn btn-outline-primary btn-sm" target="_blank">
                                  <i className="fab fa-linkedin"></i>
                                </a>
                              )}
                              {profile.reseauxSociaux.twitter && (
                                <a href={profile.reseauxSociaux.twitter} className="btn btn-outline-info btn-sm" target="_blank">
                                  <i className="fab fa-twitter"></i>
                                </a>
                              )}
                              {profile.reseauxSociaux.facebook && (
                                <a href={profile.reseauxSociaux.facebook} className="btn btn-outline-primary btn-sm" target="_blank">
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
                                    <h4 className="mb-0">{profile.statistiques.nbStagiairesTotal}</h4>
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
                                    <h4 className="mb-0">{profile.statistiques.nbStagiairesActifs}</h4>
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
                                    <h4 className="mb-0">{profile.statistiques.noteMoyenne.toFixed(1)}</h4>
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
                                    <h4 className="mb-0">{profile.statistiques.nbOffresActives}</h4>
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
                                <p><strong>Fondée en:</strong> {profile.anneeCreation}</p>
                                <p><strong>Effectifs:</strong> {profile.nbEmployes} employés</p>
                              </div>
                              <div className="col-md-6">
                                <p><strong>Taille:</strong> {profile.taille}</p>
                                <p><strong>Site web:</strong> <a href={profile.siteWeb} target="_blank">{profile.siteWeb}</a></p>
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
                              value={profile.nom}
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
                              value={profile.adresse}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Ville *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.ville}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Code postal *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.codePostal}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Pays *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.pays}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone *</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              value={profile.telephone}
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
                              value={profile.siteWeb}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Secteur d'activité *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.secteur}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Taille de l'entreprise</label>
                            <select 
                              className="form-select" 
                              value={profile.taille}
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
                              value={profile.anneeCreation}
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
                              value={profile.contact.prenom}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Nom *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.contact.nom}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fonction *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              value={profile.contact.poste}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input 
                              type="email" 
                              className="form-control" 
                              value={profile.contact.email}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone *</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                              value={profile.contact.telephone}
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
                                      {doc.nom}
                                    </td>
                                    <td>
                                      <span className="badge bg-light text-dark">{doc.type}</span>
                                    </td>
                                    <td>{doc.dateDepot}</td>
                                    <td>{getDocumentStatusBadge(doc.statut)}</td>
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
                                  <h3 className="text-primary">{profile.statistiques.nbStagiairesActifs}</h3>
                                  <p className="text-muted">Actifs</p>
                                </div>
                              </div>
                              <div className="col-6">
                                <h3 className="text-success">{profile.statistiques.nbStagiairesTermines}</h3>
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
                              <h2 className="text-warning">{profile.statistiques.noteMoyenne.toFixed(1)}/5</h2>
                              <div className="d-flex justify-content-center">
                                {[...Array(5)].map((_, i) => (
                                  <i 
                                    key={i} 
                                    className={`fas fa-star ${i < Math.floor(profile.statistiques.noteMoyenne) ? 'text-warning' : 'text-muted'}`}
                                  ></i>
                                ))}
                              </div>
                              <p className="text-muted mt-2">Basé sur {profile.statistiques.nbStagiairesTotal} évaluations</p>
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
                                <h4 className="text-primary">{profile.statistiques.nbOffresTotal}</h4>
                                <p className="text-muted">Total des offres</p>
                              </div>
                              <div className="col-md-4">
                                <h4 className="text-success">{profile.statistiques.nbOffresActives}</h4>
                                <p className="text-muted">Offres actives</p>
                              </div>
                              <div className="col-md-4">
                                <h4 className="text-info">{profile.statistiques.nbOffresTotal - profile.statistiques.nbOffresActives}</h4>
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