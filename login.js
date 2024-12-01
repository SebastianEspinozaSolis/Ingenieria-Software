import { ManageAccount } from './firebaseconect.js';
import { auth } from './firebaseconect.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Verifica si el usuario ya está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Si el usuario está autenticado, redirigir a menu.html
    window.location.href = "menu.html";
  }
});
// trae el formulario con su id cuando se toque el boton
document.getElementById("formulario-sesion").addEventListener("submit", (event) => {
  event.preventDefault();

  //toma los 2 valores
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // se instancia manage account que viene desde firebase conect para utilizar sus funciones
  const account = new ManageAccount();
  // authenticate de firebaseconect que inicia sesion
  account.authenticate(email, password);
});
