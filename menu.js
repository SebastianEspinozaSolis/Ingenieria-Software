import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// al cerrar sesion se redirige a iniciar sesion
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
      alert("Has cerrado sesión correctamente.");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión.");
    });
});


// Usuario autenticado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById("bienvenida").textContent = `¡Bienvenido, ${userData.name}!`;
    } else {
      console.error("No se encontraron datos del usuario.");
      document.getElementById("bienvenida").textContent = "Error al cargar los datos del usuario.";
    }
  } else {
    // si no lo esta lo redirige a iniciar sesion
    window.location.href = "login.html";
  }
});