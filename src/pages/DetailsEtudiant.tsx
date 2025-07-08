import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  program: string;
  year: number;
  department: string;
  university: string;
  birthDate: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  photo?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: string[];
  languages: string[];
  interests: string[];
  stages: Stage[];
  documents: Document[];
  evaluations: Evaluation[];
}

interface Stage {
  id: number;
  title: string;
  enterprise: string;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  supervisor: string;
  tutor: string;
  evaluation?: number;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
  status: string;
}

interface Evaluation {
  id: number;
  stageTitle: string;
  enterprise: string;
  date: string;
  grade: number;
  comments: string;
  evaluator: string;
}

const DetailsEtudiant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Données simulées
  useEffect(() => {
    const mockStudent: Student = {
      id: parseInt(id || '1'),
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@email.com',
      phone: '06 12 34 56 78',
      studentId: '2024001',
      program: 'Master Informatique',
      year: 2,
      department: 'Département d\'Informatique',
      university: 'Université de Paris',
      birthDate: '15/03/2000',
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      photo: '/api/photos/student-1.jpg',
      linkedin: 'linkedin.com/in/jeandupont',
      github: 'github.com/jeandupont',
      portfolio: 'jeandupont.dev',
      skills: ['React', 'Node.js', 'Python', 'MongoDB', 'Git', 'Docker'],
      languages: ['Français (Natif)', 'Anglais (Courant)', 'Espagnol (Intermédiaire)'],
      interests: ['Développement Web', 'Intelligence Artificielle', 'Cybersécurité'],
      stages: [
        {
          id: 1,
          title: 'Développeur Web Full-Stack',
          enterprise: 'TechCorp',
          startDate: '01/03/2024',
          endDate: '31/08/2024',
          status: 'En cours',
          description: 'Développement d\'une application web moderne',
          supervisor: 'M. Martin',
          tutor: 'Dr. Dupont',
          evaluation: 4.5
        },
        {
          id: 2,
          title: 'Assistant Marketing Digital',
          enterprise: 'InnovateX',
          startDate: '01/06/2023',
          endDate: '31/08/2023',
          status: 'Terminé',
          description: 'Gestion des réseaux sociaux',
          supervisor: 'Mme. Dubois',
          tutor: 'Dr. Moreau',
          evaluation: 4.2
        }
      ],
      documents: [
        {
          id: 1,
          name: 'CV_Jean_Dupont_2024.pdf',
          type: 'CV',
          uploadDate: '15/01/2024',
          status: 'Approuvé'
        },
        {
          id: 2,
          name: 'Lettre_motivation_TechCorp.docx',
          type: 'Lettre de motivation',
          uploadDate: '20/01/2024',
          status: 'Approuvé'
        },
        {
          id: 3,
          name: 'Rapport_stage_2023.pdf',
          type: 'Rapport de stage',
          uploadDate: '30/08/2023',
          status: 'Approuvé'
        }
      ],
      evaluations: [
        {
          id: 1,
          stageTitle: 'Assistant Marketing Digital',
          enterprise: 'InnovateX',
          date: '31/08/2023',
          grade: 4.2,
          comments: 'Excellent travail, très autonome et créatif',
          evaluator: 'Mme. Dubois'
        }
      ]
    };
    setStudent(mockStudent);
  }, [id]);

  const user = {
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  };

  if (!student) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        <div className={`col-auto ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar 
            user={user} 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
        <div className="col">
          <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-user-graduate me-2 text-primary"></i>
                  Détails de l'étudiant
                </h1>
                <p className="text-muted mb-0">
                  {student.firstName} {student.lastName} - {student.studentId}
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-edit me-2"></i>Modifier
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
                <Link to="/admin/utilisateurs" className="btn btn-secondary">
                  <i className="fas fa-arrow-left me-2"></i>Retour
                </Link>
              </div>
            </div>

            <div className="row">
              {/* Informations principales */}
              <div className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <img 
                        src={student.photo || '/default-avatar.png'} 
                        alt="Photo de profil"
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                    <h4 className="mb-1">{student.firstName} {student.lastName}</h4>
                    <p className="text-muted mb-2">{student.program}</p>
                    <p className="text-muted mb-3">Étudiant #{student.studentId}</p>
                    
                    <div className="d-flex justify-content-center gap-2 mb-3">
                      {student.linkedin && (
                        <a href={`https://${student.linkedin}`} className="btn btn-outline-primary btn-sm" target="_blank">
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {student.github && (
                        <a href={`https://${student.github}`} className="btn btn-outline-dark btn-sm" target="_blank">
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                      {student.portfolio && (
                        <a href={`https://${student.portfolio}`} className="btn btn-outline-info btn-sm" target="_blank">
                          <i className="fas fa-globe"></i>
                        </a>
                      )}
                    </div>

                    <div className="row text-center">
                      <div className="col-6">
                        <h5 className="text-primary mb-0">{student.stages.length}</h5>
                        <small className="text-muted">Stages</small>
                      </div>
                      <div className="col-6">
                        <h5 className="text-success mb-0">{student.documents.length}</h5>
                        <small className="text-muted">Documents</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact rapide */}
                <div className="card mt-3">
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="fas fa-address-card me-2"></i>Contact
                    </h6>
                    <div className="mb-2">
                      <i className="fas fa-envelope me-2 text-muted"></i>
                      <a href={`mailto:${student.email}`} className="text-decoration-none">
                        {student.email}
                      </a>
                    </div>
                    <div className="mb-2">
                      <i className="fas fa-phone me-2 text-muted"></i>
                      <a href={`tel:${student.phone}`} className="text-decoration-none">
                        {student.phone}
                      </a>
                    </div>
                    <div>
                      <i className="fas fa-map-marker-alt me-2 text-muted"></i>
                      {student.city}, {student.country}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu principal */}
              <div className="col-md-8">
                {/* Onglets */}
                <div className="card">
                  <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                          onClick={() => setActiveTab('profile')}
                        >
                          <i className="fas fa-user me-2"></i>Profil
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'stages' ? 'active' : ''}`}
                          onClick={() => setActiveTab('stages')}
                        >
                          <i className="fas fa-briefcase me-2"></i>Stages
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`}
                          onClick={() => setActiveTab('documents')}
                        >
                          <i className="fas fa-file-alt me-2"></i>Documents
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'evaluations' ? 'active' : ''}`}
                          onClick={() => setActiveTab('evaluations')}
                        >
                          <i className="fas fa-star me-2"></i>Évaluations
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    {/* Onglet Profil */}
                    {activeTab === 'profile' && (
                      <div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">
                              <i className="fas fa-info-circle me-2"></i>Informations personnelles
                            </h6>
                            <p><strong>Nom complet:</strong> {student.firstName} {student.lastName}</p>
                            <p><strong>Date de naissance:</strong> {student.birthDate}</p>
                            <p><strong>Email:</strong> {student.email}</p>
                            <p><strong>Téléphone:</strong> {student.phone}</p>
                            <p><strong>Adresse:</strong> {student.address}</p>
                            <p><strong>Ville:</strong> {student.city} {student.postalCode}</p>
                            <p><strong>Pays:</strong> {student.country}</p>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">
                              <i className="fas fa-graduation-cap me-2"></i>Informations académiques
                            </h6>
                            <p><strong>Numéro étudiant:</strong> {student.studentId}</p>
                            <p><strong>Programme:</strong> {student.program}</p>
                            <p><strong>Année d'étude:</strong> {student.year}</p>
                            <p><strong>Département:</strong> {student.department}</p>
                            <p><strong>Université:</strong> {student.university}</p>
                          </div>
                        </div>

                        <hr />

                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">
                              <i className="fas fa-tools me-2"></i>Compétences
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {student.skills.map((skill, index) => (
                                <span key={index} className="badge bg-primary">{skill}</span>
                              ))}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <h6 className="text-primary mb-3">
                              <i className="fas fa-language me-2"></i>Langues
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {student.languages.map((language, index) => (
                                <span key={index} className="badge bg-info">{language}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <hr />

                        <div className="row">
                          <div className="col-12">
                            <h6 className="text-primary mb-3">
                              <i className="fas fa-heart me-2"></i>Centres d'intérêt
                            </h6>
                            <div className="d-flex flex-wrap gap-2">
                              {student.interests.map((interest, index) => (
                                <span key={index} className="badge bg-warning">{interest}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Onglet Stages */}
                    {activeTab === 'stages' && (
                      <div>
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-briefcase me-2"></i>Historique des stages
                        </h6>
                        {student.stages.length === 0 ? (
                          <p className="text-muted">Aucun stage enregistré.</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Stage</th>
                                  <th>Entreprise</th>
                                  <th>Période</th>
                                  <th>Statut</th>
                                  <th>Évaluation</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {student.stages.map((stage) => (
                                  <tr key={stage.id}>
                                    <td>
                                      <strong>{stage.title}</strong><br />
                                      <small className="text-muted">{stage.description}</small>
                                    </td>
                                    <td>{stage.enterprise}</td>
                                    <td>
                                      {stage.startDate} - {stage.endDate}
                                    </td>
                                    <td>
                                      <span className={`badge ${
                                        stage.status === 'En cours' ? 'bg-info' : 
                                        stage.status === 'Terminé' ? 'bg-success' : 'bg-secondary'
                                      }`}>
                                        {stage.status}
                                      </span>
                                    </td>
                                    <td>
                                      {stage.evaluation ? (
                                        <div>
                                          <div className="d-flex align-items-center">
                                            <span className="me-2">{stage.evaluation}/5</span>
                                            <div className="d-flex">
                                              {[...Array(5)].map((_, i) => (
                                                <i 
                                                  key={i} 
                                                  className={`fas fa-star ${i < Math.floor(stage.evaluation!) ? 'text-warning' : 'text-muted'}`}
                                                ></i>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-muted">Non évalué</span>
                                      )}
                                    </td>
                                    <td>
                                      <button className="btn btn-sm btn-outline-primary">
                                        <i className="fas fa-eye"></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Onglet Documents */}
                    {activeTab === 'documents' && (
                      <div>
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-file-alt me-2"></i>Documents de l'étudiant
                        </h6>
                        {student.documents.length === 0 ? (
                          <p className="text-muted">Aucun document enregistré.</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Document</th>
                                  <th>Type</th>
                                  <th>Date d'upload</th>
                                  <th>Statut</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {student.documents.map((doc) => (
                                  <tr key={doc.id}>
                                    <td>
                                      <i className="fas fa-file-pdf text-danger me-2"></i>
                                      {doc.name}
                                    </td>
                                    <td>
                                      <span className="badge bg-light text-dark">{doc.type}</span>
                                    </td>
                                    <td>{doc.uploadDate}</td>
                                    <td>
                                      <span className={`badge ${
                                        doc.status === 'Approuvé' ? 'bg-success' : 
                                        doc.status === 'En attente' ? 'bg-warning' : 'bg-danger'
                                      }`}>
                                        {doc.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="btn-group" role="group">
                                        <button className="btn btn-sm btn-outline-primary">
                                          <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="btn btn-sm btn-outline-success">
                                          <i className="fas fa-download"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Onglet Évaluations */}
                    {activeTab === 'evaluations' && (
                      <div>
                        <h6 className="text-primary mb-3">
                          <i className="fas fa-star me-2"></i>Évaluations reçues
                        </h6>
                        {student.evaluations.length === 0 ? (
                          <p className="text-muted">Aucune évaluation enregistrée.</p>
                        ) : (
                          <div className="row">
                            {student.evaluations.map((evaluation) => (
                              <div key={evaluation.id} className="col-12 mb-3">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      <h6 className="card-title mb-0">{evaluation.stageTitle}</h6>
                                      <div className="d-flex align-items-center">
                                        <span className="me-2">{evaluation.grade}/5</span>
                                        <div className="d-flex">
                                          {[...Array(5)].map((_, i) => (
                                            <i 
                                              key={i} 
                                              className={`fas fa-star ${i < Math.floor(evaluation.grade) ? 'text-warning' : 'text-muted'}`}
                                            ></i>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <p className="text-muted mb-2">
                                      <i className="fas fa-building me-1"></i>
                                      {evaluation.enterprise} - {evaluation.date}
                                    </p>
                                    <p className="mb-2">
                                      <strong>Évaluateur:</strong> {evaluation.evaluator}
                                    </p>
                                    <p className="mb-0">
                                      <strong>Commentaires:</strong> {evaluation.comments}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsEtudiant; 