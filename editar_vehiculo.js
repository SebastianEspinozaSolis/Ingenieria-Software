import { db, auth } from './firebaseconect.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
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

// Referencias a los elementos del formulario
const form = document.getElementById("vehiculo-form");
const modeloInput = document.getElementById("modelo");
const matriculaInput = document.getElementById("matricula");
const capacidadInput = document.getElementById("capacidad");
const estadoInput = document.getElementById("estado");
const nombreInput = document.getElementById("nombre");
const licenciaInput = document.getElementById("licencia");
const contactoInput = document.getElementById("contacto");

// Extraer el ID del documento de la URL
const urlParams = new URLSearchParams(window.location.search);
const vehiculoId = urlParams.get("id");

if (!vehiculoId) {
  alert("No se proporcionó un ID de vehículo.");
  window.location.href = "menu_vehiculos.html";
}

// Cargar los datos del vehículo en el formulario
async function cargarVehiculo() {
  try {
    const docRef = doc(db, "vehiculos", vehiculoId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      modeloInput.value = data.modelo || "";
      matriculaInput.value = data.matricula || "";
      capacidadInput.value = data.capacidad || "";
      estadoInput.value = data.estado || "disponible";

      // Datos del trabajador
      const trabajador = data.trabajador || {};
      nombreInput.value = trabajador.nombre || "";
      licenciaInput.value = trabajador.licencia || "";
      contactoInput.value = trabajador.contacto || "";
    } else {
      alert("El vehículo no existe.");
      window.location.href = "menu_vehiculos.html";
    }
  } catch (error) {
    console.error("Error al cargar el vehículo:", error);
    alert("Hubo un error al cargar el vehículo.");
  }
}

// Guardar cambios en el vehículo
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const modelo = modeloInput.value.trim();
  const matricula = matriculaInput.value.trim();
  const capacidad = capacidadInput.value.trim();
  const estado = estadoInput.value.trim();
  const nombre = nombreInput.value.trim();
  const licencia = licenciaInput.value.trim();
  const contacto = contactoInput.value.trim();

  if (!modelo || !matricula || !capacidad || !estado || !nombre || !licencia || !contacto) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const docRef = doc(db, "vehiculos", vehiculoId);
    await updateDoc(docRef, {
      modelo,
      matricula,
      capacidad,
      estado,
      trabajador: {
        nombre,
        licencia,
        contacto
      }
    });

    alert("Vehículo actualizado con éxito.");
    window.location.href = "menu_vehiculos.html";
  } catch (error) {
    console.error("Error al actualizar el vehículo:", error);
    alert("Hubo un error al actualizar el vehículo.");
  }
});

// Cargar el vehículo al cargar la página
cargarVehiculo();
