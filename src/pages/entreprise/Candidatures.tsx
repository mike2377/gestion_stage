import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Candidature {
  infosEtudiant?: Record<string, unknown>;
  candidatureId: string;
  offreId: string;
  entrepriseId: string;
  etudiantId: string;
  cvUrl: string;
  statut: string;
  date: string;
  nomEtudiant: string;
  emailEtudiant: string;
  programmeEtudiant: string;
  universiteEtudiant: string;
  photoEtudiant?: string;
}

const Candidatures: React.FC = () => {
  const { user } = useAuth();
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [chargement, setChargement] = useState(true);
  const [showEtudiantModal, setShowEtudiantModal] = useState(false);
  const [selectedEtudiant, setSelectedEtudiant] = useState<Candidature | null>(null);
  // Notification state
  const [notif, setNotif] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  // Auto-hide notification
  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  useEffect(() => {
    if (!user?.entrepriseId) return;

    const chargerCandidatures = async () => {
      setChargement(true);
      const q = query(collection(db, 'candidatures'), where('entrepriseId', '==', user.entrepriseId));
      const snap = await getDocs(q);

      const resultats: Candidature[] = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let nomEtudiant = '';
          let emailEtudiant = '';
          let programmeEtudiant = '';
          let universiteEtudiant = '';
          let infosEtudiant: Record<string, unknown> = {}; // Typage plus strict
          let photoEtudiant = '';
          if (data.etudiantId) {
            const etuSnap = await getDocs(query(collection(db, 'utilisateurs'), where('uid', '==', data.etudiantId)));
            if (!etuSnap.empty) {
              const s = etuSnap.docs[0].data();
              infosEtudiant = s; // On stocke toutes les infos récupérées
              nomEtudiant = (s.firstName || s.prenom || '') + ' ' + (s.lastName || s.nom || '');
              emailEtudiant = s.email || '';
              programmeEtudiant = s.program || s.filiere || '';
              photoEtudiant = s.avatar || s.photo || '';
              if (s.universiteId) {
                try {
                  const univRef = doc(db, 'universites', s.universiteId);
                  const univSnap = await getDoc(univRef);
                  if (univSnap.exists()) {
                    universiteEtudiant = univSnap.data().nom || s.universiteId;
                  } else {
                    universiteEtudiant = s.universiteId;
                  }
                } catch (e) {
                  universiteEtudiant = s.universiteId;
                  console.error('Erreur récupération université:', e);
                }
              } else {
                universiteEtudiant = '';
              }
            }
          }
          return {
            candidatureId: data.candidatureId || docSnap.id,
            offreId: data.offreId,
            entrepriseId: data.entrepriseId,
            etudiantId: data.etudiantId,
            cvUrl: data.cvUrl,
            statut: data.statut,
            date: data.date ? new Date(data.date).toLocaleDateString() : '',
            nomEtudiant,
            emailEtudiant,
            programmeEtudiant,
            universiteEtudiant,
            infosEtudiant,
            photoEtudiant,
          };
        })
      );
      setCandidatures(resultats);
      setChargement(false);
    };

    chargerCandidatures();
  }, [user]);

  const changerStatut = async (candidatureId: string, nouveauStatut: string) => {
  let stageAjoute = false;
  let erreurAjout: unknown = null;
  await updateDoc(doc(db, 'candidatures', candidatureId), { statut: nouveauStatut });
  setCandidatures(prev =>
    prev.map(cand =>
      cand.candidatureId === candidatureId ? { ...cand, statut: nouveauStatut } : cand
    )
  );

  // Si acceptée, créer le stage dans la collection 'stages'
  if (nouveauStatut === 'acceptée') {
    // Trouver la candidature complète
    const candidature = candidatures.find(c => c.candidatureId === candidatureId);
    if (!candidature) return;
    // Récupérer les infos de l'offre de stage
    try {
      const offreRef = doc(db, 'offres_stage', candidature.offreId);
      const offreSnap = await getDoc(offreRef);
      if (!offreSnap.exists()) return;
      const offre = offreSnap.data();
      // Créer le stage
      const stageData = {
        entrepriseId: candidature.entrepriseId,
        etudiantId: candidature.etudiantId,
        offreId: candidature.offreId,
        titre: offre.titre || '',
        description: offre.description || '',
        dateDebut: offre.dateDebut || '',
        dateFin: offre.dateFin || '',
        lieu: offre.lieu || '',
        encadrant: offre.encadrant || '',
        tuteur: offre.tuteur || '',
        universite: candidature.universiteEtudiant || '',
        programme: candidature.programmeEtudiant || '',
        statut: 'actif',
        creeLe: new Date().toISOString(),
      };
      // Ajouter le stage
      await addDoc(collection(db, 'stages'), stageData);
      stageAjoute = true;
    } catch (e) {
      erreurAjout = e;
      console.error('Erreur lors de la création du stage:', e);
    }
  }

  // Affichage d'une notification stylée
  if (nouveauStatut === 'acceptée') {
    if (stageAjoute) {
      setNotif({ type: 'success', text: 'Stage ajouté avec succès dans la base de données !' });
    } else if (erreurAjout) {
      setNotif({ type: 'error', text: 'Erreur lors de la création du stage. Vérifiez la console pour plus de détails.' });
    }
  }
  if (nouveauStatut === 'refusée') {
    setNotif({ type: 'info', text: 'Candidature refusée.' });
  }
};

  // Statistiques
  const total = candidatures.length;
  const nbAcceptees = candidatures.filter(c => c.statut === 'acceptée').length;
  const nbRefusees = candidatures.filter(c => c.statut === 'refusée').length;
  const nbEnAttente = candidatures.filter(c => c.statut === 'en_attente' || c.statut === 'en attente').length;

  // Dictionnaire pour afficher les champs en français
  const fieldLabels: Record<string, string> = {
    programme: 'Programme',
    universite: 'Université',
    dateNaissance: 'Date de naissance',
    adresse: 'Adresse',
    telephone: 'Téléphone',
    ville: 'Ville',
    pays: 'Pays',
    codePostal: 'Code postal',
    genre: 'Genre',
    specialite: 'Spécialité',
    niveau: 'Niveau',
    program: 'Programme',
    country: 'Pays',
    city: 'Ville',
    postalCode: 'Code postal',
    gender: 'Genre',
    specialty: 'Spécialité',
    level: 'Niveau',
    address: 'Adresse',
    birthDate: 'Date de naissance',
    phone: 'Téléphone',
    university: 'Université',
    role: 'Rôle',
    // Ajoute ici d'autres champs à traduire si besoin
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Notification */}
      {notif && (
        <div className={`alert alert-${notif.type === 'success' ? 'success' : notif.type === 'error' ? 'danger' : 'info'} alert-dismissible fade show`} role="alert" style={{ zIndex: 9999, position: 'fixed', top: 20, right: 20, minWidth: 300 }}>
        {notif.text}
        <button type="button" className="btn-close" aria-label="Close" onClick={() => setNotif(null)}></button>
      </div>
      )}
      {/* Header et stats */}
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3 gap-3">
          <span className="d-flex align-items-center justify-content-center bg-light rounded-circle" style={{ width: 54, height: 54 }}>
            <i className="fas fa-folder-open fa-2x text-primary"></i>
          </span>
          <div>
            <h2 className="mb-0 fw-bold text-primary">Candidatures reçues</h2>
            <div className="text-muted fs-6">Gérez et suivez toutes les candidatures à vos offres de stage</div>
          </div>
        </div>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 bg-primary text-white rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0 fw-bold">{total}</h4>
                    <p className="mb-0">Total</p>
                  </div>
                  <i className="fas fa-users fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 bg-success text-white rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0 fw-bold">{nbAcceptees}</h4>
                    <p className="mb-0">Acceptées</p>
                  </div>
                  <i className="fas fa-check fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 bg-danger text-white rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0 fw-bold">{nbRefusees}</h4>
                    <p className="mb-0">Refusées</p>
                  </div>
                  <i className="fas fa-times fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 bg-secondary text-white rounded-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-0 fw-bold">{nbEnAttente}</h4>
                    <p className="mb-0">En attente</p>
                  </div>
                  <i className="fas fa-clock fa-2x opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tableau des candidatures */}
      <div className="container py-4">
        {chargement ? (
          <div>Chargement...</div>
        ) : candidatures.length === 0 ? (
          <div className="alert alert-info">Aucune candidature reçue pour le moment.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle bg-white rounded-4 shadow-sm overflow-hidden">
              <thead className="align-middle bg-light">
                <tr style={{ fontWeight: 600, fontSize: 16 }}>
                  <th>Étudiant</th>
                  <th>Email</th>
                  <th>Programme</th>
                  <th>Université</th>
                  <th>Date</th>
                  <th>CV</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidatures.map(cand => (
                  <tr key={cand.candidatureId} style={{ transition: 'background 0.2s' }}>
                    <td style={{ fontWeight: 500 }}>{cand.nomEtudiant}</td>
                    <td>{cand.emailEtudiant}</td>
                    <td>{cand.programmeEtudiant}</td>
                    <td>{cand.universiteEtudiant}</td>
                    <td>{cand.date}</td>
                    <td>
                      {cand.cvUrl ? (
                        <a href={cand.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1">
                          <i className="fas fa-file-pdf me-1"></i>CV
                        </a>
                      ) : (
                        <span className="text-muted">Aucun</span>
                      )}
                    </td>
                    <td>
                      <span className={
                        cand.statut === 'acceptée' ? 'badge bg-success px-3 py-2 fs-6' :
                        cand.statut === 'refusée' ? 'badge bg-danger px-3 py-2 fs-6' :
                        'badge bg-secondary px-3 py-2 fs-6'
                      } style={{ fontSize: 15 }}>
                        {cand.statut}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-outline-success btn-sm"
                          title="Accepter"
                          onClick={() => changerStatut(cand.candidatureId, 'acceptée')}
                          style={{ minWidth: 32, minHeight: 32, padding: 0 }}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Refuser"
                          onClick={() => changerStatut(cand.candidatureId, 'refusée')}
                          style={{ minWidth: 32, minHeight: 32, padding: 0 }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                        <button
                          className="btn btn-outline-info btn-sm"
                          title="Voir profil"
                          onClick={() => { setSelectedEtudiant(cand); setShowEtudiantModal(true); }}
                          style={{ minWidth: 32, minHeight: 32, padding: 0 }}
                        >
                          <i className="fas fa-eye"></i>
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
      {showEtudiantModal && selectedEtudiant && (
        <div className="modal show d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Profil de l'étudiant</h5>
                <button type="button" className="btn-close" onClick={() => setShowEtudiantModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-4 text-center">
                    {typeof selectedEtudiant.photoEtudiant === 'string' && selectedEtudiant.photoEtudiant.trim() !== '' ? (
                      <img src={selectedEtudiant.photoEtudiant} alt="Photo étudiant" className="rounded-circle mb-3" style={{ width: 120, height: 120, objectFit: 'cover', border: '2px solid #ddd' }} />
                    ) : (
                      <div className="rounded-circle bg-light mb-3 d-flex align-items-center justify-content-center" style={{ width: 120, height: 120 }}>
                        <i className="fas fa-user fa-4x text-secondary"></i>
                      </div>
                    )}
                    <div className="fw-bold fs-5 mb-2">{selectedEtudiant.nomEtudiant}</div>
                    {selectedEtudiant.infosEtudiant && selectedEtudiant.infosEtudiant['role'] && (
                      <div>
                        <span className="badge bg-info text-dark mt-1">{selectedEtudiant.infosEtudiant['role']}</span>
                      </div>
                    )}
                    <div className="text-muted">{selectedEtudiant.emailEtudiant}</div>
                  </div>
                  <div className="col-md-8">
                    <h6 className="fw-bold mb-3">Informations détaillées :</h6>
                    <div className="row">
                      {selectedEtudiant.infosEtudiant &&
  Object.entries(selectedEtudiant.infosEtudiant as Record<string, unknown>).map(([key, value]) => (
    // Ignore 'program' (anglais), n'affiche que 'programme' (français)
    key === 'program' ? null :
    (typeof value === 'string' || typeof value === 'number')
      && key !== 'avatar'
      && key !== 'photo'
      && key !== 'firstName'
      && key !== 'prenom'
      && key !== 'lastName'
      && key !== 'nom'
      && key !== 'email'
      && key !== 'uid'
      && key !== 'id'
      && key !== 'etudiantId'
      && key !== 'universiteId'
      && key !== 'updatedAt'
      && key !== 'role'
      ? (
        <div className="col-md-6 mb-2" key={key}>
          <strong>{key === 'year' ? 'Niveau' : (fieldLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))} :</strong> {value}
        </div>
      ) : null
  ))}
                      <div className="col-md-6 mb-2"><strong>Programme :</strong> {selectedEtudiant.programmeEtudiant}</div>
                      <div className="col-md-6 mb-2"><strong>Université :</strong> {selectedEtudiant.universiteEtudiant}</div>
                      <div className="col-md-6 mb-2"><strong>Date de candidature :</strong> {selectedEtudiant.date}</div>
                      <div className="col-md-6 mb-2"><strong>Statut :</strong> <span className={
                        selectedEtudiant.statut === 'acceptée' ? 'badge bg-success' :
                        selectedEtudiant.statut === 'refusée' ? 'badge bg-danger' :
                        'badge bg-secondary'
                      }>{selectedEtudiant.statut}</span></div>
                      <div className="col-md-12 mb-2"><strong>CV :</strong> {selectedEtudiant.cvUrl ? (
                        <a href={selectedEtudiant.cvUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm ms-2">
                          <i className="fas fa-file-pdf me-1"></i>Voir le CV
                        </a>
                      ) : (
                        <span className="text-muted ms-2">Aucun</span>
                      )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEtudiantModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidatures; 