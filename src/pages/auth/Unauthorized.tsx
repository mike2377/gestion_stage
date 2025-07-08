import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Unauthorized: React.FC = () => {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (role === 'super-admin') {
        navigate('/super-admin/dashboard', { replace: true });
      }
      // Tu peux ajouter d'autres redirections pour d'autres rôles ici
    }
  }, [role, loading, navigate]);

  if (loading) return <div>Chargement...</div>;
  return <div>Accès non autorisé.</div>;
};

export default Unauthorized; 