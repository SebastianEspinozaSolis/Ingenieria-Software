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
    // en caso que lo este muestre los documentos
    cargarDocumentos();
  } else {
    // de lo contrario, enviarlo a iniciar sesion
    window.location.href = "login.html";
  }
});

// Referencias a los campos de filtro y botón
const filtros = {
  tipo: document.getElementById("filtro-tipo"),
  estado: document.getElementById("filtro-estado"),
  fecha: document.getElementById("filtro-fecha"),
  transportista: document.getElementById("filtro-transportista"),
  licencia: document.getElementById("filtro-licencia"),
};
const btnFiltrar = document.getElementById("btn-filtrar");

// Función para cargar documentos desde Firestore
async function cargarDocumentos(filtrosAplicados = {}) {
  const documentosLista = document.getElementById("documentos-lista");
  documentosLista.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "documentos"));

    if (querySnapshot.empty) {
      console.warn("No se encontraron documentos.");
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Filtrar documentos
      if (
        (filtrosAplicados.tipo && !data.tipo?.toLowerCase().includes(filtrosAplicados.tipo.toLowerCase())) ||
        (filtrosAplicados.estado && !data.estado?.toLowerCase().includes(filtrosAplicados.estado.toLowerCase())) ||
        (filtrosAplicados.fecha && !data.fechaCreacion?.toDate().toLocaleDateString().includes(filtrosAplicados.fecha)) ||
        (filtrosAplicados.transportista && !data.transportista?.nombre?.toLowerCase().includes(filtrosAplicados.transportista.toLowerCase())) ||
        (filtrosAplicados.licencia && !data.transportista?.licencia?.toLowerCase().includes(filtrosAplicados.licencia.toLowerCase()))
      ) {
        return; // Ignorar documentos que no cumplen los filtros
      }

      // Formatea la fecha
      const fecha = data.fechaCreacion && data.fechaCreacion.toDate
        ? data.fechaCreacion.toDate().toLocaleDateString()
        : "Fecha no disponible";

      // Crear card de documento
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
      documentosLista.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar documentos:", error);
  }
}

// Al tocar filtrar que aplique los filtros y recargue los documentos que cumplen
btnFiltrar.addEventListener("click", () => {
  const filtrosAplicados = {
    tipo: filtros.tipo.value.trim(),
    estado: filtros.estado.value.trim(),
    fecha: filtros.fecha.value.trim(),
    transportista: filtros.transportista.value.trim(),
    licencia: filtros.licencia.value.trim(),
  };
  cargarDocumentos(filtrosAplicados);
});
