import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SidebarLayout from './components/layout/SidebarLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages Étudiant
import MesStages from './pages/etudiant/MesStages';
import RechercherStages from './pages/etudiant/RechercherStages';
import MesDocuments from './pages/etudiant/MesDocuments';
import MonProfilEtudiant from './pages/etudiant/MonProfil';
import TachesHebdomadaires from './pages/etudiant/TachesHebdomadaires';
import Dashboard from './pages/etudiant/Dashboard';

// Pages Entreprise
import MesOffres from './pages/entreprise/MesOffres';
import Candidatures from './pages/entreprise/Candidatures';
import MesStagiaires from './pages/entreprise/MesStagiaires';
import MonProfilEntreprise from './pages/entreprise/MonProfil';
import TachesStagiaires from './pages/entreprise/TachesStagiaires';
import ParametresEntreprise from './pages/entreprise/Parametres';
import DashboardEntreprise from './pages/entreprise/Dashboard';
import Employes from './pages/entreprise/Employes';

// Pages Enseignant
import GestionStages from './pages/enseignant/GestionStages';
import Conventions from './pages/enseignant/Conventions';
import Evaluations from './pages/enseignant/Evaluations';
import Rapports from './pages/enseignant/Rapports';
import SuiviPedagogique from './pages/enseignant/SuiviPedagogique';
import TachesStagiairesEnseignant from './pages/enseignant/TachesStagiaires';
import DashboardEnseignant from './pages/enseignant/Dashboard';

// Pages Responsable
import GestionStagesResponsable from './pages/responsable/GestionStages';
import ConventionsResponsable from './pages/responsable/Conventions';
import EvaluationsResponsable from './pages/responsable/Evaluations';
import UtilisateursResponsable from './pages/responsable/Utilisateurs';
import EntreprisesResponsable from './pages/responsable/Entreprises';
import ParametresResponsable from './pages/responsable/Parametres';
import DashboardResponsable from './pages/responsable/Dashboard';
import RapportsResponsable from './pages/responsable/Rapports';
import StatistiquesResponsable from './pages/responsable/Statistiques';
import ProfilResponsable from './pages/responsable/Profil';

// Pages Tuteur
import SuiviTuteur from './pages/tuteur/SuiviTuteur';
import EvaluationsTuteur from './pages/tuteur/Evaluations';
import RapportsTuteur from './pages/tuteur/Rapports';
import TachesStagiairesTuteur from './pages/tuteur/TachesStagiaires';
import ParametresTuteur from './pages/tuteur/Parametres';
import DashboardTuteur from './pages/tuteur/Dashboard';

// Pages Communes
import ContactCommun from './pages/Contact';
import Stages from './pages/Stages';
import Entreprises from './pages/Entreprises';
import DetailsEtudiant from './pages/DetailsEtudiant';

// Super-Admin pages
import DashboardSuperAdmin from './pages/super-admin/Dashboard';
import ParametresSuperAdmin from './pages/super-admin/Parametres';
import StatistiquesSuperAdmin from './pages/super-admin/Statistiques';
import GestionStagesSuperAdmin from './pages/super-admin/GestionStages';
import GestionEntreprisesSuperAdmin from './pages/super-admin/GestionEntreprises';
import GestionUtilisateursSuperAdmin from './pages/super-admin/GestionUtilisateurs';
import GestionUniversitesSuperAdmin from './pages/super-admin/GestionUniversites';
import Unauthorized from './pages/auth/Unauthorized';

