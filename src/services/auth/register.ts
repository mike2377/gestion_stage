import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { UserRole } from "../../types/models/User";

export async function registerUser(formData: any) {
  // 1. Création du compte Auth
  const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
  const user = userCredential.user;

  // 2. Préparation des données Firestore
  const baseData = {
    uid: user.uid,
    email: formData.email,
    firstName: formData.firstName,
    lastName: formData.lastName,
    role: formData.role,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let roleData = {};
  switch (formData.role) {
    case UserRole.STUDENT:
      roleData = {
        studentId: formData.studentId,
        program: formData.program,
        year: Number(formData.year),
        department: formData.department,
        university: formData.university,
        statut: 'en_attente',
      };
      break;
    case UserRole.ENTERPRISE:
      roleData = {
        companyName: formData.companyName,
        industry: formData.industry,
        phone: formData.phone,
      };
      break;
    case UserRole.TEACHER:
    case UserRole.RESPONSIBLE:
      roleData = {
        department: formData.department,
        phone: formData.phone,
      };
      break;
    case UserRole.TUTOR:
      roleData = {
        specialization: formData.specialization,
        experience: Number(formData.experience),
      };
      break;
    // Ajoute d'autres cas si besoin
  }

  // 3. Ajout dans Firestore
  await addDoc(collection(db, "utilisateurs"), {
    ...baseData,
    ...roleData,
  });
} 