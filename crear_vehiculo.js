import { auth, db } from './firebaseconect.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { collection, addDoc, doc, getDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Se toma el formulario
document.getElementById("vehiculo-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Obtener valores del formulario
  const modelo = document.getElementById("modelo").value;
  const matricula = document.getElementById("matricula").value;
  const capacidad = document.getElementById("capacidad").value;
  const estado = document.getElementById("estado").value;
  const trabajadorNombre = document.getElementById("trabajador-nombre").value;
  const trabajadorLicencia = document.getElementById("trabajador-licencia").value;
  const trabajadorContacto = document.getElementById("trabajador-contacto").value;

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

        // Obtener el nombre del creador del vehículo
        const nombreCreador = userDoc.data().name;

        // Crear el documento en la colección 'vehiculos'
        await addDoc(collection(db, "vehiculos"), {
          modelo: modelo,
          matricula: matricula,
          capacidad: capacidad,
          estado: estado,
          trabajador: {
            nombre: trabajadorNombre,
            licencia: trabajadorLicencia,
            contacto: trabajadorContacto
          },
          creadoPor: nombreCreador,  // Guardamos el nombre del creador
          fechaCreacion: Timestamp.now()  // Timestamp de la fecha de creación
        });

        alert("Vehículo creado exitosamente");
        window.location.href = "menu_vehiculos.html"; // Redirigir al menú de vehículos
      } catch (error) {
        console.error("Error al crear el vehículo:", error);
        alert("Error al crear el vehículo: " + error.message);
      }
    } else {
      alert("Debes iniciar sesión para crear un vehículo.");
      window.location.href = "login.html";
    }
  });
});
