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
const form = document.getElementById("documento-form");
const tipoInput = document.getElementById("tipo");
const contenidoInput = document.getElementById("contenido");
const estadoInput = document.getElementById("estado");
const nombreInput = document.getElementById("nombre");
const licenciaInput = document.getElementById("licencia");
const contactoInput = document.getElementById("contacto");

// Extraer el ID del documento de la URL
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("id");
// verificar si se paso un id
if (!docId) {
  alert("No se proporcionó un ID de documento.");
  window.location.href = "menu_documentos.html";
}

// Cargar los datos del documento en el formulario
async function cargarDocumento() {
  try {
    const docRef = doc(db, "documentos", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      tipoInput.value = data.tipo || "";
      contenidoInput.value = data.contenido || "";
      estadoInput.value = data.estado || "pendiente";

      // Datos del transportista
      const transportista = data.transportista || {};
      nombreInput.value = transportista.nombre || "";
      licenciaInput.value = transportista.licencia || "";
      contactoInput.value = transportista.contacto || "";
    } else {
      alert("El documento no existe.");
      window.location.href = "menu_documentos.html";
    }
  } catch (error) {
    console.error("Error al cargar el documento:", error);
    alert("Hubo un error al cargar el documento.");
  }
}

// Guardar cambios en el documento
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const tipo = tipoInput.value.trim();
  const contenido = contenidoInput.value.trim();
  const estado = estadoInput.value.trim();
  const nombre = nombreInput.value.trim();
  const licencia = licenciaInput.value.trim();
  const contacto = contactoInput.value.trim();

  if (!tipo || !contenido || !nombre || !licencia || !contacto) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  try {
    const docRef = doc(db, "documentos", docId);
    await updateDoc(docRef, {
      tipo,
      contenido,
      estado,
      transportista: {
        nombre,
        licencia,
        contacto
      }
    });

    alert("Documento actualizado con éxito.");
    window.location.href = "menu_documentos.html";
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    alert("Hubo un error al actualizar el documento.");
  }
});

// Cargar el documento al cargar la página
cargarDocumento();
