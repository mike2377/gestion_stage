import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Récupère le nombre de stages en cours pour une université
export async function getStagesEnCoursCount(universiteId: string) {
  const q = query(collection(db, 'stages'), where('status', '==', 'in_progress'), where('universiteId', '==', universiteId));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Récupère le nombre de conventions à valider pour une université
export async function getConventionsAValiderCount(universiteId: string) {
  const q = query(collection(db, 'conventions'), where('status', '==', 'pending_signatures'), where('universiteId', '==', universiteId));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Récupère le nombre d'étudiants en stage pour une université (supporte 'student' et 'etudiant')
export async function getEtudiantsEnStageCount(universiteId: string) {
  const q = query(
    collection(db, 'utilisateurs'),
    where('universiteId', '==', universiteId),
    where('isActive', '==', true),
    where('role', 'in', ['student', 'etudiant'])
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Récupère le nombre d'entreprises partenaires (universiteId = université du responsable ET associationStatus = 'accepted')
export async function getEntreprisesCount(universiteId: string) {
  const q = query(collection(db, 'entreprises'), where('universiteId', '==', universiteId), where('associationStatus', '==', 'accepted'));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Récupère le nombre d'enseignants pour une université (supporte 'teacher' et 'enseignant')
export async function getEnseignantsCount(universiteId: string) {
  const q = query(
    collection(db, 'utilisateurs'),
    where('universiteId', '==', universiteId),
    where('role', 'in', ['teacher', 'enseignant'])
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Fonction utilitaire pour tout récupérer d'un coup
export async function getResponsableDashboardStats(universiteId: string) {
  const [stagesEnCours, conventionsAValider, etudiantsEnStage, entreprises, enseignants] = await Promise.all([
    getStagesEnCoursCount(universiteId),
    getConventionsAValiderCount(universiteId),
    getEtudiantsEnStageCount(universiteId),
    getEntreprisesCount(universiteId),
    getEnseignantsCount(universiteId),
  ]);
  return {
    stagesEnCours,
    conventionsAValider,
    etudiantsEnStage,
    entreprises,
    enseignants,
  };
} 