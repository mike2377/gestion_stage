import React, { useState, useEffect } from 'react';
import { FaHandshake, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaEye, FaCheckCircle, FaClock, FaExclamationTriangle, FaCalendarAlt, FaUsers, FaFileAlt, FaDownload, FaEnvelope, FaSort, FaSortUp, FaSortDown, FaMapMarkerAlt, FaIndustry, FaGraduationCap, FaStar, FaBriefcase } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where, doc, getDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';

interface OffreStage {
  id: string;
  titre: string;
  description: string;
  duree: string;
  lieu: string;
  remuneration: number;
  nbCandidatures: number;
  domaine: string;
  exigences: string[];
  dateDebut: string;
  dateFin: string;
  statut: 'active' | 'inactive' | 'brouillon' | 'expiree';
  creeLe: string;
  modifieLe: string;
  technologies?: string[];
  nbCandidaturesMax?: number;
  urgent: boolean;
  enVedette: boolean;
  adresseEntreprise?: string;
  villeEntreprise?: string;
}

const MesOffres: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<OffreStage[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<OffreStage[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    domain: '',
    keywords: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entrepriseInfo, setEntrepriseInfo] = useState<{ adresse?: string; ville?: string; secteur?: string } | null>(null);
  const [stats, setStats] = useState({
    offresActives: 0,
    offresBrouillon: 0,
    offresInactives: 0,
    offresExpirees: 0
  });

  // Ajout pour la modale d'ajout d'offre
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    titre: '',
    description: '',
    domaine: '',
    autreDomaine: '',
    duree: '',
    lieu: '',
    remuneration: 0,
    exigences: '',
    dateDebut: '',
    dateFin: '',
    nbCandidaturesMax: 0,
    statut: 'active',
    technologies: '',
    urgent: false,
    enVedette: false
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OffreStage | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Voir
  const handleView = (offer: OffreStage) => {
    setSelectedOffer(offer);
    setShowViewModal(true);
  };

  // Éditer
  const handleEdit = (offer: OffreStage) => {
    setSelectedOffer(offer);
    setNewOffer({
      ...offer,
      exigences: Array.isArray(offer.exigences) ? offer.exigences.join(', ') : offer.exigences || '',
      technologies: Array.isArray(offer.technologies) ? offer.technologies.join(', ') : offer.technologies || '',
      autreDomaine: '',
    });
    setShowEditModal(true);
  };

  // Supprimer
  const handleDelete = (offer: OffreStage) => {
    setSelectedOffer(offer);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedOffer) return;
    try {
      await deleteDoc(doc(db, 'offres_stage', selectedOffer.id));
      setSuccessMsg('Offre supprimée avec succès !');
      setShowDeleteConfirm(false);
      setSelectedOffer(null);
      // Rafraîchir la liste
      if (user && user.entrepriseId) {
        setLoading(true);
        const q = query(collection(db, 'offres_stage'), where('entrepriseId', '==', user.entrepriseId));
        const snap = await getDocs(q);
        const offres: OffreStage[] = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            titre: data.titre || '',
            description: data.description || '',
            duree: data.duree || '',
            lieu: data.lieu || '',
            remuneration: data.remuneration || 0,
            nbCandidatures: data.nbCandidatures || 0,
            domaine: data.domaine || '',
            exigences: data.exigences || [],
            dateDebut: data.dateDebut || '',
            dateFin: data.dateFin || '',
            statut: data.statut || 'active',
            creeLe: data.creeLe || '',
            modifieLe: data.modifieLe || '',
            technologies: data.technologies || [],
            nbCandidaturesMax: data.nbCandidaturesMax || 0,
            urgent: data.urgent || false,
            enVedette: data.enVedette || false,
            adresseEntreprise: data.adresseEntreprise || '',
            villeEntreprise: data.villeEntreprise || ''
          };
        });
        setOffers(offres);
        setFilteredOffers(offres);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("Erreur lors de la suppression de l'offre.");
    }
  };

  // Sauvegarder la modification
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    const domaineFinal = newOffer.domaine === 'Autre' ? newOffer.autreDomaine : newOffer.domaine;
    const offreAEnvoyer = {
      ...newOffer,
      domaine: domaineFinal,
      exigences: newOffer.exigences.split(',').map(s => s.trim()).filter(Boolean),
      technologies: newOffer.technologies.split(',').map(s => s.trim()).filter(Boolean),
      entrepriseId: user?.entrepriseId,
      nomEntreprise: user?.nom || user?.nomEntreprise || '',
      villeEntreprise: entrepriseInfo?.ville || '',
      adresseEntreprise: entrepriseInfo?.adresse || '',
      modifieLe: new Date().toISOString()
    };
    try {
      await updateDoc(doc(db, 'offres_stage', selectedOffer.id), offreAEnvoyer);
      setShowEditModal(false);
      setSuccessMsg('Offre modifiée avec succès !');
      setSelectedOffer(null);
      setNewOffer({
        titre: '',
        description: '',
        domaine: '',
        autreDomaine: '',
        duree: '',
        lieu: '',
        remuneration: 0,
        exigences: '',
        dateDebut: '',
        dateFin: '',
        nbCandidaturesMax: 0,
        statut: 'active',
        technologies: '',
        urgent: false,
        enVedette: false
      });
      // Rafraîchir la liste
      if (user && user.entrepriseId) {
        setLoading(true);
        const q = query(collection(db, 'offres_stage'), where('entrepriseId', '==', user.entrepriseId));
        const snap = await getDocs(q);
        const offres: OffreStage[] = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            titre: data.titre || '',
            description: data.description || '',
            duree: data.duree || '',
            lieu: data.lieu || '',
            remuneration: data.remuneration || 0,
            nbCandidatures: data.nbCandidatures || 0,
            domaine: data.domaine || '',
            exigences: data.exigences || [],
            dateDebut: data.dateDebut || '',
            dateFin: data.dateFin || '',
            statut: data.statut || 'active',
            creeLe: data.creeLe || '',
            modifieLe: data.modifieLe || '',
            technologies: data.technologies || [],
            nbCandidaturesMax: data.nbCandidaturesMax || 0,
            urgent: data.urgent || false,
            enVedette: data.enVedette || false,
            adresseEntreprise: data.adresseEntreprise || '',
            villeEntreprise: data.villeEntreprise || ''
          };
        });
        setOffers(offres);
        setFilteredOffers(offres);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("Erreur lors de la modification de l'offre.");
    }
  };

  const domaines = [
    'Informatique',
    'Marketing',
    'Ressources humaines',
    'Industrie',
    'Finance',
    'Santé',
    'Communication',
    'Logistique',
    'Juridique',
    'Autre'
  ];

  const handleNewOfferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setNewOffer(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'remuneration' || name === 'nbCandidaturesMax') {
      setNewOffer(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setNewOffer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const domaineFinal = newOffer.domaine === 'Autre' ? newOffer.autreDomaine : newOffer.domaine;
    const offreAEnvoyer = {
      ...newOffer,
      domaine: domaineFinal,
      exigences: newOffer.exigences.split(',').map(s => s.trim()).filter(Boolean),
      technologies: newOffer.technologies.split(',').map(s => s.trim()).filter(Boolean),
      entrepriseId: user?.entrepriseId,
      nomEntreprise: user?.nom || user?.nomEntreprise || '',
      villeEntreprise: entrepriseInfo?.ville || '',
      adresseEntreprise: entrepriseInfo?.adresse || '',
      creeLe: new Date().toISOString()
    };
    try {
      await addDoc(collection(db, 'offres_stage'), offreAEnvoyer);
      setShowAddModal(false);
      setSuccessMsg('Offre ajoutée avec succès !');
      setNewOffer({
        titre: '',
        description: '',
        domaine: '',
        autreDomaine: '',
        duree: '',
        lieu: '',
        remuneration: 0,
        exigences: '',
        dateDebut: '',
        dateFin: '',
        nbCandidaturesMax: 0,
        statut: 'active',
        technologies: '',
        urgent: false,
        enVedette: false
      });
      // Recharge la liste des offres
      if (user && user.entrepriseId) {
        setLoading(true);
        const q = query(collection(db, 'offres_stage'), where('entrepriseId', '==', user.entrepriseId));
        const snap = await getDocs(q);
        const offres: OffreStage[] = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            titre: data.titre || '',
            description: data.description || '',
            duree: data.duree || '',
            lieu: data.lieu || '',
            remuneration: data.remuneration || 0,
            nbCandidatures: data.nbCandidatures || 0,
            domaine: data.domaine || '',
            exigences: data.exigences || [],
            dateDebut: data.dateDebut || '',
            dateFin: data.dateFin || '',
            statut: data.statut || 'active',
            creeLe: data.creeLe || '',
            modifieLe: data.modifieLe || '',
            technologies: data.technologies || [],
            nbCandidaturesMax: data.nbCandidaturesMax || 0,
            urgent: data.urgent || false,
            enVedette: data.enVedette || false,
            adresseEntreprise: data.adresseEntreprise || '',
            villeEntreprise: data.villeEntreprise || ''
          };
        });
        setOffers(offres);
        setFilteredOffers(offres);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("Erreur lors de l'ajout de l'offre.");
    }
  };

  useEffect(() => {
    if (!user || !user.entrepriseId) return;
    setLoading(true);
    setError(null);
    const fetchOffers = async () => {
      try {
        const q = query(collection(db, 'offres_stage'), where('entrepriseId', '==', user.entrepriseId));
        const snap = await getDocs(q);
        const offres: OffreStage[] = snap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            titre: data.titre || '',
            description: data.description || '',
            duree: data.duree || '',
            lieu: data.lieu || '',
            remuneration: data.remuneration || 0,
            nbCandidatures: data.nbCandidatures || 0,
            domaine: data.domaine || '',
            exigences: data.exigences || [],
            dateDebut: data.dateDebut || '',
            dateFin: data.dateFin || '',
            statut: data.statut || 'active',
            creeLe: data.creeLe || '',
            modifieLe: data.modifieLe || '',
            technologies: data.technologies || [],
            nbCandidaturesMax: data.nbCandidaturesMax || 0,
            urgent: data.urgent || false,
            enVedette: data.enVedette || false,
            adresseEntreprise: data.adresseEntreprise || '',
            villeEntreprise: data.villeEntreprise || ''
          };
        });
        setOffers(offres);
        setFilteredOffers(offres);
      } catch (e: any) {
        setError('Erreur lors du chargement des offres.');
      }
      setLoading(false);
    };
    fetchOffers();
  }, [user]);

  useEffect(() => {
    if (!user || !user.entrepriseId) return;
    const fetchEntreprise = async () => {
      const ref = doc(db, 'entreprises', user.entrepriseId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setEntrepriseInfo({ adresse: data.adresse, ville: data.ville, secteur: data.secteur });
      } else {
        setEntrepriseInfo(null);
      }
    };
    fetchEntreprise();
  }, [user]);

  // Pré-remplir le domaine avec le secteur de l'entreprise à l'ouverture de la modale
  useEffect(() => {
    if (showAddModal && entrepriseInfo?.secteur && !newOffer.domaine) {
      setNewOffer(prev => ({ ...prev, domaine: entrepriseInfo.secteur }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddModal, entrepriseInfo]);

  // Calculer les stats quand les offres changent
  useEffect(() => {
    const offresActives = offers.filter(o => o.statut === 'active').length;
    const offresBrouillon = offers.filter(o => o.statut === 'brouillon').length;
    const offresInactives = offers.filter(o => o.statut === 'inactive').length;
    const offresExpirees = offers.filter(o => o.statut === 'expiree').length;
    setStats({ offresActives, offresBrouillon, offresInactives, offresExpirees });
  }, [offers]);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = offers;
    if (newFilters.status) {
      filtered = filtered.filter(o => o.statut === newFilters.status);
    }
    if (newFilters.domain) {
      filtered = filtered.filter(o => o.domaine === newFilters.domain);
    }
    if (newFilters.keywords) {
      filtered = filtered.filter(o =>
        o.titre.toLowerCase().includes(newFilters.keywords.toLowerCase()) ||
        o.description.toLowerCase().includes(newFilters.keywords.toLowerCase())
      );
    }
    setFilteredOffers(filtered);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0"><FaHandshake className="me-2 text-primary" />Mes Offres</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}><FaPlus className="me-2" />Nouvelle offre</button>
      </div>

      {/* Statistiques des offres */}
      <div className="row mb-4 g-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-success text-white">
            <div className="card-body d-flex align-items-center">
              <FaBriefcase className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.offresActives}</h4>
                <p className="mb-0">Offres actives</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-warning text-white">
            <div className="card-body d-flex align-items-center">
              <FaBriefcase className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.offresBrouillon}</h4>
                <p className="mb-0">Brouillons</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-secondary text-white">
            <div className="card-body d-flex align-items-center">
              <FaBriefcase className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.offresInactives}</h4>
                <p className="mb-0">Offres inactives</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 bg-danger text-white">
            <div className="card-body d-flex align-items-center">
              <FaBriefcase className="fa-2x me-3 opacity-75" />
              <div>
                <h4 className="mb-0">{stats.offresExpirees}</h4>
                <p className="mb-0">Offres expirées</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de répartition des offres */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Actives</span>
              <span className="text-success">{stats.offresActives} ({Math.round(stats.offresActives / offers.length * 100 || 0)}%)</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div className="progress-bar bg-success" style={{ width: `${stats.offresActives / offers.length * 100 || 0}%` }}></div>
            </div>
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Brouillons</span>
              <span className="text-warning">{stats.offresBrouillon} ({Math.round(stats.offresBrouillon / offers.length * 100 || 0)}%)</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div className="progress-bar bg-warning" style={{ width: `${stats.offresBrouillon / offers.length * 100 || 0}%` }}></div>
            </div>
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Inactives</span>
              <span className="text-secondary">{stats.offresInactives} ({Math.round(stats.offresInactives / offers.length * 100 || 0)}%)</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div className="progress-bar bg-secondary" style={{ width: `${stats.offresInactives / offers.length * 100 || 0}%` }}></div>
            </div>
          </div>
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span>Expirées</span>
              <span className="text-danger">{stats.offresExpirees} ({Math.round(stats.offresExpirees / offers.length * 100 || 0)}%)</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div className="progress-bar bg-danger" style={{ width: `${stats.offresExpirees / offers.length * 100 || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modale d'ajout d'offre */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nouvelle offre de stage</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddOffer}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {/* Informations principales */}
                  <h6 className="mb-3 mt-2 text-primary">Informations principales</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Titre du poste</label>
                      <input type="text" className="form-control" name="titre" value={newOffer.titre} onChange={handleNewOfferChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Domaine</label>
                      <select className="form-select" name="domaine" value={newOffer.domaine} onChange={handleNewOfferChange} required>
                        <option value="">Sélectionner un domaine</option>
                        {domaines.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    {newOffer.domaine === 'Autre' && (
                      <div className="col-md-6">
                        <label className="form-label">Précisez le domaine</label>
                        <input type="text" className="form-control" name="autreDomaine" value={newOffer.autreDomaine} onChange={handleNewOfferChange} required />
                      </div>
                    )}
                    <div className="col-12">
                      <label className="form-label">Description du poste</label>
                      <textarea className="form-control" name="description" value={newOffer.description} onChange={handleNewOfferChange} required rows={2} />
                    </div>
                  </div>
                  {/* Détails */}
                  <h6 className="mb-3 mt-4 text-primary">Détails de l'offre</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Durée (en mois)</label>
                      <input type="number" className="form-control" name="duree" value={newOffer.duree} onChange={handleNewOfferChange} min={1} required placeholder="ex: 6" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Localisation</label>
                      <input type="text" className="form-control" value={ entrepriseInfo ? (entrepriseInfo.adresse || '') + (entrepriseInfo.ville ? ', ' + entrepriseInfo.ville : '') : 'Chargement...' } disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de début</label>
                      <input type="date" className="form-control" name="dateDebut" value={newOffer.dateDebut} onChange={handleNewOfferChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de fin</label>
                      <input type="date" className="form-control" name="dateFin" value={newOffer.dateFin} onChange={handleNewOfferChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rémunération (FCFA)</label>
                      <input type="number" className="form-control" name="remuneration" value={newOffer.remuneration} onChange={handleNewOfferChange} min={0} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre de candidatures max</label>
                      <input type="number" className="form-control" name="nbCandidaturesMax" value={newOffer.nbCandidaturesMax} onChange={handleNewOfferChange} min={0} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Statut</label>
                      <select className="form-select" name="statut" value={newOffer.statut} onChange={handleNewOfferChange} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="brouillon">Brouillon</option>
                        <option value="expiree">Expirée</option>
                      </select>
                    </div>
                  </div>
                  {/* Compétences et options */}
                  <h6 className="mb-3 mt-4 text-primary">Compétences & options</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Exigences <span className="text-muted">(séparées par des virgules)</span></label>
                      <input type="text" className="form-control" name="exigences" value={newOffer.exigences} onChange={handleNewOfferChange} placeholder="ex: autonomie, rigueur, anglais" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Technologies <span className="text-muted">(séparées par des virgules)</span></label>
                      <input type="text" className="form-control" name="technologies" value={newOffer.technologies} onChange={handleNewOfferChange} placeholder="ex: Node.js, Excel, Photoshop" />
                    </div>
                    <div className="col-md-6 d-flex align-items-center mt-2">
                      <input className="form-check-input me-2" type="checkbox" name="urgent" id="urgent" checked={newOffer.urgent} onChange={handleNewOfferChange} />
                      <label className="form-check-label" htmlFor="urgent">Urgent</label>
                    </div>
                    <div className="col-md-6 d-flex align-items-center mt-2">
                      <input className="form-check-input me-2" type="checkbox" name="enVedette" id="enVedette" checked={newOffer.enVedette} onChange={handleNewOfferChange} />
                      <label className="form-check-label" htmlFor="enVedette">En vedette</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {successMsg && <div className="alert alert-success my-2">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger my-2">{errorMsg}</div>}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Statut</label>
              <select className="form-select" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
                <option value="">Tous</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="brouillon">Brouillon</option>
                <option value="expiree">Expirée</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Domaine</label>
              <input type="text" className="form-control" value={filters.domain} onChange={e => handleFilterChange('domain', e.target.value)} placeholder="Domaine" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Mots-clés</label>
              <input type="text" className="form-control" value={filters.keywords} onChange={e => handleFilterChange('keywords', e.target.value)} placeholder="Recherche..." />
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Domaine</th>
                <th>Lieu</th>
                <th>Durée</th>
                <th>Rémunération</th>
                <th>Statut</th>
                <th>Candidatures</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-muted">Aucune offre trouvée</td></tr>
              ) : filteredOffers.map(offer => (
                <tr key={offer.id}>
                  <td>{offer.titre}</td>
                  <td>{offer.domaine}</td>
                  <td>{
                    [offer.adresseEntrepise, offer.villeEntreprise].filter(Boolean).join(', ') || 'Non renseigné'
                  }</td>
                  <td>{offer.duree}</td>
                  <td>{offer.remuneration} FCFA</td>
                  <td><span className="badge bg-primary">{offer.statut}</span></td>
                  <td>{offer.nbCandidatures}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-info me-1" onClick={() => handleView(offer)}><FaEye /></button>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(offer)}><FaEdit /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(offer)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showViewModal && selectedOffer && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Détails de l'offre</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Titre :</strong> {selectedOffer.titre}</p>
                <p><strong>Domaine :</strong> {selectedOffer.domaine}</p>
                <p><strong>Description :</strong> {selectedOffer.description}</p>
                <p><strong>Durée :</strong> {selectedOffer.duree}</p>
                <p><strong>Localisation :</strong> {[selectedOffer.adresseEntrepise, selectedOffer.villeEntreprise].filter(Boolean).join(', ')}</p>
                <p><strong>Rémunération :</strong> {selectedOffer.remuneration} FCFA</p>
                <p><strong>Statut :</strong> {selectedOffer.statut}</p>
                <p><strong>Exigences :</strong> {Array.isArray(selectedOffer.exigences) ? selectedOffer.exigences.join(', ') : selectedOffer.exigences}</p>
                <p><strong>Technologies :</strong> {Array.isArray(selectedOffer.technologies) ? selectedOffer.technologies.join(', ') : selectedOffer.technologies}</p>
                <p><strong>Urgent :</strong> {selectedOffer.urgent ? 'Oui' : 'Non'}</p>
                <p><strong>En vedette :</strong> {selectedOffer.enVedette ? 'Oui' : 'Non'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier l'offre</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSave}>
                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  {/* Réutiliser le même formulaire que pour l'ajout, mais avec newOffer et handleNewOfferChange */}
                  {/* Informations principales */}
                  <h6 className="mb-3 mt-2 text-primary">Informations principales</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Titre du poste</label>
                      <input type="text" className="form-control" name="titre" value={newOffer.titre} onChange={handleNewOfferChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Domaine</label>
                      <select className="form-select" name="domaine" value={newOffer.domaine} onChange={handleNewOfferChange} required>
                        <option value="">Sélectionner un domaine</option>
                        {domaines.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    {newOffer.domaine === 'Autre' && (
                      <div className="col-md-6">
                        <label className="form-label">Précisez le domaine</label>
                        <input type="text" className="form-control" name="autreDomaine" value={newOffer.autreDomaine} onChange={handleNewOfferChange} required />
                      </div>
                    )}
                    <div className="col-12">
                      <label className="form-label">Description du poste</label>
                      <textarea className="form-control" name="description" value={newOffer.description} onChange={handleNewOfferChange} required rows={2} />
                    </div>
                  </div>
                  {/* Détails */}
                  <h6 className="mb-3 mt-4 text-primary">Détails de l'offre</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Durée (en mois)</label>
                      <input type="number" className="form-control" name="duree" value={newOffer.duree} onChange={handleNewOfferChange} min={1} required placeholder="ex: 6" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Localisation</label>
                      <input type="text" className="form-control" value={ entrepriseInfo ? (entrepriseInfo.adresse || '') + (entrepriseInfo.ville ? ', ' + entrepriseInfo.ville : '') : 'Chargement...' } disabled />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de début</label>
                      <input type="date" className="form-control" name="dateDebut" value={newOffer.dateDebut} onChange={handleNewOfferChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date de fin</label>
                      <input type="date" className="form-control" name="dateFin" value={newOffer.dateFin} onChange={handleNewOfferChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rémunération (FCFA)</label>
                      <input type="number" className="form-control" name="remuneration" value={newOffer.remuneration} onChange={handleNewOfferChange} min={0} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Nombre de candidatures max</label>
                      <input type="number" className="form-control" name="nbCandidaturesMax" value={newOffer.nbCandidaturesMax} onChange={handleNewOfferChange} min={0} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Statut</label>
                      <select className="form-select" name="statut" value={newOffer.statut} onChange={handleNewOfferChange} required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="brouillon">Brouillon</option>
                        <option value="expiree">Expirée</option>
                      </select>
                    </div>
                  </div>
                  {/* Compétences et options */}
                  <h6 className="mb-3 mt-4 text-primary">Compétences & options</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Exigences <span className="text-muted">(séparées par des virgules)</span></label>
                      <input type="text" className="form-control" name="exigences" value={newOffer.exigences} onChange={handleNewOfferChange} placeholder="ex: autonomie, rigueur, anglais" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Technologies <span className="text-muted">(séparées par des virgules)</span></label>
                      <input type="text" className="form-control" name="technologies" value={newOffer.technologies} onChange={handleNewOfferChange} placeholder="ex: Node.js, Excel, Photoshop" />
                    </div>
                    <div className="col-md-6 d-flex align-items-center mt-2">
                      <input className="form-check-input me-2" type="checkbox" name="urgent" id="urgent" checked={newOffer.urgent} onChange={handleNewOfferChange} />
                      <label className="form-check-label" htmlFor="urgent">Urgent</label>
                    </div>
                    <div className="col-md-6 d-flex align-items-center mt-2">
                      <input className="form-check-input me-2" type="checkbox" name="enVedette" id="enVedette" checked={newOffer.enVedette} onChange={handleNewOfferChange} />
                      <label className="form-check-label" htmlFor="enVedette">En vedette</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && selectedOffer && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Voulez-vous vraiment supprimer l'offre <strong>{selectedOffer.titre}</strong> ?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Annuler</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesOffres; 