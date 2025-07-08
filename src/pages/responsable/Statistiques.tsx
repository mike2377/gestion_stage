import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';

interface StatData {
  totalStudents: number;
  activeInternships: number;
  completedInternships: number;
  totalEnterprises: number;
  totalApplications: number;
  averageScore: number;
  monthlyStats: { month: string; applications: number; completions: number; }[];
  programStats: { program: string; count: number; }[];
  enterpriseStats: { enterprise: string; internships: number; students: number; }[];
}

const Statistiques: React.FC = () => {
  const [stats, setStats] = useState<StatData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  useEffect(() => {
    const mockStats: StatData = {
      totalStudents: 156,
      activeInternships: 89,
      completedInternships: 234,
      totalEnterprises: 45,
      totalApplications: 567,
      averageScore: 4.2,
      monthlyStats: [
        { month: 'Jan', applications: 45, completions: 12 },
        { month: 'Fév', applications: 52, completions: 18 },
        { month: 'Mar', applications: 38, completions: 15 },
        { month: 'Avr', applications: 67, completions: 22 },
        { month: 'Mai', applications: 73, completions: 28 },
        { month: 'Juin', applications: 89, completions: 35 }
      ],
      programStats: [
        { program: 'Master Informatique', count: 45 },
        { program: 'Master Marketing', count: 32 },
        { program: 'Master Data Science', count: 28 },
        { program: 'Master Design', count: 23 },
        { program: 'Master Finance', count: 18 }
      ],
      enterpriseStats: [
        { enterprise: 'TechCorp Solutions', internships: 12, students: 15 },
        { enterprise: 'MarketingPro', internships: 8, students: 10 },
        { enterprise: 'DataCorp', internships: 6, students: 8 },
        { enterprise: 'DesignStudio', internships: 5, students: 7 },
        { enterprise: 'FinanceGroup', internships: 4, students: 6 }
      ]
    };
    setStats(mockStats);
  }, []);

  const user = {
    role: 'responsable',
    firstName: 'M. Responsable',
    lastName: 'Stage'
  };

  if (!stats) return <div>Chargement...</div>;

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
                  <i className="fas fa-chart-bar me-2 text-primary"></i>
                  Statistiques
                </h1>
                <p className="text-muted mb-0">
                  Tableau de bord des statistiques de stage
                </p>
              </div>
              <div className="d-flex gap-2">
                <select className="form-select" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
                <button className="btn btn-outline-primary">
                  <i className="fas fa-download me-2"></i>Exporter
                </button>
              </div>
            </div>

            {/* Statistiques principales */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{stats.totalStudents}</h4>
                        <p className="mb-0">Total étudiants</p>
                      </div>
                      <i className="fas fa-user-graduate fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{stats.activeInternships}</h4>
                        <p className="mb-0">Stages actifs</p>
                      </div>
                      <i className="fas fa-briefcase fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{stats.totalEnterprises}</h4>
                        <p className="mb-0">Entreprises</p>
                      </div>
                      <i className="fas fa-building fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{stats.averageScore.toFixed(1)}</h4>
                        <p className="mb-0">Note moyenne</p>
                      </div>
                      <i className="fas fa-star fa-2x opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphiques et tableaux */}
            <div className="row g-4">
              {/* Statistiques mensuelles */}
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-chart-line me-2"></i>
                      Évolution mensuelle
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Mois</th>
                            <th>Candidatures</th>
                            <th>Complétions</th>
                            <th>Progression</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.monthlyStats.map((stat, index) => (
                            <tr key={index}>
                              <td><strong>{stat.month}</strong></td>
                              <td>{stat.applications}</td>
                              <td>{stat.completions}</td>
                              <td>
                                <div className="progress" style={{ height: '6px' }}>
                                  <div 
                                    className="progress-bar bg-success"
                                    style={{ width: `${(stat.completions / stat.applications) * 100}%` }}
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques par programme */}
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-graduation-cap me-2"></i>
                      Par programme
                    </h5>
                  </div>
                  <div className="card-body">
                    {stats.programStats.map((program, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <strong>{program.program}</strong>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div 
                              className="progress-bar bg-primary"
                              style={{ width: `${(program.count / Math.max(...stats.programStats.map(p => p.count))) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="badge bg-primary">{program.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top entreprises */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-building me-2"></i>
                      Top entreprises
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Entreprise</th>
                            <th>Stages</th>
                            <th>Étudiants</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.enterpriseStats.map((enterprise, index) => (
                            <tr key={index}>
                              <td><strong>{enterprise.enterprise}</strong></td>
                              <td>{enterprise.internships}</td>
                              <td>{enterprise.students}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Résumé */}
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      Résumé
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="text-center">
                          <h4 className="text-primary">{stats.completedInternships}</h4>
                          <p className="text-muted">Stages terminés</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center">
                          <h4 className="text-success">{stats.totalApplications}</h4>
                          <p className="text-muted">Candidatures</p>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-6">
                        <div className="text-center">
                          <h4 className="text-info">{((stats.activeInternships / stats.totalStudents) * 100).toFixed(1)}%</h4>
                          <p className="text-muted">Taux d'activité</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center">
                          <h4 className="text-warning">{((stats.completedInternships / (stats.completedInternships + stats.activeInternships)) * 100).toFixed(1)}%</h4>
                          <p className="text-muted">Taux de réussite</p>
                        </div>
                      </div>
                    </div>
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

export default Statistiques; 