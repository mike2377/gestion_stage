import React, { useState } from 'react';
import { 
  FaCog, 
  FaSave, 
  FaBell, 
  FaEnvelope, 
  FaShieldAlt, 
  FaEye, 
  FaEyeSlash,
  FaToggleOn,
  FaToggleOff,
  FaCheck,
  FaTimes,
  FaDownload,
  FaUpload,
  FaTrash,
  FaKey,
  FaUser,
  FaGlobe,
  FaLanguage,
  FaPalette,
  FaClock,
  FaCalendarAlt,
  FaFileAlt,
  FaUsers,
  FaHandshake,
  FaStar,
  FaExclamationTriangle
} from 'react-icons/fa';

interface Parametres {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    candidatures: boolean;
    rappels: boolean;
    rapports: boolean;
    newsletter: boolean;
  };
  securite: {
    authentificationDouble: boolean;
    motDePasseComplexe: boolean;
    sessionTimeout: number;
    connexionsSimultanees: number;
    historiqueConnexions: boolean;
  };
  interface: {
    theme: 'light' | 'dark' | 'auto';
    langue: 'fr' | 'en';
    timezone: string;
    formatDate: string;
    formatHeure: string;
  };
  stages: {
    autoValidation: boolean;
    delaiReponse: number;
    evaluationObligatoire: boolean;
    rapportObligatoire: boolean;
    tuteurObligatoire: boolean;
    conventionObligatoire: boolean;
  };
  entreprise: {
    visibiliteProfil: 'public' | 'prive' | 'partiel';
    acceptationAutomatique: boolean;
    delaiAcceptation: number;
    criteresEvaluation: string[];
    documentsObligatoires: string[];
  };
}

