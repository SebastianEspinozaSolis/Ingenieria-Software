import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { collection, addDoc, doc, getDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Se toma el form
document.getElementById("documento-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Obtener valores del formulario
  const tipo = document.getElementById("tipo").value;
  const contenido = document.getElementById("contenido").value;
  const estado = document.getElementById("estado").value;
  const nombre = document.getElementById("nombre").value;
  const licencia = document.getElementById("licencia").value;
  const contacto = document.getElementById("contacto").value;

  // Verificar si el usuario está autenticado
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Obtener el documento del usuario autenticado
        const userDocRef = doc(db, "users", user.uid);  // Asumimos que los usuarios están almacenados en la colección 'users'
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error("No se encontró el documento del usuario.");
          return;
        }

        // Obtener el nombre del creador del documento
        const nombreCreador = userDoc.data().name;

        // Crear el documento en la colección 'documentos'
        await addDoc(collection(db, "documentos"), {
          tipo: tipo,
          fechaCreacion: Timestamp.now(),
          contenido: contenido,
          estado: estado,
          transportista: {
            nombre: nombre,
            licencia: licencia,
            contacto: contacto
          },
          creadoPor: nombreCreador  // Guardamos el nombre del creador
        });

        alert("Documento creado exitosamente");
        window.location.href = "menu_documentos.html"; // Redirigir al menú
      } catch (error) {
        console.error("Error al crear el documento:", error);
        alert("Error al crear el documento: " + error.message);
      }
    } else {
      alert("Debes iniciar sesión para crear un documento.");
      window.location.href = "login.html";
    }
  });
});
