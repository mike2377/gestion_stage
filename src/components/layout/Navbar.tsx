import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-graduation-cap me-2"></i>
          CampusConnect
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home me-1"></i>Accueil
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/stages') ? 'active' : ''}`} 
                to="/stages"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-briefcase me-1"></i>Stages
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/entreprises') ? 'active' : ''}`} 
                to="/entreprises"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-building me-1"></i>Entreprises
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} 
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <i className="fas fa-tachometer-alt me-1"></i>Tableau de bord
                </Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user.firstName} {user.lastName}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="fas fa-user me-2"></i>Mon Profil
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/settings">
                      <i className="fas fa-cog me-2"></i>Paramètres
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item logout" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Déconnexion
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt me-1"></i>Connexion
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/register') ? 'active' : ''}`} 
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-user-plus me-1"></i>Inscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 