import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signOut, deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

interface StudentProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  program: string;
  year: number;
  department: string;
  university: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  birthDate: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  languages: string[];
  interests: string[];
  photo?: string;
  universiteId?: string; // Ajout de l'université associée
  createdAt?: string; // Ajout des champs de date
  updatedAt?: string;
  role?: string; // Ajout du rôle
  filiere?: string; // Ajout de la filière
  isActive?: boolean; // Ajout du champ isActive
}

// Fonction utilitaire pour formater une date en français
function formatDateFr(date: any) {
  if (!date) return '';
  let d: Date;
  if (typeof date === 'string' && !isNaN(Date.parse(date))) {
    d = new Date(date);
  } else if (date instanceof Date) {
    d = date;
  } else if (date.seconds) {
    d = new Date(date.seconds * 1000);
  } else {
    return '';
  }
  return d.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'medium' });
}

const MonProfil: React.FC = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [universiteInfo, setUniversiteInfo] = useState<any>(null);

  // Remplacer le useEffect de chargement du profil par la récupération depuis 'utilisateurs'
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      try {
        const q = query(collection(db, 'utilisateurs'), where('uid', '==', user.uid), where('role', '==', 'etudiant'));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setProfile({
            ...data,
            skills: data.skills || [],
            languages: data.languages || [],
            interests: data.interests || [],
          } as StudentProfile);
          setEditedProfile({
            ...data,
            skills: data.skills || [],
            languages: data.languages || [],
            interests: data.interests || [],
          } as StudentProfile);
          // Charger l'université associée si universiteId présent
          if (data.universiteId) {
            const univRef = doc(db, 'universites', data.universiteId);
            const univSnap = await getDoc(univRef);
            if (univSnap.exists()) {
              setUniversiteInfo(univSnap.data());
          }
          } else {
            setUniversiteInfo(null);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil étudiant:', error);
      }
    };
    fetchProfile();
  }, [user]);

  // Supprimer le useEffect qui gérait l'ancien statut/statutMessage basé sur user.statut

  const handleInputChange = (field: keyof StudentProfile, value: any) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (editedProfile && skill.trim() && !editedProfile.skills.includes(skill.trim())) {
      setEditedProfile({
        ...editedProfile,
        skills: [...editedProfile.skills, skill.trim()]
      });
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        skills: editedProfile.skills.filter(skill => skill !== skillToRemove)
      });
    }
  };

  const handleLanguageAdd = (language: string) => {
    if (editedProfile && language.trim() && !editedProfile.languages.includes(language.trim())) {
      setEditedProfile({
        ...editedProfile,
        languages: [...editedProfile.languages, language.trim()]
      });
    }
  };

  const handleLanguageRemove = (languageToRemove: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        languages: editedProfile.languages.filter(language => language !== languageToRemove)
      });
    }
  };

  const handleInterestAdd = (interest: string) => {
    if (editedProfile && interest.trim() && !editedProfile.interests.includes(interest.trim())) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, interest.trim()]
      });
    }
  };

  const handleInterestRemove = (interestToRemove: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        interests: editedProfile.interests.filter(interest => interest !== interestToRemove)
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!user?.uid || !editedProfile) return;
      // Mettre à jour le document dans 'utilisateurs'
      const q = query(collection(db, 'utilisateurs'), where('uid', '==', user.uid), where('role', '==', 'etudiant'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const now = new Date();
        const updatedProfile = {
          ...editedProfile,
          updatedAt: now.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'medium' }),
          skills: editedProfile.skills || [],
          languages: editedProfile.languages || [],
          interests: editedProfile.interests || [],
        };
        await setDoc(doc(db, 'utilisateurs', snap.docs[0].id), updatedProfile, { merge: true });
        setProfile(updatedProfile);
      setIsEditing(false);
        // Recharger l'université si modifiée
        if (updatedProfile.universiteId) {
          const univRef = doc(db, 'universites', updatedProfile.universiteId);
          const univSnap = await getDoc(univRef);
          if (univSnap.exists()) {
            setUniversiteInfo(univSnap.data());
          }
        } else {
          setUniversiteInfo(null);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) return <div>Chargement...</div>;
  if (!user) return <div>Non connecté</div>;
  if (!editedProfile) return null;

  // Affichage du statut du compte basé sur isActive
  const statut = editedProfile?.isActive === true ? 'Actif' : 'Inactif';
  const statutClass = editedProfile?.isActive === true ? 'alert-success' : 'alert-danger';

  return (
    <div className="dashboard-container">
      <div className={`alert text-center ${statutClass}`}>
        Statut du compte : <b>{statut}</b>
        {statut === 'Inactif' && <div className="mt-2">Votre compte est inactif. Veuillez contacter l'administration.</div>}
      </div>
      <div className="row g-0">
        <div className="col">
          <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-user me-2 text-primary"></i>
                  Mon Profil
                </h1>
                <p className="text-muted mb-0">
                  Gérez vos informations personnelles et académiques
                </p>
              </div>
              <div className="d-flex gap-2">
                {!isEditing ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit me-2"></i>Modifier le profil
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <i className="fas fa-times me-2"></i>Annuler
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>Sauvegarder
                        </>
                      )}
                    </button>
                  </>
                )}
                <button className="btn btn-outline-secondary" onClick={() => setShowPasswordModal(true)}>
                  <i className="fas fa-key me-2"></i>Modifier le mot de passe
                </button>
              </div>
            </div>

            {/* Université associée */}
            {universiteInfo && (
              <div className="card shadow-sm border-0 mb-4" style={{ background: '#f5f8ff' }}>
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ fontSize: 36, color: '#2563eb' }}>
                    <i className="fas fa-university"></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold" style={{ fontSize: 20 }}>{universiteInfo.nom}</div>
                    <div className="text-muted" style={{ fontSize: 15 }}>
                      {universiteInfo.ville && <span><i className="fas fa-map-marker-alt me-1"></i>{universiteInfo.ville}</span>}
                      {universiteInfo.secteur && <span className="ms-3"><i className="fas fa-briefcase me-1"></i>{universiteInfo.secteur}</span>}
                    </div>
                    <div className="mt-1" style={{ fontSize: 14 }}>
                      {universiteInfo.email && <span><i className="fas fa-envelope me-1"></i>{universiteInfo.email}</span>}
                      {universiteInfo.telephone && <span className="ms-3"><i className="fas fa-phone me-1"></i>{universiteInfo.telephone}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              {/* Photo de profil */}
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="position-relative mb-3">
                      <div className="profile-photo-container">
                        {editedProfile.photo ? (
                        <img 
                            src={editedProfile.photo} 
                          alt="Photo de profil"
                          className="rounded-circle profile-photo"
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                        ) : (
                          <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fas fa-user" style={{ fontSize: 72, color: 'rgba(0,0,0,0.10)' }}></i>
                          </div>
                        )}
                        {isEditing && (
                          <button 
                            className="btn btn-sm btn-primary position-absolute bottom-0 end-0"
                            onClick={() => setShowPhotoModal(true)}
                            style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                          >
                            <i className="fas fa-camera"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <h5 className="mb-1">{editedProfile.firstName || ''} {editedProfile.lastName || ''}</h5>
                    <p className="text-muted mb-2">{editedProfile.program || ''}</p>
                    <p className="text-muted mb-0">Étudiant #{editedProfile.studentId || ''}</p>
                  </div>
                </div>
              </div>

              {/* Informations principales */}
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Informations personnelles
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Prénom *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.firstName || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nom *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.lastName || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Adresse e-mail *</label>
                        <input
                          type="email"
                          className="form-control"
                          value={editedProfile.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          placeholder="exemple@email.com"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Téléphone</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={editedProfile.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Votre numéro de téléphone"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations académiques */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Informations académiques
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Programme *</label>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editedProfile.program || ''}
                            onChange={(e) => handleInputChange('program', e.target.value)}
                          >
                            <option value="">Sélectionner un programme</option>
                            <option value="BTS">BTS</option>
                            <option value="Licence">Licence</option>
                            <option value="Master">Master</option>
                          </select>
                        ) : (
                        <input
                          type="text"
                          className="form-control"
                            value={editedProfile.program || ''}
                            disabled
                        />
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Année d'étude</label>
                        <select
                          className="form-select"
                          value={editedProfile.year || ''}
                          onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                          disabled={!isEditing}
                        >
                          <option value={1}>1ère année</option>
                          <option value={2}>2ème année</option>
                          <option value={3}>3ème année</option>
                          <option value={4}>4ème année</option>
                          <option value={5}>5ème année</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Département</label>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editedProfile.department || ''}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                          >
                            <option value="">Sélectionner un département</option>
                            <option value="Informatique">Informatique</option>
                            <option value="Gestion">Gestion</option>
                            <option value="Droit">Droit</option>
                            <option value="Économie">Économie</option>
                            <option value="Santé">Santé</option>
                            <option value="Autre">Autre</option>
                          </select>
                        ) : (
                        <input
                          type="text"
                          className="form-control"
                            value={editedProfile.department || ''}
                            disabled
                        />
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Filière</label>
                        {isEditing ? (
                          <select
                            className="form-select"
                            value={editedProfile.filiere || ''}
                            onChange={(e) => handleInputChange('filiere', e.target.value)}
                          >
                            <option value="">Sélectionner une filière</option>
                            <option value="Génie Logiciel">Génie Logiciel</option>
                            <option value="Sécurité">Sécurité</option>
                            <option value="Comptabilité">Comptabilité</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Réseaux">Réseaux</option>
                            <option value="Ressources Humaines">Ressources Humaines</option>
                            <option value="Autre">Autre</option>
                          </select>
                        ) : (
                        <input
                          type="text"
                          className="form-control"
                            value={editedProfile.filiere || ''}
                            disabled
                        />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Adresse
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Adresse</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Ville</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.city || ''}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Code postal</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.postalCode || ''}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Pays</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.country || ''}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Réseaux sociaux */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-share-alt me-2"></i>
                      Réseaux sociaux
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          <i className="fab fa-linkedin me-2"></i>LinkedIn
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={editedProfile.linkedin || ''}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          disabled={!isEditing}
                          placeholder="linkedin.com/in/username"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          <i className="fab fa-github me-2"></i>GitHub
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={editedProfile.github || ''}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          disabled={!isEditing}
                          placeholder="github.com/username"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          <i className="fas fa-globe me-2"></i>Portfolio
                        </label>
                        <input
                          type="url"
                          className="form-control"
                          value={editedProfile.portfolio || ''}
                          onChange={(e) => handleInputChange('portfolio', e.target.value)}
                          disabled={!isEditing}
                          placeholder="votre-portfolio.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compétences */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-tools me-2"></i>
                      Compétences
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2">
                        {editedProfile.skills.map((skill, index) => (
                          <span key={index} className="badge bg-primary">
                            {skill}
                            {isEditing && (
                              <button
                                className="btn btn-sm text-white ms-1"
                                onClick={() => handleSkillRemove(skill)}
                                style={{ background: 'none', border: 'none', padding: 0 }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ajouter une compétence..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSkillAdd(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          className="btn btn-outline-primary"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleSkillAdd(input.value);
                            input.value = '';
                          }}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Langues */}
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-language me-2"></i>
                      Langues
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2">
                        {editedProfile.languages.map((language, index) => (
                          <span key={index} className="badge bg-info">
                            {language}
                            {isEditing && (
                              <button
                                className="btn btn-sm text-white ms-1"
                                onClick={() => handleLanguageRemove(language)}
                                style={{ background: 'none', border: 'none', padding: 0 }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ajouter une langue..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleLanguageAdd(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          className="btn btn-outline-info"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleLanguageAdd(input.value);
                            input.value = '';
                          }}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Centres d'intérêt */}
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-heart me-2"></i>
                      Centres d'intérêt
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2">
                        {editedProfile.interests.map((interest, index) => (
                          <span key={index} className="badge bg-warning">
                            {interest}
                            {isEditing && (
                              <button
                                className="btn btn-sm text-white ms-1"
                                onClick={() => handleInterestRemove(interest)}
                                style={{ background: 'none', border: 'none', padding: 0 }}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isEditing && (
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ajouter un centre d'intérêt..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleInterestAdd(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          className="btn btn-outline-warning"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleInterestAdd(input.value);
                            input.value = '';
                          }}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonProfil; 