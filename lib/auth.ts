import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/**
 * Creates the `users/{uid}` profile on first sign-in. New accounts are "pending"
 * and have no dashboard access until an admin approves them (Firestore rules
 * enforce this; the first admin is made with scripts/make-admin.mjs).
 */
async function ensureProfile(user: User, displayName?: string) {
  const ref = doc(db, "users", user.uid);
  if ((await getDoc(ref)).exists()) return;
  await setDoc(ref, {
    email: user.email ?? "",
    displayName: displayName || user.displayName || user.email?.split("@")[0] || "Operador",
    role: "pending",
    createdAt: Date.now(),
  });
}

export async function signInWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await ensureProfile(user);
}

export async function registerWithEmail(name: string, email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(user, { displayName: name });
  await ensureProfile(user, name);
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
  await ensureProfile(user);
}

export function signOut() {
  return firebaseSignOut(auth);
}

export function authErrorMessage(error: unknown) {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con este correo.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/invalid-email":
      return "Ingresá un correo válido.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/too-many-requests":
      return "Demasiados intentos. Probá de nuevo en unos minutos.";
    default:
      return "Algo salió mal. Intentá de nuevo.";
  }
}
