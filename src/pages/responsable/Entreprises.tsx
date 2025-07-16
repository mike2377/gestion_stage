import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

interface Enterprise {
  id: string;
  name: string;
  logo?: string;
  sector: string;
  size: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
  partnershipDate?: string;
  totalInternships?: number;
  activeInternships?: number;
  completedInternships?: number;
  averageRating?: number;
  description?: string;
  specialties?: string[];
  benefits?: string[];
  universiteId?: string;
  associationStatus?: 'accepted' | 'pending' | 'rejected';
}

const Entreprises: React.FC = () => {
  const { user } = useAuth();
  const [allEnterprises, setAllEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !user.universiteId) return;
    const fetchEnterprises = async () => {
      setLoading(true);
      const q = query(collection(db, 'entreprises'));
      const querySnapshot = await getDocs(q);
      const enterprises: Enterprise[] = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || data.nom || '',
          logo: data.logo,
          sector: data.sector || data.secteur || '',
          size: data.size || data.taille || '',
          location: data.location || data.adresse || '',
          website: data.website || '',
          email: data.email || '',
          phone: data.phone || '',
          contactPerson: data.contactPerson || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          status: data.status || 'active',
          partnershipDate: data.partnershipDate,
          universiteId: data.universiteId,
          associationStatus: data.associationStatus || 'accepted', // Default to accepted
        };
      });
      setAllEnterprises(enterprises);
      setLoading(false);
    };
    fetchEnterprises();
  }, [user]);

  const associerEntreprise = async (enterpriseId: string) => {
    if (!user || !user.universiteId) return;
    if (!window.confirm("Associer cette entreprise à votre université ? L'entreprise devra accepter la demande.")) return;
    setActionLoading(enterpriseId);
    await updateDoc(doc(db, 'entreprises', enterpriseId), { universiteId: user.universiteId, associationStatus: 'pending' });
    setAllEnterprises(prev => prev.map(e => e.id === enterpriseId ? { ...e, universiteId: user.universiteId, associationStatus: 'pending' } : e));
    setActionLoading(null);
  };

  const dissocierEntreprise = async (enterpriseId: string) => {
    if (!window.confirm("Retirer cette entreprise du partenariat avec votre université ?")) return;
    setActionLoading(enterpriseId);
    await updateDoc(doc(db, 'entreprises', enterpriseId), { universiteId: null, associationStatus: null });
    setAllEnterprises(prev => prev.map(e => e.id === enterpriseId ? { ...e, universiteId: undefined, associationStatus: undefined } : e));
    setActionLoading(null);
  };

  const partenaires = allEnterprises.filter(e => e.universiteId === user?.universiteId && e.associationStatus === 'accepted');
  const enAttente = allEnterprises.filter(e => e.universiteId === user?.universiteId && e.associationStatus === 'pending');
  const nonAssociees = allEnterprises.filter(e => !e.universiteId || e.universiteId !== user?.universiteId);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content p-4">
        <h1 className="h3 mb-4">
          <i className="fas fa-building me-2 text-primary"></i>
          Entreprises partenaires de mon université
        </h1>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <>
            <h5 className="mb-3">Entreprises partenaires</h5>
            <div className="table-responsive mb-5">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Secteur</th>
                    <th>Localisation</th>
                    <th>Contact</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partenaires.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted">Aucune entreprise partenaire</td></tr>
                  ) : partenaires.map(e => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.sector}</td>
                      <td>{e.location}</td>
                      <td>{e.contactPerson} <br /><small>{e.contactEmail}</small></td>
                      <td>{e.status}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" disabled={actionLoading === e.id} onClick={() => dissocierEntreprise(e.id)}>
                          {actionLoading === e.id ? '...' : 'Retirer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h5 className="mb-3">Demandes en attente d'acceptation</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Secteur</th>
                    <th>Localisation</th>
                    <th>Contact</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enAttente.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted">Aucune demande en attente</td></tr>
                  ) : enAttente.map(e => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.sector}</td>
                      <td>{e.location}</td>
                      <td>{e.contactPerson} <br /><small>{e.contactEmail}</small></td>
                      <td>{e.status}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-success" disabled={actionLoading === e.id} onClick={() => associerEntreprise(e.id)}>
                          {actionLoading === e.id ? '...' : 'Accepter'}
                        </button>
                        <button className="btn btn-sm btn-outline-danger ms-2" disabled={actionLoading === e.id} onClick={() => dissocierEntreprise(e.id)}>
                          {actionLoading === e.id ? '...' : 'Refuser'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h5 className="mb-3">Entreprises non associées</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Secteur</th>
                    <th>Localisation</th>
                    <th>Contact</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nonAssociees.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted">Aucune entreprise à associer</td></tr>
                  ) : nonAssociees.map(e => (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{e.sector}</td>
                      <td>{e.location}</td>
                      <td>{e.contactPerson} <br /><small>{e.contactEmail}</small></td>
                      <td>{e.status}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-success" disabled={actionLoading === e.id} onClick={() => associerEntreprise(e.id)}>
                          {actionLoading === e.id ? '...' : 'Associer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Entreprises; 