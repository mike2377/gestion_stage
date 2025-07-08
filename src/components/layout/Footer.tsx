import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-white mb-3">
              <i className="fas fa-graduation-cap me-2"></i>CampusConnect
            </h5>
            <p className="text-white-50">
              La plateforme de référence pour la gestion des stages. 
              Connectez étudiants, entreprises et établissements d'enseignement.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="text-white mb-3">Liens rapides</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/about" className="text-white-50 text-decoration-none">
                  <i className="fas fa-info-circle me-1"></i>À propos
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-white-50 text-decoration-none">
                  <i className="fas fa-cogs me-1"></i>Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white-50 text-decoration-none">
                  <i className="fas fa-envelope me-1"></i>Contact
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/help" className="text-white-50 text-decoration-none">
                  <i className="fas fa-question-circle me-1"></i>Aide
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="text-white mb-3">Suivez-nous</h6>
            <div className="social-links">
              <a href="#" className="text-white-50 me-3" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white-50 me-3" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white-50 me-3" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="text-white-50 me-3" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
            <div className="mt-3">
              <h6 className="text-white mb-2">Newsletter</h6>
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control form-control-sm" 
                  placeholder="Votre email"
                />
                <button className="btn btn-outline-light btn-sm" type="button">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="row">
          <div className="col-md-6">
            <p className="text-white-50 mb-0">
              © 2024 CampusConnect. Tous droits réservés.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/privacy" className="text-white-50 text-decoration-none me-3">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="text-white-50 text-decoration-none">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 