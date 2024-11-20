import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Botón de cerrar sesión
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

// Verificar si el usuario está autenticado
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Si el usuario está autenticado, cargamos los documentos
    cargarDocumentos();
  } else {
    // Si no está autenticado, lo redirigimos a la página de login
    window.location.href = "login.html";
  }
});

// Función para cargar documentos desde Firestore
async function cargarDocumentos() {
  const documentosLista = document.getElementById("documentos-lista");

  // Limpiar la lista antes de agregar nuevos documentos
  documentosLista.innerHTML = "";

  try {
    // Obtiene los documentos de la colección 'documentos' en Firestore
    const querySnapshot = await getDocs(collection(db, "documentos"));

    if (querySnapshot.empty) {
      console.warn("No se encontraron documentos.");
    }

    // Recorre cada documento y muestra la información en tarjetas
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Formatea la fecha de creación si está disponible
      const fecha = data.fechaCreacion && data.fechaCreacion.toDate
        ? data.fechaCreacion.toDate().toLocaleDateString()
        : "Fecha no disponible";

      // Crea una tarjeta para mostrar cada documento
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-3");

      card.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Tipo: ${data.tipo || "N/A"}</h5>
            <p class="card-text">
              <strong>Fecha:</strong> ${fecha}<br>
              <strong>Contenido:</strong> <a href="${data.contenido}" target="_blank">Ver Documento</a><br>
              <strong>Estado:</strong> ${data.estado || "N/A"}<br>
              <strong>Creado por:</strong> ${data.creadoPor || "N/A"}<br>
            </p>
            <h6 class="card-subtitle mb-2 text-muted">Transportista</h6>
            <p class="card-text">
              <strong>Nombre:</strong> ${data.transportista?.nombre || "N/A"}<br>
              <strong>Licencia:</strong> ${data.transportista?.licencia || "N/A"}<br>
              <strong>Contacto:</strong> ${data.transportista?.contacto || "N/A"}<br>
            </p>
          </div>
        </div>
      `;

      // Añade la tarjeta a la lista de documentos
      documentosLista.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar documentos:", error);
  }
}
