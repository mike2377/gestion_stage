import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
  const { user } = useAuth();
  const [stats, setStats] = useState<StatData | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.universiteId) return;
    setLoading(true);
    const fetchStats = async () => {
      // 1. Étudiants
      const studentsQ = query(
        collection(db, 'utilisateurs'),
        where('universiteId', '==', user.universiteId),
        where('role', 'in', ['student', 'etudiant'])
      );
      const studentsSnap = await getDocs(studentsQ);
      const students = studentsSnap.docs.map(doc => doc.data());
      const totalStudents = students.length;

      // 2. Stages (tous)
      const stagesQ = query(
        collection(db, 'stages'),
        where('universiteId', '==', user.universiteId)
      );
      const stagesSnap = await getDocs(stagesQ);
      const stages = stagesSnap.docs.map(doc => doc.data());
      const activeInternships = stages.filter(s => s.statut === 'published').length;
      const completedInternships = stages.filter(s => s.statut === 'termine' || s.statut === 'completed').length;

      // 3. Entreprises (toutes)
      const entreprisesSnap = await getDocs(collection(db, 'entreprises'));
      const entreprises = entreprisesSnap.docs.map(doc => doc.data());
      const totalEnterprises = entreprises.length;

      // 4. Candidatures (somme)
      let totalApplications = 0;
      stages.forEach(stage => {
        if (Array.isArray(stage.candidatures)) {
          totalApplications += stage.candidatures.length;
        }
      });

      // 5. Note moyenne (stages terminés)
      let totalScore = 0, nbScores = 0;
      stages.forEach(stage => {
        if ((stage.statut === 'termine' || stage.statut === 'completed') && typeof stage.noteEvaluation === 'number') {
          totalScore += stage.noteEvaluation;
          nbScores++;
        }
      });
      const averageScore = nbScores > 0 ? totalScore / nbScores : 0;

      // 6. Évolution mensuelle (année sélectionnée)
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const monthlyStats = months.map((month, idx) => {
        const monthNum = (idx + 1).toString().padStart(2, '0');
        // Candidatures du mois
        let applications = 0;
        let completions = 0;
        stages.forEach(stage => {
          if (Array.isArray(stage.candidatures)) {
            applications += stage.candidatures.filter(c => c.appliedDate && c.appliedDate.startsWith(`${selectedPeriod}-${monthNum}`)).length;
          }
          if (stage.date_fin && stage.date_fin.startsWith(`${selectedPeriod}-${monthNum}`) && (stage.statut === 'termine' || stage.statut === 'completed')) {
            completions++;
          }
        });
        return { month, applications, completions };
      });

      // 7. Par programme
      const programMap: Record<string, number> = {};
      students.forEach(s => {
        if (s.program) {
          programMap[s.program] = (programMap[s.program] || 0) + 1;
        }
      });
      const programStats = Object.entries(programMap).map(([program, count]) => ({ program, count }));

      // 8. Top entreprises
      const enterpriseMap: Record<string, { internships: number; students: Set<string>; }> = {};
      stages.forEach(stage => {
        const ent = stage.entreprise?.nom || stage.entreprise?.companyName || stage.entreprise?.name;
        if (!ent) return;
        if (!enterpriseMap[ent]) enterpriseMap[ent] = { internships: 0, students: new Set() };
        enterpriseMap[ent].internships++;
        if (Array.isArray(stage.candidatures)) {
          stage.candidatures.forEach((c: any) => {
            if (c.studentId) enterpriseMap[ent].students.add(c.studentId);
          });
        }
      });
      const enterpriseStats = Object.entries(enterpriseMap).map(([enterprise, data]) => ({
        enterprise,
        internships: data.internships,
        students: data.students.size
      })).sort((a, b) => b.internships - a.internships).slice(0, 5);

      setStats({
        totalStudents,
        activeInternships,
        completedInternships,
        totalEnterprises,
        totalApplications,
        averageScore,
        monthlyStats,
        programStats,
        enterpriseStats,
      });
      setLoading(false);
    };
    fetchStats();
  }, [user, selectedPeriod]);

  if (loading || !stats) return <div>Chargement...</div>;

  return (
    <div className="dashboard-container">
      <div className="row g-0">
        {/* Supprimer toute inclusion de Sidebar ou SidebarLayout. Retourner uniquement le contenu principal. */}
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