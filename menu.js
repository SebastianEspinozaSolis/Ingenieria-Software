import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// toma el boton de cerrar sesion y usa signOut de firebase
document.getElementById("logout-btn").addEventListener("click", () => {
  // usa  auth de firebaseconect para cerrar la sesion activa
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

// Usa funcion de firebase auth, para determinar el usuario que esta activo
onAuthStateChanged(auth, async (user) => {
  // user es el usuario autentificado, por lo que si hay uno hara lo de abajo, de lo contrario enviara a login
  if (user) {
    // aca se toma el id en users, que es el nombre y rol del que inicio sesion
    const userDocRef = doc(db, "users", user.uid);
    // y aca se guarda el documento
    const userDoc = await getDoc(userDocRef);

    // aca comprueba que el usuario autenticado tenga un documento en users
    if (userDoc.exists()) {
      // saca los datos
      const userData = userDoc.data();
      // y aca usando un elemento con bienvenida saluda con el nombre
      document.getElementById("bienvenida").textContent = `¡Bienvenido, ${userData.name}!`;
      
      // Cargar documentos de la colección 'documentos'
      cargarDocumentos();
    } else {
      console.error("No se encontraron datos del usuario.");
      document.getElementById("bienvenida").textContent = "Error al cargar los datos del usuario.";
    }
  } else {
    window.location.href = "login.html";
  }
});

// Función para cargar los documentos desde Firestore
async function cargarDocumentos() {
  // instancia la lista desde el html
  const documentosLista = document.getElementById("documentos-lista");
  
  // Asegura de que 'documentos-lista' exista
  if (!documentosLista) {
    console.error("Elemento con ID 'documentos-lista' no encontrado.");
    return;
  }
  
  documentosLista.innerHTML = ""; // Limpiar la lista antes de agregar elementos

  try {
    // aca se esta obteniendo la coleccion, o sea todos los documentos y los guarda en querySnapshot
    const querySnapshot = await getDocs(collection(db, "documentos"));
    
    // ve si esta vacia
    if (querySnapshot.empty) {
      console.warn("No se encontraron documentos en la colección.");
    }
    // y aca en caso que tenga elementos hace un for, o sea recorre cada uno de los documentos
    querySnapshot.forEach((doc) => {
      // obtiene los datos del documento
      const data = doc.data();
      
      // Verificar si hay fecha, y si esta en tiempo timestamp para transformarlo en legible
      const fecha = data.fechaCreacion && data.fechaCreacion.toDate
        ? data.fechaCreacion.toDate().toLocaleDateString()
        : "Fecha no disponible";

      // se crea un div con clases de card, para mas abajo añadirle el contenido 
      const card = document.createElement("div");
      card.classList.add("col-md-4", "mb-3");

      // Contenido HTML de la card
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
            <h6 class="card-subtitle mb-2 text-muted">Vehículo</h6>
            <p class="card-text">
              <strong>Modelo:</strong> ${data.transportista?.vehiculo?.modelo || "N/A"}<br>
              <strong>Matrícula:</strong> ${data.transportista?.vehiculo?.matricula || "N/A"}<br>
              <strong>Capacidad:</strong> ${data.transportista?.vehiculo?.capacidad || "N/A"}<br>
              <strong>Estado Vehículo:</strong> ${data.transportista?.vehiculo?.estado || "N/A"}
            </p>
          </div>
        </div>
      `;
      // y lo agrega a la lista
      documentosLista.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar documentos:", error);
  }
}
