// Importa la clase ManageAccount desde el archivo firebaseconect.js
import { ManageAccount } from './firebaseconect.js';

// Escucha el evento submit del formulario de registro
document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Previene la acción predeterminada del formulario

  // Obtiene los valores de los campos del formulario
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;

  // Crea una instancia de la clase ManageAccount y llama al método register
  const account = new ManageAccount();
  account.register(email, password, name); // Ahora solo pasas los parámetros correctos

  console.log('Formulario de Registro');
});
