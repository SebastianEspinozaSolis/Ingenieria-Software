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
    // en caso que lo este, muestre los vehículos
    cargarVehiculos();
  } else {
    // de lo contrario, enviarlo a iniciar sesion
    window.location.href = "login.html";
  }
});

// Referencias a los campos de filtro y botón
const filtros = {
  modelo: document.getElementById("filtro-modelo"),
  matricula: document.getElementById("filtro-matricula"),
  capacidad: document.getElementById("filtro-capacidad"),
  estado: document.getElementById("filtro-estado"),
  nombreTrabajador: document.getElementById("filtro-nombre-trabajador"),
  licencia: document.getElementById("filtro-licencia"),
  fecha: document.getElementById("filtro-fecha"),
};
const btnFiltrar = document.getElementById("btn-filtrar");

// Función para cargar vehículos desde Firestore
async function cargarVehiculos(filtrosAplicados = {}) {
  const vehiculosLista = document.getElementById("vehiculos-lista");
  vehiculosLista.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "vehiculos"));

    // mira si la coleccion tiene o no datos
    if (querySnapshot.empty) {
      console.warn("No se encontraron vehículos.");
    }
    // si los tiene comienza a recorrer cada documento y usar sus datos 
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Filtros de vehículos, en caso que los tenga
      if (
        (filtrosAplicados.modelo && !data.modelo?.toLowerCase().includes(filtrosAplicados.modelo.toLowerCase())) ||
        (filtrosAplicados.matricula && !data.matricula?.replace(/\s+/g, '').toLowerCase().includes(filtrosAplicados.matricula.replace(/\s+/g, '').toLowerCase())) ||
        (filtrosAplicados.capacidad && !data.capacidad?.toLowerCase().includes(filtrosAplicados.capacidad.toLowerCase())) ||
        (filtrosAplicados.estado && !data.estado?.toLowerCase().includes(filtrosAplicados.estado.toLowerCase())) ||
        (filtrosAplicados.nombreTrabajador && !data.trabajador?.nombre?.toLowerCase().includes(filtrosAplicados.nombreTrabajador.toLowerCase())) ||
        (filtrosAplicados.licencia && !data.trabajador?.licencia?.toLowerCase().includes(filtrosAplicados.licencia.toLowerCase())) ||
        (filtrosAplicados.fecha && !data.fecha?.toDate().toLocaleDateString().includes(filtrosAplicados.fecha))
      ) {
        return; // Ignorar vehículos que no cumplen los filtros
      }

      // Formatear fecha
      const fecha = data.fecha && data.fecha.toDate
        ? data.fecha.toDate().toLocaleDateString()
        : "Fecha no disponible";

      // Crea una card para mostrar cada vehículo
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-3");

      card.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">Vehículo</h5>
            <p class="card-text">
              <strong>Modelo:</strong> ${data.modelo || "N/A"}<br>
              <strong>Matrícula:</strong> ${data.matricula || "N/A"}<br>
              <strong>Capacidad:</strong> ${data.capacidad || "N/A"}<br>
              <strong>Estado:</strong> ${data.estado || "N/A"}<br>
            </p>

            <hr> <!-- Línea horizontal para separar las secciones -->

            <h6 class="card-subtitle mb-2 text-muted">Trabajador</h6>
            <p class="card-text">
              <strong>Nombre:</strong> ${data.trabajador?.nombre || "N/A"}<br>
              <strong>Licencia:</strong> ${data.trabajador?.licencia || "N/A"}<br>
              <strong>Contacto:</strong> ${data.trabajador?.contacto || "N/A"}<br>
            </p>

            <hr> <!-- Línea horizontal para separar las secciones -->

            <h6 class="card-subtitle mb-2 text-muted">Información adicional</h6>
            <p class="card-text">
              <strong>Fecha de Creación:</strong> ${fecha}<br>
              <strong>Creado por:</strong> ${data.creadoPor|| "N/A"}<br>
            </p>
          </div>
        </div>
      `;
      vehiculosLista.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar vehículos:", error);
  }
}

// Al tocar filtrar que aplique los filtros y recargue los vehículos que cumplen
btnFiltrar.addEventListener("click", () => {
  const filtrosAplicados = {
    modelo: filtros.modelo.value.trim(),
    matricula: filtros.matricula.value.trim(),
    capacidad: filtros.capacidad.value.trim(),
    estado: filtros.estado.value.trim(),
    nombreTrabajador: filtros.nombreTrabajador.value.trim(),
    licencia: filtros.licencia.value.trim(),
    fecha: filtros.fecha.value.trim(),
  };
  cargarVehiculos(filtrosAplicados);
});
