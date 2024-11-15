// Importa la clase ManageAccount desde el archivo firebaseconect.js
import { ManageAccount } from './firebaseconect.js';

// toma el formulario, para cuando se toca el boton registrar una cuenta
document.getElementById("register-form").addEventListener("submit", (event) => {
  event.preventDefault();

  // Obtiene los valores de los campos del formulario
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const role = document.getElementById("role").value;
  // Crea una instancia de la clase ManageAccount y llama al método register
  const account = new ManageAccount();
  account.register(email, password, name,role); // y se le pasan los valores 
});
