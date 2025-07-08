import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const Parametres: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [parametres, setParametres] = useState<any[]>([]);
  const [loadingParams, setLoadingParams] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingParam, setEditingParam] = useState<any>(null);

  const fetchParametres = async () => {
    setLoadingParams(true);
    try {
      const snap = await getDocs(collection(db, 'parametres'));
      setParametres(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setError(null);
    } catch (e) {
      setError('Erreur lors du chargement des paramètres');
    } finally {
      setLoadingParams(false);
    }
  };

  useEffect(() => {
    fetchParametres();
  }, []);

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setEditingParam({ ...p });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateDoc(doc(db, 'parametres', editingId), editingParam);
      setEditingId(null);
      setEditingParam(null);
      fetchParametres();
    } catch (e) {
      setError('Erreur lors de la modification');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (role !== 'super_admin') return <div>Accès refusé</div>;
  if (loadingParams) return <div>Chargement des paramètres...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <h2>Paramètres Généraux</h2>
      {parametres.length === 0 ? (
        <div>Aucun paramètre trouvé.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Clé</th>
              <th>Valeur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parametres.map(p => (
              <tr key={p.id}>
                <td>{p.cle}</td>
                <td>
                  {editingId === p.id ? (
                    <input type="text" value={editingParam?.valeur || ''} onChange={e => setEditingParam({ ...editingParam, valeur: e.target.value })} />
                  ) : (
                    p.valeur
                  )}
                </td>
                <td>
                  {editingId === p.id ? (
                    <>
                      <button className="btn btn-sm btn-success me-2" onClick={handleUpdate}>Enregistrer</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setEditingParam(null); }}>Annuler</button>
                    </>
                  ) : (
                    <button className="btn btn-sm btn-warning" onClick={() => handleEdit(p)}>Éditer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Parametres; 