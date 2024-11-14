import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configura el evento para el botón de cierre de sesión
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Redirige al usuario a la página de inicio de sesión después de cerrar sesión
      window.location.href = "login.html";
      alert("Has cerrado sesión correctamente.");
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un problema al cerrar sesión.");
    });
});

// Mostrar mensaje de bienvenida con el nombre del usuario
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Obtener datos del usuario desde Firestore
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
    // Redirige al login si no está autenticado
    window.location.href = "login.html";
  }
});
