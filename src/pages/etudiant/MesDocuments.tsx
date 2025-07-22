import React, { useState, useEffect } from 'react';
// Supprimer : import Sidebar from '../../components/layout/Sidebar';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  description?: string;
  stageId?: number;
  stageTitle?: string;
  fileType: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png';
}

const MesDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    stage: ''
  });
  // Supprimer : const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadForm, setUploadForm] = useState({
    type: '',
    description: '',
    stageId: '',
    file: null as File | null
  });

  // Données simulées
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 1,
        name: 'CV_Jean_Dupont_2024.pdf',
        type: 'CV',
        size: '245 KB',
        uploadDate: '15/01/2024',
        status: 'approved',
        description: 'CV mis à jour avec mes dernières expériences',
        fileType: 'pdf'
      },
      {
        id: 2,
        name: 'Lettre_motivation_TechCorp.docx',
        type: 'Lettre de motivation',
        size: '156 KB',
        uploadDate: '20/01/2024',
        status: 'approved',
        description: 'Lettre de motivation pour le stage chez TechCorp',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        fileType: 'docx'
      },
      {
        id: 3,
        name: 'Convention_stage_TechCorp.pdf',
        type: 'Convention de stage',
        size: '1.2 MB',
        uploadDate: '05/02/2024',
        status: 'pending',
        description: 'Convention de stage signée avec TechCorp',
        stageId: 1,
        stageTitle: 'Développeur Web Full-Stack',
        fileType: 'pdf'
      },
      {
        id: 4,
        name: 'Rapport_stage_2023.pdf',
        type: 'Rapport de stage',
        size: '2.8 MB',
        uploadDate: '30/08/2023',
        status: 'approved',
        description: 'Rapport de stage de l\'année dernière',
        fileType: 'pdf'
      },
      {
        id: 5,
        name: 'Photo_profil.jpg',
        type: 'Photo',
        size: '89 KB',
        uploadDate: '10/01/2024',
        status: 'approved',
        description: 'Photo de profil professionnelle',
        fileType: 'jpg'
      },
      {
        id: 6,
        name: 'Lettre_motivation_InnovateX.docx',
        type: 'Lettre de motivation',
        size: '178 KB',
        uploadDate: '25/01/2024',
        status: 'rejected',
        description: 'Lettre de motivation pour InnovateX - à retravailler',
        stageId: 2,
        stageTitle: 'Assistant Marketing Digital',
        fileType: 'docx'
      }
    ];
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = documents;

    if (newFilters.type) {
      filtered = filtered.filter(doc => doc.type === newFilters.type);
    }
    if (newFilters.status) {
      filtered = filtered.filter(doc => doc.status === newFilters.status);
    }
    if (newFilters.stage) {
      filtered = filtered.filter(doc => doc.stageId?.toString() === newFilters.stage);
    }

    setFilteredDocuments(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { class: 'bg-success', text: 'Approuvé', icon: 'fas fa-check' },
      pending: { class: 'bg-warning', text: 'En attente', icon: 'fas fa-clock' },
      rejected: { class: 'bg-danger', text: 'Rejeté', icon: 'fas fa-times' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`badge ${config.class}`}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getFileIcon = (fileType: string) => {
    const iconMap = {
      pdf: 'fas fa-file-pdf text-danger',
      doc: 'fas fa-file-word text-primary',
      docx: 'fas fa-file-word text-primary',
      jpg: 'fas fa-file-image text-success',
      png: 'fas fa-file-image text-success'
    };
    return iconMap[fileType as keyof typeof iconMap] || 'fas fa-file text-secondary';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'upload
    console.log('Upload:', uploadForm);
    setShowUploadModal(false);
    setUploadForm({ type: '', description: '', stageId: '', file: null });
  };

  const getStatusCount = (status: string) => {
    return documents.filter(doc => doc.status === status).length;
  };

  const user = {
    role: 'student',
    firstName: 'Jean',
    lastName: 'Dupont'
  };

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        {/* Supprimer : div className={`col-auto ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}> */}
        {/* Supprimer : <Sidebar 
            user={user} 
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          /> */}
        <div className="col">
          <div className="dashboard-content p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-file-alt me-2 text-primary"></i>
                  Mes Documents
                </h1>
                <p className="text-muted mb-0">
                  Gérez vos documents et suivez leur statut
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowUploadModal(true)}
                >
                  <i className="fas fa-upload me-2"></i>Ajouter un document
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{documents.length}</h4>
                        <p className="mb-0">Total documents</p>
                      </div>
                      <i className="fas fa-file-alt fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('approved')}</h4>
                        <p className="mb-0">Approuvés</p>
                      </div>
                      <i className="fas fa-check-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('pending')}</h4>
                        <p className="mb-0">En attente</p>
                      </div>
                      <i className="fas fa-clock fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount('rejected')}</h4>
                        <p className="mb-0">Rejetés</p>
                      </div>
                      <i className="fas fa-times-circle fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fas fa-filter me-2"></i>Filtres
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Type de document</label>
                    <select 
                      className="form-select"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option value="">Tous les types</option>
                      <option value="CV">CV</option>
                      <option value="Lettre de motivation">Lettre de motivation</option>
                      <option value="Convention de stage">Convention de stage</option>
                      <option value="Rapport de stage">Rapport de stage</option>
                      <option value="Photo">Photo</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Statut</label>
                    <select 
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">Tous les statuts</option>
                      <option value="approved">Approuvé</option>
                      <option value="pending">En attente</option>
                      <option value="rejected">Rejeté</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Stage associé</label>
                    <select 
                      className="form-select"
                      value={filters.stage}
                      onChange={(e) => handleFilterChange('stage', e.target.value)}
                    >
                      <option value="">Tous les stages</option>
                      <option value="1">Développeur Web Full-Stack - TechCorp</option>
                      <option value="2">Assistant Marketing Digital - InnovateX</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">&nbsp;</label>
                    <button 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        setFilters({ type: '', status: '', stage: '' });
                        setFilteredDocuments(documents);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des documents */}
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Documents ({filteredDocuments.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun document trouvé</h5>
                    <p className="text-muted">Aucun document ne correspond à vos critères de recherche.</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <i className="fas fa-upload me-2"></i>Ajouter un document
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Document</th>
                          <th>Type</th>
                          <th>Taille</th>
                          <th>Date d'upload</th>
                          <th>Stage associé</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="bg-light rounded-circle p-2 me-3">
                                  <i className={`${getFileIcon(doc.fileType)} fa-lg`}></i>
                                </div>
                                <div>
                                  <strong>{doc.name}</strong>
                                  {doc.description && (
                                    <>
                                      <br />
                                      <small className="text-muted">{doc.description}</small>
                                    </>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark">{doc.type}</span>
                            </td>
                            <td>{doc.size}</td>
                            <td>{doc.uploadDate}</td>
                            <td>
                              {doc.stageTitle ? (
                                <span className="text-primary">{doc.stageTitle}</span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>{getStatusBadge(doc.status)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedDocument(doc);
                                    setShowPreviewModal(true);
                                  }}
                                  title="Aperçu"
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-success"
                                  title="Télécharger"
                                >
                                  <i className="fas fa-download"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-warning"
                                  title="Modifier"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash"></i>
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
            </div>
          </div>
        </div>
      </div>

      {/* Modal Upload */}
      {showUploadModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-upload me-2"></i>
                  Ajouter un document
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUploadSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Type de document *</label>
                    <select 
                      className="form-select"
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                      required
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="CV">CV</option>
                      <option value="Lettre de motivation">Lettre de motivation</option>
                      <option value="Convention de stage">Convention de stage</option>
                      <option value="Rapport de stage">Rapport de stage</option>
                      <option value="Photo">Photo</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stage associé (optionnel)</label>
                    <select 
                      className="form-select"
                      value={uploadForm.stageId}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, stageId: e.target.value }))}
                    >
                      <option value="">Aucun stage</option>
                      <option value="1">Développeur Web Full-Stack - TechCorp</option>
                      <option value="2">Assistant Marketing Digital - InnovateX</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fichier *</label>
                    <input 
                      type="file" 
                      className="form-control"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      required
                    />
                    <small className="text-muted">
                      Formats acceptés: PDF, DOC, DOCX, JPG, PNG (max 5MB)
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description (optionnel)</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Description du document..."
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleUploadSubmit}
                >
                  <i className="fas fa-upload me-2"></i>Uploader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Aperçu */}
      {showPreviewModal && selectedDocument && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-eye me-2"></i>
                  Aperçu - {selectedDocument.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPreviewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-info-circle me-2"></i>Informations
                    </h6>
                    <p><strong>Nom:</strong> {selectedDocument.name}</p>
                    <p><strong>Type:</strong> {selectedDocument.type}</p>
                    <p><strong>Taille:</strong> {selectedDocument.size}</p>
                    <p><strong>Date d'upload:</strong> {selectedDocument.uploadDate}</p>
                    <p><strong>Statut:</strong> {getStatusBadge(selectedDocument.status)}</p>
                    {selectedDocument.description && (
                      <p><strong>Description:</strong> {selectedDocument.description}</p>
                    )}
                    {selectedDocument.stageTitle && (
                      <p><strong>Stage associé:</strong> {selectedDocument.stageTitle}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary mb-3">
                      <i className="fas fa-file me-2"></i>Aperçu
                    </h6>
                    <div className="bg-light rounded p-4 text-center">
                      <i className={`${getFileIcon(selectedDocument.fileType)} fa-4x mb-3`}></i>
                      <p className="mb-0">{selectedDocument.name}</p>
                      <small className="text-muted">{selectedDocument.size}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPreviewModal(false)}
                >
                  Fermer
                </button>
                <button type="button" className="btn btn-success">
                  <i className="fas fa-download me-2"></i>Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesDocuments; 