import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const { user, role, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (role === 'super_admin') {
        navigate('/super-admin/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'student') {
        navigate('/etudiant/stages', { replace: true });
      } else if (role === 'enterprise') {
        navigate('/entreprise', { replace: true });
      } else if (role === 'teacher') {
        navigate('/enseignant/stages', { replace: true });
      } else if (role === 'responsible') {
        navigate('/responsable/stages', { replace: true });
      } else if (role === 'tutor') {
        navigate('/tuteur/suivi', { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Connexion avec Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Récupérer le rôle dans Firestore (optionnel, pour vérification)
      const q = query(collection(db, 'utilisateurs'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Redirection unique vers le dashboard centralisé
        navigate('/dashboard');
      } else {
        setError('Utilisateur non trouvé dans la base.');
      }
    } catch (err) {
      setError('Erreur de connexion. Vérifiez vos identifiants.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center min-vh-100" style={{ background: 'var(--light-color)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <div className="text-center mb-4">
                <i className="fas fa-graduation-cap fa-3x mb-2 text-primary"></i>
                <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                  CampusConnect
                </h2>
                <p className="text-muted">Connexion à votre espace</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>Adresse e-mail
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nom@exemple.com"
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required
                  />
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Se souvenir de moi
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Se connecter
                    </>
                  )}
                </button>
              </form>

              <div className="mt-3 text-center">
                <Link to="/forgot-password" className="text-decoration-none text-primary">
                  <i className="fas fa-key me-1"></i>Mot de passe oublié ?
                </Link>
              </div>

              <div className="mt-2 text-center">
                <span className="text-muted">Pas encore de compte ?</span>
                <Link to="/register" className="text-decoration-none text-primary ms-1">
                  Créer un compte
                </Link>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-3">Ou connectez-vous avec</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fab fa-google me-2"></i>Google
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="fab fa-microsoft me-2"></i>Microsoft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 