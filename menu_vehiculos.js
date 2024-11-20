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
    // Si el usuario está autenticado, cargamos los vehículos
    cargarVehiculos();
  } else {
    // Si no está autenticado, lo redirigimos a la página de login
    window.location.href = "login.html";
  }
});

async function cargarVehiculos() {
    const vehiculosLista = document.getElementById("vehiculos-lista");
  
    // Limpiar la lista antes de agregar nuevos vehículos
    vehiculosLista.innerHTML = "";
  
    try {
      // Obtiene los vehículos de la colección 'vehiculos' en Firestore
      const querySnapshot = await getDocs(collection(db, "vehiculos"));
  
      if (querySnapshot.empty) {
        console.warn("No se encontraron vehículos.");
      }
  
      // Recorre cada vehículo y muestra la información en tarjetas
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(data); // Verificar la estructura de los datos
  
        // Obtenemos la fecha de creación y el creador
        const fechaCreacion = data.fechaCreacion ? data.fechaCreacion.toDate().toLocaleDateString() : "N/A";
        const creadoPor = data.creadoPor || "N/A";
  
        // Crea una tarjeta para mostrar cada vehículo
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
                <strong>Fecha de Creación:</strong> ${fechaCreacion}<br>
                <strong>Creado por:</strong> ${creadoPor}<br>
              </p>
            </div>
          </div>
        `;
  
        // Añade la tarjeta a la lista de vehículos
        vehiculosLista.appendChild(card);
      });
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
    }
  }
  
