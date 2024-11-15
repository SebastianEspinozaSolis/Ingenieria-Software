import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc, collection, getDocs, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Toma el botón de cerrar sesión y usa signOut de Firebase
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

// Usa función de Firebase Auth para determinar el usuario que está activo
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
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
  const documentosLista = document.getElementById("documentos-lista");
  
  if (!documentosLista) {
    console.error("Elemento con ID 'documentos-lista' no encontrado.");
    return;
  }
  
  documentosLista.innerHTML = ""; // Limpiar la lista antes de agregar elementos

  try {
    const querySnapshot = await getDocs(collection(db, "documentos"));
    
    if (querySnapshot.empty) {
      console.warn("No se encontraron documentos en la colección.");
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const docId = doc.id;

      const fecha = data.fechaCreacion && data.fechaCreacion.toDate
        ? data.fechaCreacion.toDate().toLocaleDateString()
        : "Fecha no disponible";

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
            <h6 class="card-subtitle mb-2 text-muted">Vehículo</h6>
            <p class="card-text">
              <strong>Modelo:</strong> ${data.transportista?.vehiculo?.modelo || "N/A"}<br>
              <strong>Matrícula:</strong> ${data.transportista?.vehiculo?.matricula || "N/A"}<br>
              <strong>Capacidad:</strong> ${data.transportista?.vehiculo?.capacidad || "N/A"}<br>
              <strong>Estado Vehículo:</strong> ${data.transportista?.vehiculo?.estado || "N/A"}
            </p>
            <button class="btn btn-warning btn-sm mb-2" onclick="editarDocumento('${docId}')">Editar</button>
            <button class="btn btn-danger btn-sm mb-2" onclick="eliminarDocumento('${docId}')">Eliminar</button>
          </div>
        </div>
      `;
      
      documentosLista.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar documentos:", error);
  }
}

// Función para editar documento
window.editarDocumento = (docId) => {
  const modal = new bootstrap.Modal(document.getElementById('editarDocumentoModal'));
  modal.show();

  const docRef = doc(db, "documentos", docId);
  getDoc(docRef).then((doc) => {
    if (doc.exists()) {
      const data = doc.data();
      document.getElementById('tipoDocumento').value = data.tipo || '';
      document.getElementById('contenidoDocumento').value = data.contenido || '';
      document.getElementById('estadoDocumento').value = data.estado || '';
      document.getElementById('nombreTransportista').value = data.transportista?.nombre || '';
      document.getElementById('licenciaTransportista').value = data.transportista?.licencia || '';
      document.getElementById('contactoTransportista').value = data.transportista?.contacto || '';
      document.getElementById('modeloVehiculo').value = data.transportista?.vehiculo?.modelo || '';
      document.getElementById('matriculaVehiculo').value = data.transportista?.vehiculo?.matricula || '';
      document.getElementById('capacidadVehiculo').value = data.transportista?.vehiculo?.capacidad || '';
      document.getElementById('estadoVehiculo').value = data.transportista?.vehiculo?.estado || '';
    }
  });

  document.getElementById('formEditarDocumento').onsubmit = async (e) => {
    e.preventDefault();
    const tipo = document.getElementById('tipoDocumento').value;
    const contenido = document.getElementById('contenidoDocumento').value;
    const estado = document.getElementById('estadoDocumento').value;
    const nombreTransportista = document.getElementById('nombreTransportista').value;
    const licenciaTransportista = document.getElementById('licenciaTransportista').value;
    const contactoTransportista = document.getElementById('contactoTransportista').value;
    const modeloVehiculo = document.getElementById('modeloVehiculo').value;
    const matriculaVehiculo = document.getElementById('matriculaVehiculo').value;
    const capacidadVehiculo = document.getElementById('capacidadVehiculo').value;
    const estadoVehiculo = document.getElementById('estadoVehiculo').value;

    await updateDoc(docRef, {
      tipo: tipo,
      contenido: contenido,
      estado: estado,
      transportista: {
        nombre: nombreTransportista,
        licencia: licenciaTransportista,
        contacto: contactoTransportista,
        vehiculo: {
          modelo: modeloVehiculo,
          matricula: matriculaVehiculo,
          capacidad: capacidadVehiculo,
          estado: estadoVehiculo
        }
      }
    });
    modal.hide();
    cargarDocumentos();
  };
};

// Función para eliminar documento
window.eliminarDocumento = (docId) => {
  if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
    const docRef = doc(db, "documentos", docId);
    deleteDoc(docRef).then(() => {
      alert('Documento eliminado exitosamente.');
      cargarDocumentos();
    }).catch((error) => {
      console.error('Error al eliminar documento:', error);
      alert('Hubo un problema al eliminar el documento.');
    });
  }
};
