import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
    // en caso que lo esté, muestre los vehículos
    cargarVehiculos();
  } else {
    // de lo contrario, enviarlo a iniciar sesión
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

    if (querySnapshot.empty) {
      console.warn("No se encontraron vehículos.");
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Filtrar vehículos
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

      // Formatea la fecha
      const fecha = data.fechaCreacion && data.fechaCreacion.toDate
        ? data.fechaCreacion.toDate().toLocaleDateString()
        : "Fecha no disponible";

      // Crear card de vehículo
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
              <strong>Creado por:</strong> ${data.creadoPor || "N/A"}<br>
            </p>
            <div class="d-flex justify-content-between mt-3">
              <button class="btn btn-warning btn-sm btn-editar" data-id="${doc.id}">Editar</button>
              <button class="btn btn-danger btn-sm btn-eliminar" data-id="${doc.id}">Eliminar</button>
            </div>
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

// Manejador de eventos para editar y eliminar vehículos
const vehiculosLista = document.getElementById("vehiculos-lista");
vehiculosLista.addEventListener("click", async (event) => {
  const target = event.target;
  const vehiculoId = target.getAttribute("data-id");
  // editar
  if (target.classList.contains("btn-editar")) {
    // Redirigir a la página de edición con el ID del vehículo
    window.location.href = `editar_vehiculo.html?id=${vehiculoId}`;
  // eliminar
  } else if (target.classList.contains("btn-eliminar")) {
    // Confirmar la eliminación
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este vehículo?");
    if (confirmar) {
      try {
        await deleteDoc(doc(db, "vehiculos", vehiculoId));
        alert("Vehículo eliminado con éxito.");
        cargarVehiculos(); // Recargar la lista de vehículos
      } catch (error) {
        console.error("Error al eliminar vehículo:", error);
        alert("Hubo un error al eliminar el vehículo.");
      }
    }
  }
});
// Manejar el evento del botón para regresar al menú
document.getElementById("regresar-btn").addEventListener("click", () => {
  window.location.href = "menu.html"; // Redirige al menú
});
