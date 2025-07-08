import React, { useState } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaUndo, 
  FaBell, 
  FaUser, 
  FaEnvelope,
  FaCalendarAlt,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaBuilding,
  FaLock,
  FaKey,
  FaTrash
} from 'react-icons/fa';

interface Parametre {
  id: string;
  nom: string;
  description: string;
  valeur: string | boolean | number;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
  options?: string[];
  categorie: string;
  obligatoire: boolean;
}

interface Profil {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  departement: string;
  bureau: string;
  bio: string;
  photo: string;
}

const Parametres: React.FC = () => {
  const [profil, setProfil] = useState<Profil>({
    nom: "Diallo",
    prenom: "Mamadou",
    email: "mamadou.diallo@universite.ci",
    telephone: "+225 07 08 12 34 56",
    specialite: "Informatique",
    departement: "Sciences et Technologies",
    bureau: "Bâtiment A - Bureau 205",
    bio: "Tuteur expérimenté en développement web et applications mobiles. Plus de 10 ans d'expérience dans l'accompagnement des stagiaires.",
    photo: "/images/profile.jpg"
  });

  const [parametres, setParametres] = useState<Parametre[]>([
    // Paramètres de Notification
    {
      id: 'notifications_email',
      nom: 'Notifications par email',
      description: 'Recevoir les notifications par email',
      valeur: true,
      type: 'boolean',
      categorie: 'notifications',
      obligatoire: false
    },
    {
      id: 'notifications_push',
      nom: 'Notifications push',
      description: 'Recevoir les notifications push dans le navigateur',
      valeur: true,
      type: 'boolean',
      categorie: 'notifications',
      obligatoire: false
    },
    {
      id: 'frequence_rapports',
      nom: 'Fréquence des rapports',
      description: 'Fréquence de rappel pour les rapports',
      valeur: 'hebdomadaire',
      type: 'select',
      options: ['quotidienne', 'hebdomadaire', 'mensuelle', 'jamais'],
      categorie: 'notifications',
      obligatoire: false
    },
    {
      id: 'notifications_evaluations',
      nom: 'Notifications d\'évaluations',
      description: 'Être notifié des évaluations à faire',
      valeur: true,
      type: 'boolean',
      categorie: 'notifications',
      obligatoire: false
    },

    // Paramètres de Sécurité
    {
      id: 'verification_2fa',
      nom: 'Authentification à deux facteurs',
      description: 'Activer l\'authentification à deux facteurs',
      valeur: false,
      type: 'boolean',
      categorie: 'securite',
      obligatoire: false
    },
    {
      id: 'session_timeout',
      nom: 'Délai de déconnexion (minutes)',
      description: 'Délai d\'inactivité avant déconnexion automatique',
      valeur: 30,
      type: 'number',
      categorie: 'securite',
      obligatoire: true
    },
    {
      id: 'historique_connexions',
      nom: 'Conserver l\'historique des connexions',
      description: 'Garder un historique des connexions',
      valeur: true,
      type: 'boolean',
      categorie: 'securite',
      obligatoire: false
    },

    // Paramètres d'Interface
    {
      id: 'theme_interface',
      nom: 'Thème de l\'interface',
      description: 'Choisir le thème d\'affichage',
      valeur: 'clair',
      type: 'select',
      options: ['clair', 'sombre', 'auto'],
      categorie: 'interface',
      obligatoire: false
    },
    {
      id: 'langue_interface',
      nom: 'Langue de l\'interface',
      description: 'Langue d\'affichage de l\'interface',
      valeur: 'Français',
      type: 'select',
      options: ['Français', 'English', 'Español'],
      categorie: 'interface',
      obligatoire: true
    },
    {
      id: 'affichage_tableau',
      nom: 'Éléments par page',
      description: 'Nombre d\'éléments affichés par page dans les tableaux',
      valeur: 10,
      type: 'select',
      options: ['5', '10', '20', '50'],
      categorie: 'interface',
      obligatoire: true
    },

    // Paramètres de Suivi
    {
      id: 'auto_sauvegarde',
      nom: 'Sauvegarde automatique',
      description: 'Sauvegarder automatiquement les rapports en cours de rédaction',
      valeur: true,
      type: 'boolean',
      categorie: 'suivi',
      obligatoire: false
    },
    {
      id: 'rappel_evaluations',
      nom: 'Rappels d\'évaluations',
      description: 'Activer les rappels pour les évaluations à venir',
      valeur: true,
      type: 'boolean',
      categorie: 'suivi',
      obligatoire: false
    },
    {
      id: 'delai_rappel',
      nom: 'Délai de rappel (jours)',
      description: 'Nombre de jours avant l\'échéance pour les rappels',
      valeur: 3,
      type: 'number',
      categorie: 'suivi',
      obligatoire: true
    }
  ]);

  const [parametresModifies, setParametresModifies] = useState<Set<string>>(new Set());
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('profil');

  const categories = [
    { id: 'profil', nom: 'Profil', icon: FaUser },
    { id: 'notifications', nom: 'Notifications', icon: FaBell },
    { id: 'securite', nom: 'Sécurité', icon: FaShieldAlt },
    { id: 'interface', nom: 'Interface', icon: FaCog },
    { id: 'suivi', nom: 'Suivi', icon: FaCalendarAlt }
  ];

  const handleParametreChange = (id: string, nouvelleValeur: string | boolean | number) => {
    setParametres(prev => prev.map(param => 
      param.id === id ? { ...param, valeur: nouvelleValeur } : param
    ));
    setParametresModifies(prev => new Set(prev).add(id));
  };

  const handleProfilChange = (field: keyof Profil, value: string) => {
    setProfil(prev => ({ ...prev, [field]: value }));
    setParametresModifies(prev => new Set(prev).add('profil'));
  };

  const handleSave = () => {
    // Simulation de sauvegarde
    setTimeout(() => {
      setParametresModifies(new Set());
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setParametres(prev => prev.map(param => ({ ...param })));
    setProfil(prev => ({ ...prev }));
    setParametresModifies(new Set());
    setMessage({ type: 'error', text: 'Paramètres réinitialisés !' });
    setTimeout(() => setMessage(null), 3000);
  };

  const renderParametreInput = (parametre: Parametre) => {
    switch (parametre.type) {
      case 'text':
        return (
          <input
            type="text"
            className="form-control"
            value={parametre.valeur as string}
            onChange={(e) => handleParametreChange(parametre.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="form-control"
            value={parametre.valeur as number}
            onChange={(e) => handleParametreChange(parametre.id, parseInt(e.target.value))}
          />
        );
      case 'boolean':
        return (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={parametre.valeur as boolean}
              onChange={(e) => handleParametreChange(parametre.id, e.target.checked)}
            />
          </div>
        );
      case 'select':
        return (
          <select
            className="form-select"
            value={parametre.valeur as string}
            onChange={(e) => handleParametreChange(parametre.id, e.target.value)}
          >
            {parametre.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            className="form-control"
            rows={3}
            value={parametre.valeur as string}
            onChange={(e) => handleParametreChange(parametre.id, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaCog className="me-2 text-primary" />
            Paramètres Personnels
          </h1>
          <p className="text-muted">Configurez vos paramètres personnels et préférences</p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={handleReset}
            disabled={parametresModifies.size === 0}
          >
            <FaUndo className="me-2" />
            Réinitialiser
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={parametresModifies.size === 0}
          >
            <FaSave className="me-2" />
            Sauvegarder
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
            {categories.map(categorie => {
              const IconComponent = categorie.icon;
              return (
                <li key={categorie.id} className="nav-item">
                  <button
                    className={`nav-link ${activeTab === categorie.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(categorie.id)}
                  >
                    <IconComponent className="me-2" />
                    {categorie.nom}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-body">
          {/* Profil */}
          {activeTab === 'profil' && (
            <div className="row">
              <div className="col-md-4 text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={profil.photo}
                    alt="Photo de profil"
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Photo';
                    }}
                  />
                  <button className="btn btn-sm btn-primary position-absolute bottom-0 end-0">
                    <FaUser />
                  </button>
                </div>
                <h5 className="mt-3">{profil.prenom} {profil.nom}</h5>
                <p className="text-muted">{profil.specialite}</p>
              </div>
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profil.prenom}
                      onChange={(e) => handleProfilChange('prenom', e.target.value)}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profil.nom}
                      onChange={(e) => handleProfilChange('nom', e.target.value)}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={profil.email}
                        onChange={(e) => handleProfilChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Téléphone</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaPhone />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        value={profil.telephone}
                        onChange={(e) => handleProfilChange('telephone', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Spécialité</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaGraduationCap />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={profil.specialite}
                        onChange={(e) => handleProfilChange('specialite', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Département</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaBuilding />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={profil.departement}
                        onChange={(e) => handleProfilChange('departement', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Bureau</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaMapMarkerAlt />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      value={profil.bureau}
                      onChange={(e) => handleProfilChange('bureau', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Biographie</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={profil.bio}
                    onChange={(e) => handleProfilChange('bio', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Autres onglets */}
          {activeTab !== 'profil' && (
            <div className="row">
              {parametres
                .filter(parametre => parametre.categorie === activeTab)
                .map(parametre => (
                  <div key={parametre.id} className="col-md-6 mb-4">
                    <div className={`card ${parametresModifies.has(parametre.id) ? 'border-warning' : 'border-light'}`}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <label className="form-label fw-bold mb-0">
                            {parametre.nom}
                            {parametre.obligatoire && <span className="text-danger ms-1">*</span>}
                          </label>
                          {parametresModifies.has(parametre.id) && (
                            <span className="badge bg-warning">
                              <FaCheck className="me-1" />
                              Modifié
                            </span>
                          )}
                        </div>
                        <p className="text-muted small mb-3">{parametre.description}</p>
                        {renderParametreInput(parametre)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Section de sécurité avancée */}
      {activeTab === 'securite' && (
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              <FaLock className="me-2" />
              Sécurité Avancée
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="card border-light">
                  <div className="card-body">
                    <h6 className="card-title">Changer le mot de passe</h6>
                    <div className="mb-3">
                      <label className="form-label">Ancien mot de passe</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Entrez l'ancien mot de passe"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nouveau mot de passe</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Entrez le nouveau mot de passe"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirmer le nouveau mot de passe</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmez le nouveau mot de passe"
                      />
                    </div>
                    <button className="btn btn-warning">
                      <FaLock className="me-2" />
                      Changer le mot de passe
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-light">
                  <div className="card-body">
                    <h6 className="card-title">Sessions actives</h6>
                    <p className="text-muted small">
                      Gérez vos sessions actives sur différents appareils.
                    </p>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                        <div>
                          <strong>Chrome - Windows</strong>
                          <br />
                          <small className="text-muted">Dernière activité: Il y a 2 heures</small>
                        </div>
                        <button className="btn btn-sm btn-outline-danger">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                        <div>
                          <strong>Safari - iPhone</strong>
                          <br />
                          <small className="text-muted">Dernière activité: Il y a 1 jour</small>
                        </div>
                        <button className="btn btn-sm btn-outline-danger">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-outline-secondary">
                      <FaKey className="me-2" />
                      Fermer toutes les sessions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations système */}
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            <FaCog className="me-2" />
            Informations Système
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 text-primary">Tuteur</div>
                <div className="text-muted">Rôle actuel</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 text-success">15</div>
                <div className="text-muted">Stagiaires suivis</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 text-info">45</div>
                <div className="text-muted">Rapports créés</div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 text-warning">2 ans</div>
                <div className="text-muted">Expérience tuteur</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametres; 