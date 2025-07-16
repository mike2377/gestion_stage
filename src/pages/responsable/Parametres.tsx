import React, { useState, useEffect } from 'react';
// SUPPRIMER: import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  display: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
  workflow: {
    autoApproval: boolean;
    requireSignature: boolean;
    maxApplications: number;
  };
}

const Parametres: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    display: {
      theme: 'light',
      language: 'fr',
      timezone: 'Europe/Paris'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30
    },
    workflow: {
      autoApproval: false,
      requireSignature: true,
      maxApplications: 10
    }
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [universite, setUniversite] = useState<any>(null);
  const [universiteForm, setUniversiteForm] = useState<any>(null);
  const [universiteLoading, setUniversiteLoading] = useState(false);
  const [universiteSuccess, setUniversiteSuccess] = useState<string|null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.universiteId) return;
    setUniversiteLoading(true);
    getDoc(doc(db, 'universites', user.universiteId)).then(snap => {
      if (snap.exists()) {
        setUniversite(snap.data());
        setUniversiteForm(snap.data());
      }
      setUniversiteLoading(false);
    });
  }, [user]);

  const handleSettingChange = (category: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Paramètres sauvegardés avec succès !');
  };

  const handleUniversiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUniversiteForm({ ...universiteForm, [e.target.name]: e.target.value });
  };

  const handleUniversiteSave = async () => {
    if (!user || !user.universiteId) return;
    setUniversiteLoading(true);
    await updateDoc(doc(db, 'universites', user.universiteId), universiteForm);
    setUniversite(universiteForm);
    setUniversiteLoading(false);
    setUniversiteSuccess('Informations mises à jour !');
    setTimeout(() => setUniversiteSuccess(null), 2000);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-cog me-2 text-primary"></i>
                  Paramètres
                </h1>
                <p className="text-muted mb-0">
                  Configurez vos préférences et paramètres système
                </p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    Sauvegarder
                  </>
                )}
              </button>
            </div>

            <div className="row">
              <div className="col-md-3">
                <div className="card">
                  <div className="card-body">
                    <ul className="nav nav-pills flex-column">
                      <li className="nav-item">
                        <button 
                          className={`nav-link w-100 text-start ${activeTab === 'notifications' ? 'active' : ''}`}
                          onClick={() => setActiveTab('notifications')}
                        >
                          <i className="fas fa-bell me-2"></i>
                          Notifications
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link w-100 text-start ${activeTab === 'display' ? 'active' : ''}`}
                          onClick={() => setActiveTab('display')}
                        >
                          <i className="fas fa-palette me-2"></i>
                          Affichage
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link w-100 text-start ${activeTab === 'security' ? 'active' : ''}`}
                          onClick={() => setActiveTab('security')}
                        >
                          <i className="fas fa-shield-alt me-2"></i>
                          Sécurité
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link w-100 text-start ${activeTab === 'workflow' ? 'active' : ''}`}
                          onClick={() => setActiveTab('workflow')}
                        >
                          <i className="fas fa-project-diagram me-2"></i>
                          Workflow
                        </button>
                      </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link w-100 text-start ${activeTab === 'universite' ? 'active' : ''}`}
                      onClick={() => setActiveTab('universite')}
                    >
                      <i className="fas fa-university me-2"></i>
                      Université
                    </button>
                  </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="card">
                  <div className="card-body">
                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                      <div>
                        <h5 className="mb-4">
                          <i className="fas fa-bell me-2"></i>
                          Paramètres de notifications
                        </h5>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="emailNotifications"
                              checked={settings.notifications.email}
                              onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="emailNotifications">
                              Notifications par email
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="smsNotifications"
                              checked={settings.notifications.sms}
                              onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="smsNotifications">
                              Notifications par SMS
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="pushNotifications"
                              checked={settings.notifications.push}
                              onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="pushNotifications">
                              Notifications push
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Affichage */}
                    {activeTab === 'display' && (
                      <div>
                        <h5 className="mb-4">
                          <i className="fas fa-palette me-2"></i>
                          Paramètres d'affichage
                        </h5>
                        <div className="mb-3">
                          <label className="form-label">Thème</label>
                          <select 
                            className="form-select"
                            value={settings.display.theme}
                            onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                          >
                            <option value="light">Clair</option>
                            <option value="dark">Sombre</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Langue</label>
                          <select 
                            className="form-select"
                            value={settings.display.language}
                            onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                          >
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Fuseau horaire</label>
                          <select 
                            className="form-select"
                            value={settings.display.timezone}
                            onChange={(e) => handleSettingChange('display', 'timezone', e.target.value)}
                          >
                            <option value="Europe/Paris">Europe/Paris</option>
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">America/New_York</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Sécurité */}
                    {activeTab === 'security' && (
                      <div>
                        <h5 className="mb-4">
                          <i className="fas fa-shield-alt me-2"></i>
                          Paramètres de sécurité
                        </h5>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="twoFactor"
                              checked={settings.security.twoFactor}
                              onChange={(e) => handleSettingChange('security', 'twoFactor', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="twoFactor">
                              Authentification à deux facteurs
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Délai d'expiration de session (minutes)</label>
                          <input 
                            type="number" 
                            className="form-control"
                            value={settings.security.sessionTimeout}
                            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                            min="5"
                            max="480"
                          />
                        </div>
                      </div>
                    )}

                    {/* Workflow */}
                    {activeTab === 'workflow' && (
                      <div>
                        <h5 className="mb-4">
                          <i className="fas fa-project-diagram me-2"></i>
                          Paramètres de workflow
                        </h5>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="autoApproval"
                              checked={settings.workflow.autoApproval}
                              onChange={(e) => handleSettingChange('workflow', 'autoApproval', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="autoApproval">
                              Approbation automatique des stages
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id="requireSignature"
                              checked={settings.workflow.requireSignature}
                              onChange={(e) => handleSettingChange('workflow', 'requireSignature', e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="requireSignature">
                              Signature obligatoire des conventions
                            </label>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Nombre maximum de candidatures par stage</label>
                          <input 
                            type="number" 
                            className="form-control"
                            value={settings.workflow.maxApplications}
                            onChange={(e) => handleSettingChange('workflow', 'maxApplications', parseInt(e.target.value))}
                            min="1"
                            max="50"
                          />
                        </div>
                      </div>
                )}

                {/* Université */}
                {activeTab === 'universite' && (
                  <div>
                    <h5 className="mb-4">
                      <i className="fas fa-university me-2"></i>
                      Informations sur l'université
                    </h5>
                    {universiteLoading ? (
                      <div>Chargement...</div>
                    ) : universiteForm ? (
                      <form onSubmit={e => { e.preventDefault(); handleUniversiteSave(); }}>
                        <div className="mb-3">
                          <label className="form-label">Nom</label>
                          <input className="form-control" name="nom" value={universiteForm.nom || ''} onChange={handleUniversiteChange} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Adresse</label>
                          <input className="form-control" name="adresse" value={universiteForm.adresse || ''} onChange={handleUniversiteChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Téléphone</label>
                          <input className="form-control" name="telephone" value={universiteForm.telephone || ''} onChange={handleUniversiteChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Email</label>
                          <input className="form-control" name="email" value={universiteForm.email || ''} onChange={handleUniversiteChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Site web</label>
                          <input className="form-control" name="site_web" value={universiteForm.site_web || ''} onChange={handleUniversiteChange} />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea className="form-control" name="description" value={universiteForm.description || ''} onChange={handleUniversiteChange} />
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={universiteLoading}>
                          {universiteLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                        {universiteSuccess && <span className="text-success ms-3">{universiteSuccess}</span>}
                      </form>
                    ) : (
                      <div className="alert alert-warning">Aucune information d'université trouvée.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parametres; 