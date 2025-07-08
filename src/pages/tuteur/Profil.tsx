import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase';
import { doc, updateDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Profil: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userAuth = auth.currentUser;
      if (!userAuth) return;
      const q = query(collection(db, 'utilisateurs'), where('uid', '==', userAuth.uid));
      const snap = await getDocs(q);
      if (!snap.empty) setProfile(snap.docs[0].data());
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const userAuth = auth.currentUser;
      if (!userAuth) return;
      const q = query(collection(db, 'utilisateurs'), where('uid', '==', userAuth.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const userDoc = snap.docs[0];
        await updateDoc(doc(db, 'utilisateurs', userDoc.id), {
          ...profile,
          updatedAt: new Date(),
        });
        setMessage({ type: 'success', text: 'Profil sauvegardé avec succès !' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde du profil.' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mon Profil Tuteur</h2>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      {profile && (
        <>
          <div className="mb-3">
            <label>Nom</label>
            <input className="form-control" value={profile.lastName || ''} onChange={e => setProfile({ ...profile, lastName: e.target.value })} disabled={!isEditing} />
          </div>
          <div className="mb-3">
            <label>Prénom</label>
            <input className="form-control" value={profile.firstName || ''} onChange={e => setProfile({ ...profile, firstName: e.target.value })} disabled={!isEditing} />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" value={profile.email || ''} disabled />
          </div>
          <div className="mb-3">
            <label>Téléphone</label>
            <input className="form-control" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} disabled={!isEditing} />
          </div>
          <div className="mb-3">
            <label>Spécialisation</label>
            <input className="form-control" value={profile.specialization || ''} onChange={e => setProfile({ ...profile, specialization: e.target.value })} disabled={!isEditing} />
          </div>
          <div className="mb-3">
            <label>Expérience (années)</label>
            <input className="form-control" type="number" value={profile.experience || ''} onChange={e => setProfile({ ...profile, experience: Number(e.target.value) })} disabled={!isEditing} />
          </div>
          <div className="d-flex gap-2">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Modifier</button>
            ) : (
              <button className="btn btn-success" onClick={handleSave}>Sauvegarder</button>
            )}
            <button className="btn btn-outline-secondary" onClick={() => setShowPasswordModal(true)}>Modifier le mot de passe</button>
          </div>
        </>
      )}
      {/* Modal mot de passe */}
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
                  <label>Ancien mot de passe</label>
                  <input type="password" className="form-control" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label>Nouveau mot de passe</label>
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

export default Profil; 