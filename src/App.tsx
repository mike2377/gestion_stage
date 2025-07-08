import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SidebarLayout from './components/layout/SidebarLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages Étudiant
import MesStages from './pages/etudiant/MesStages';
import RechercherStages from './pages/etudiant/RechercherStages';
import MesDocuments from './pages/etudiant/MesDocuments';
import MonProfilEtudiant from './pages/etudiant/MonProfil';
import TachesHebdomadaires from './pages/etudiant/TachesHebdomadaires';

// Pages Entreprise
import MesOffres from './pages/entreprise/MesOffres';
import Candidatures from './pages/entreprise/Candidatures';
import MesStagiaires from './pages/entreprise/MesStagiaires';
import MonProfilEntreprise from './pages/entreprise/MonProfil';
import TachesStagiaires from './pages/entreprise/TachesStagiaires';
import ParametresEntreprise from './pages/entreprise/Parametres';

// Pages Enseignant
import GestionStages from './pages/enseignant/GestionStages';
import Conventions from './pages/enseignant/Conventions';
import Evaluations from './pages/enseignant/Evaluations';
import Rapports from './pages/enseignant/Rapports';
import SuiviPedagogique from './pages/enseignant/SuiviPedagogique';
import TachesStagiairesEnseignant from './pages/enseignant/TachesStagiaires';

// Pages Responsable
import GestionStagesResponsable from './pages/responsable/GestionStages';
import ConventionsResponsable from './pages/responsable/Conventions';
import EvaluationsResponsable from './pages/responsable/Evaluations';
import UtilisateursResponsable from './pages/responsable/Utilisateurs';
import EntreprisesResponsable from './pages/responsable/Entreprises';
import ParametresResponsable from './pages/responsable/Parametres';

// Pages Tuteur
import SuiviTuteur from './pages/tuteur/SuiviTuteur';
import EvaluationsTuteur from './pages/tuteur/Evaluations';
import RapportsTuteur from './pages/tuteur/Rapports';
import TachesStagiairesTuteur from './pages/tuteur/TachesStagiaires';
import ParametresTuteur from './pages/tuteur/Parametres';

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
          
          {/* Dashboard avec SidebarLayout */}
          <Route path="/dashboard" element={
            <SidebarLayout>
              <Dashboard />
            </SidebarLayout>
          } />

          {/* Routes Étudiant avec Sidebar directe */}
          <Route path="/etudiant/stages" element={
            <SidebarLayout>
              <MesStages />
            </SidebarLayout>
          } />
          <Route path="/etudiant/rechercher" element={
            <SidebarLayout>
              <RechercherStages />
            </SidebarLayout>
          } />
          <Route path="/etudiant/documents" element={
            <SidebarLayout>
              <MesDocuments />
            </SidebarLayout>
          } />
          <Route path="/etudiant/profil" element={
            <SidebarLayout>
              <MonProfilEtudiant />
            </SidebarLayout>
          } />
          <Route path="/etudiant/taches" element={
            <SidebarLayout>
              <TachesHebdomadaires />
            </SidebarLayout>
          } />

          {/* Routes Entreprise avec Sidebar directe */}
          <Route path="/entreprise/offres" element={
            <SidebarLayout>
              <MesOffres />
            </SidebarLayout>
          } />
          <Route path="/entreprise/candidatures" element={
            <SidebarLayout>
              <Candidatures />
            </SidebarLayout>
          } />
          <Route path="/entreprise/stagiaires" element={
            <SidebarLayout>
              <MesStagiaires />
            </SidebarLayout>
          } />
          <Route path="/entreprise/profil" element={
            <SidebarLayout>
              <MonProfilEntreprise />
            </SidebarLayout>
          } />
          <Route path="/entreprise/taches" element={
            <SidebarLayout>
              <TachesStagiaires />
            </SidebarLayout>
          } />
          <Route path="/entreprise/parametres" element={
            <SidebarLayout>
              <ParametresEntreprise />
            </SidebarLayout>
          } />

          {/* Routes Enseignant avec Sidebar directe */}
          <Route path="/enseignant/stages" element={
            <SidebarLayout>
              <GestionStages />
            </SidebarLayout>
          } />
          <Route path="/enseignant/conventions" element={
            <SidebarLayout>
              <Conventions />
            </SidebarLayout>
          } />
          <Route path="/enseignant/evaluations" element={
            <SidebarLayout>
              <Evaluations />
            </SidebarLayout>
          } />
          <Route path="/enseignant/rapports" element={
            <SidebarLayout>
              <Rapports />
            </SidebarLayout>
          } />
          <Route path="/enseignant/suivi" element={
            <SidebarLayout>
              <SuiviPedagogique />
            </SidebarLayout>
          } />
          <Route path="/enseignant/taches" element={
            <SidebarLayout>
              <TachesStagiairesEnseignant />
            </SidebarLayout>
          } />

          {/* Routes Responsable avec Sidebar directe */}
          <Route path="/responsable/stages" element={
            <SidebarLayout>
              <GestionStagesResponsable />
            </SidebarLayout>
          } />
          <Route path="/responsable/conventions" element={
            <SidebarLayout>
              <ConventionsResponsable />
            </SidebarLayout>
          } />
          <Route path="/responsable/evaluations" element={
            <SidebarLayout>
              <EvaluationsResponsable />
            </SidebarLayout>
          } />
          <Route path="/responsable/utilisateurs-gestion" element={
            <SidebarLayout>
              <UtilisateursResponsable />
            </SidebarLayout>
          } />
          <Route path="/responsable/entreprises-gestion" element={
            <SidebarLayout>
              <EntreprisesResponsable />
            </SidebarLayout>
          } />
          <Route path="/responsable/parametres" element={
            <SidebarLayout>
              <ParametresResponsable />
            </SidebarLayout>
          } />

          {/* Routes Tuteur avec Sidebar directe */}
          <Route path="/tuteur/suivi" element={
            <SidebarLayout>
              <SuiviTuteur />
            </SidebarLayout>
          } />
          <Route path="/tuteur/evaluations" element={
            <SidebarLayout>
              <EvaluationsTuteur />
            </SidebarLayout>
          } />
          <Route path="/tuteur/rapports" element={
            <SidebarLayout>
              <RapportsTuteur />
            </SidebarLayout>
          } />
          <Route path="/tuteur/taches" element={
            <SidebarLayout>
              <TachesStagiairesTuteur />
            </SidebarLayout>
          } />
          <Route path="/tuteur/parametres" element={
            <SidebarLayout>
              <ParametresTuteur />
            </SidebarLayout>
          } />

          {/* Routes communes avec Layout */}
          <Route path="/etudiant/details/:id" element={
            <Layout>
              <DetailsEtudiant />
            </Layout>
          } />

          {/* Super-Admin routes */}
          <Route path="/super-admin" element={
            role === 'super_admin'
              ? <Navigate to="/super-admin/dashboard" replace />
              : <Navigate to="/unauthorized" replace />
          } />
          <Route path="/super-admin/dashboard" element={
            <ProtectedRoute allowedRoles={['super_admin']}>
              <SidebarLayout>
                <DashboardSuperAdmin />
              </SidebarLayout>
            </ProtectedRoute>
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
      </Router>
    </AuthProvider>
  );
}

export default App; 