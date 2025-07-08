import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { signOut, deleteUser, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

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
}

const MonProfil: React.FC = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statut, setStatut] = useState<string | null>(null);
  const [statutMessage, setStatutMessage] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Données simulées
  useEffect(() => {
    const mockProfile: StudentProfile = {
      id: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 12 34 56 78',
      studentId: '2024001',
      program: 'Master Informatique',
      year: 2,
      department: 'Département d\'Informatique',
      university: 'Université de Paris',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      birthDate: '15/03/2000',
      linkedin: 'linkedin.com/in/jeandupont',
      github: 'github.com/jeandupont',
      portfolio: 'jeandupont.dev',
      skills: ['React', 'Node.js', 'Python', 'MongoDB', 'Git', 'Docker'],
      languages: ['Français (Natif)', 'Anglais (Courant)', 'Espagnol (Intermédiaire)'],
      interests: ['Développement Web', 'Intelligence Artificielle', 'Cybersécurité'],
      photo: '/api/photos/student-1.jpg'
    };
    setProfile(mockProfile);
    setEditedProfile(mockProfile);
  }, []);

  useEffect(() => {
    if (user && user.statut) {
      setStatut(user.statut);
      if (user.statut === 'en_attente') {
        setStatutMessage("Votre compte est en attente de validation par le responsable universitaire. Veuillez patienter.");
      } else if (user.statut === 'rejeté') {
        setStatutMessage("Votre inscription a été rejetée. Vous allez être déconnecté et votre compte supprimé.");
        // Suppression du compte après un court délai
        setTimeout(async () => {
          // Supprimer le document Firestore
          const q = query(collection(db, 'utilisateurs'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            await deleteDoc(doc(db, 'utilisateurs', querySnapshot.docs[0].id));
          }
          // Supprimer le compte Auth
          if (auth.currentUser) {
            await deleteUser(auth.currentUser);
          }
          await signOut(auth);
          window.location.href = '/login';
        }, 4000);
      }
    }
  }, [user]);

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
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editedProfile);
      setIsEditing(false);
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

  return (
    <div className="dashboard-container">
      <div className="alert alert-info text-center">
        Statut du compte : <b>{statut || 'Inconnu'}</b>
        {statutMessage && <div className="mt-2">{statutMessage}</div>}
      </div>
      {/* Si en attente, bloquer le reste du dashboard */}
      {statut === 'en_attente' ? (
        <div className="text-center mt-5">
          <h4>Votre compte est en attente de validation.</h4>
          <p>Vous ne pouvez pas utiliser la plateforme tant que le responsable universitaire n'a pas validé votre inscription.</p>
        </div>
      ) : statut === 'rejeté' ? (
        <div className="text-center mt-5">
          <h4>Votre inscription a été rejetée.</h4>
          <p>Vous allez être déconnecté et votre compte supprimé.</p>
        </div>
      ) : (
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

            <div className="row">
              {/* Photo de profil */}
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="position-relative mb-3">
                      <div className="profile-photo-container">
                        <img 
                          src={editedProfile.photo || '/default-avatar.png'} 
                          alt="Photo de profil"
                          className="rounded-circle profile-photo"
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
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
                    <h5 className="mb-1">{editedProfile.firstName} {editedProfile.lastName}</h5>
                    <p className="text-muted mb-2">{editedProfile.program}</p>
                    <p className="text-muted mb-0">Étudiant #{editedProfile.studentId}</p>
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="card mt-3">
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="fas fa-chart-bar me-2"></i>Statistiques
                    </h6>
                    <div className="row text-center">
                      <div className="col-6">
                        <h4 className="text-primary mb-0">3</h4>
                        <small className="text-muted">Stages</small>
                      </div>
                      <div className="col-6">
                        <h4 className="text-success mb-0">5</h4>
                        <small className="text-muted">Documents</small>
                      </div>
                    </div>
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
                          value={editedProfile.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Nom *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Téléphone</label>
                        <input
                          type="tel"
                          className="form-control"
                          value={editedProfile.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date de naissance</label>
                        <input
                          type="date"
                          className="form-control"
                          value={editedProfile.birthDate}
                          onChange={(e) => handleInputChange('birthDate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Numéro étudiant</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.studentId}
                          onChange={(e) => handleInputChange('studentId', e.target.value)}
                          disabled={!isEditing}
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
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.program}
                          onChange={(e) => handleInputChange('program', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Année d'étude</label>
                        <select
                          className="form-select"
                          value={editedProfile.year}
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
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Université</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.university}
                          onChange={(e) => handleInputChange('university', e.target.value)}
                          disabled={!isEditing}
                        />
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
                          value={editedProfile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Ville</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Code postal</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Pays</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editedProfile.country}
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
      )}

      {/* Modal Photo */}
      {showPhotoModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-camera me-2"></i>
                  Modifier la photo de profil
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPhotoModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-3">
                  <img 
                    src={editedProfile.photo || '/default-avatar.png'} 
                    alt="Photo actuelle"
                    className="rounded-circle mb-3"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Choisir une nouvelle photo</label>
                  <input 
                    type="file" 
                    className="form-control"
                    accept="image/*"
                  />
                  <small className="text-muted">
                    Formats acceptés: JPG, PNG (max 2MB)
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPhotoModal(false)}
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

      {/* Modal de modification du mot de passe */}
      {showPasswordModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le mot de passe</h5>
                <button type="button" className="btn-close" onClick={() => setShowPasswordModal(false)}></button>
              </div>
              <div className="modal-body">
                {passwordError && <div className="alert alert-danger">{passwordError}</div>}
                {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}
                <div className="mb-3">
                  <label className="form-label">Ancien mot de passe</label>
                  <input type="password" className="form-control" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={async () => {
                  setPasswordError('');
                  setPasswordSuccess('');
                  try {
                    if (!oldPassword || !newPassword) {
                      setPasswordError('Veuillez remplir les deux champs.');
                      return;
                    }
                    const userAuth = auth.currentUser;
                    if (!userAuth || !userAuth.email) {
                      setPasswordError('Utilisateur non authentifié.');
                      return;
                    }
                    const credential = EmailAuthProvider.credential(userAuth.email, oldPassword);
                    await reauthenticateWithCredential(userAuth, credential);
                    await updatePassword(userAuth, newPassword);
                    setPasswordSuccess('Mot de passe modifié avec succès !');
                    setOldPassword('');
                    setNewPassword('');
                    setTimeout(() => setShowPasswordModal(false), 2000);
                  } catch (err: any) {
                    setPasswordError('Erreur : ' + (err.message || 'Impossible de modifier le mot de passe.'));
                  }
                }}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonProfil; 