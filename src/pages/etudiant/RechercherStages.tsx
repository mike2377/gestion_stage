import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';
// Supprimer : import Sidebar from '../../components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import styles from '../../styles/pages/RechercherStages.module.css';

interface StageOffer {
  id: number;
  title: string;
  enterprise: string;
  description: string;
  duration: string;
  location: string;
  salary: number;
  applications: number;
  domain: string;
  requirements: string[];
  startDate: string;
  endDate: string;
  isNew: boolean;
  isUrgent: boolean;
  technologies?: string[];
  logoEntreprise?: string; // Added for the new logo
  entrepriseId?: string; // Added for the new entrepriseId
}

const RechercherStages: React.FC = () => {
  const [offers, setOffers] = useState<StageOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<StageOffer[]>([]);
  const [filters, setFilters] = useState({
    domain: '',
    location: '',
    duration: '',
    keywords: ''
  });
  // Supprimer : const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<StageOffer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [entrepriseInfo, setEntrepriseInfo] = useState<any | null>(null);
  const [enterpriseNames, setEnterpriseNames] = useState<{ [entrepriseId: string]: string }>({});
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState<{ [offerId: string]: boolean }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [etudiantInfo, setEtudiantInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Charger les offres actives depuis Firestore et les noms d'entreprise
  useEffect(() => {
    const fetchOffers = async () => {
      const q = query(collection(db, 'offres_stage'), where('statut', '==', 'active'));
      const snap = await getDocs(q);
      const offres = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.titre || data.title || '',
          entrepriseId: data.entrepriseId || '',
          logoEntreprise: data.logoEntreprise || '',
          description: data.description || '',
          duration: data.duree ? `${data.duree} mois` : '',
          location: [data.adresseEntrepise, data.villeEntreprise].filter(Boolean).join(', '),
          salary: data.remuneration || 0,
          applications: data.nbCandidatures || 0,
          domain: data.domaine || '',
          requirements: data.exigences || [],
          startDate: data.dateDebut || '',
          endDate: data.dateFin || '',
          isNew: !!data.isNew,
          isUrgent: !!data.urgent,
          technologies: data.technologies || []
        };
      });
      setOffers(offres);
      setFilteredOffers(offres);
      // Charger les noms d'entreprise en batch
      const uniqueEntrepriseIds = Array.from(new Set(offres.map(o => o.entrepriseId).filter(Boolean)));
      const names: { [entrepriseId: string]: string } = {};
      await Promise.all(uniqueEntrepriseIds.map(async (id) => {
        try {
          const ref = doc(db, 'entreprises', id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            names[id] = snap.data().nom || '';
          }
        } catch {}
      }));
      setEnterpriseNames(names);
    };
    fetchOffers();
  }, []);

  // Récupérer les infos de l'étudiant au chargement
  useEffect(() => {
    const fetchEtudiantInfo = async () => {
      if (!user?.uid) return;
      try {
        const etudiantDoc = await getDoc(doc(db, 'etudiants', user.uid));
        if (etudiantDoc.exists()) {
          setEtudiantInfo(etudiantDoc.data());
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos étudiant:', error);
      }
    };
    fetchEtudiantInfo();
  }, [user]);

  useEffect(() => {
    console.log('user:', user);
    console.log('etudiantInfo:', etudiantInfo);
  }, [user, etudiantInfo]);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: typeof filters) => {
    let filtered = offers;

    if (currentFilters.domain) {
      filtered = filtered.filter(offer => offer.domain === currentFilters.domain);
    }
    if (currentFilters.location) {
      filtered = filtered.filter(offer => offer.location === currentFilters.location);
    }
    if (currentFilters.duration) {
      filtered = filtered.filter(offer => {
        const duration = parseInt(offer.duration.split(' ')[0]);
        switch (currentFilters.duration) {
          case '1-3 mois':
            return duration <= 3;
          case '3-6 mois':
            return duration > 3 && duration <= 6;
          case '6+ mois':
            return duration > 6;
          default:
            return true;
        }
      });
    }
    if (currentFilters.keywords) {
      const keywords = currentFilters.keywords.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(keywords) ||
        offer.description.toLowerCase().includes(keywords) ||
        offer.enterprise.toLowerCase().includes(keywords) ||
        offer.requirements.some(req => req.toLowerCase().includes(keywords))
      );
    }

    // Appliquer le tri
    applySorting(filtered);
  };

  const applySorting = (offersToSort: StageOffer[]) => {
    let sorted = [...offersToSort];
    
    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'salary':
        sorted.sort((a, b) => b.salary - a.salary);
        break;
      case 'applications':
        sorted.sort((a, b) => a.applications - b.applications);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    setFilteredOffers(sorted);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    applySorting(filteredOffers);
  };

  // S'assurer qu'aucune donnée simulée/mock n'est utilisée, tout doit venir de Firestore ou du contexte utilisateur.
  // Fonction pour charger les infos entreprise lors de l'ouverture de la modale
  const handleShowDetails = async (offer: StageOffer) => {
    setSelectedOffer(offer);
    setShowDetailsModal(true);
    setEntrepriseInfo(null);
    if (offer.entrepriseId) {
      try {
        const ref = doc(db, 'entreprises', offer.entrepriseId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setEntrepriseInfo(snap.data());
        }
      } catch (e) {
        setEntrepriseInfo(null);
      }
    }
  };

  // Vérifier si déjà postulé à l'ouverture de la modale
  const handleShowApply = async (offer: StageOffer) => {
    setSelectedOffer(offer);
    setShowApplyModal(true);
    if (user?.uid && offer.id) {
      const q = query(collection(db, 'candidatures'), where('offreId', '==', offer.id), where('etudiantId', '==', user.uid));
      const snap = await getDocs(q);
      setHasApplied(prev => ({ ...prev, [offer.id]: !snap.empty }));
    }
  };

  // Gérer la sélection du fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        toast.error('Le fichier est trop volumineux. Maximum 5MB.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validTypes.includes(fileExtension)) {
        toast.error('Format de fichier non supporté. Utilisez PDF, DOC ou DOCX.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setSelectedFile(file);
    }
  };

  // Fonction pour postuler
  const handleApply = async () => {
    console.log('handleApply champs:', {
      userUid: user?.uid,
      selectedOffer,
      selectedFile
    });
    if (!user?.uid || !selectedOffer || !selectedFile) {
      toast.error('Veuillez remplir tous les champs requis.');
      return;
    }

    setIsApplying(true);
    try {
      // Vérifier si déjà postulé
      const q = query(
        collection(db, 'candidatures'),
        where('offreId', '==', selectedOffer.id),
        where('etudiantId', '==', user.uid)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        toast.info('Vous avez déjà postulé à cette offre.');
        setIsApplying(false);
        setHasApplied(prev => ({ ...prev, [selectedOffer.id]: true }));
        return;
      }

      // Upload du CV
      const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
      const cvFileName = `cv_${user.uid}_${Date.now()}${fileExtension}`;
      const cvRef = ref(storage, `cv/${cvFileName}`);
      await uploadBytes(cvRef, selectedFile);
      const cvUrl = await getDownloadURL(cvRef);

      // Créer la candidature
      await addDoc(collection(db, 'candidatures'), {
        offreId: selectedOffer.id,
        entrepriseId: selectedOffer.entrepriseId,
        etudiantId: user.uid,
        cvUrl: cvUrl,
        date: new Date().toISOString(),
        statut: 'en_attente'
      });

      toast.success('Votre candidature a bien été envoyée !');
      setHasApplied(prev => ({ ...prev, [selectedOffer.id]: true }));
      setShowApplyModal(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
      toast.error('Erreur lors de l\'envoi de la candidature. Veuillez réessayer.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        {/* Supprimer : div className={`col-auto ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}> */}
        {/* Supprimer : <Sidebar 
            user={user} 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          /> */}
        <div className="col">
          <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-search me-2 text-primary"></i>
                  Rechercher des Stages
                </h1>
                <p className="text-muted mb-0">
                  Trouvez le stage qui correspond à vos compétences et aspirations
                </p>
              </div>
            </div>

            {/* Filtres de recherche */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fas fa-filter me-2"></i>Filtres de recherche
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Domaine</label>
                    <select 
                      className="form-select"
                      value={filters.domain}
                      onChange={(e) => handleFilterChange('domain', e.target.value)}
                    >
                      <option value="">Tous les domaines</option>
                      <option value="Informatique">Informatique</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Commerce">Commerce</option>
                      <option value="Data/Analyse">Data/Analyse</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Localisation</label>
                    <select 
                      className="form-select"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    >
                      <option value="">Toutes les localisations</option>
                      <option value="Paris">Paris</option>
                      <option value="Lyon">Lyon</option>
                      <option value="Marseille">Marseille</option>
                      <option value="Toulouse">Toulouse</option>
                      <option value="Bordeaux">Bordeaux</option>
                      <option value="Nantes">Nantes</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Durée</label>
                    <select 
                      className="form-select"
                      value={filters.duration}
                      onChange={(e) => handleFilterChange('duration', e.target.value)}
                    >
                      <option value="">Toutes les durées</option>
                      <option value="1-3 mois">1-3 mois</option>
                      <option value="3-6 mois">3-6 mois</option>
                      <option value="6+ mois">6+ mois</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ domain: '', location: '', duration: '', keywords: '' });
                        setFilteredOffers(offers);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Rechercher par mots-clés (développeur, marketing, data...)"
                        value={filters.keywords}
                        onChange={(e) => handleFilterChange('keywords', e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Résultats */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Offres trouvées ({filteredOffers.length})</h4>
              <div className="d-flex gap-2">
                <select 
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  style={{ width: 'auto' }}
                >
                  <option value="date">Trier par date</option>
                  <option value="salary">Trier par salaire</option>
                  <option value="applications">Trier par candidatures</option>
                  <option value="title">Trier par titre</option>
                </select>
              </div>
            </div>

            {/* Cartes des offres */}
            {filteredOffers.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search fa-4x text-muted mb-3"></i>
                <h5 className="text-muted">Aucune offre trouvée</h5>
                <p className="text-muted">Aucune offre ne correspond à vos critères de recherche.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setFilters({ domain: '', location: '', duration: '', keywords: '' });
                    setFilteredOffers(offers);
                  }}
                >
                  <i className="fas fa-times me-2"></i>Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {filteredOffers.map((offer) => (
                  <div key={offer.id} className="col-md-6 col-lg-4">
                    <div className={styles['offer-card']}>
                      {/* Header visuel aligné */}
                      <div className="d-flex align-items-center offer-card-visual p-3 pb-0 gap-3">
                        {/* Logo entreprise ou avatar */}
                        {offer.logoEntreprise ? (
                          <img src={offer.logoEntreprise} alt="Logo entreprise" style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: '50%', border: '2.5px solid #e0e7ef', background: '#fff', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }} />
                        ) : (
                          <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#f0f4fa', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: '#2563eb', border: '2.5px solid #e0e7ef', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
                            <i className="fas fa-building"></i>
                          </div>
                        )}
                        <div className="flex-grow-1 d-flex flex-column align-items-start justify-content-center">
                          <div className={styles['offer-card-title']}>
                            {enterpriseNames[offer.entrepriseId] || ''}
                          </div>
                          <span className="badge bg-primary mt-1" style={{ fontSize: 13, fontWeight: 500, borderRadius: 8 }}><i className="fas fa-briefcase me-1"></i>{offer.domain}</span>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-1">
                            {offer.isNew && (
                            <span className="badge bg-success px-3 py-2 fs-6">Nouveau</span>
                            )}
                            {offer.isUrgent && (
                            <span className="badge bg-danger px-3 py-2 fs-6">Urgent</span>
                            )}
                          </div>
                        </div>
                      <div className="card-body d-flex flex-column">
                        <h5 className={styles['offer-card-title']}>
                          {offer.title}
                        </h5>
                        <p className="card-text mb-2" style={{ minHeight: 60, color: '#444', fontSize: 15 }}>
                          {offer.description.length > 120 
                            ? `${offer.description.substring(0, 120)}...` 
                            : offer.description
                          }
                        </p>
                        {/* Chips infos */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge rounded-pill bg-info text-white px-3 py-2"><i className="fas fa-clock me-1"></i>{offer.duration}</span>
                          <span className="badge rounded-pill bg-secondary text-white px-3 py-2"><i className="fas fa-map-marker-alt me-1"></i>{offer.location}</span>
                          <span className="badge rounded-pill bg-warning text-dark px-3 py-2"><i className="fas fa-coins me-1"></i>{offer.salary} FCFA/mois</span>
                          <span className="badge rounded-pill bg-light text-dark border px-3 py-2"><i className="fas fa-users me-1"></i>{offer.applications} candidatures</span>
                        </div>
                        {/* Technologies */}
                        {offer.technologies && offer.technologies.length > 0 && (
                          <div className="mb-2 d-flex flex-wrap gap-1">
                            {offer.technologies.slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="badge bg-light text-dark border border-primary fw-normal" style={{ fontSize: 13 }}>
                                <i className="fas fa-code me-1 text-primary"></i>{tech}
                                </span>
                              ))}
                              {offer.technologies.length > 3 && (
                              <span className="badge bg-light text-dark border border-primary" style={{ fontSize: 13 }}>+{offer.technologies.length - 3}</span>
                              )}
                          </div>
                        )}
                        <div className="mt-auto d-flex gap-2">
                          <button 
                            className="btn btn-primary flex-fill shadow-sm rounded-pill px-3 py-2"
                            style={{ fontWeight: 500, fontSize: 16, letterSpacing: 0.2 }}
                            onClick={() => handleShowDetails(offer)}
                          >
                            <i className="fas fa-eye me-2"></i>Voir détails
                          </button>
                          <button 
                            className="btn btn-outline-success flex-fill shadow-sm rounded-pill px-3 py-2"
                            style={{ fontWeight: 500, fontSize: 16, letterSpacing: 0.2 }}
                            onClick={() => handleShowApply(offer)}
                            title="Postuler"
                          >
                            <i className="fas fa-paper-plane"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Détails Offre */}
      {showDetailsModal && selectedOffer && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-briefcase me-2"></i>
                  {selectedOffer.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>Informations stage
                    </h6>
                    <p><strong>Intitulé:</strong> {selectedOffer.title}</p>
                    <p><strong>Entreprise:</strong> {entrepriseInfo?.nom || selectedOffer.enterprise}</p>
                    <p><strong>Domaine:</strong> {selectedOffer.domain}</p>
                    <p><strong>Durée:</strong> {selectedOffer.duration}</p>
                    <p><strong>Localisation:</strong> {selectedOffer.location}</p>
                    <p><strong>Gratification:</strong> {selectedOffer.salary} FCFA/mois</p>
                    <p><strong>Début:</strong> {selectedOffer.startDate}</p>
                    <p><strong>Fin:</strong> {selectedOffer.endDate}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-building me-2"></i>Informations entreprise
                    </h6>
                    {entrepriseInfo ? (
                      <>
                        <p><strong>Nom:</strong> {entrepriseInfo.nom}</p>
                        <p><strong>Email:</strong> {entrepriseInfo.email}</p>
                        <p><strong>Téléphone:</strong> {entrepriseInfo.telephone}</p>
                        <p><strong>Adresse:</strong> {entrepriseInfo.adresse}, {entrepriseInfo.ville}, {entrepriseInfo.pays}</p>
                        <p><strong>Secteur:</strong> {entrepriseInfo.secteur}</p>
                        {entrepriseInfo.contact && (
                          <p><strong>Contact principal:</strong> {entrepriseInfo.contact.prenom} {entrepriseInfo.contact.nom} ({entrepriseInfo.contact.poste})</p>
                        )}
                      </>
                    ) : (
                      <div className="text-muted">Chargement des informations...</div>
                    )}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-align-left me-2"></i>Description du stage
                    </h6>
                    <p>{selectedOffer.description}</p>
                  </div>
                </div>
                {selectedOffer.requirements.length > 0 && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-list me-2"></i>Compétences requises
                        </h6>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedOffer.requirements.map((req, index) => (
                            <span key={index} className="badge bg-primary">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fermer
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowApplyModal(true);
                  }}
                >
                  <i className="fas fa-paper-plane me-2"></i>Postuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Postuler */}
      {showApplyModal && selectedOffer && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-paper-plane me-2"></i>
                  Postuler - {selectedOffer.title}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowApplyModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Vous êtes sur le point de postuler au stage "{selectedOffer.title}" chez <strong>{enterpriseNames[selectedOffer.entrepriseId] || ''}</strong>.
                </div>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Importer votre CV *</label>
                    <input
                      type="file"
                      className="form-control" 
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      required
                    />
                    <small className="text-muted">Formats acceptés : PDF, DOC, DOCX (max 5MB)</small>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="confirmApply" required />
                    <label className="form-check-label" htmlFor="confirmApply">
                      Je confirme que les informations fournies sont exactes
                    </label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApplyModal(false)}
                >
                  Annuler
                </button>
                <button type="button" className="btn btn-success" onClick={handleApply} disabled={isApplying || hasApplied[selectedOffer.id]}>
                  {isApplying ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fas fa-paper-plane me-2"></i>}
                  {hasApplied[selectedOffer.id] ? 'Déjà postulé' : 'Envoyer ma candidature'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechercherStages; 