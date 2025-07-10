import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) {
      switch (role) {
        case 'etudiant':
          navigate('/etudiant/dashboard', { replace: true });
          break;
        case 'entreprise':
          navigate('/entreprise/dashboard', { replace: true });
          break;
        case 'enseignant':
          navigate('/enseignant/dashboard', { replace: true });
          break;
        case 'responsable':
          navigate('/responsable/dashboard', { replace: true });
          break;
        case 'tuteur':
          navigate('/tuteur/dashboard', { replace: true });
          break;
        case 'admin':
        case 'super_admin':
          navigate('/super-admin/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  if (loading) return <div>Chargement...</div>;
  if (user && role) return null; // Empêche l'affichage de la page d'accueil pendant la redirection

  return (
    <Layout user={user}>
      {/* Début du contenu de la page d'accueil */}
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 fade-in">
              <h1 className="display-4 fw-bold text-white mb-4">
                Connectez-vous au monde professionnel
              </h1>
              <p className="lead text-white-50 mb-4">
                CampusConnect facilite la gestion des stages et connecte étudiants, 
                entreprises et établissements d'enseignement dans une plateforme 
                moderne et intuitive.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <i className="fas fa-rocket me-2"></i>Commencer
                </Link>
                <a href="#features" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-info-circle me-2"></i>En savoir plus
                </a>
              </div>
            </div>
            <div className="col-lg-6 fade-in">
              <div className="hero-image text-center">
                <div className="position-relative">
                  <i className="fas fa-users fa-10x text-white-50 mb-4"></i>
                  <div className="position-absolute top-0 start-0 w-100 h-100">
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <div className="text-center">
                        <div className="bg-white bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                          <i className="fas fa-graduation-cap fa-3x text-white"></i>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-circle p-4 d-inline-block mb-3">
                          <i className="fas fa-building fa-3x text-white"></i>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded-circle p-4 d-inline-block">
                          <i className="fas fa-chalkboard-teacher fa-3x text-white"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">Fonctionnalités principales</h2>
              <p className="lead text-muted">
                Une plateforme complète pour tous les acteurs du stage
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-user-graduate fa-3x text-primary"></i>
                </div>
                <h4>Étudiants</h4>
                <p className="text-muted">
                  Trouvez et postulez aux stages, suivez vos candidatures, 
                  gérez vos documents et communiquez avec vos superviseurs.
                </p>
                <ul className="list-unstyled text-start">
                  <li><i className="fas fa-check text-success me-2"></i>Recherche de stages</li>
                  <li><i className="fas fa-check text-success me-2"></i>Gestion des candidatures</li>
                  <li><i className="fas fa-check text-success me-2"></i>Suivi des évaluations</li>
                  <li><i className="fas fa-check text-success me-2"></i>Rapports hebdomadaires</li>
                </ul>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-building fa-3x text-primary"></i>
                </div>
                <h4>Entreprises</h4>
                <p className="text-muted">
                  Publiez vos offres de stage, gérez les candidatures, 
                  évaluez les stagiaires et suivez leur progression.
                </p>
                <ul className="list-unstyled text-start">
                  <li><i className="fas fa-check text-success me-2"></i>Publication d'offres</li>
                  <li><i className="fas fa-check text-success me-2"></i>Gestion des candidatures</li>
                  <li><i className="fas fa-check text-success me-2"></i>Évaluation des stagiaires</li>
                  <li><i className="fas fa-check text-success me-2"></i>Suivi des conventions</li>
                </ul>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chalkboard-teacher fa-3x text-primary"></i>
                </div>
                <h4>Établissements</h4>
                <p className="text-muted">
                  Supervisez les stages, validez les conventions, 
                  évaluez les étudiants et générez des rapports.
                </p>
                <ul className="list-unstyled text-start">
                  <li><i className="fas fa-check text-success me-2"></i>Supervision des stages</li>
                  <li><i className="fas fa-check text-success me-2"></i>Validation des conventions</li>
                  <li><i className="fas fa-check text-success me-2"></i>Évaluation des étudiants</li>
                  <li><i className="fas fa-check text-success me-2"></i>Génération de rapports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-white">500+</h3>
                <p className="text-white-50">Stages publiés</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-white">200+</h3>
                <p className="text-white-50">Entreprises partenaires</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-white">1000+</h3>
                <p className="text-white-50">Étudiants placés</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item">
                <h3 className="display-4 fw-bold text-white">95%</h3>
                <p className="text-white-50">Taux de satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">Comment ça marche ?</h2>
              <p className="lead text-muted">
                Un processus simple en 4 étapes
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h4 mb-0">1</span>
                </div>
                <h5>Inscription</h5>
                <p className="text-muted">
                  Créez votre compte selon votre profil (étudiant, entreprise, établissement)
                </p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h4 mb-0">2</span>
                </div>
                <h5>Publication/Recherche</h5>
                <p className="text-muted">
                  Les entreprises publient leurs offres, les étudiants les consultent
                </p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h4 mb-0">3</span>
                </div>
                <h5>Candidature</h5>
                <p className="text-muted">
                  Les étudiants postulent, les entreprises sélectionnent
                </p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="text-center">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="h4 mb-0">4</span>
                </div>
                <h5>Suivi</h5>
                <p className="text-muted">
                  Convention signée, stage réalisé et évalué
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4">Prêt à commencer ?</h2>
              <p className="lead text-muted mb-4">
                Rejoignez CampusConnect et découvrez une nouvelle façon de gérer les stages
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <i className="fas fa-user-plus me-2"></i>Créer un compte
                </Link>
                <Link to="/contact" className="btn btn-outline-primary btn-lg">
                  <i className="fas fa-envelope me-2"></i>Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
      {/* Fin du contenu de la page d'accueil */}
    </Layout>
  );
};

export default Home; 