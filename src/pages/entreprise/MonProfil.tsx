import React, { useState, useEffect } from 'react';
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
  FaStar,
  FaUserTie
} from 'react-icons/fa';
import { db, auth } from '../../config/firebase';
import { doc, updateDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

interface ProfilEntreprise {
  id: string;
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
}

const MonProfil: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfilEntreprise | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [effectif, setEffectif] = useState<number>(0);

  // Récupération du profil
  useEffect(() => {
    if (!user?.entrepriseId) return;
    const fetchProfile = async () => {
      try {
        const entrepriseRef = doc(db, 'entreprises', user.entrepriseId);
        const entrepriseDoc = await getDoc(entrepriseRef);
        if (entrepriseDoc.exists()) {
          const data = entrepriseDoc.data();
          setProfile({
            id: entrepriseDoc.id,
            nom: data.nom || '',
            siret: data.siret || '',
            adresse: data.adresse || '',
            ville: data.ville || '',
            codePostal: data.codePostal || '',
            pays: data.pays || '',
            telephone: data.telephone || '',
            email: data.email || '',
            siteWeb: data.siteWeb || '',
            secteur: data.secteur || '',
            taille: data.taille || '',
            description: data.description || '',
            logo: data.logo,
            anneeCreation: data.anneeCreation || new Date().getFullYear(),
            nbEmployes: data.nbEmployes || 0,
            contact: {
              prenom: data.contact?.prenom || '',
              nom: data.contact?.nom || '',
              poste: data.contact?.poste || '',
              email: data.contact?.email || '',
              telephone: data.contact?.telephone || ''
            }
          });
        } else {
          setMessage({ type: 'error', text: 'Profil entreprise non trouvé.' });
        }
      } catch (e) {
        console.error("Erreur lors de la récupération du profil de l'entreprise:", e);
        setMessage({ type: 'error', text: "Erreur lors de la récupération du profil." });
      }
    };
    fetchProfile();
  }, [user]);

  // Récupération de l'effectif exact
  useEffect(() => {
    if (!user?.entrepriseId) return;
    const fetchEffectif = async () => {
      try {
        const q = query(
          collection(db, 'utilisateurs'),
          where('entrepriseId', '==', user.entrepriseId),
          where('role', 'in', ['tuteur', 'entreprise'])
        );
        const snap = await getDocs(q);
        setEffectif(snap.size);
      } catch (e) {
        setEffectif(0);
      }
    };
    fetchEffectif();
  }, [user]);

  // Gestion des modifications
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: string) => {
    if (!profile) return;

    const { name, value } = e.target;
    if (section) {
      setProfile(prev => prev ? {
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      } : null);
    } else {
      setProfile(prev => prev ? {
        ...prev,
        [name]: value
      } : null);
    }
  };

  // Sauvegarde du profil
  const handleSave = async () => {
    if (!profile || !user?.entrepriseId) return;
    
    try {
      const entrepriseRef = doc(db, 'entreprises', user.entrepriseId);
      await updateDoc(entrepriseRef, {
          ...profile,
        updatedAt: new Date().toISOString()
        });
      
        setMessage({ type: 'success', text: 'Profil sauvegardé avec succès !' });
      setIsEditing(false);
    } catch (e) {
      console.error("Erreur lors de la sauvegarde:", e);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde du profil.' });
    }
  };

  if (!profile) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>;
  }

  return (
    <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
            <FaBuilding className="me-2 text-primary" />
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
              <FaEdit className="me-2" />Modifier
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                <FaTimes className="me-2" />Annuler
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={handleSave}
                    >
                <FaSave className="me-2" />Sauvegarder
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Message de notification */}
            {message && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`}>
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
              </div>
            )}

      {/* Contenu principal */}
      <div className="card shadow">
        <div className="card-header bg-white">
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
                <FaIndustry className="me-2" />
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
                </ul>
              </div>
              <div className="card-body">
                  {/* Onglet Aperçu */}
                  {activeTab === 'overview' && (
                    <div className="row">
                      <div className="col-md-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="mb-3">
                            <img 
                        src={profile?.logo || '/default-logo.png'} 
                              alt="Logo"
                        className="rounded-circle"
                        style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                    </div>
                    <h4>{profile?.nom}</h4>
                    <p className="text-muted">{profile?.secteur}</p>
                    <p className="mb-2">
                      <FaMapMarkerAlt className="me-2" />
                      {profile?.ville}, {profile?.pays}
                            </p>
                    <p className="mb-2">
                      <FaPhone className="me-2" />
                      {profile?.telephone}
                    </p>
                    <p className="mb-2">
                      <FaEnvelope className="me-2" />
                      {profile?.email}
                    </p>
                    {profile?.siteWeb && (
                      <p className="mb-2">
                        <FaGlobe className="me-2" />
                        <a href={profile.siteWeb} target="_blank" rel="noopener noreferrer">
                          {profile.siteWeb}
                        </a>
                      </p>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-8">
                <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                      <FaBuilding className="me-2" />
                      À propos
                            </h5>
                    <p>{profile?.description}</p>
                            <div className="row">
                              <div className="col-md-6">
                        <p><strong>Fondée en:</strong> {profile?.anneeCreation}</p>
                        <p><strong>Effectifs:</strong> {effectif} employés</p>
                              </div>
                              <div className="col-md-6">
                        <p><strong>Taille:</strong> {profile?.taille}</p>
                        <p><strong>Secteur:</strong> {profile?.secteur}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

          {/* Onglet Détails */}
                  {activeTab === 'details' && (
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Nom de l'entreprise *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="nom"
                  value={profile?.nom}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Numéro d’identification de l’entreprise *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="siret"
                  value={profile?.siret}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Adresse *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="adresse"
                  value={profile?.adresse}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Ville *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="ville"
                  value={profile?.ville}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Code postal *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="codePostal"
                  value={profile?.codePostal}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Pays *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="pays"
                  value={profile?.pays}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone *</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                  name="telephone"
                  value={profile?.telephone}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input 
                              type="email" 
                              className="form-control" 
                  name="email"
                  value={profile?.email}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Site web</label>
                            <input 
                              type="url" 
                              className="form-control" 
                  name="siteWeb"
                  value={profile?.siteWeb}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Secteur d'activité *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="secteur"
                  value={profile?.secteur}
                  onChange={handleInputChange}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-12">
                <label className="form-label">Description</label>
                            <textarea 
                              className="form-control" 
                  name="description"
                  value={profile?.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                              rows={4}
                />
                      </div>
                    </div>
                  )}

          {/* Onglet Contact */}
                  {activeTab === 'contact' && (
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Prénom *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="prenom"
                  value={profile?.contact.prenom}
                  onChange={(e) => handleInputChange(e, 'contact')}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Nom *</label>
                            <input 
                              type="text" 
                              className="form-control" 
                  name="nom"
                  value={profile?.contact.nom}
                  onChange={(e) => handleInputChange(e, 'contact')}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email *</label>
                            <input 
                              type="email" 
                              className="form-control" 
                  name="email"
                  value={profile?.contact.email}
                  onChange={(e) => handleInputChange(e, 'contact')}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Téléphone *</label>
                            <input 
                              type="tel" 
                              className="form-control" 
                  name="telephone"
                  value={profile?.contact.telephone}
                  onChange={(e) => handleInputChange(e, 'contact')}
                              disabled={!isEditing}
                  required
                            />
                          </div>
                      <div className="col-md-6">
                <label className="form-label">Fonction *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="poste"
                  value={profile?.contact.poste}
                  onChange={(e) => handleInputChange(e, 'contact')}
                  disabled={!isEditing}
                  required
                />
                      </div>
                    </div>
                  )}
                </div>
              </div>
    </div>
  );
};

export default MonProfil; 