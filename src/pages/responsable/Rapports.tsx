import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface Report {
  id: number;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  program: string;
  year: number;
  enterpriseName: string;
  stageTitle: string;
  reportType: 'rapport intermédiaire' | 'rapport final' | 'autre';
  title: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  reviewer: string;
  comments: string;
  fileUrl: string;
}

const Rapports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    reportType: ''
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: 1,
        studentId: '2024001',
        studentName: 'Jean Dupont',
        studentPhoto: '/api/photos/student-1.jpg',
        program: 'Master Informatique',
        year: 2,
        enterpriseName: 'TechCorp Solutions',
        stageTitle: 'Développeur Web Full-Stack',
        reportType: 'rapport intermédiaire',
        title: 'Rapport intermédiaire - Jean Dupont',
        submittedAt: '15/05/2024',
        status: 'reviewed',
        reviewer: 'Dr. Dupont',
        comments: 'Rapport complet et bien structuré.',
        fileUrl: '/api/reports/rapport-intermediaire-1.pdf'
      },
      {
        id: 2,
        studentId: '2024002',
        studentName: 'Marie Martin',
        studentPhoto: '/api/photos/student-2.jpg',
        program: 'Master Marketing',
        year: 2,
        enterpriseName: 'MarketingPro',
        stageTitle: 'Assistant Marketing Digital',
        reportType: 'rapport final',
        title: 'Rapport final - Marie Martin',
        submittedAt: '31/07/2024',
        status: 'pending',
        reviewer: '',
        comments: '',
        fileUrl: '/api/reports/rapport-final-2.pdf'
      },
      {
        id: 3,
        studentId: '2024003',
        studentName: 'Sophie Bernard',
        studentPhoto: '/api/photos/student-3.jpg',
        program: 'Master Data Science',
        year: 2,
        enterpriseName: 'DataCorp',
        stageTitle: 'Data Analyst',
        reportType: 'rapport final',
        title: 'Rapport final - Sophie Bernard',
        submittedAt: '31/12/2023',
        status: 'approved',
        reviewer: 'Dr. Petit',
        comments: 'Excellent travail, félicitations.',
        fileUrl: '/api/reports/rapport-final-3.pdf'
      }
    ];
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  const handleFilterChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    let filtered = reports;
    if (newFilters.status) {
      filtered = filtered.filter(r => r.status === newFilters.status);
    }
    if (newFilters.program) {
      filtered = filtered.filter(r => r.program === newFilters.program);
    }
    if (newFilters.reportType) {
      filtered = filtered.filter(r => r.reportType === newFilters.reportType);
    }
    setFilteredReports(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { class: 'bg-warning', text: 'En attente' },
      reviewed: { class: 'bg-info', text: 'Revu' },
      approved: { class: 'bg-success', text: 'Approuvé' },
      rejected: { class: 'bg-danger', text: 'Refusé' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const user = {
    role: 'responsable',
    firstName: 'M. Responsable',
    lastName: 'Stage'
  };

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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-0">
                  <i className="fas fa-file-alt me-2 text-primary"></i>
                  Rapports de Stage
                </h1>
                <p className="text-muted mb-0">
                  Consultez et gérez les rapports des étudiants en stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="mb-3">
                  <i className="fas fa-filter me-2"></i>Filtres
                </h5>
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label">Statut</label>
                    <select className="form-select" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
                      <option value="">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="reviewed">Revu</option>
                      <option value="approved">Approuvé</option>
                      <option value="rejected">Refusé</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Programme</label>
                    <select className="form-select" value={filters.program} onChange={e => handleFilterChange('program', e.target.value)}>
                      <option value="">Tous les programmes</option>
                      <option value="Master Informatique">Master Informatique</option>
                      <option value="Master Marketing">Master Marketing</option>
                      <option value="Master Data Science">Master Data Science</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Type de rapport</label>
                    <select className="form-select" value={filters.reportType} onChange={e => handleFilterChange('reportType', e.target.value)}>
                      <option value="">Tous</option>
                      <option value="rapport intermédiaire">Rapport intermédiaire</option>
                      <option value="rapport final">Rapport final</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-primary w-100" onClick={() => {
                      setFilters({ status: '', program: '', reportType: '' });
                      setFilteredReports(reports);
                    }}>
                      <i className="fas fa-times me-2"></i>Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-list me-2"></i>
                  Rapports ({filteredReports.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">Aucun rapport trouvé</h5>
                    <p className="text-muted">Aucun rapport ne correspond à vos critères de recherche.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Étudiant</th>
                          <th>Stage</th>
                          <th>Entreprise</th>
                          <th>Type</th>
                          <th>Titre</th>
                          <th>Date de dépôt</th>
                          <th>Statut</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.map(report => (
                          <tr key={report.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img src={report.studentPhoto || '/default-avatar.png'} alt="Photo" className="rounded-circle me-2" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
                                <div>
                                  <strong>{report.studentName}</strong><br />
                                  <small className="text-muted">{report.program} - {report.year}</small>
                                </div>
                              </div>
                            </td>
                            <td><strong>{report.stageTitle}</strong></td>
                            <td><strong>{report.enterpriseName}</strong></td>
                            <td><span className="badge bg-info">{report.reportType}</span></td>
                            <td>{report.title}</td>
                            <td>{report.submittedAt}</td>
                            <td>{getStatusBadge(report.status)}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedReport(report); setShowDetailsModal(true); }} title="Voir détails">
                                <i className="fas fa-eye"></i>
                              </button>
                              <a className="btn btn-sm btn-outline-success ms-1" href={report.fileUrl} target="_blank" rel="noopener noreferrer" title="Télécharger">
                                <i className="fas fa-download"></i>
                              </a>
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
      {/* Modal Détails Rapport */}
      {showDetailsModal && selectedReport && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-file-alt me-2"></i>
                  Détails du rapport - {selectedReport.studentName}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDetailsModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4 text-center">
                    <img src={selectedReport.studentPhoto || '/default-avatar.png'} alt="Photo" className="rounded-circle mb-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                    <h5>{selectedReport.studentName}</h5>
                    <p className="text-muted">{selectedReport.program} - {selectedReport.year}</p>
                  </div>
                  <div className="col-md-8">
                    <h6 className="text-primary mb-2">Stage</h6>
                    <p><strong>{selectedReport.stageTitle}</strong> chez <strong>{selectedReport.enterpriseName}</strong></p>
                    <h6 className="text-primary mb-2">Type de rapport</h6>
                    <p>{selectedReport.reportType}</p>
                    <h6 className="text-primary mb-2">Titre</h6>
                    <p>{selectedReport.title}</p>
                    <h6 className="text-primary mb-2">Date de dépôt</h6>
                    <p>{selectedReport.submittedAt}</p>
                    <h6 className="text-primary mb-2">Statut</h6>
                    <p>{getStatusBadge(selectedReport.status)}</p>
                  </div>
                </div>
                <h6 className="text-primary mb-2">Commentaires du relecteur</h6>
                <div className="card">
                  <div className="card-body">
                    <p className="mb-0">{selectedReport.comments || 'Aucun commentaire.'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <a className="btn btn-success" href={selectedReport.fileUrl} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-download me-2"></i>Télécharger le rapport
                  </a>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailsModal(false)}>Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rapports; 