const Parametres: React.FC = () => {
  const [parametres, setParametres] = useState<Parametres>({
    notifications: {
      email: true,
      sms: false,
      push: true,
      candidatures: true,
      rappels: true,
      rapports: false,
      newsletter: true
    },
    securite: {
      authentificationDouble: false,
      motDePasseComplexe: true,
      sessionTimeout: 30,
      connexionsSimultanees: 3,
      historiqueConnexions: true
    },
    interface: {
      theme: 'light',
      langue: 'fr',
      timezone: 'Africa/Abidjan',
      formatDate: 'DD/MM/YYYY',
      formatHeure: '24h'
    },
    stages: {
      autoValidation: false,
      delaiReponse: 7,
      evaluationObligatoire: true,
      rapportObligatoire: true,
      tuteurObligatoire: true,
      conventionObligatoire: true
    },
    entreprise: {
      visibiliteProfil: 'public',
      acceptationAutomatique: false,
      delaiAcceptation: 14,
      criteresEvaluation: ['Compétences techniques', 'Motivation', 'Adaptabilité', 'Communication'],
      documentsObligatoires: ['CV', 'Lettre de motivation', 'Relevé de notes', 'Convention de stage']
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const themes = ['light', 'dark', 'auto'];
  const langues = ['fr', 'en'];
  const timezones = ['Africa/Abidjan', 'Europe/Paris', 'America/New_York', 'Asia/Tokyo'];
  const formatsDate = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
  const formatsHeure = ['24h', '12h'];
  const visibilites = ['public', 'prive', 'partiel'];

  const handleNotificationChange = (key: keyof Parametres['notifications']) => {
    setParametres(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleSecuriteChange = (key: keyof Parametres['securite'], value: boolean | number) => {
    setParametres(prev => ({
      ...prev,
      securite: {
        ...prev.securite,
        [key]: value
      }
    }));
  };

  const handleInterfaceChange = (key: keyof Parametres['interface'], value: string) => {
    setParametres(prev => ({
      ...prev,
      interface: {
        ...prev.interface,
        [key]: value
      }
    }));
  };

  const handleStagesChange = (key: keyof Parametres['stages'], value: boolean | number) => {
    setParametres(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [key]: value
      }
    }));
  };

  const handleEntrepriseChange = (key: keyof Parametres['entreprise'], value: any) => {
    setParametres(prev => ({
      ...prev,
      entreprise: {
        ...prev.entreprise,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Simulation de sauvegarde
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Paramètres sauvegardés avec succès !' });
      setTimeout(() => setMessage(null), 3000);
    }, 1000);
  };

  const handleReset = () => {
    setMessage({ type: 'error', text: 'Paramètres réinitialisés !' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(parametres, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parametres_entreprise.json';
    link.click();
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">
            <FaCog className="me-2 text-primary" />
            Paramètres
          </h1>
          <p className="text-muted">Configurez vos préférences et paramètres</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handleReset}>
            <FaTimes className="me-2" />
            Réinitialiser
          </button>
          <button className="btn btn-outline-info" onClick={handleExport}>
            <FaDownload className="me-2" />
            Exporter
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
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
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell className="me-2" />
                Notifications
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'securite' ? 'active' : ''}`}
                onClick={() => setActiveTab('securite')}
              >
                <FaShieldAlt className="me-2" />
                Sécurité
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'interface' ? 'active' : ''}`}
                onClick={() => setActiveTab('interface')}
              >
                <FaGlobe className="me-2" />
                Interface
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'stages' ? 'active' : ''}`}
                onClick={() => setActiveTab('stages')}
              >
                <FaHandshake className="me-2" />
                Stages
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'entreprise' ? 'active' : ''}`}
                onClick={() => setActiveTab('entreprise')}
              >
                <FaBuilding className="me-2" />
                Entreprise
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaEnvelope className="me-2 text-primary" />
                  Canaux de notification
                </h6>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                    <label className="form-check-label">
                      Notifications par email
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                    />
                    <label className="form-check-label">
                      Notifications par SMS
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                    <label className="form-check-label">
                      Notifications push
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaBell className="me-2 text-primary" />
                  Types de notifications
                </h6>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.candidatures}
                      onChange={() => handleNotificationChange('candidatures')}
                    />
                    <label className="form-check-label">
                      Nouvelles candidatures
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.rappels}
                      onChange={() => handleNotificationChange('rappels')}
                    />
                    <label className="form-check-label">
                      Rappels et échéances
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.rapports}
                      onChange={() => handleNotificationChange('rapports')}
                    />
                    <label className="form-check-label">
                      Rapports de stage
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.notifications.newsletter}
                      onChange={() => handleNotificationChange('newsletter')}
                    />
                    <label className="form-check-label">
                      Newsletter et actualités
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sécurité */}
          {activeTab === 'securite' && (
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaShieldAlt className="me-2 text-primary" />
                  Authentification
                </h6>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.securite.authentificationDouble}
                      onChange={() => handleSecuriteChange('authentificationDouble', !parametres.securite.authentificationDouble)}
                    />
                    <label className="form-check-label">
                      Authentification à deux facteurs
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.securite.motDePasseComplexe}
                      onChange={() => handleSecuriteChange('motDePasseComplexe', !parametres.securite.motDePasseComplexe)}
                    />
                    <label className="form-check-label">
                      Mot de passe complexe requis
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Timeout de session (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={parametres.securite.sessionTimeout}
                    onChange={(e) => handleSecuriteChange('sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Connexions simultanées max</label>
                  <input
                    type="number"
                    className="form-control"
                    value={parametres.securite.connexionsSimultanees}
                    onChange={(e) => handleSecuriteChange('connexionsSimultanees', parseInt(e.target.value))}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaKey className="me-2 text-primary" />
                  Historique et logs
                </h6>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.securite.historiqueConnexions}
                      onChange={() => handleSecuriteChange('historiqueConnexions', !parametres.securite.historiqueConnexions)}
                    />
                    <label className="form-check-label">
                      Historique des connexions
                    </label>
                  </div>
                </div>
                <div className="card border-light">
                  <div className="card-body">
                    <h6 className="card-title">Changer le mot de passe</h6>
                    <div className="mb-3">
                      <label className="form-label">Ancien mot de passe</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Ancien mot de passe"
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
                        placeholder="Nouveau mot de passe"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirmer le mot de passe"
                      />
                    </div>
                    <button className="btn btn-warning">
                      <FaKey className="me-2" />
                      Changer le mot de passe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interface */}
          {activeTab === 'interface' && (
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaPalette className="me-2 text-primary" />
                  Apparence
                </h6>
                <div className="mb-3">
                  <label className="form-label">Thème</label>
                  <select
                    className="form-select"
                    value={parametres.interface.theme}
                    onChange={(e) => handleInterfaceChange('theme', e.target.value)}
                  >
                    {themes.map(theme => (
                      <option key={theme} value={theme}>
                        {theme === 'light' ? 'Clair' :
                         theme === 'dark' ? 'Sombre' : 'Automatique'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Langue</label>
                  <select
                    className="form-select"
                    value={parametres.interface.langue}
                    onChange={(e) => handleInterfaceChange('langue', e.target.value)}
                  >
                    {langues.map(langue => (
                      <option key={langue} value={langue}>
                        {langue === 'fr' ? 'Français' : 'English'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaClock className="me-2 text-primary" />
                  Date et heure
                </h6>
                <div className="mb-3">
                  <label className="form-label">Fuseau horaire</label>
                  <select
                    className="form-select"
                    value={parametres.interface.timezone}
                    onChange={(e) => handleInterfaceChange('timezone', e.target.value)}
                  >
                    {timezones.map(timezone => (
                      <option key={timezone} value={timezone}>{timezone}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Format de date</label>
                  <select
                    className="form-select"
                    value={parametres.interface.formatDate}
                    onChange={(e) => handleInterfaceChange('formatDate', e.target.value)}
                  >
                    {formatsDate.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Format d'heure</label>
                  <select
                    className="form-select"
                    value={parametres.interface.formatHeure}
                    onChange={(e) => handleInterfaceChange('formatHeure', e.target.value)}
                  >
                    {formatsHeure.map(format => (
                      <option key={format} value={format}>{format}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Stages */}
          {activeTab === 'stages' && (
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaHandshake className="me-2 text-primary" />
                  Gestion des stages
                </h6>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.stages.autoValidation}
                      onChange={() => handleStagesChange('autoValidation', !parametres.stages.autoValidation)}
                    />
                    <label className="form-check-label">
                      Validation automatique des stages
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Délai de réponse (jours)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={parametres.stages.delaiReponse}
                    onChange={(e) => handleStagesChange('delaiReponse', parseInt(e.target.value))}
                    min="1"
                    max="30"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.stages.evaluationObligatoire}
                      onChange={() => handleStagesChange('evaluationObligatoire', !parametres.stages.evaluationObligatoire)}
                    />
                    <label className="form-check-label">
                      Évaluation obligatoire
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.stages.rapportObligatoire}
                      onChange={() => handleStagesChange('rapportObligatoire', !parametres.stages.rapportObligatoire)}
                    />
                    <label className="form-check-label">
                      Rapport de stage obligatoire
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaUsers className="me-2 text-primary" />
                  Accompagnement
                </h6>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.stages.tuteurObligatoire}
                      onChange={() => handleStagesChange('tuteurObligatoire', !parametres.stages.tuteurObligatoire)}
                    />
                    <label className="form-check-label">
                      Tuteur obligatoire
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.stages.conventionObligatoire}
                      onChange={() => handleStagesChange('conventionObligatoire', !parametres.stages.conventionObligatoire)}
                    />
                    <label className="form-check-label">
                      Convention de stage obligatoire
                    </label>
                  </div>
                </div>
                <div className="card border-light">
                  <div className="card-body">
                    <h6 className="card-title">
                      <FaExclamationTriangle className="me-2 text-warning" />
                      Informations importantes
                    </h6>
                    <p className="card-text small">
                      Ces paramètres affectent le processus de gestion des stages.
                      Modifiez-les avec précaution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Entreprise */}
          {activeTab === 'entreprise' && (
            <div className="row">
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaBuilding className="me-2 text-primary" />
                  Visibilité
                </h6>
                <div className="mb-3">
                  <label className="form-label">Visibilité du profil</label>
                  <select
                    className="form-select"
                    value={parametres.entreprise.visibiliteProfil}
                    onChange={(e) => handleEntrepriseChange('visibiliteProfil', e.target.value)}
                  >
                    {visibilites.map(visibilite => (
                      <option key={visibilite} value={visibilite}>
                        {visibilite === 'public' ? 'Public' :
                         visibilite === 'prive' ? 'Privé' : 'Partiel'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={parametres.entreprise.acceptationAutomatique}
                      onChange={() => handleEntrepriseChange('acceptationAutomatique', !parametres.entreprise.acceptationAutomatique)}
                    />
                    <label className="form-check-label">
                      Acceptation automatique des candidatures
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Délai d'acceptation (jours)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={parametres.entreprise.delaiAcceptation}
                    onChange={(e) => handleEntrepriseChange('delaiAcceptation', parseInt(e.target.value))}
                    min="1"
                    max="30"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="mb-3">
                  <FaStar className="me-2 text-primary" />
                  Critères d'évaluation
                </h6>
                <div className="mb-3">
                  <label className="form-label">Critères d'évaluation des stagiaires</label>
                  <div className="border rounded p-3">
                    {parametres.entreprise.criteresEvaluation.map((critere, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <FaCheck className="me-2 text-success" />
                        <span>{critere}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-outline-primary btn-sm mt-2">
                    <FaEdit className="me-2" />
                    Modifier
                  </button>
                </div>
                <h6 className="mb-3">
                  <FaFileAlt className="me-2 text-primary" />
                  Documents requis
                </h6>
                <div className="mb-3">
                  <label className="form-label">Documents obligatoires</label>
                  <div className="border rounded p-3">
                    {parametres.entreprise.documentsObligatoires.map((document, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <FaCheck className="me-2 text-success" />
                        <span>{document}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-outline-primary btn-sm mt-2">
                    <FaEdit className="me-2" />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Parametres; 