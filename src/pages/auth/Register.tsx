import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/models/User';
import { registerUser } from '../../services/auth/register';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: '',
    program: '',
    year: '',
    department: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Afficher les champs supplémentaires selon le rôle
    if (name === 'role') {
      setShowAdditionalFields(value !== '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({ ...formData, role: 'student' });
      navigate('/etudiant/mon-profil');
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAdditionalFields = () => {
    switch (formData.role) {
      case UserRole.STUDENT:
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="studentId" className="form-label">
                <i className="fas fa-id-card me-2"></i>Numéro étudiant
              </label>
              <input
                type="text"
                className="form-control"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="12345678"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="program" className="form-label">
                <i className="fas fa-graduation-cap me-2"></i>Programme
              </label>
              <input
                type="text"
                className="form-control"
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                placeholder="Informatique"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="year" className="form-label">
                <i className="fas fa-calendar me-2"></i>Année d'étude
              </label>
              <select
                className="form-select"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner...</option>
                <option value="1">1ère année</option>
                <option value="2">2ème année</option>
                <option value="3">3ème année</option>
                <option value="4">4ème année</option>
                <option value="5">5ème année</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">
                <i className="fas fa-building me-2"></i>Département
              </label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Département d'informatique"
                required
              />
            </div>
          </div>
        );

      case UserRole.ENTERPRISE:
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="companyName" className="form-label">
                <i className="fas fa-building me-2"></i>Nom de l'entreprise
              </label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Nom de votre entreprise"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="industry" className="form-label">
                <i className="fas fa-industry me-2"></i>Secteur d'activité
              </label>
              <select
                className="form-select"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner...</option>
                <option value="technology">Technologie</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Santé</option>
                <option value="education">Éducation</option>
                <option value="manufacturing">Manufacture</option>
                <option value="retail">Commerce</option>
                <option value="consulting">Conseil</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                <i className="fas fa-phone me-2"></i>Téléphone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
                required
              />
            </div>
          </div>
        );

      case UserRole.TEACHER:
      case UserRole.RESPONSIBLE:
        return (
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="department" className="form-label">
                <i className="fas fa-building me-2"></i>Département
              </label>
              <input
                type="text"
                className="form-control"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Département"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">
                <i className="fas fa-phone me-2"></i>Téléphone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+33 1 23 45 67 89"
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="d-flex align-items-center min-vh-100" style={{ background: 'var(--light-color)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-7">
            <div className="card shadow-lg p-4 border-0 rounded-4">
              <div className="text-center mb-4">
                <i className="fas fa-user-plus fa-3x mb-2 text-primary"></i>
                <h2 className="fw-bold mb-0" style={{ color: 'var(--primary-color)' }}>
                  Créer un compte
                </h2>
                <p className="text-muted">Rejoignez CampusConnect</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">
                      <i className="fas fa-user me-2"></i>Prénom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">
                      <i className="fas fa-user me-2"></i>Nom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3">
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
                  />
                </div>

                <div className="row g-3 mt-3">
                  <div className="col-md-6">
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
                    <small className="text-muted">Minimum 8 caractères</small>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">
                      <i className="fas fa-lock me-2"></i>Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirmer le mot de passe"
                      required
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="university" className="form-label">
                    <i className="fas fa-university me-2"></i>Université
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Votre université"
                    required
                  />
                </div>

                {showAdditionalFields && (
                  <div className="mt-3">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="card-title mb-3">
                          <i className="fas fa-info-circle me-2 text-primary"></i>
                          Informations supplémentaires
                        </h6>
                        {getAdditionalFields()}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Création du compte...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        S'inscrire
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-3 text-center">
                <span className="text-muted">Déjà un compte ?</span>
                <Link to="/login" className="text-decoration-none text-primary ms-1">
                  Se connecter
                </Link>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-3">Ou inscrivez-vous avec</p>
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

export default Register; 