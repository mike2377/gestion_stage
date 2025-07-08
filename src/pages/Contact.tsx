import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          <i className="fas fa-envelope me-3"></i>
          Contactez-nous
        </h1>
        <p className="lead text-muted">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question.
        </p>
      </div>

      <div className="row g-5">
        {/* Informations de contact */}
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-4">
                <i className="fas fa-info-circle me-2"></i>
                Informations de contact
              </h4>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-map-marker-alt text-primary fa-lg"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Adresse</h6>
                    <p className="text-muted mb-0">
                      123 Rue de l'Université<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-phone text-primary fa-lg"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Téléphone</h6>
                    <p className="text-muted mb-0">+33 1 23 45 67 89</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-envelope text-primary fa-lg"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Email</h6>
                    <p className="text-muted mb-0">contact@campusconnect.fr</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                    <i className="fas fa-clock text-primary fa-lg"></i>
                  </div>
                  <div>
                    <h6 className="mb-1">Horaires</h6>
                    <p className="text-muted mb-0">
                      Lun-Ven: 9h-18h<br />
                      Sam: 9h-12h
                    </p>
                  </div>
                </div>
              </div>

              <hr />

              <h5 className="mb-3">Suivez-nous</h5>
              <div className="d-flex gap-2">
                <a href="#" className="btn btn-outline-primary">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="btn btn-outline-primary">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="btn btn-outline-primary">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="btn btn-outline-primary">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-4">
                <i className="fas fa-paper-plane me-2"></i>
                Envoyez-nous un message
              </h4>

              {submitSuccess && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      <i className="fas fa-user me-2"></i>Nom complet *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope me-2"></i>Email *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="subject" className="form-label">
                    <i className="fas fa-tag me-2"></i>Sujet *
                  </label>
                  <select
                    className="form-select"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="technical">Support technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="feedback">Retour d'expérience</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div className="mt-3">
                  <label htmlFor="message" className="form-label">
                    <i className="fas fa-comment me-2"></i>Message *
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Décrivez votre demande en détail..."
                  ></textarea>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Envoyer le message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-4">
                <i className="fas fa-question-circle me-2"></i>
                Questions fréquentes
              </h4>
              
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq1">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                      Comment m'inscrire sur la plateforme ?
                    </button>
                  </h2>
                  <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Pour vous inscrire, cliquez sur le bouton "S'inscrire" en haut à droite de la page d'accueil. 
                      Remplissez le formulaire avec vos informations et sélectionnez votre profil (étudiant, entreprise, enseignant, etc.).
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq2">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                      Comment publier une offre de stage ?
                    </button>
                  </h2>
                  <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Une fois connecté avec votre compte entreprise, allez dans la section "Mes offres" et cliquez sur "Ajouter une offre". 
                      Remplissez tous les champs requis et soumettez votre offre pour validation.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq3">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                      Comment postuler à un stage ?
                    </button>
                  </h2>
                  <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Connectez-vous avec votre compte étudiant, recherchez les offres de stage qui vous intéressent, 
                      et cliquez sur "Postuler" pour soumettre votre candidature avec votre CV et lettre de motivation.
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq4">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4">
                      Comment suivre l'avancement de ma candidature ?
                    </button>
                  </h2>
                  <div id="collapse4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Dans votre espace étudiant, allez dans "Mes stages" pour voir le statut de toutes vos candidatures. 
                      Vous recevrez également des notifications par email lors des mises à jour.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-primary mb-4">
                <i className="fas fa-map me-2"></i>
                Notre localisation
              </h4>
              <div className="ratio ratio-21x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3522219!3d48.856614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUxJzIzLjgiTiAywrAyMScwOC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 