function App() {
  const { role } = useAuth();
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques sans Layout */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/entreprise" element={<Navigate to="/entreprise/dashboard" replace />} />
          
          {/* Routes avec Layout */}
          <Route path="/contact" element={
            <Layout>
              <ContactCommun />
            </Layout>
          } />
          <Route path="/stages" element={
            <Layout>
              <Stages />
            </Layout>
          } />
          <Route path="/entreprises" element={
            <Layout>
              <Entreprises />
            </Layout>
          } />
          
          {/* Routes Étudiant avec Sidebar directe */}
          <Route path="/etudiant/stages" element={
            <ProtectedRoute allowedRoles={['etudiant']}>
            <SidebarLayout>
              <MesStages />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/etudiant/rechercher" element={
            <ProtectedRoute allowedRoles={['etudiant']}>
            <SidebarLayout>
              <RechercherStages />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/etudiant/documents" element={
            <ProtectedRoute allowedRoles={['etudiant']}>
            <SidebarLayout>
              <MesDocuments />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/etudiant/profil" element={
            <ProtectedRoute allowedRoles={['etudiant']}>
            <SidebarLayout>
              <MonProfilEtudiant />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/etudiant/taches" element={
            <ProtectedRoute allowedRoles={['etudiant']}>
            <SidebarLayout>
              <TachesHebdomadaires />
            </SidebarLayout>
            </ProtectedRoute>
          } />

          {/* Routes Entreprise avec Sidebar directe */}
          <Route path="/entreprise/*" element={
            <SidebarLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardEntreprise />} />
                <Route path="offres" element={<MesOffres />} />
                <Route path="candidatures" element={<Candidatures />} />
                <Route path="stagiaires" element={<MesStagiaires />} />
                <Route path="profil" element={<MonProfilEntreprise />} />
                <Route path="taches" element={<TachesStagiaires />} />
                <Route path="parametres" element={<ParametresEntreprise />} />
                <Route path="employes" element={<Employes />} />
              </Routes>
            </SidebarLayout>
          } />

          {/* Routes Enseignant avec Sidebar directe */}
          <Route path="/enseignant/stages" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
            <SidebarLayout>
              <GestionStages />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/enseignant/conventions" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
            <SidebarLayout>
              <Conventions />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/enseignant/evaluations" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
            <SidebarLayout>
              <Evaluations />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/enseignant/rapports" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
            <SidebarLayout>
              <Rapports />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/enseignant/suivi" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
            <SidebarLayout>
              <SuiviPedagogique />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/enseignant/taches" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
            <SidebarLayout>
              <TachesStagiairesEnseignant />
            </SidebarLayout>
            </ProtectedRoute>
          } />

          {/* Routes Responsable avec Sidebar directe */}
          <Route path="/responsable/gestion-stages" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <GestionStagesResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/conventions" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <ConventionsResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/evaluations" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <EvaluationsResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/rapports" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <RapportsResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/statistiques" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <StatistiquesResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/entreprises" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <EntreprisesResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/utilisateurs" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <UtilisateursResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/parametres" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <ParametresResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/profil" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <ProfilResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/dashboard" element={
            <ProtectedRoute allowedRoles={['responsable']}>
            <SidebarLayout>
              <DashboardResponsable />
            </SidebarLayout>
            </ProtectedRoute>
          } />

          {/* Routes Tuteur avec Sidebar directe */}
          <Route path="/tuteur/suivi" element={
            <ProtectedRoute allowedRoles={['tuteur']}>
            <SidebarLayout>
              <SuiviTuteur />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/tuteur/evaluations" element={
            <ProtectedRoute allowedRoles={['tuteur']}>
            <SidebarLayout>
              <EvaluationsTuteur />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/tuteur/rapports" element={
            <ProtectedRoute allowedRoles={['tuteur']}>
            <SidebarLayout>
              <RapportsTuteur />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/tuteur/taches" element={
            <ProtectedRoute allowedRoles={['tuteur']}>
            <SidebarLayout>
              <TachesStagiairesTuteur />
            </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/tuteur/parametres" element={
            <ProtectedRoute allowedRoles={['tuteur']}>
            <SidebarLayout>
              <ParametresTuteur />
            </SidebarLayout>
            </ProtectedRoute>
          } />

          {/* Routes communes avec Layout */}
          <Route path="/etudiant/details/:id" element={
            <Layout>
              <DetailsEtudiant />
            </Layout>
          } />

          {/* Routes avec SidebarLayout et protégées */}
          <Route path="/etudiant/dashboard" element={
            <ProtectedRoute allowedRoles={['etudiant']}>
              <SidebarLayout>
                <Dashboard />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/entreprise/dashboard" element={
            <SidebarLayout>
              <DashboardEntreprise />
            </SidebarLayout>
          } />
          <Route path="/enseignant/dashboard" element={
            <ProtectedRoute allowedRoles={['enseignant']}>
              <SidebarLayout>
                <DashboardEnseignant />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/responsable/dashboard" element={
            <ProtectedRoute allowedRoles={['responsable']}>
              <SidebarLayout>
                <DashboardResponsable />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/tuteur/dashboard" element={
            <ProtectedRoute allowedRoles={['tuteur']}>
              <SidebarLayout>
                <DashboardTuteur />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
              <SidebarLayout>
                <DashboardSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />

          {/* Super-Admin routes */}
          <Route path="/super-admin" element={
            role === 'super_admin'
              ? <Navigate to="/super-admin/dashboard" replace />
              : <Navigate to="/unauthorized" replace />
          } />
          <Route path="/super-admin/parametres" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <ParametresSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/statistiques" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <StatistiquesSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/gestion-stages" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <GestionStagesSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/gestion-entreprises" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <GestionEntreprisesSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/gestion-utilisateurs" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <GestionUtilisateursSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/super-admin/universites" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <GestionUniversitesSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App; 